#!/usr/bin/env bash

set -euo pipefail

readonly repository_url="${MILLION_VIEWS_SKILLS_REPO:-https://github.com/million-views/skills.git}"
readonly skills_root="${MILLION_VIEWS_SKILLS_HOME:-${HOME}/.million-views/skills}"
readonly launcher_dir="${MILLION_VIEWS_SKILLS_BIN:-${HOME}/.local/bin}"
readonly launcher_path="${launcher_dir}/skills"

ref="main"
force_launcher=0

usage() {
  cat <<'EOF'
Bootstrap Million Views skills.

Usage:
  curl -fsSL https://raw.githubusercontent.com/million-views/skills/main/install.sh \
    | bash

Options:
  --ref <git-ref>       Clone or update a specific ref on first install.
  --force-launcher      Replace a non-Million-Views launcher at ~/.local/bin/skills.
  --help                Show this help.

This bootstraps the skills command and lists the marketplace registry. It does
not install individual skills. Use `skills install` after the bootstrap.
EOF
}

fail() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

while (($# > 0)); do
  case "$1" in
    --ref)
      (($# >= 2)) || fail "--ref requires a value"
      ref="$2"
      shift 2
      ;;
    --force-launcher)
      force_launcher=1
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    --*)
      fail "unknown option: $1"
      ;;
    *)
      fail "install.sh bootstraps the skills command; install skills afterward with: skills install $1 --global --agent claude-code --agent codex"
      ;;
  esac
done

command -v git >/dev/null 2>&1 || fail "git is required"
command -v node >/dev/null 2>&1 || fail "Node.js 18 or newer is required"
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 18 ? 0 : 1)' \
  || fail "Node.js 18 or newer is required"

if [[ -e "$skills_root" && ! -d "$skills_root/.git" ]]; then
  fail "$skills_root exists but is not a Git checkout"
fi

if [[ -d "$skills_root/.git" ]]; then
  status="$(git -C "$skills_root" status --porcelain)"
  [[ -z "$status" ]] || fail "managed checkout has local changes; commit or stash them before upgrading"
  git -C "$skills_root" pull --ff-only
else
  mkdir -p "$(dirname "$skills_root")"
  git clone --depth 1 --branch "$ref" "$repository_url" "$skills_root"
fi

[[ -f "$skills_root/bin/skills" ]] || fail "managed checkout is missing bin/skills"
mkdir -p "$launcher_dir"
if [[ -L "$launcher_path" ]]; then
  if [[ "$force_launcher" -ne 1 ]]; then
    fail "$launcher_path is a symlink; remove it or use --force-launcher"
  fi
  rm -f "$launcher_path"
fi
if [[ -e "$launcher_path" && "$force_launcher" -ne 1 ]]; then
  if ! grep -q "Million Views skills launcher" "$launcher_path" 2>/dev/null; then
    fail "$launcher_path already exists; use --force-launcher to replace it"
  fi
fi
install -m 0755 "$skills_root/bin/skills" "$launcher_path"

printf '\nAvailable skills from the marketplace:\n'
node "$skills_root/skills.mjs" list --no-color

printf '\nThe skills command is ready. Install selected skills explicitly:\n'
printf 'skills install <skill-name> --global --agent claude-code --agent codex\n'
printf 'skills install --all --global --agent claude-code --agent codex\n'

case ":${PATH}:" in
  *":${launcher_dir}:"*) ;;
  *)
    printf '\nAdd this directory to PATH before using the skills command:\n'
    printf 'export PATH="%s:$PATH"\n' "$launcher_dir"
    ;;
esac

printf '\nBootstrapped the skills command. No individual skills were installed.\n'
