# Take Over from Claude

Use this skill when Claude Code has been working in the project and you want
Codex to pick up safely.

Start with a read-only request such as:

```text
Take over this project from Claude. First collect the handoff and tell me what
Claude's memory says, what the repository proves, and where they disagree. Do
not change files or start processes.
```

You can also ask for a narrower view:

- “What does Claude's memory say about the current status? Do not inspect the repo yet.”
- “What do Claude's recent transcripts say? Do not inspect the repo or memory files yet.”
- “What can be established from the repository alone? Do not use Claude's memory.”
- “Where did Claude stop, and what was the last unfinished intention? Separate facts from inference.”
- “What is the smallest safe next step? Do not implement it yet.”
- “Review the generated handoff for sensitive information before I share it.”

The skill writes a temporary handoff bundle to `tmp/claude-takeover/`. In the
default `all` view it checks Claude's account against the current working tree,
instructions, commits, tests, and source. Historical memory is useful context,
not proof or authorization.

The collector keeps these evidence boundaries separate: `memory` (memory files
only), `transcript` (session transcripts only), `claude` (both), `repository`
(repo only), and `all` (everything). The answer should label which source backs
each substantive claim.

When you are ready to proceed, explicitly authorize the proposed scope—for
example, “Implement that next step and run the named verification.” The skill
will still ask before commits, pushes, deletion, dependency installation,
external services, or long-running processes.

For the complete scenario catalog, see
[references/scenarios.md](references/scenarios.md). For the agent workflow,
see [SKILL.md](SKILL.md).
