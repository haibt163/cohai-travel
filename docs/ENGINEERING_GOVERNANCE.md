# CoHai Travel — Engineering Governance

**Effective:** 25 September 2026 (supersedes 15 September 2026 version)

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

### Chief Engineer — Claude

Claude (via claude.ai chat, and optionally Claude Code acting as Co-Chief
Engineer per `CLAUDE.md`) acts as the Chief Engineer for CoHai Travel,
replacing the prior ChatGPT-as-Chief-Engineer arrangement.

The Chief Engineer is the independent engineering review and quality gate.
The Chief Engineer reviews substantial engineer work before it is eligible
for the Project Owner's final approval.

**Evidence-access boundary:** the Chief Engineer role in claude.ai chat
has no live access to the repository, git history, or a runnable
environment. As confirmed in practice, the GitHub connector visible in
claude.ai's connector settings does not currently provide claude.ai chat
with live repository access for this project — the "Claude Code cloud
sessions" access it grants is a separate product mode from chat. Chat
therefore works only from what Maris pastes or uploads into the
conversation (diffs, logs, handoff documents), and this may change if
Anthropic's connector coverage changes — re-verify before assuming
otherwise. Claude Code, by contrast, has direct repository and shell
access when run locally or in a properly connected cloud session.
Reviews should say plainly which situation applies — a review based only
on handed-over material is not the same as one backed by direct
inspection, and the review output should not blur the two.

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

Chief Engineer approval is an engineering gate, not the final
product-owner approval.

### Main Engineers — interchangeable implementation lanes

CoHai Travel has the following Main Engineer lanes:

1. **Claude Code** — local Claude Code CLI, with direct repository, shell,
   and git access. Governed day-to-day by `CLAUDE.md`, which grants more
   working discretion than this document imposes on other lanes, within
   the same hard boundaries (§6, §7 below).
2. **Codex CLI / Codex App** — the local Codex engineering lane using
   available GPT/Codex models.
3. **OMP CLI** — the local multi-model engineering lane using DeepSeek,
   GLM, Kimi, and Qwen (and other models as available) through OpenRouter
   or OpenCode Go. These are full implementation substitutes, used
   routinely for cost/availability reasons and especially when session
   limits are hit on other lanes — not backup-only or degraded lanes.

**Codex Cloud is retired from the CoHai Travel governance model and must
not be selected for project engineering work.**

Lanes may be used interchangeably according to task fit, context
capacity, local-resource constraints, quality, latency, cost, and
availability.

**Workflow for Codex CLI/App and OMP specifically:** these lanes commit
their work to a dedicated feature/sub-branch, never to `main`. Once that
branch is ready, Claude Code (or Claude-chat, working from the handoff)
reviews it. Only after an APPROVE is on record from Claude-chat or the
Project Owner does Claude Code — or the Project Owner directly — merge
that branch into `main`. This is the same approval gate and execution
rule as §6a, applied to a branch someone else authored; Codex/OMP never
gain any part of merge authority by having their branch merged this way.

No lane merges its own unreviewed work to `main`. Merge authority itself
is scoped narrowly — see §6a — and Codex CLI/App and OMP never hold it,
regardless of how much implementation work they do.

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
   └──────────────┴───────────────┴──────────────────────┘
                  ↓
         Implement / investigate
                  ↓
         Tests + evidence + handoff
                  ↓
          Chief Engineer — Claude (chat)
          APPROVE / REQUEST CORRECTION
                  ↓
     APPROVE from Claude-chat OR Project Owner (Maris)
     — Maris relays the APPROVE; there is no direct
       channel between Claude-chat and Claude Code
                  ↓
        merge executed by Claude Code or Maris
        (never Codex/OMP, never Claude-chat itself —
         Claude-chat has no repository write access)
                  ↓
            protected `main`
```

Model or environment switching does not bypass any stage. Merge
authority itself (who may approve, who may execute) is defined
exclusively in §6a and does not vary by which Main Engineer lane
produced the work.

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
- execution environment requirements (Claude Code needs local shell
  access; the others may run in more constrained contexts);
- cost and OpenRouter/OpenCode Go spend guardrails;
- current availability / session limits;
- need for direct local Git/GitHub control.

A task may move between lanes when useful. The incoming engineer must read
the repository governance, current handoff/report, live Git state and
relevant evidence before continuing — regardless of which lane it is.

Do not use Codex Cloud for CoHai Travel work.

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
- A merge requires an APPROVE from Claude-chat or the Project Owner — see
  §6a for exactly who may then execute it.

## 6a. Merge authority (Claude and Claude Code only)

Merge authority to `main` is held **only** by the Project Owner and
Claude Code. Claude-chat participates in the approval gate but never
executes a merge itself — see the access note below. Codex CLI/App and
OMP (DeepSeek/GLM/Kimi/Qwen) never hold any part of merge authority under
any circumstance — see §2, Main Engineers. This is true no matter how
much implementation work those lanes do.

**Approval gate.** A merge to `main` requires an APPROVE on record from
one of:

- Claude, acting as Chief Engineer in claude.ai chat; or
- the Project Owner, directly.

A Claude Code self-review, a passing test suite, or another Main
Engineer lane's sign-off does not satisfy this gate.

**No direct channel to Claude Code.** Claude-chat has no way to message,
notify, or otherwise signal Claude Code directly, in any session type.
The Project Owner is the sole relay: when Claude-chat issues an APPROVE,
that decision reaches Claude Code only because the Project Owner copies
or otherwise conveys it there. Nothing in this document should be read
as implying an automatic or live hand-off between the two.

**Who executes the merge, once approved.** After an APPROVE exists —
from Claude-chat (relayed by the Project Owner) or from the Project
Owner directly — the merge itself is carried out by:

- the Project Owner; or
- Claude Code.

Claude-chat never executes the merge itself: it has no repository write
access in any session type currently available (see §2's evidence-access
boundary and the GitHub-connector note there). This is a standing fact
about the current environment, not a per-session judgment call.

Claude Code does not need to request permission for each individual
merge once the APPROVE is on record; that APPROVE is the standing
authorization to execute. Claude Code should still record, in its
handoff, which source's APPROVE it is merging under.

**No approval, no merge.** If neither Claude-chat nor the Project Owner
has approved the work, no merge to `main` may occur — not by Claude
Code, and not by any other lane.


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
Chief Engineer role is running in claude.ai chat without direct repo
access, the handoff itself — pasted or uploaded — is the evidence; the
review should note this explicitly rather than implying independent
verification that didn't happen.

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
see routine use whenever a primary lane's session limit is reached. Codex
CLI/App is the official Codex lane. Claude Code is the preferred lane for
work needing direct local repository/shell access or closer trust.

OpenRouter/OpenCode Go spend guardrails remain active for OMP-based work.

Codex Cloud is not an approved CoHai Travel engineering lane.

## 12. Simple operating rule

```text
MAIN ENGINEERS
Claude Code ↔ Codex CLI/App ↔ OMP (DeepSeek/GLM/Kimi/Qwen)
              ↓
        tests + evidence + handoff
              ↓
      CHIEF ENGINEER — Claude (chat)
        APPROVE / REQUEST CORRECTION
              ↓
   APPROVE from Claude-chat OR Project Owner (Maris) required
   — Maris relays the APPROVE; no direct chat↔Claude Code channel
              ↓
      executed by Maris or Claude Code (never Claude-chat,
      never Codex/OMP)
              ↓
          protected `main`
```

No model, agent, tool, successful test, deadline or previous decision may
skip getting that APPROVE. Merge *execution* authority is exclusive to
the Project Owner and Claude Code (§6a) — Claude-chat has no repository
write access, and Codex/OMP never hold it.
