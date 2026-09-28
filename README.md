# Million Views Agent Skills

Agent Skills for Million Views products and tools. Point your compatible AI
assistant to a skill folder and it will understand the relevant methodology,
patterns, and best practices.

## Install

### One-command bootstrap

The supported team install keeps a managed checkout at
`~/.million-views/skills` and installs a `skills` launcher at
`~/.local/bin/skills`. It lists the skills from this repository's marketplace
registry. It does not install individual skills:

```bash
curl -fsSL https://raw.githubusercontent.com/million-views/skills/main/install.sh \
  | bash
```

Then select the skills to install globally for both Claude Code and Codex:

```bash
skills list
skills install SKILL_NAME --global --agent claude-code --agent codex
```

Replace `SKILL_NAME` with a name shown by `skills list`.

Or install every marketplace entry:

```bash
skills install --all --global --agent claude-code --agent codex
```

The bootstrap requires Git and Node.js 18+. If `~/.local/bin` is not already
on `PATH`, the installer prints the exact export line to add to your shell
profile. For a reviewable bootstrap, download `install.sh`, inspect it, and
run it with Bash instead of piping it directly.

The examples follow `main` for convenience. For reproducible provisioning,
fetch `install.sh` from a reviewed commit or release tag and pass the same ref
with `--ref`.

The launcher is a small executable, not a shell alias, so `skills` also works
from scripts and non-interactive shells. Set `MILLION_VIEWS_SKILLS_HOME` or
`MILLION_VIEWS_SKILLS_BIN` to override the managed checkout or launcher
directory.

### Managing the checkout

After the first install, use the launcher:

```bash
skills list
skills upgrade
skills upgrade SKILL_NAME
skills upgrade --all
```

`upgrade` updates the managed checkout with `git pull --ff-only`, validates it,
lists the current marketplace entries, and reinstalls selected skills for both
agents. With no selection it updates and lists the checkout without changing
installed skills. It stops if the checkout has local changes; it never rebases
or rewrites local history.

For direct work from a clone, the underlying dependency-free installer is:

```bash
node skills.mjs list
node skills.mjs check
node skills.mjs install SKILL_NAME --global --agent claude-code --agent codex
```

The default local install creates direct symlinks to this checkout. Pull updates
and run the install command again, or use `update` explicitly. GitHub installs
are copied because their temporary clone is removed after installation. Use
`--copy` for an independent copy of a local skill. Use `--project` instead of
`--global` to install into the current project's `.claude/skills/` and
`.agents/skills/` directories. `--agent` may be repeated.

Install every skill for both agents:

```bash
node skills.mjs install --all --global --agent claude-code --agent codex
```

### Install from GitHub

Remote installs accept a GitHub repository or a repository containing a
`.claude-plugin/marketplace.json`:

```bash
node skills.mjs install --from owner/repository --skill SKILL_NAME \
  --ref v2.0.0 --global --agent codex
```

Before copying a remote skill, the installer queries the [NVD CVE database](https://nvd.nist.gov/vuln)
and [CISA Known Exploited Vulnerabilities feed](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
for dependencies declared by the source, or the skill name when none are declared,
using conservative keyword matching. It fails closed if the audit
cannot complete or finds a critical/known-exploited advisory. Review a finding before using
`--allow-vulnerable`; use
`--skip-security-audit` only when you intentionally accept an unavailable
audit. This check covers known software vulnerabilities, not prompt injection
or the quality of a skill's instructions. The installer never executes files
from the downloaded repository.

Remove a managed installation:

```bash
node skills.mjs remove SKILL_NAME --global --agent claude-code
```

### Vercel `npx skills` compatibility

This repository also works with Vercel's open skills CLI and follows its
`SKILL.md` discovery and installation model.
Use the CLI to inspect the skills currently discoverable from this checkout or
from the published repository:

```bash
npx skills add . --list
npx skills add million-views/skills --list
npx skills add million-views/skills --skill SKILL_NAME \
  --global --agent claude-code --yes
```

Vercel's CLI discovers `SKILL.md` files independently; it does not consume our
`.claude-plugin/marketplace.json`. Use the Million Views installer when you
want the marketplace listing, managed checkout upgrades, and its pre-install
CVE audit; the Vercel command is a separate installation path.

### Export for Claude web

Claude's [documented upload flow](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
accepts a ZIP containing the skill folder at the archive root. Export one with:

```bash
node skills.mjs export SKILL_NAME
```

The archive is written to `dist/SKILL_NAME.zip`. Upload it from
Claude → Customize → Skills → Create skill → Upload a skill.

## Marketplace

The [marketplace registry](./.claude-plugin/marketplace.json) is the source of
truth for the installable entries and the metadata shown by this installer.
Use `skills list` or `node skills.mjs list` for the current checkout; skill
instructions live beside each registered source path.

## License

MIT License. See [LICENSE](./LICENSE) for details.

## About

[Million Views](https://m5nv.com) is a research and product development firm exploring ideas worth pursuing.

These skills are provided as-is for open source use. We do not accept contributions or provide support at this time.
