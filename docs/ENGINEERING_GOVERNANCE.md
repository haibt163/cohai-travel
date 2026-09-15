# CoHai Travel — Engineering Governance

**Effective:** 15 September 2026

## 1. Purpose

This document defines the live engineering governance for CoHai Travel.

The project uses multiple AI engineering environments, but governance does not depend on a particular model or vendor. Implementation work may move between the Codex local lane and OMP CLI without changing the review or approval boundary.

## 2. Roles

### Project Owner — final authority

The Project Owner is the final human authority for the project.

The Project Owner:

- defines product intent and priorities;
- decides whether proposed scope should proceed;
- gives the final green light for protected `main`;
- may override or reject an engineering recommendation;
- owns the final release decision.

### Chief Engineer — ChatGPT

ChatGPT acts as the Chief Engineer for CoHai Travel.

The Chief Engineer is the independent engineering review and quality gate. The Chief Engineer reviews substantial engineer work before it is eligible for the Project Owner's final approval.

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

**REQUEST CORRECTION** — the work must be corrected and re-verified before it can proceed.

Chief Engineer approval is an engineering gate, not the final product-owner approval.

### Main Engineers — interchangeable implementation lanes

CoHai Travel has two permanent interchangeable Main Engineer lanes:

1. **Codex CLI / Codex App** — the local Codex engineering lane using available GPT/Codex models. It is the official Codex lane for this project. The CLI is preferred for direct terminal control and visibility; the App is preferred when its multi-agent/worktree UI is more convenient.
2. **OMP CLI** — the local multi-model engineering lane using DeepSeek and GLM through OpenRouter. These are full implementation substitutes, not backup-only models.

**Codex Cloud is retired from the CoHai Travel governance model and must not be selected for project engineering work.**

Codex CLI/App and OMP/DeepSeek/GLM may be used interchangeably according to task fit, context capacity, local-resource constraints, quality, latency, cost and availability.

Neither lane has authority to merge its own work to protected `main`.

## 3. Engineering pipeline

```text
Project Owner defines task
        ↓
Choose Main Engineer lane
   ┌────────────────────────────┐
   │                            │
   ▼                            ▼
Codex CLI / App               OMP CLI
GPT / Codex models         DeepSeek / GLM
   └──────────────┬─────────────┘
                  ↓
         Implement / investigate
                  ↓
         Tests + evidence + handoff
                  ↓
          Chief Engineer — ChatGPT
          APPROVE / REQUEST CORRECTION
                  ↓
       Project Owner final green light
                  ↓
            protected `main`
```

Model or environment switching does not bypass any stage.

## 4. Choosing the Main Engineer

Use the least expensive capable lane that can safely perform the task.

Codex CLI/App and OMP/DeepSeek/GLM may be selected based on:

- task complexity;
- required context window;
- repository size;
- local PC resource constraints;
- model quality for the specific task;
- execution environment requirements;
- cost and OpenRouter guardrails;
- current availability;
- need for direct local Git/GitHub control.

A task may move between the two lanes when useful. The incoming engineer must read the repository governance, current handoff/report, live Git state and relevant evidence before continuing.

Do not use Codex Cloud for CoHai Travel work.

## 5. Task modes

Every engineering request must be treated as one of these modes:

### Implementation

The engineer may modify application code, tests, configuration or documentation within the authorized scope.

Implementation work should use a dedicated feature branch/worktree when parallel coding could otherwise conflict.

### Read-only audit / investigation

The engineer inspects the repository and records findings without changing application code.

Read-only work must explicitly state:

`NO APPLICATION CODE CHANGES.`

Independent read-only audits may inspect the same clean repository concurrently.

## 6. Branch and Git rules

- `main` is the protected integration branch and source of record.
- Engineer implementation work should occur on a dedicated feature branch/worktree.
- Coding agents must not edit the same worktree simultaneously.
- Engineers may commit their own implementation branches and push/open/update PRs when the active environment has the required GitHub access.
- Engineers must not bypass the Chief Engineer review boundary.
- Engineers must not merge their own work to `main`.
- A successful test run does not itself authorize a merge.
- Silence or lack of objection is not approval.
- Prior model approval does not substitute for the current review.
- The Project Owner gives the final green light after Chief Engineer approval.

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

The Chief Engineer may review the branch or PR and either approve it for Project Owner consideration or request explicit corrections.

## 8. Evidence standard

Use these statuses consistently:

- **VERIFIED** — supported by direct repository, command, test, CI or runtime evidence.
- **UNVERIFIED** — proposal, inference or claim lacking sufficient direct evidence.
- **FAILED** — execution produced a confirmed failure.

Do not describe work as fixed, passing, working, complete or production-ready without the relevant evidence.

## 9. Durable handoffs

Substantial work must leave repository-visible evidence. Conversation history is useful context but is not the durable source of truth.

Preferred evidence includes:

- repository documentation;
- audit reports;
- implementation handoffs;
- Git commits;
- pull requests;
- automated test output;
- CI results;
- runtime verification.

For generated external artifacts, also record the exact workspace path and user-accessibility/retrieval status.

## 10. Cross-agent continuity

A new engineer must not assume it knows another engineer's prior conversation.

Preferred starting sequence:

```text
read governance
→ read current handover/report
→ inspect live Git state
→ inspect relevant code
→ independently verify important claims
→ continue from evidence
```

Fresh sessions are preferred for major phase boundaries and controlled benchmarks.

## 11. Cost discipline

The project favors economical, capable models.

DeepSeek and GLM through OMP are considered valid production engineering lanes, not inferior fallback-only systems. Codex CLI/App is the official Codex lane.

OpenRouter spend guardrails remain active for OMP-based work.

Codex Cloud is not an approved CoHai Travel engineering lane.

## 12. Simple operating rule

```text
MAIN ENGINEERS
Codex CLI / App ↔ OMP (DeepSeek / GLM)
              ↓
        tests + evidence + handoff
              ↓
      CHIEF ENGINEER — ChatGPT
        APPROVE / CORRECT
              ↓
   PROJECT OWNER — final green light
              ↓
          protected `main`
```

No model, agent, tool, successful test, deadline or previous decision may skip the Project Owner's final approval.
