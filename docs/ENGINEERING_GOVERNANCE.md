# CoHai Travel — Engineering Governance

**Effective:** 26 September 2026 (supersedes 25 September 2026 version)

## 1. Purpose

This document defines the live engineering governance for CoHai Travel.

The project uses multiple AI engineering environments, but governance does
not depend on a particular model or vendor. Implementation work may move
between Main Engineer lanes without changing the review or approval
boundary.

## 2. Roles

### Project Owner — final authority

The Project Owner (Maris) is the final human authority for the project.

The Project Owner:

- defines product intent and priorities;
- decides whether proposed scope should proceed;
- gives the final green light for protected `main`;
- may override or reject an engineering recommendation;
- owns the final release decision.

### Chief Engineer — Chat lane

The Chief Engineer role may be performed by **Claude Chat or ChatGPT**.
These two chat/review lanes have the same role, authority and review
responsibility. Neither is superior to the other by vendor or model, and
neither is a fallback for the other — either may independently review
evidence and issue the governing outcome for a given piece of work.

The Chief Engineer is the independent engineering review and quality gate.
The Chief Engineer reviews substantial engineer work before it is eligible
for the Project Owner's final approval.

**Evidence-access boundary:** a chat/review session may have no live access
to the repository, git history, or a runnable environment. Chat therefore
works from what the Project Owner pastes or uploads into the conversation
(diffs, logs, handoff documents), or from explicitly available connector
access. A direct-repository coding lane may instead have local repository
and shell access. Reviews should say plainly which situation applies — a
review based only on handed-over material is not the same as one backed by
direct inspection, and the review output should not blur the two. This
access boundary applies equally to Claude Chat and ChatGPT; neither has a
standing access advantage over the other.

The Chief Engineer reviews, as applicable:

- scope and requirements;
- architecture and design;
- implementation quality;
- code correctness and maintainability;
- tests and verification evidence;
- security and privacy risks;
- data and source provenance;
- deployment/runtime implications;
- remaining risks and unresolved issues;
- Git branch, commit and pull-request state.

Chief Engineer outcomes are:

**APPROVE** — the work is acceptable for Project Owner consideration.

**REQUEST CORRECTION** — the work must be corrected and re-verified before
it can proceed.

Chief Engineer approval is an engineering gate, not the final product-owner
approval. An APPROVE from either chat lane carries the same weight; the
Project Owner does not need to prefer one over the other, and a REQUEST
CORRECTION from either lane is likewise binding on its own.

### Main Engineers — interchangeable implementation lanes

CoHai Travel has the following Main Engineer lanes:

1. **Claude Code** — local Claude Code CLI, with direct repository, shell,
   and git access when run in that environment. `CLAUDE.md` provides
   Claude-specific operating guidance.
2. **Codex CLI / Codex App** — the local Codex engineering lane using
   available GPT/Codex models.
3. **OMP CLI** — the local multi-model engineering lane using DeepSeek,
   GLM, Kimi, and Qwen (and other models as available) through OpenRouter
   or OpenCode Go. These are full implementation substitutes, used
   routinely for cost/availability reasons and especially when session
   limits are hit on other lanes — not backup-only or degraded lanes.

Claude Code and Codex CLI/App have the same Main Engineer role and governance
standing, including the same merge-execution authority (§6a). Environment
capabilities can differ, but governance does not, and neither lane is a
fallback for the other — either may be the lane that actually executes a
given approved merge.

**Codex Cloud is retired from the CoHai Travel governance model and must
not be selected for project engineering work.**

Lanes may be used interchangeably according to task fit, context
capacity, local-resource constraints, quality, latency, cost, and
availability.

**Workflow for Codex CLI/App and OMP specifically:** these lanes commit
their work to a dedicated feature/sub-branch, never to `main`. Once that
branch is ready, the active Chief Engineer chat lane (Claude Chat or
ChatGPT), or a peer engineer when appropriate, reviews it. Only after an
APPROVE is on record from the active Chief Engineer chat lane or
the Project Owner may the Project Owner, Claude Code, or Codex CLI/App merge
that branch into `main`. OMP does not gain merge authority by having its branch
reviewed or merged.

No lane merges its own unreviewed work to `main`.

## 3. Engineering pipeline

```text
Project Owner defines task
        ↓
Choose Main Engineer lane
   ┌──────────────┬───────────────┬──────────────────────┐
   │               │               │                      │
   ▼               ▼               ▼                      ▼
Claude Code    Codex CLI/App     OMP CLI              (future lanes)
(CLAUDE.md)    GPT/Codex models  DeepSeek/GLM/Kimi/Qwen
   (peer, merge-capable)
   └──────────────┴───────────────┴──────────────────────┘
                 ↓
          Implement / investigate
                 ↓
          Tests + evidence + handoff
                 ↓
       Chief Engineer — Claude Chat or ChatGPT (peers)
          APPROVE / REQUEST CORRECTION
                 ↓
     APPROVE from Chief Engineer chat OR Project Owner
     — Project Owner relays the APPROVE when needed
                 ↓
        merge executed by Project Owner, Claude Code, or Codex CLI/App
        (Claude Code and Codex CLI/App are equally merge-capable —
         never by chat; OMP does not execute merges)
                 ↓
              protected `main`
```

Model or environment switching does not bypass any stage. Merge
authority itself (who may approve, who may execute) is defined
exclusively in §6a and does not vary by which Main Engineer lane
produced the work, nor by which chat lane approved it.

## 4. Choosing the Main Engineer

Use the least expensive capable lane that can safely perform the task, and
switch lanes freely when a session limit is hit on the current one — this
is expected routine behavior, not an exception.

Selection factors:

- task complexity;
- required context window;
- repository size;
- local PC resource constraints;
- model quality for the specific task;
- execution environment requirements (Claude Code and Codex have local
  shell/filesystem/Git capabilities when run in those environments; other
  lanes may run in more constrained contexts);
- cost and OpenRouter/OpenCode Go spend guardrails;
- current availability / session limits;
- need for direct local Git/GitHub control.

A task may move between lanes when useful. The incoming engineer must read
the repository governance, current handoff/report, live Git state and
relevant evidence before continuing — regardless of which lane it is.

Do not use Codex Cloud for CoHai Travel work.

Claude Code and Codex CLI/App are equivalent Main Engineer choices; neither
receives a governance preference over the other. The same holds for Claude
Chat and ChatGPT as Chief Engineer choices — selection between either pair
is a matter of session availability, context, and cost, never of standing.

## 5. Task modes

Every engineering request must be treated as one of these modes:

### Implementation

The engineer may modify application code, tests, configuration or
documentation within the authorized scope.

Implementation work should use a dedicated feature branch/worktree when
parallel coding could otherwise conflict.

### Read-only audit / investigation

The engineer inspects the repository and records findings without
changing application code.

Read-only work must explicitly state:

`NO APPLICATION CODE CHANGES.`

Independent read-only audits may inspect the same clean repository
concurrently.

## 6. Branch and Git rules

- `main` is the protected integration branch and source of record.
- Engineer implementation work should occur on a dedicated feature
  branch/worktree.
- Coding agents must not edit the same worktree simultaneously.
- Engineers may commit their own implementation branches and push/open/
  update PRs when the active environment has the required GitHub access.
- Engineers must not bypass the Chief Engineer review boundary.
- No engineer merges its own unreviewed work to `main`.
- A successful test run does not itself authorize a merge.
- Silence or lack of objection is not approval.
- Prior model approval does not substitute for the current review.
- A merge requires an APPROVE from the active Chief Engineer chat lane
  (Claude Chat or ChatGPT — either is sufficient on its own) or the
  Project Owner — see §6a for exactly who may then execute it.

## 6a. Merge authority (Project Owner, Claude Code, and Codex CLI/App)

Merge execution authority to protected `main` is held equally by the
Project Owner, Claude Code, and Codex CLI/App. Claude Code and Codex
CLI/App are peer, equally higher-trust, merge-capable Main Engineer
lanes — neither is the primary and neither is the other's fallback; OMP
is not merge-capable.

**Approval gate.** A merge to `main` requires an APPROVE on record from one
of:

- Claude Chat, acting as Chief Engineer;
- ChatGPT, acting as Chief Engineer; or
- the Project Owner, directly.

Claude Chat and ChatGPT satisfy this gate identically — an APPROVE from
either one, alone, is sufficient. A Main Engineer self-review, a passing
test suite, or another Main Engineer lane's sign-off does not by itself
satisfy the Chief Engineer approval gate.

**No direct chat-to-coding handoff is assumed.** The Project Owner relays an
APPROVE to the active implementation lane when needed. Nothing in this
document should be read as implying an automatic or live hand-off.

**Who executes the merge, once approved.** The Project Owner, Claude Code, or
Codex CLI/App may perform the merge to protected `main` and should record the
approval source. Claude Code and Codex CLI/App hold this execution authority
equally — whichever lane is active, or whichever the Project Owner asks to
handle it, may do so; there is no default or preferred executor between them.

**No approval, no merge.** If neither the Chief Engineer chat lane nor the
Project Owner has approved the work, no merge to `main` may occur.

## 7. Pull-request review boundary

A normal implementation handoff should contain:

- task and scope;
- design/approach;
- files or surfaces changed;
- tests and verification results;
- direct evidence;
- remaining risks;
- unverified items;
- branch name;
- commit SHA;
- PR number/URL when applicable.

The Chief Engineer may review the branch or PR and either approve it for
Project Owner consideration or request explicit corrections. Where the
Chief Engineer role is running in a chat session (Claude Chat or ChatGPT)
without direct repo access, the handoff itself — pasted or uploaded — is
the evidence; the review should note this explicitly rather than implying
independent verification that didn't happen. This applies equally
regardless of which chat lane is reviewing.

**Standard handoff package: ZIP snapshot + Git state.** For a chat-based
Chief Engineer review, the preferred handoff is two parts together, not
either alone:

1. a repository ZIP snapshot taken at the point the Main Engineer finished
   (produced by the project's zip script, which preserves `.git`, `.github`,
   `.claude`, `.omp`, `docs`, `src`, `server`, `scripts`, `migrations`,
   `public`, and root configuration, excluding only local/runtime material
   such as `node_modules` and `.env`); and
2. the engineer's own Git output from that same point — at minimum
   `git status`, `git log -5 --oneline --decorate`, and
   `git show --stat --oneline HEAD`.

The ZIP lets the Chief Engineer inspect the full repository state directly
rather than relying solely on a pasted diff, which can hide context a
reviewer would otherwise catch. The Git output lets the Chief Engineer
locate exactly what changed and where it sits in history, without having
to reconstruct that from the snapshot alone. Neither substitutes for the
other.

This package still does not give the chat lane the ability to execute
anything — no install, no test run, no build. A ZIP-based review verifies
what the code says and does static analysis of that; it does not verify
that a test suite, lint, typecheck, or build actually passed. The handoff
should therefore also include the actual output of whichever verification
commands the Main Engineer ran (§14 of `AGENTS.project.md`), not just the
Git summary — a Chief Engineer reading only `git show --stat` can confirm
what changed, but not whether it works.

## 8. Evidence standard

Use these statuses consistently:

- **VERIFIED** — supported by direct repository, command, test, CI or
  runtime evidence.
- **UNVERIFIED** — proposal, inference or claim lacking sufficient direct
  evidence.
- **FAILED** — execution produced a confirmed failure.

Do not describe work as fixed, passing, working, complete or
production-ready without the relevant evidence.

## 9. Durable handoffs

Substantial work must leave repository-visible evidence. Conversation
history is useful context but is not the durable source of truth.

Preferred evidence includes:

- repository documentation;
- audit reports;
- implementation handoffs;
- Git commits;
- pull requests;
- automated test output;
- CI results;
- runtime verification.

For generated external artifacts, also record the exact workspace path
and user-accessibility/retrieval status.

## 10. Cross-agent continuity

A new engineer must not assume it knows another engineer's prior
conversation.

Preferred starting sequence:

```text
read governance
→ read current handover/report
→ inspect live Git state
→ inspect relevant code
→ independently verify important prior claims
→ continue from evidence
```

Fresh sessions are preferred for major phase boundaries and controlled
benchmarks.

## 11. Cost discipline

The project favors economical, capable models, within Maris's fixed
monthly budget (Claude Pro or ChatGPT Plus, up to $20/month; OpenCode Go
$10/month; OpenRouter API $10/month, used only when required).

DeepSeek, GLM, Kimi, and Qwen through OMP are considered valid production
engineering lanes, not inferior fallback-only systems, and are expected to
see routine use whenever a primary lane's session limit is reached. Claude
Code and Codex CLI/App are equivalent Main Engineer lanes; choose between
them based on task fit, environment, context, availability, quality and
cost. Claude Chat and ChatGPT are likewise equivalent Chief Engineer
lanes; choose between them on the same basis — session availability,
budget, and which one the Project Owner has open — never on a standing
preference for one over the other.

OpenRouter/OpenCode Go spend guardrails remain active for OMP-based work.

Codex Cloud is not an approved CoHai Travel engineering lane.

## 12. Simple operating rule

```text
MAIN ENGINEERS (peers)
Claude Code ↔ Codex CLI/App ↔ OMP (DeepSeek/GLM/Kimi/Qwen)
  (Claude Code and Codex CLI/App are equally merge-capable;
   OMP is implementation-only)

                  │
                  ▼
   CHIEF ENGINEER (peers) — Claude Chat or ChatGPT
                  │
                  ▼
 APPROVE from Chief Engineer chat OR Project Owner (Maris) required
 — either chat lane's APPROVE is independently sufficient
 — Project Owner relays the APPROVE when needed
                  │
                  ▼
       merge executed by Project Owner, Claude Code, or Codex CLI/App
       (never by chat; OMP does not execute merges)
                  │
                  ▼
             protected `main`
```

No model, agent, tool, successful test, deadline or previous decision may
skip getting that APPROVE. Merge *execution* authority is held equally by
the Project Owner, Claude Code, and Codex CLI/App (§6a) — it is not
exclusive to the Project Owner. Chat/review lanes and implementation lanes
may have different environment capabilities, but those differences do not
change governance authority, and no lane within either peer pair (Claude
Chat/ChatGPT, Claude Code/Codex CLI App) outranks its peer.
