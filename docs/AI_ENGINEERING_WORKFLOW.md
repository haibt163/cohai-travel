# CoHai Travel — AI Engineering Workflow

**Last updated: 25 September 2026** (supersedes 15 September 2026 version)

## 1. Source of truth

- GitHub `main` is the canonical repository source of truth unless
  explicitly overridden.
- Local project folders/checkouts are working copies unless explicitly
  declared otherwise.
- Session history from any lane (Claude Code, Codex, OMP) is useful
  context, not authoritative project memory.
- Durable truth comes from repository files, Git history, PRs, tests,
  CI/runtime evidence, and Project Owner decisions.
- See `docs/ENGINEERING_GOVERNANCE.md` for the role and approval model.

## 2. Live engineering pipeline

```text
Project Owner defines task
        ↓
Choose Main Engineer lane
   ┌───────────────┬────────────────┬─────────────────────────┐
   │                │                │                         │
   ▼                ▼                ▼                         ▼
Claude Code    Codex CLI/App       OMP CLI                (future lane)
(CLAUDE.md)    GPT/Codex models    DeepSeek/GLM/Kimi/Qwen
   └───────────────┴────────────────┴─────────────────────────┘
                  ↓
           implementation / audit
                  ↓
           tests + evidence + handoff
                  ↓
      Chief Engineer — Claude Chat or ChatGPT
        APPROVE / REQUEST CORRECTION
                  ↓
      APPROVE from Chief Engineer chat OR Project Owner
      — Project Owner relays the APPROVE when needed
                  ↓
      merge executed by Project Owner, Claude Code, or Codex CLI/App
      (never by chat; OMP does not execute merges)
                  ↓
              protected `main`
```

Codex Cloud is retired and not part of the workflow.

## 3. Main Engineer lanes

### Claude Code

Claude Code is a full Main Engineer lane with local shell/filesystem/Git
access when run in that environment. `CLAUDE.md` provides Claude-specific
operating guidance. Claude Code has the same Main Engineer role and
higher-trust, merge-capable standing as Codex CLI/App.

### Codex CLI / Codex App

The official Codex lane for CoHai Travel is local Codex via the CLI or
Windows App, using available GPT/Codex models.

Use the CLI when direct terminal control, command visibility, Git
operations and interactive debugging are valuable. Use the App when its
agent/worktree interface is more convenient for local development or
parallel work.

### OMP CLI

OMP CLI is the local multi-model engineering lane using DeepSeek, GLM,
Kimi, and Qwen through OpenRouter or OpenCode Go. These models may perform
the same substantive implementation classes as Claude Code or Codex when
they are the better fit for cost, quality, context, latency, or
availability — and routinely when a session limit is hit elsewhere.

### Retired environment

**Codex Cloud is permanently retired from CoHai Travel engineering. Do not
select it, route work to it, or treat it as an approved fallback.**

### Switching lanes

A task may move between any of the lanes above when that improves
engineering results or is forced by a session/rate limit. The incoming
engineer must read the current governance, handoff/report, live Git state
and relevant evidence before continuing.

Changing models or tools never changes the approval boundary.

## 4. Chief Engineer review

The Chief Engineer role may be performed by the active chat/review lane:
**Claude Chat or ChatGPT**. These two chat lanes have the same governance role
and review authority.

- **Chat** — reviews based on what the Project Owner pastes/uploads (diffs,
  logs, test output, handoff docs), or on connector-provided repo access when
  explicitly available. No assumption of live, independent repository access
  unless stated.
- **A coding lane providing a peer review** may inspect its local repository
  directly, but peer review does not replace the Chief Engineer gate.

Either way, the review covers, as applicable:

- scope and requirements;
- architecture and design;
- implementation quality and correctness;
- tests and verification evidence;
- security and privacy;
- data/source provenance;
- runtime and deployment implications;
- remaining risks and unresolved issues;
- branch, commit and PR state.

Outcome:

**APPROVE** — acceptable for Project Owner consideration.

**REQUEST CORRECTION** — corrective actions and re-verification are
required.

Chief Engineer approval does not replace Project Owner approval.

## 5. Project Owner authority and merge execution

The Project Owner is the final human authority over scope, priorities, and
whether to override any engineering recommendation.

For the specific act of merging to protected `main`, the approval gate is
satisfied by an APPROVE from **either** Claude Chat or ChatGPT acting as
Chief Engineer, **or** the Project Owner directly — see
`docs/ENGINEERING_GOVERNANCE.md` §6a for the authoritative definition.
No engineer, model, tool, successful test, prior approval, silence or
deadline substitutes for that gate.

Once the gate is satisfied, the Project Owner, Claude Code, or Codex CLI/App
may execute the merge. The active chat/review lane may approve but does not
execute merges from chat-only environments. OMP does not execute merges. There
is no direct live channel between the chat/review lane and the implementation
lane, so the Project Owner relays the APPROVE when needed.

## 6. Read-only audits

Independent read-only audits may inspect the same clean repository
concurrently for archaeology, architecture reconnaissance, security
review, verification or other analysis.

Read-only agents must not modify application code unless explicitly
authorized.

Read-only work must explicitly state:

`NO APPLICATION CODE CHANGES.`

## 7. Implementation isolation

Each implementation effort should use its own feature branch/worktree
where parallel coding could conflict.

Never allow two coding agents to edit the same worktree simultaneously.

This applies to Claude Code, Codex CLI/App, OMP and any other coding
agent.

## 8. Audit trail and handoff

Substantial work must leave durable repository-visible evidence rather
than relying on conversation memory.

Claude Code may use a lighter-weight handoff for small/exploratory work
per `CLAUDE.md` §5; the full templates below remain the standard for
substantive changes and for anything crossing the Chief Engineer review
boundary.

### Audit report

```markdown
# [Audit Title]
## Scope
## Repository State
## Method
## Findings
## Evidence
## Verification Status
### VERIFIED
### UNVERIFIED
### FAILED
## Risks / Concerns
## Unresolved Questions
## Recommendations
## Changes Made
## Handoff
```

### Implementation handoff

```markdown
# Implementation Handoff
## Task
## Scope
## Design
## Changes
## Tests / Verification
## Evidence
## Remaining Risks
## Unverified
## Git
Branch:
Commit:
PR:
```

For generated external artifacts, also record the exact workspace path
and user-accessibility/retrieval status.

## 9. Verification standard

- **VERIFIED** = supported by direct repository, command, test, CI or
  runtime evidence.
- **UNVERIFIED** = proposal, inference or claim lacking sufficient direct
  evidence.
- **FAILED** = confirmed execution failure.

Do not call changes fixed, working, passing, complete or
production-ready without the relevant evidence.

## 10. Fresh-session rule

At the beginning of every new CoHai Travel engineering session:

1. inspect live Git state;
2. read `docs/ENGINEERING_GOVERNANCE.md`;
3. read the current handover/report and relevant project plans;
4. identify whether the task is implementation or read-only audit;
5. choose a Main Engineer lane (Claude Code, Codex CLI/App, or OMP) based
   on task fit, context, local resources, availability, quality and cost;
6. state the evidence and handoff deliverable;
7. independently verify important prior claims before relying on them.

Do not treat prior chat history as authoritative.

## 11. Cost discipline

Use the least expensive capable engineering lane that can safely perform
the task, within Maris's fixed monthly budget (see
`docs/ENGINEERING_GOVERNANCE.md` §11).

OpenRouter/OpenCode Go spend guardrails remain active for OMP. Switching
to OMP when a primary lane's session limit is hit is expected, routine
behavior — not a fallback of last resort.

Model choice can change without changing governance, but Codex Cloud is
excluded from the approved choices.
