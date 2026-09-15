# CoHai Travel — Engineering Governance

**Effective:** 15 September 2026

## 1. Purpose

This document defines the live engineering governance for CoHai Travel.

The project uses multiple AI engineering environments, but governance does not depend on a particular model or vendor. Implementation work may move between Codex Cloud and OMP CLI without changing the review or approval boundary.

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

CoHai Travel has two interchangeable Main Engineer lanes:

1. **Codex Cloud** — the preferred hosted implementation environment using available GPT models. It reduces pressure on the local PC and is the normal first choice when hosted execution is convenient.
2. **OMP CLI** — local implementation environment using DeepSeek and GLM models through OpenRouter. These are full implementation substitutes, not merely backup models.

The two lanes may be used interchangeably according to task fit, context capacity, availability, quality, latency and cost.

Neither lane has authority to merge its own work to protected `main`.

## 3. Engineering pipeline

```text
Project Owner defines task
        ↓
Choose Main Engineer lane
   ┌───────────────┴───────────────┐
   ↓                               ↓
Codex Cloud                     OMP CLI
GPT models                 DeepSeek / GLM
   └───────────────┬───────────────┘
                   ↓
          Implement / investigate
                   ↓
          Tests + evidence + handoff
                   ↓
            Chief Engineer review
                   ↓
        APPROVE / REQUEST CORRECTION
                   ↓
          Project Owner green light
                   ↓
             protected `main`
```

Model or environment switching does not bypass any stage.

## 4. Choosing the Main Engineer

Use the least expensive capable lane that can safely perform the task.

Codex Cloud and OMP/DeepSeek/GLM may be selected based on:

- task complexity;
- required context window;
- repository size;
- local PC resource constraints;
- model quality for the specific task;
- execution environment requirements;
- cost and OpenRouter guardrails;
- current availability.

A task may move from one lane to the other when useful. The incoming engineer must read the repository governance, current handoff/report, live Git state and relevant evidence before continuing.

## 5. Task modes

Every engineering request must be treated as one of these modes:

### Implementation

The engineer may modify application code, tests, configuration or documentation within the authorized scope.

Implementation work must use an isolated feature branch/worktree when parallel coding could otherwise conflict.

### Read-only audit / investigation

The engineer inspects the repository and records findings without changing application code.

Read-only work must explicitly state:

`NO APPLICATION CODE CHANGES.`

Independent read-only audits may inspect the same clean repository concurrently.

## 6. Branch and Git rules

- `main` is the protected integration branch and source of record.
- Engineer implementation work should occur on a dedicated branch.
- Coding agents must not edit the same worktree simultaneously.
- Engineers may commit their own implementation branches and open/update PRs within authorized scope.
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

DeepSeek and GLM through OMP are considered valid production engineering lanes for this workflow, not inferior fallback-only systems. Codex Cloud with GPT models is likewise a full Main Engineer lane.

OpenRouter spend guardrails remain active for OMP-based work.

## 12. Simple operating rule

```text
MAIN ENGINEER(S)
Codex Cloud ↔ OMP (DeepSeek / GLM)
            ↓
      tests + evidence
            ↓
    CHIEF ENGINEER — ChatGPT
      APPROVE / CORRECT
            ↓
 PROJECT OWNER — final green light
            ↓
        protected main
```

No model, agent, tool, successful test, deadline or previous decision may skip the Project Owner's final approval.
