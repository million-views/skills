# AGENTS.md

## Scope

These instructions apply to the Million Views skills repository.

This repository contains:

- Agent Skills compliant with the Agent Skills specification.
- `skills.mjs`, the dependency-free skills CLI.
- `install.sh` and `bin/skills`, which bootstrap the CLI.
- `.claude-plugin/marketplace.json`, the marketplace registry.

Read `README.md` for user-facing installation and publishing guidance. Use
`skills help <command>` for current CLI behavior.

## Repository conventions

- Use kebab-case for skill directories and filenames.
- Use snake_case for Python functions.
- Keep the CLI dependency-free unless there is a compelling reason otherwise.
- Prefer focused patches and preserve unrelated work.
- Do not commit or push unless explicitly asked.
- Never commit secrets, credentials, generated archives, or temporary files.
- Do not maintain hardcoded skill counts or skill inventories in documentation.

## CLI source of truth

- The installed command is `skills`.
- Direct development invocation is `node skills.mjs`.
- `skills.mjs` owns the CLI version through `CLI_VERSION`.
- `.claude-plugin/marketplace.json` owns marketplace metadata and entries.
- Each registered skill's marketplace version must match its `SKILL.md` metadata version.
- `export` is the only supported command for creating Claude web ZIPs.

When changing CLI behavior:

1. Update command-specific help.
2. Update README examples when user-visible behavior changes.
3. Run:

   ```bash
   node --check skills.mjs
   node skills.mjs --no-color --help
   node skills.mjs --no-color check
   bash -n install.sh
   git diff --check
   ```

4. Verify Vercel compatibility when discovery or skill layout changes:

   ```bash
   npx skills add . --list
   ```

## Creating or updating a skill

Every skill must:

- Live in a kebab-case directory.
- Contain `SKILL.md`.
- Have YAML frontmatter with `name` and `description`.
- Use a `name` matching its parent directory.
- Keep the description specific about when the skill should be used.
- Follow the current Agent Skills specification.
- Be self-contained, actionable, and free of project-history assumptions.
- Avoid duplicating instructions that belong in this file, the README, or CLI help.

When adding a skill:

1. Add it to `.claude-plugin/marketplace.json`.
2. Keep its marketplace and `SKILL.md` versions synchronized.
3. Run `skills check`.
4. Run Vercel discovery with `npx skills add . --list`.
5. Add documentation only where it helps users discover or use the skill.

## Security

Treat downloaded skills and repositories as untrusted input.

- Do not execute code from a downloaded skill during inspection.
- Preserve the CLI's remote CVE and CISA KEV audit behavior.
- Do not weaken security checks to make an install succeed.
- Clearly document any intentional security override.

## Publishing

Before publishing changes:

- Review the complete diff.
- Check for stale examples, dead commands, hardcoded inventories, and version mismatches.
- Run the validation commands above.
- Use a concise imperative commit message.
- Push only after explicit human approval.
