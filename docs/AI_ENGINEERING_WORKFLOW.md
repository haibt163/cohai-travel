# CoHai Travel — AI Engineering Workflow

**Last updated: 15 September 2026**

## 1. Source of truth

- GitHub `main` is the canonical repository source of truth unless explicitly overridden.
- Local project folders/ZIPs are working copies unless explicitly declared otherwise.
- Codex/OMP session history is useful context, not authoritative project memory.
- Durable truth comes from repository files, Git history, PRs, tests, CI/runtime evidence, and Project Owner decisions.
- See `docs/ENGINEERING_GOVERNANCE.md` for the role and approval model.

## 2. Live engineering pipeline

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
          implementation / audit
                   ↓
          tests + evidence + handoff
                   ↓
         Chief Engineer — ChatGPT
          APPROVE / REQUEST CORRECTION
                   ↓
       Project Owner final green light
                   ↓
             protected `main`
```

Codex Cloud and OMP/DeepSeek/GLM are interchangeable Main Engineer lanes. OMP DeepSeek/GLM are not backup-only systems.

## 3. Main Engineer lanes

### Codex Cloud

Codex Cloud is the normal hosted engineering lane using available GPT models. It is especially useful when hosted execution reduces local PC resource pressure.

### OMP CLI

OMP CLI is the local engineering lane using DeepSeek and GLM models through OpenRouter. These models may be used for the same classes of implementation work as Codex Cloud when they are the better fit for cost, quality, context, latency or availability.

### Switching lanes

A task may move between Codex Cloud and OMP at any time when that improves engineering results. The incoming engineer must read the current governance, handoff/report, live Git state and relevant evidence before continuing.

Changing models or tools never changes the approval boundary.

## 4. Chief Engineer review

ChatGPT is the Chief Engineer and the independent engineering review gate.

The Chief Engineer reviews, as applicable:

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

**REQUEST CORRECTION** — corrective actions and re-verification are required.

Chief Engineer approval does not replace Project Owner approval.

## 5. Project Owner authority

The Project Owner is the final human authority.

No engineer, model, tool, successful test, prior approval, silence or deadline authorizes a merge to protected `main` without the Project Owner's final green light.

## 6. Read-only audits

Independent read-only audits may inspect the same clean repository concurrently for archaeology, architecture reconnaissance, security review, verification or other analysis.

Read-only agents must not modify application code unless explicitly authorized.

Read-only work must explicitly state:

`NO APPLICATION CODE CHANGES.`

## 7. Implementation isolation

Each implementation effort should use its own feature branch/worktree where parallel coding could conflict.

Never allow two coding agents to edit the same worktree simultaneously.

This applies to Codex Cloud, OMP and any other coding agent.

## 8. Audit trail and handoff

Substantial work must leave durable repository-visible evidence rather than relying on conversation memory.

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

## 9. Verification standard

- **VERIFIED** = supported by direct repository, command, test, CI or runtime evidence.
- **UNVERIFIED** = proposal, inference or claim lacking sufficient direct evidence.
- **FAILED** = confirmed execution failure.

Do not call changes fixed, working, passing, complete or production-ready without the relevant evidence.

## 10. Fresh-session rule

At the beginning of every new CoHai Travel engineering session:

1. inspect live Git state;
2. read `docs/ENGINEERING_GOVERNANCE.md`;
3. read the current handover/report and relevant project plans;
4. identify whether the task is implementation or read-only audit;
5. choose Codex Cloud or OMP based on task fit, context, availability, quality and cost;
6. state the evidence and handoff deliverable;
7. independently verify important prior claims before relying on them.

Do not treat prior chat history as authoritative.

## 11. Cost discipline

Use the least expensive capable engineering lane that can safely perform the task.

OpenRouter spend guardrails remain active for OMP.

Model choice can change without changing governance.
