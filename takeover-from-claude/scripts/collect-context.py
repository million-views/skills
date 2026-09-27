#!/usr/bin/env python3
"""Collect a bounded, redacted Claude-to-Codex project handoff."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_TRANSCRIPT_BYTES = 4 * 1024 * 1024
DEFAULT_MAX_MEMORY_CHARS = 180_000
DEFAULT_MAX_MESSAGE_CHARS = 8_000
DEFAULT_MAX_TRANSCRIPT_CHARS = 120_000
VIEW_CHOICES = ("all", "claude", "memory", "transcript", "repository")
CLAUDE_VIEWS = frozenset({"all", "claude", "memory", "transcript"})
MEMORY_VIEWS = frozenset({"all", "claude", "memory"})
TRANSCRIPT_VIEWS = frozenset({"all", "claude", "transcript"})
REPOSITORY_VIEWS = frozenset({"all", "repository"})
PROJECT_INSTRUCTION_NAMES = {
    "AGENTS.md",
    "CLAUDE.md",
    "CONTRIBUTING.md",
    "README.md",
    "Makefile",
    "pyproject.toml",
    "package.json",
    "Cargo.toml",
    "go.mod",
}
PROJECT_DIRECTORY_NAMES = {"docs", "engineering", "plans", "product", "specs"}
HANDOFF_FILE_PATTERN = re.compile(r"handoff", re.IGNORECASE)
REDACTION_PATTERNS = (
    re.compile(r"(?i)([\"']?(?:api[_-]?key|access(?:[_-]?token)?|refresh(?:[_-]?token)?|password|secret)[\"']?\s*[:=]\s*[\"']?)[^\"',;\s}]+"),
    re.compile(r"(?i)bearer\s+[A-Za-z0-9._~+/=-]+"),
    re.compile(r"(?<![A-Za-z0-9])(?:sk|gh[opusr])-[A-Za-z0-9_-]{12,}\b"),
    re.compile(r"\bAIza[A-Za-z0-9_-]{20,}\b"),
)


def parse_args() -> argparse.Namespace:
    def non_negative_int(value: str) -> int:
        parsed = int(value)
        if parsed < 0:
            raise argparse.ArgumentTypeError("must be zero or greater")
        return parsed

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project-dir", default=".")
    parser.add_argument("--claude-state-dir")
    parser.add_argument("--output-dir")
    parser.add_argument("--transcript-tail", type=non_negative_int, default=12)
    parser.add_argument(
        "--view",
        choices=VIEW_CHOICES,
        default="all",
        help="Evidence scope: all, claude, memory, transcript, or repository.",
    )
    return parser.parse_args()


def canonical_path(path: str | Path) -> Path:
    return Path(path).expanduser().resolve(strict=False)


def project_slug(project_dir: Path) -> str:
    """Return Claude's observed slash-to-hyphen project directory candidate."""
    return project_dir.as_posix().replace("/", "-")


def read_json_line(line: str) -> dict[str, Any] | None:
    try:
        value = json.loads(line)
    except json.JSONDecodeError:
        return None
    return value if isinstance(value, dict) else None


def nested_value(record: dict[str, Any], *keys: str) -> Any:
    value: Any = record
    for key in keys:
        if not isinstance(value, dict):
            return None
        value = value.get(key)
    return value


def record_cwd(record: dict[str, Any]) -> str | None:
    for candidate in (
        record.get("cwd"),
        nested_value(record, "session", "cwd"),
        nested_value(record, "message", "cwd"),
    ):
        if isinstance(candidate, str) and candidate:
            return candidate
    return None


def transcript_cwd(transcript: Path) -> Path | None:
    try:
        with transcript.open("rb") as stream:
            data = stream.read(512 * 1024).decode("utf-8", errors="replace")
    except OSError:
        return None
    for line in data.splitlines():
        record = read_json_line(line)
        if record:
            cwd = record_cwd(record)
            if cwd:
                return canonical_path(cwd)
    return None


def candidate_state_dirs(project_dir: Path, explicit: str | None) -> list[Path]:
    if explicit:
        return [canonical_path(explicit)]
    projects_root = Path.home() / ".claude" / "projects"
    slug_candidate = projects_root / project_slug(project_dir)
    candidates = [slug_candidate] if slug_candidate.is_dir() else []
    if projects_root.is_dir():
        candidates.extend(
            path for path in sorted(projects_root.iterdir())
            if path.is_dir() and path not in candidates
        )
    return candidates


def match_state_dir(
    project_dir: Path,
    explicit: str | None,
    validate_transcript_cwd: bool = True,
) -> tuple[Path | None, str, list[str]]:
    warnings: list[str] = []
    if not validate_transcript_cwd:
        if explicit:
            candidate = canonical_path(explicit)
            if candidate.is_dir():
                return candidate, "explicit", warnings
            warnings.append(f"Explicit Claude state directory does not exist: {candidate}")
            return None, "none", warnings
        slug_candidate = Path.home() / ".claude" / "projects" / project_slug(project_dir)
        if slug_candidate.is_dir():
            warnings.append("Claude state matched by slug; transcript cwd validation was not requested.")
            return slug_candidate, "slug-only", warnings
        warnings.append("No Claude project state directory matched the project path by slug.")
        return None, "none", warnings
    candidates = candidate_state_dirs(project_dir, explicit)
    for candidate in candidates:
        for transcript in sorted(candidate.glob("*.jsonl")):
            if transcript_cwd(transcript) == project_dir:
                method = "explicit-cwd" if explicit else "transcript-cwd"
                return candidate, method, warnings
    if not explicit:
        slug_candidate = Path.home() / ".claude" / "projects" / project_slug(project_dir)
        if slug_candidate.is_dir():
            warnings.append("Claude state matched by slug only; no transcript cwd confirmed it.")
            return slug_candidate, "slug-only", warnings
    warnings.append("No Claude project state directory matched the project path.")
    return None, "none", warnings


def file_metadata(path: Path) -> dict[str, Any]:
    try:
        stat = path.stat()
    except OSError as error:
        return {"path": str(path), "error": str(error)}
    metadata: dict[str, Any] = {
        "path": str(path),
        "bytes": stat.st_size,
        "modified": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
    }
    return metadata


def clip_text(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    return f"{text[:limit]}\n[… clipped at {limit} characters …]"


def redaction_count(text: str) -> int:
    count = 0
    remaining = text
    for pattern in REDACTION_PATTERNS:
        remaining, matches = pattern.subn("", remaining)
        count += matches
    return count


def redact_text(text: str) -> str:
    replacements = (
        (REDACTION_PATTERNS[0], r"\1[REDACTED]"),
        (REDACTION_PATTERNS[1], "Bearer [REDACTED]"),
        (REDACTION_PATTERNS[2], "[REDACTED_TOKEN]"),
        (REDACTION_PATTERNS[3], "[REDACTED_TOKEN]"),
    )
    for pattern, replacement in replacements:
        text = pattern.sub(replacement, text)
    return text


def text_from_content(content: Any) -> str:
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    parts = []
    for item in content:
        if isinstance(item, str):
            parts.append(item)
        elif isinstance(item, dict) and item.get("type") in {"text", "input_text"}:
            value = item.get("text")
            if isinstance(value, str):
                parts.append(value)
    return "\n".join(parts)


def record_message(record: dict[str, Any]) -> tuple[str, str, str] | None:
    message = record.get("message")
    if not isinstance(message, dict) or message.get("role") not in {"user", "assistant"}:
        return None
    text = clip_text(redact_text(text_from_content(message.get("content"))).strip(), DEFAULT_MAX_MESSAGE_CHARS)
    if not text:
        return None
    timestamp = record.get("timestamp") or message.get("timestamp") or ""
    return str(timestamp), str(message["role"]), text


def record_summary(record: dict[str, Any]) -> dict[str, Any]:
    message = record.get("message")
    role = message.get("role") if isinstance(message, dict) else None
    timestamp = record.get("timestamp", "")
    if isinstance(message, dict):
        timestamp = record.get("timestamp") or message.get("timestamp", "")
    return {
        "record_type": record.get("type"),
        "timestamp": timestamp,
        "message_role": role,
    }


def collect_transcript_metadata(transcript: Path, message_limit: int) -> tuple[dict[str, Any], list[tuple[str, str, str]]]:
    try:
        with transcript.open("rb") as stream:
            stream.seek(0, os.SEEK_END)
            size = stream.tell()
            stream.seek(max(0, size - DEFAULT_TRANSCRIPT_BYTES))
            data = stream.read().decode("utf-8", errors="replace")
    except OSError as error:
        return {"path": str(transcript), "error": str(error)}, []
    if size > DEFAULT_TRANSCRIPT_BYTES:
        data = data[data.find("\n") + 1 :]
    records = [read_json_line(line) for line in data.splitlines()]
    records = [record for record in records if record]
    messages = [message for record in records if (message := record_message(record))]
    cwd = transcript_cwd(transcript)
    last_record = record_summary(records[-1]) if records else {}
    metadata = {
        **file_metadata(transcript),
        "cwd": str(cwd) if cwd else None,
        "tail_truncated": size > DEFAULT_TRANSCRIPT_BYTES,
        "scanned_message_count": len(messages),
        "last_record": last_record,
        "last_meaningful_message": messages[-1][0:2] if messages else None,
        "last_meaningful_message_preview": clip_text(messages[-1][2], 1_000) if messages else None,
        "last_meaningful_message_scope": (
            "scanned tail" if size > DEFAULT_TRANSCRIPT_BYTES else "full transcript"
        ),
        "redacted_matches": sum(
            redaction_count(text_from_content(record.get("message", {}).get("content")))
            for record in records
            if isinstance(record.get("message"), dict)
        ),
    }
    selected: list[tuple[str, str, str]] = []
    total_chars = 0
    recent_messages = messages[-message_limit:] if message_limit else []
    for message in reversed(recent_messages):
        if selected and total_chars + len(message[2]) > DEFAULT_MAX_TRANSCRIPT_CHARS:
            break
        selected.append(message)
        total_chars += len(message[2])
    selected.reverse()
    return metadata, selected


def read_memory_files(state_dir: Path, limit: int) -> tuple[list[dict[str, Any]], list[str], int]:
    metadata = []
    excerpts = []
    remaining = limit
    redacted_matches = 0
    memory_dir = state_dir / "memory"
    index_path = memory_dir / "MEMORY.md"
    try:
        index_text = index_path.read_text(encoding="utf-8")
    except OSError:
        index_text = ""
    referenced_names = {
        Path(link).name
        for link in re.findall(r"\]\(([^)]+)\)", index_text)
        if link and not link.startswith(("http://", "https://"))
    }
    for path in sorted((state_dir / "memory").glob("*.md")):
        try:
            raw_content = path.read_text(encoding="utf-8")
            redacted_matches += redaction_count(raw_content)
            content = redact_text(raw_content)
        except OSError as error:
            metadata.append({"path": str(path), "error": str(error)})
            continue
        metadata.append(
            {
                **file_metadata(path),
                "characters": len(content),
                "indexed_by_memory_md": path.name == "MEMORY.md" or path.name in referenced_names,
            }
        )
        if remaining <= 0:
            continue
        excerpt = clip_text(content, remaining)
        excerpts.append(f"## {path.name}\n\n{excerpt}")
        remaining -= len(excerpt)
    if remaining <= 0 and metadata:
        excerpts.append("[… memory excerpts clipped at the configured total limit …]")
    return metadata, excerpts, redacted_matches


def run_command(args: list[str], cwd: Path) -> tuple[int, str]:
    try:
        result = subprocess.run(
            args,
            cwd=cwd,
            check=False,
            capture_output=True,
            text=True,
            timeout=10,
        )
    except (OSError, subprocess.TimeoutExpired) as error:
        return 1, str(error)
    return result.returncode, (result.stdout + result.stderr).strip()


def repository_snapshot(project_dir: Path) -> dict[str, Any]:
    profiles = (
        (
            "git",
            {
                "root": ["git", "rev-parse", "--show-toplevel"],
                "head": ["git", "rev-parse", "HEAD"],
                "status": ["git", "status", "--short", "--branch"],
                "recent_log": ["git", "log", "-8", "--oneline", "--decorate"],
                "diff_stat": ["git", "diff", "--stat"],
            },
        ),
        (
            "hg",
            {
                "root": ["hg", "root"],
                "head": ["hg", "id", "-i"],
                "status": ["hg", "status"],
                "recent_log": ["hg", "log", "-l", "8", "--template", "{rev}:{node|short} {desc|firstline}\\n"],
                "diff_stat": ["hg", "diff", "--stat"],
            },
        ),
        (
            "jj",
            {
                "root": ["jj", "root"],
                "head": ["jj", "log", "-r", "@", "-n", "1", "--no-graph"],
                "status": ["jj", "status"],
                "recent_log": ["jj", "log", "-n", "8", "--no-graph"],
                "diff_stat": ["jj", "diff", "--stat"],
            },
        ),
    )
    for vcs, commands in profiles:
        code, _ = run_command(commands["root"], project_dir)
        if code != 0:
            continue
        snapshot: dict[str, Any] = {"path": str(project_dir), "vcs": vcs}
        for name, command in commands.items():
            _, output = run_command(command, project_dir)
            snapshot[name] = output
        return snapshot
    return {
        "path": str(project_dir),
        "vcs": "none-detected",
        "status": "No supported version-control repository detected.",
    }


def project_file_list(project_dir: Path) -> list[str]:
    paths = []
    for path in sorted(project_dir.iterdir()):
        if path.name in {".git", ".venv", "node_modules", "__pycache__"}:
            continue
        if path.name in PROJECT_INSTRUCTION_NAMES or path.name == ".claude" or (
            path.is_dir() and path.name in PROJECT_DIRECTORY_NAMES
        ):
            paths.append(str(path.relative_to(project_dir)))
    tmp_dir = project_dir / "tmp"
    if tmp_dir.is_dir():
        paths.extend(
            str(path.relative_to(project_dir))
            for path in sorted(tmp_dir.glob("*handoff*"))
            if path.is_file()
        )
    return paths


def handoff_file_list(project_dir: Path) -> list[str]:
    candidates = []
    for root in (project_dir, project_dir / "tmp"):
        if not root.is_dir():
            continue
        for path in root.glob("*"):
            if path.is_file() and HANDOFF_FILE_PATTERN.search(path.name):
                candidates.append(str(path.relative_to(project_dir)))
    return sorted(set(candidates))


def render_report(
    view: str,
    project_dir: Path,
    state_dir: Path | None,
    state_match: str,
    warnings: list[str],
    repository: dict[str, Any],
    memory_metadata: list[dict[str, Any]],
    memory_excerpts: list[str],
    transcript_sections: list[str],
    project_files: list[str],
    transcript_metadata: list[dict[str, Any]],
    orphan_memory_files: list[str],
    redacted_matches: int,
) -> str:
    collect_repository = view in REPOSITORY_VIEWS
    collect_memory = view in MEMORY_VIEWS
    collect_transcripts = view in TRANSCRIPT_VIEWS
    lines = [
        f"# Claude takeover context ({view} view)",
        "",
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        f"Project: `{project_dir}`",
        f"Claude state: `{state_dir or 'not found'}` ({state_match})",
        "",
        "## Evidence scope",
        "",
        f"- Repository: {'collected' if collect_repository else 'not collected'}",
        f"- Claude memory: {'collected' if collect_memory else 'not collected'}",
        f"- Claude transcripts: {'collected' if collect_transcripts else 'not collected'}",
    ]
    if collect_repository:
        lines.extend(
            [
                "## Repository snapshot",
                "",
                f"VCS: {repository.get('vcs', 'unknown')}",
                f"HEAD: `{repository.get('head', 'unknown')}`",
                "",
                "```text",
                repository.get("status", "status unavailable"),
                "```",
                "",
                "### Recent history",
                "",
                "```text",
                repository.get("recent_log", "history unavailable"),
                "```",
                "",
                "### Current diff summary",
                "",
                "```text",
                repository.get("diff_stat", "diff unavailable"),
                "```",
                "",
                "## Project files to inspect",
                "",
            ]
        )
        if project_files:
            lines.extend(f"- `{path}`" for path in project_files)
        else:
            lines.append("No conventional project files detected.")
    if collect_memory:
        lines.extend(
            [
                "",
                "## Claude memory",
                "",
                "Memory files are historical context. Read their current contents before relying on a claim.",
                "",
            ]
        )
        if memory_metadata:
            lines.extend(
                f"- `{item['path']}` ({item.get('characters', '?')} characters; "
                f"indexed={item.get('indexed_by_memory_md', '?')}; "
                f"modified={item.get('modified', 'unknown')})"
                for item in memory_metadata
            )
        else:
            lines.append("No memory files found.")
        if orphan_memory_files:
            lines.extend(["", "Unindexed memory files:"])
            lines.extend(f"- `{path}`" for path in orphan_memory_files)
        lines.extend(["", *memory_excerpts])
    if collect_transcripts:
        lines.extend(["", "## Recent transcript excerpts", ""])
        lines.extend(transcript_sections or ["No readable transcript excerpts found."])
        lines.extend(["", "### Session tail metadata", ""])
        if transcript_metadata:
            for item in transcript_metadata:
                last_record = item.get("last_record", {})
                last_message = item.get("last_meaningful_message") or ["", ""]
                lines.append(
                    f"- `{item.get('path')}`: last record="
                    f"`{last_record.get('record_type', 'unknown')}`, "
                    f"last meaningful message=`{last_message[1] or 'none'}` "
                    f"at `{last_message[0] or 'unknown'}`, "
                    f"scope=`{item.get('last_meaningful_message_scope', 'unknown')}`, "
                    f"redactions={item.get('redacted_matches', 0)}"
                )
        else:
            lines.append("No transcript metadata found.")
    lines.extend(["", "## Collection summary", "", f"Redacted secret-like matches: {redacted_matches}"])
    lines.extend(["", "## Warnings", ""])
    if warnings:
        lines.extend(f"- {warning}" for warning in warnings)
    else:
        lines.append("- None.")
    lines.extend(
        [
            "",
            "## Operating rule",
            "",
            "This report does not authorize edits, commits, pushes, deletions, dependency installs, or long-running processes.",
        ]
    )
    return "\n".join(lines).rstrip() + "\n"


def write_report(output_dir: Path, report: str, manifest: dict[str, Any], evidence: dict[str, Any]) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "context.md").write_text(report, encoding="utf-8")
    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    (output_dir / "evidence.json").write_text(
        json.dumps(evidence, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    args = parse_args()
    project_dir = canonical_path(args.project_dir)
    if not project_dir.is_dir():
        print(f"Project directory does not exist or is not a directory: {project_dir}")
        return 2
    output_dir = canonical_path(args.output_dir or project_dir / "tmp" / "claude-takeover")
    collect_claude = args.view in CLAUDE_VIEWS
    collect_repository = args.view in REPOSITORY_VIEWS
    collect_memory = args.view in MEMORY_VIEWS
    collect_transcripts = args.view in TRANSCRIPT_VIEWS
    if collect_claude:
        state_dir, state_match, warnings = match_state_dir(
            project_dir,
            args.claude_state_dir,
            validate_transcript_cwd=collect_transcripts,
        )
    else:
        state_dir, state_match, warnings = None, "not-requested", []
    repository = repository_snapshot(project_dir) if collect_repository else {
        "path": str(project_dir),
        "vcs": "not-requested",
    }
    memory_metadata: list[dict[str, Any]] = []
    memory_excerpts: list[str] = []
    transcript_sections: list[str] = []
    transcript_metadata: list[dict[str, Any]] = []
    redacted_matches = 0
    if collect_memory and state_dir:
        memory_metadata, memory_excerpts, memory_redactions = read_memory_files(
            state_dir, DEFAULT_MAX_MEMORY_CHARS
        )
        redacted_matches += memory_redactions
    if collect_transcripts and state_dir:
        transcripts = sorted(
            state_dir.glob("*.jsonl"),
            key=lambda path: path.stat().st_mtime,
            reverse=True,
        )
        for transcript in transcripts[:5]:
            metadata, messages = collect_transcript_metadata(transcript, args.transcript_tail)
            transcript_metadata.append(metadata)
            redacted_matches += metadata.get("redacted_matches", 0)
            if not messages:
                continue
            transcript_sections.append(f"### {transcript.name}\n")
            transcript_sections.extend(
                f"**{role}** ({timestamp})\n\n{text}\n"
                for timestamp, role, text in messages
            )
    project_files = project_file_list(project_dir) if collect_repository else []
    handoff_files = handoff_file_list(project_dir) if collect_repository else []
    orphan_memory_files = [
        item["path"]
        for item in memory_metadata
        if item.get("indexed_by_memory_md") is False
    ]
    evidence = {
        "schema_version": 1,
        "view": args.view,
        "project": {
            "directory": str(project_dir),
            "slug_candidate": project_slug(project_dir),
        },
        "claude": {
            "state_dir": str(state_dir) if state_dir else None,
            "state_match": state_match,
            "memory_files": memory_metadata,
            "orphan_memory_files": orphan_memory_files,
            "transcript_files": transcript_metadata,
        },
        "repository": {
            **repository,
            "project_files": project_files,
            "handoff_files": handoff_files,
        },
        "warnings": warnings,
        "redacted_matches": redacted_matches,
    }
    manifest = {
        "schema_version": 2,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "view": args.view,
        "project_dir": str(project_dir),
        "project_slug_candidate": project_slug(project_dir),
        "claude_state_dir": str(state_dir) if state_dir else None,
        "state_match": state_match,
        "repository": repository,
        "memory_files": memory_metadata,
        "orphan_memory_files": orphan_memory_files,
        "transcript_files": transcript_metadata,
        "project_files": project_files,
        "handoff_files": handoff_files,
        "redacted_matches": redacted_matches,
        "evidence_file": "evidence.json",
        "warnings": warnings,
    }
    report = render_report(
        args.view,
        project_dir,
        state_dir,
        state_match,
        warnings,
        repository,
        memory_metadata,
        memory_excerpts,
        transcript_sections,
        project_files,
        transcript_metadata,
        orphan_memory_files,
        redacted_matches,
    )
    write_report(output_dir, report, manifest, evidence)
    print(f"Wrote {output_dir / 'context.md'}")
    print(f"Wrote {output_dir / 'manifest.json'}")
    print(f"Wrote {output_dir / 'evidence.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
