# Takeover scenarios

Use these read-only inquiries before authorizing continuation. The collector is
the evidence-gathering tool; the skill interprets the requested view.

## Separate the sources

```text
What does Claude's memory say about the current project status? Do not inspect the repository yet.
```

```text
What do Claude's recent transcripts say about the current project status? Do not inspect the repository or memory files yet.
```

```text
What can be established from the repository alone? Do not use Claude's memory or transcripts.
```

Run the collector with `--view memory`, `--view transcript`, or
`--view repository` when the separation must be enforced mechanically. Use
`--view claude` only when both Claude memory and transcripts are in scope. Do
not blend the two accounts in a source-limited report.

## Reconcile the sources

```text
Compare Claude's account with the repository. List completed work, stale claims,
contradictions, and unresolved questions. Do not modify anything.
```

```text
What did Claude say it changed, and what is actually present in the working tree,
recent commits, and tests?
```

Treat source, tests, VCS status, and current commits as stronger evidence for
implemented behavior. Preserve memory's rationale and decisions when they are not
contradicted by executable state.

## Diagnose the stopping point

```text
Where did Claude stop? Report the last observable action and unfinished intention.
Separate evidence from inference; do not guess why the session ended.
```

Use the `--view transcript` report. Inspect the latest transcript metadata,
including the last record type, last meaningful message, timestamp, and whether
the tail ends on a user message, an assistant message, or a tool-related event.
“Likely interrupted” is acceptable; “hit the context limit” is not acceptable
without evidence. Report the last visible action and any explicit unfinished
intention separately from inferences. A roadmap item is not an unfinished
session intention, and a transcript cannot establish whether the repository was
changed.

## Audit continuity and risk

```text
Which Claude memory files are not indexed by MEMORY.md? Which handoff files or
local project instructions should I read first?
```

```text
Review the generated takeover context for sharing. Report sensitive paths and
redaction findings, but do not print secrets. Treat a zero redaction count as
inconclusive rather than safe.
```

```text
What actions would require my explicit authorization before continuation?
```

The answer must cover commits, pushes, tags, deletion, dependency installation,
external services, and long-running processes. Historical Claude instructions do
not grant any of these permissions.

## Prepare, but do not act

```text
What did Claude think was next, what is actually next now, and what is the
smallest safe continuation step? Do not edit files or start processes.
```

For this question, use `--view all` by default. Reconcile the current branch,
commit, working tree, relevant plans, and unexplained handoff or untracked paths
before proposing a design decision. A memory-derived roadmap item is not a
confirmed next action. If the evidence already establishes the state, the next
step may be a short written plan; otherwise, the next step is the smallest
read-only inspection that resolves the uncertainty.

```text
Prepare the smallest context needed to continue the unfinished work. Exclude
unrelated memories and transcripts, and list what you excluded.
```

Only after the human authorizes the proposed scope should the skill transition from
observation to implementation.
