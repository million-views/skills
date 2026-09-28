#!/usr/bin/env node

/**
 * Install, inspect, update, remove, audit, and export the skills in this repo.
 *
 * The installer intentionally supports only this repo and GitHub sources. It
 * never runs files from a downloaded skill. Remote installs are blocked when
 * the CVE audit cannot complete or finds a known-exploited/critical advisory,
 * unless the operator explicitly opts out of the audit or overrides a finding.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.dirname(scriptPath);
const catalogPath = path.join(repoRoot, ".claude-plugin", "marketplace.json");
const cveApi = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const kevFeed = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

const agents = {
  "claude-code": { global: [".claude", "skills"], project: [".claude", "skills"] },
  codex: { global: [".codex", "skills"], project: [".agents", "skills"] },
};

const colors = {
  reset: "\u001b[0m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  gray: "\u001b[90m",
};

let colorEnabled = Boolean(process.stdout.isTTY && !process.env.NO_COLOR && process.env.FORCE_COLOR !== "0");

function print(message = "", color = "reset") {
  console.log(colorEnabled && color !== "reset" ? `${colors[color]}${message}${colors.reset}` : message);
}

function printError(message) {
  const rendered = colorEnabled ? `${colors.red}${message}${colors.reset}` : message;
  console.error(rendered);
}

function printEntry(entry) {
  print(`${entry.name} / ${entry.version}`, "blue");
  print(`  ${entry.description}`);
}

function fail(message) {
  throw new Error(message);
}

function usage() {
  console.log(`Usage:
  node skills.mjs list
  node skills.mjs check [skill ...]
  node skills.mjs audit <skill> [--from <github-source>]
  node skills.mjs install <skill ...> --global|--project --agent <agent> [options]
  node skills.mjs update <skill ...> --global|--project --agent <agent> [options]
  node skills.mjs upgrade [skill ...] [--all]
  node skills.mjs remove <skill ...> --global|--project --agent <agent> [--force]
  node skills.mjs export <skill ...> [--output <file>|--output-dir <dir>] [--force]
  node skills.mjs package <skill ...> [--output <file>|--output-dir <dir>] [--force]

Source and selection options:
  --from <owner/repo|github-url>  Install or audit a GitHub repository
  --skill <name>                  Select a skill from a remote marketplace
  --all                           Select every skill in the source
  --ref <branch-or-tag>           Clone a specific Git ref

Install options:
  --agent <claude-code|codex>     Repeat for multiple agents
  --global                        Use the user's global agent directory
  --project                       Use the current project's agent directory
  --copy                          Copy files instead of linking the checkout
  --dry-run                       Show changes without writing them
  --skip-security-audit           Explicitly bypass the remote CVE audit
  --allow-vulnerable              Allow critical/known-exploited audit findings
  --no-color                      Disable colored output

Other options:
  --force                         Replace an existing destination / output
  --help                          Show this help

Remote installs are GitHub-only and require a successful CVE audit by default.
The audit is a known-vulnerability check, not a guarantee that a skill is safe.
`);
}

function parseArgs(argv) {
  const valueOptions = new Set(["--agent", "--from", "--ref", "--skill", "--output", "--output-dir"]);
  let command = "help";
  let commandSeen = false;
  const options = { names: [], agents: [], skillNames: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!commandSeen && !arg.startsWith("-")) {
      command = arg;
      commandSeen = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--all") {
      options.all = true;
    } else if (arg === "--global") {
      if (options.scope && options.scope !== "global") fail("Choose only one of --global or --project");
      options.scope = "global";
    } else if (arg === "--project") {
      if (options.scope && options.scope !== "project") fail("Choose only one of --global or --project");
      options.scope = "project";
    } else if (arg === "--copy") {
      options.copy = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--skip-security-audit") {
      options.skipSecurityAudit = true;
    } else if (arg === "--allow-vulnerable") {
      options.allowVulnerable = true;
    } else if (arg === "--no-color") {
      options.noColor = true;
    } else if (valueOptions.has(arg)) {
      const value = argv[++index];
      if (!value || value.startsWith("-")) fail(`${arg} requires a value`);
      if (arg === "--agent") options.agents.push(value);
      if (arg === "--from") options.source = value;
      if (arg === "--ref") options.ref = value;
      if (arg === "--skill") options.skillNames.push(value);
      if (arg === "--output") options.output = value;
      if (arg === "--output-dir") options.outputDir = value;
    } else if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`);
    } else {
      options.names.push(arg);
    }
  }
  options.agents = [...new Set(options.agents)];
  return { command, options };
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Cannot read JSON ${filePath}: ${error.message}`);
  }
}

function parseFrontmatter(skillPath) {
  const text = fs.readFileSync(path.join(skillPath, "SKILL.md"), "utf8").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) fail(`${skillPath}/SKILL.md is missing or has invalid YAML frontmatter`);
  const fields = {};
  for (const line of match[1].split("\n")) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (match) {
      const value = match[2].trim();
      fields[match[1]] = /^(['"]).*\1$/.test(value) ? value.slice(1, -1) : value;
    }
  }
  if (!fields.name || !fields.description) {
    fail(`${skillPath}/SKILL.md must define name and description in frontmatter`);
  }
  return fields;
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function validateTree(root) {
  const pending = [root];
  while (pending.length) {
    const current = pending.pop();
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) fail(`Refusing symlink in skill tree: ${current}`);
    if (!stat.isDirectory()) continue;
    for (const entry of fs.readdirSync(current)) pending.push(path.join(current, entry));
  }
}

function validateSkill(root, expectedName = null) {
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) fail(`Skill directory not found: ${root}`);
  validateTree(root);
  const metadata = parseFrontmatter(root);
  const directoryName = path.basename(root);
  const validName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!validName.test(metadata.name) || metadata.name.length > 64) {
    fail(`${root}/SKILL.md has a non-compliant name: ${metadata.name}`);
  }
  if (metadata.name !== directoryName) {
    fail(`${root}/SKILL.md name must match its parent directory: ${directoryName}`);
  }
  if (expectedName && metadata.name !== expectedName) {
    fail(`Skill metadata name "${metadata.name}" does not match marketplace entry "${expectedName}"`);
  }
  if (metadata.description.length > 1024) {
    fail(`${root}/SKILL.md description exceeds the 1024-character limit`);
  }
  if (metadata.compatibility && metadata.compatibility.length > 500) {
    fail(`${root}/SKILL.md compatibility exceeds the 500-character limit`);
  }
  return { name: metadata.name, directoryName, metadata, root };
}

function catalogEntries(root = repoRoot) {
  const catalog = readJson(root === repoRoot ? catalogPath : findMarketplace(root));
  if (!Array.isArray(catalog.plugins)) fail("Marketplace has no plugins array");
  return catalog.plugins.map((plugin) => {
    if (typeof plugin.name !== "string" || typeof plugin.source !== "string") {
      fail("Every marketplace entry needs a name and source");
    }
    const source = path.resolve(root, plugin.source);
    if (!isInside(root, source)) fail(`Marketplace source escapes its repository: ${plugin.source}`);
    const entry = validateSkill(source, plugin.name);
    return { ...entry, version: plugin.version || "unknown", description: plugin.description || entry.metadata.description };
  });
}

function findMarketplace(root) {
  for (const candidate of [path.join(root, ".claude-plugin", "marketplace.json"), path.join(root, "marketplace.json")]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  fail(`No marketplace.json found in ${root}`);
}

function directSkillEntries(root) {
  const entries = [];
  if (fs.existsSync(path.join(root, "SKILL.md"))) entries.push(validateSkill(root));
  for (const name of fs.readdirSync(root, { withFileTypes: true })) {
    if (name.isDirectory() && name.name !== ".git" && fs.existsSync(path.join(root, name.name, "SKILL.md"))) {
      entries.push(validateSkill(path.join(root, name.name)));
    }
  }
  return entries;
}

function remoteEntries(root) {
  const marketplace = [path.join(root, ".claude-plugin", "marketplace.json"), path.join(root, "marketplace.json")].find(fs.existsSync);
  return marketplace ? catalogEntries(root) : directSkillEntries(root);
}

function selectEntries(entries, options, requireSelection = true) {
  const requested = [...options.names, ...options.skillNames];
  if (!entries.length) fail("No skills found in the selected source");
  if (options.all && requested.length) fail("Use --all or named skills, not both");
  if (options.all) return entries;
  if (!requested.length && !requireSelection) return entries;
  if (!requested.length) fail("Select a skill or use --all");
  const selected = requested.map((name) => entries.find((entry) => entry.name === name || entry.directoryName === name));
  const missing = requested.filter((name, index) => !selected[index]);
  if (missing.length) fail(`Skill not found: ${missing.join(", ")}`);
  return [...new Map(selected.map((entry) => [entry.name, entry])).values()];
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: options.cwd, encoding: "utf8" });
  if (result.error) fail(`${command} failed to start: ${result.error.message}`);
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    fail(`${command} failed${detail ? `: ${detail}` : ""}`);
  }
  return result.stdout || "";
}

function upgradeCheckout(options) {
  if (options.source || options.ref) fail("upgrade does not accept --from or --ref");
  if (options.scope || options.agents.length) fail("upgrade manages the global Million Views skills checkout and both agents");
  if (options.dryRun) fail("upgrade does not support --dry-run");
  if (options.copy || options.force || options.skipSecurityAudit || options.allowVulnerable) {
    fail("upgrade does not accept install, removal, or security-audit options");
  }
  const status = run("git", ["status", "--porcelain"], { cwd: repoRoot }).trim();
  if (status) {
    fail(`Managed skills checkout has local changes; commit or stash them before upgrading:\n${status}`);
  }
  print(`Updating ${repoRoot} with git pull --ff-only...`, "blue");
  run("git", ["pull", "--ff-only"], { cwd: repoRoot });
  const entries = catalogEntries();
  print("Available skills from the marketplace:", "blue");
  for (const entry of entries) printEntry(entry);
  const hasSelection = options.all || options.names.length || options.skillNames.length;
  if (!hasSelection) {
    print("No skills reinstalled. Pass skill names or --all to refresh global installations.", "gray");
    return;
  }
  const selected = selectEntries(entries, options);
  installEntries(selected, { ...options, scope: "global", agents: ["claude-code", "codex"], remote: false }, true);
}

function githubSource(source) {
  if (/^[\w.-]+\/[\w.-]+(?:\.git)?$/.test(source)) {
    return `https://github.com/${source.replace(/\.git$/, "")}.git`;
  }
  try {
    const url = new URL(source);
    if (url.hostname !== "github.com") fail("Only github.com sources are supported");
    if (!/^\/[\w.-]+\/[\w.-]+(?:\.git)?\/?$/.test(url.pathname)) {
      fail("Use a GitHub repository URL, not a file or tree URL; use --ref and --skill for selection");
    }
    const repositoryPath = url.pathname.replace(/\/$/, "");
    return `https://github.com${repositoryPath.endsWith(".git") ? repositoryPath : `${repositoryPath}.git`}`;
  } catch {
    fail(`Unsupported GitHub source: ${source}`);
  }
}

function cloneRemote(source, ref) {
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), "million-views-skills-"));
  const cloneArgs = ["clone", "--depth", "1"];
  if (ref) cloneArgs.push("--branch", ref);
  cloneArgs.push(githubSource(source), staging);
  try {
    run("git", cloneArgs);
    return staging;
  } catch (error) {
    fs.rmSync(staging, { recursive: true, force: true });
    throw error;
  }
}

async function fetchJson(url, headers = {}) {
  if (typeof fetch !== "function") fail("This Node version does not provide fetch; use Node 18 or newer");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    if (!response.ok) fail(`HTTP ${response.status} from ${new URL(url).hostname}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function dependencyQueries(skillRoot) {
  const queries = new Set();
  const addName = (value) => {
    const name = String(value).trim().replace(/^['"]|['"]$/g, "").split(/[<>=~!\s]/)[0];
    if (name && /^[A-Za-z0-9_.@/-]+$/.test(name)) queries.add(name);
  };
  const packageJson = path.join(skillRoot, "package.json");
  if (fs.existsSync(packageJson)) {
    const manifest = readJson(packageJson);
    for (const field of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
      for (const name of Object.keys(manifest[field] || {})) addName(name);
    }
  }
  for (const file of ["requirements.txt", "pyproject.toml", "Cargo.toml", "go.mod", "Gemfile", "composer.json"]) {
    const filePath = path.join(skillRoot, file);
    if (!fs.existsSync(filePath)) continue;
    const text = fs.readFileSync(filePath, "utf8");
    if (file === "composer.json") {
      const manifest = readJson(filePath);
      for (const name of Object.keys(manifest.require || {})) addName(name);
    } else {
      for (const line of text.split("\n")) {
        const match = line.match(/^\s*(?:[-*]\s*)?([A-Za-z][A-Za-z0-9_.@/-]*)\s*(?:[<>=~!]|\s|$)/);
        if (match) addName(match[1]);
        const gem = line.match(/gem\s+["']([^"']+)["']/);
        if (gem) addName(gem[1]);
      }
    }
  }
  return [...queries].slice(0, 12);
}

function addDeclaredDependencies(metadata, queries) {
  const declared = metadata.dependencies;
  if (!declared) return;
  const values = Array.isArray(declared) ? declared : String(declared).split(/[;,\s]+/);
  for (const value of values) {
    const name = String(value).trim();
    if (name) queries.add(name.replace(/^['"]|['"]$/g, ""));
  }
}

function cvssScore(cve) {
  const metrics = cve.metrics || {};
  for (const key of ["cvssMetricV40", "cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]) {
    if (metrics[key]?.[0]?.cvssData?.baseScore != null) return metrics[key][0].cvssData.baseScore;
  }
  return null;
}

async function auditSkill(skill, sourceLabel, options = {}) {
  const queries = new Set(dependencyQueries(skill.root));
  addDeclaredDependencies(skill.metadata, queries);
  if (!queries.size) queries.add(skill.name);
  const auditQueries = [...queries].slice(0, 12);
  const headers = process.env.NVD_API_KEY ? { apiKey: process.env.NVD_API_KEY } : {};
  const advisories = new Map();
  const errors = [];
  for (const query of auditQueries) {
    try {
      const url = `${cveApi}?keywordSearch=${encodeURIComponent(query)}&resultsPerPage=20`;
      const payload = await fetchJson(url, headers);
      for (const item of payload.vulnerabilities || []) {
        const cve = item.cve;
        if (cve?.id) advisories.set(cve.id, { id: cve.id, score: cvssScore(cve), query });
      }
    } catch (error) {
      errors.push(`${query}: ${error.message}`);
    }
  }
  let exploited = new Set();
  try {
    const feed = await fetchJson(kevFeed);
    exploited = new Set((feed.vulnerabilities || []).map((item) => item.cveID));
  } catch (error) {
    errors.push(`CISA KEV feed: ${error.message}`);
  }
  const findings = [...advisories.values()].map((finding) => ({
    ...finding,
    knownExploited: exploited.has(finding.id),
    critical: finding.score != null && finding.score >= 9,
  }));
  print(`Security audit: ${sourceLabel}`, "blue");
  if (auditQueries.length) print(`  CVE queries: ${auditQueries.join(", ")}`, "gray");
  for (const finding of findings) {
    const flags = [finding.knownExploited && "known exploited", finding.critical && "critical", finding.score != null && `CVSS ${finding.score}`].filter(Boolean);
    print(`  ${finding.id} (${flags.join(", ") || "review"}; query: ${finding.query})`, finding.knownExploited || finding.critical ? "red" : "yellow");
  }
  if (!findings.length) print("  No matching CVEs returned.", "green");
  if (errors.length) {
    for (const error of errors) print(`  Audit error: ${error}`, "red");
    fail("CVE audit did not complete; use --skip-security-audit only if you accept that risk");
  }
  const blocking = findings.filter((finding) => finding.knownExploited || finding.critical);
  if (blocking.length) {
    if (!options.allowVulnerable) {
      fail(`CVE audit found ${blocking.length} critical or known-exploited advisory; use --allow-vulnerable only after review`);
    }
    print("WARNING: proceeding despite critical or known-exploited findings because --allow-vulnerable was supplied.", "yellow");
  }
}

function targetRoot(scope, agent) {
  if (!scope || !["global", "project"].includes(scope)) fail("Choose exactly one of --global or --project");
  if (!agents[agent]) fail(`Unsupported agent: ${agent}`);
  return path.resolve(scope === "global" ? os.homedir() : process.cwd(), ...agents[agent][scope]);
}

function destination(root, entry) {
  return path.join(root, entry.directoryName);
}

function existsOrLink(filePath) {
  try {
    fs.lstatSync(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function planInstall(entry, options, update = false) {
  const plans = options.agents.map((agent) => {
    const root = targetRoot(options.scope, agent);
    const target = destination(root, entry);
    const existing = existsOrLink(target);
    const existingStat = existing ? fs.lstatSync(target) : null;
    const sameLink = existingStat?.isSymbolicLink() && path.resolve(root, fs.readlinkSync(target)) === path.resolve(entry.root);
    const copy = options.copy || options.remote || (update && existing && !existingStat.isSymbolicLink());
    const action = sameLink && !copy ? "keep" : existing ? (update || options.force ? "replace" : "refuse") : "create";
    return { root, target, action, copy };
  });
  return { entry, plans };
}

function installEntries(entries, options, update = false) {
  const bundles = entries.map((entry) => planInstall(entry, options, update));
  for (const bundle of bundles) {
    for (const plan of bundle.plans) {
      if (plan.action === "refuse" && !options.force) fail(`Destination exists: ${plan.target}; use --force or update`);
    }
  }
  for (const bundle of bundles) {
    const { entry } = bundle;
    for (const plan of bundle.plans) {
      const { root, target, action, copy } = plan;
      print(`${options.dryRun ? "Would " : ""}${action} ${target}`, action === "refuse" ? "red" : "gray");
      if (options.dryRun || action === "keep") continue;
      fs.mkdirSync(root, { recursive: true });
      if (existsOrLink(target)) fs.rmSync(target, { recursive: true, force: true });
      if (copy) {
        fs.cpSync(entry.root, target, { recursive: true, dereference: false, errorOnExist: true });
      } else {
        fs.symlinkSync(path.resolve(entry.root), target, "dir");
      }
    }
  }
}

function planRemoval(entry, options) {
  const plans = options.agents.map((agent) => {
    const root = targetRoot(options.scope, agent);
    const target = destination(root, entry);
    if (!existsOrLink(target)) {
      return { target, absent: true };
    }
    const stat = fs.lstatSync(target);
    const managedLink = stat.isSymbolicLink()
      && path.resolve(root, fs.readlinkSync(target)) === path.resolve(entry.root);
    return { target, absent: false, managedLink };
  });
  return { entry, plans };
}

function removeEntries(entries, options) {
  const bundles = entries.map((entry) => planRemoval(entry, options));
  for (const bundle of bundles) {
    for (const plan of bundle.plans) {
      if (!plan.absent && !plan.managedLink && !options.force) {
        fail(`Refusing to remove copied or unmanaged skill: ${plan.target}; use --force`);
      }
    }
  }
  for (const bundle of bundles) {
    for (const plan of bundle.plans) {
      if (plan.absent) {
        print(`Absent ${plan.target}`, "gray");
        continue;
      }
      print(`${options.dryRun ? "Would remove" : "Remove"} ${plan.target}`, "yellow");
      if (!options.dryRun) fs.rmSync(plan.target, { recursive: true, force: true });
    }
  }
}

function exportEntry(entry, options, multiple) {
  const outputDir = path.resolve(options.outputDir || path.join(repoRoot, "dist"));
  const output = options.output ? path.resolve(options.output) : path.join(outputDir, `${entry.directoryName}.zip`);
  if (multiple && options.output) fail("--output can only be used when exporting one skill");
  if (isInside(entry.root, output)) fail(`Output cannot be inside the skill directory: ${output}`);
  if (existsOrLink(output)) {
    if (fs.lstatSync(output).isDirectory()) fail(`Output is a directory: ${output}`);
    if (!options.force) fail(`Output exists: ${output}; use --force`);
  }
  if (options.dryRun) {
    print(`Would export ${output}`, "gray");
    return;
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  if (existsOrLink(output)) fs.rmSync(output, { force: true });
  run("zip", ["-qr", output, entry.directoryName], { cwd: path.dirname(entry.root) });
  print(`Created ${output}`, "green");
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (options.noColor) colorEnabled = false;
  if (options.help || command === "help") {
    usage();
    return;
  }
  if (command === "list") {
    for (const entry of catalogEntries()) printEntry(entry);
    return;
  }
  if (command === "check") {
    const entries = selectEntries(catalogEntries(), options, false);
    for (const entry of entries) print(`OK ${entry.name} (${entry.root})`, "green");
    return;
  }
  if (command === "export" || command === "package") {
    const entries = selectEntries(catalogEntries(), options);
    entries.forEach((entry) => exportEntry(entry, options, entries.length > 1));
    print("Claude web accepts ZIP uploads containing the skill folder at the archive root.", "gray");
    return;
  }
  if (command === "upgrade") {
    upgradeCheckout(options);
    return;
  }
  if (!["install", "update", "remove", "audit"].includes(command)) fail(`Unknown command: ${command}`);
  if (options.source && !["install", "update", "audit"].includes(command)) fail(`${command} does not accept --from`);
  if (["install", "update", "remove"].includes(command)) {
    if (!options.scope) fail(`${command} requires exactly one of --global or --project`);
    if (!options.agents.length) fail(`${command} requires at least one --agent`);
  }

  let staging = null;
  try {
    let entries;
    if (options.source) {
      staging = cloneRemote(options.source, options.ref);
      entries = selectEntries(remoteEntries(staging), options);
    } else {
      entries = selectEntries(catalogEntries(), options, command !== "check");
    }
    if (command === "audit") {
      for (const entry of entries) await auditSkill(entry, options.source || "local checkout", options);
      return;
    }
    if (command === "remove") {
      removeEntries(entries, options);
      return;
    }
    if (options.source && !options.skipSecurityAudit) {
      for (const entry of entries) await auditSkill(entry, options.source, options);
    } else if (options.source) {
      print("WARNING: remote CVE audit explicitly skipped.", "yellow");
    }
    if (options.source && !options.copy) {
      print("Remote skills are copied because the temporary Git clone is removed after installation.", "gray");
    }
    options.remote = Boolean(options.source);
    installEntries(entries, options, command === "update");
  } finally {
    if (staging) fs.rmSync(staging, { recursive: true, force: true });
  }
}

main().catch((error) => {
  printError(`Error: ${error.message}`);
  process.exitCode = 1;
});
