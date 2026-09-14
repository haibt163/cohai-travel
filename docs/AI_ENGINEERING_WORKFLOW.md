# CoHai Travel — AI Engineering Workflow

**Last updated: 14 September 2026**

## 1. Source of truth

- GitHub `main` is the canonical repository source of truth unless explicitly overridden.
- Local project folders/ZIPs are working copies unless explicitly declared otherwise.
- OMP/Codex session history is useful context, not authoritative project memory.
- Durable truth comes from repository files, Git history, PRs, tests, CI/runtime evidence, and Product Owner decisions.

## 2. Real multi-agent pipeline

```text
Task
 ↓
Junior / Specialist Engineer
 ↓
Evidence + handoff
 ↓
Main Developer
 ↓
Tests + implementation handoff
 ↓
Senior Engineer / Chief Engineer
 ↓
APPROVE or REQUEST CORRECTION
 ↓
Product Owner final green light
 ↓
protected main
```

### Current roles

- **Laguna S 2.1 FREE** — main junior developer for routine tasks, Git, small/low-risk fixes, exploration and scaffolding. **Backup:** NVIDIA Nemotron 3 Ultra FREE.
- **DeepSeek V4 Flash 0731+** — primary main developer for substantive coding and completion.
- **GLM 5.3 Flash+** — backup main developer.
- **GPT-5.6-class+** — Senior Engineer / Chief Engineer.
- **Product Owner** — final human authority.

For complicated work, Laguna scaffolds/reconnoiters first and DeepSeek fine-tunes/completes. If the main developers cannot safely resolve the issue, the Product Owner may provide a ZIP/local copy for Chief Engineer repair.

## 3. Read-only audits

Multiple agents may inspect the **same clean repository state** concurrently for independent audits, archaeology, architecture reconnaissance, security review and verification.

Read-only agents do not modify application code unless explicitly authorized.

## 4. Implementation isolation

Each implementation agent gets its own branch/worktree. Do not allow two coding agents to modify the same worktree simultaneously. This applies to OMP, Codex and other agents.

## 5. Audit trail and handoff

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

For read-only work, explicitly state `NO APPLICATION CODE CHANGES.`

## 6. Verification standard

- `VERIFIED` = direct repository, command, test, CI or runtime evidence.
- `UNVERIFIED` = inference/proposal without sufficient direct evidence.
- `FAILED` = actual execution failure.

Do not call changes fixed, working, passing or complete without evidence.

## 7. Context-window strategy

- **~262K:** Laguna and other focused/routine agents for Git, small fixes and focused exploration.
- **1M-class:** Nemotron and similar models for broad repository archaeology/investigation.
- Main implementation models must be assigned with context requirements in mind.

Observed OMP behavior shows Laguna can continue long-running work across context windows. This is useful continuity, but important findings still require durable repository handoff artifacts.

## 8. Git / approval boundary

Agents may create branches, commit their branches, push, and open/update PRs within authorized scope.

Agents may not bypass repository governance or merge their own work.

Senior Engineer outcome:

- **APPROVE**
- **REQUEST CORRECTION**

Only then does the Product Owner give the final green light before `main`.

## 9. Model switching and cost

Model switching is allowed when it improves cost, quality, latency, reliability or task fit. It does not change governance.

Use the least expensive model that can safely perform the task. OpenRouter spend guardrails remain an additional safety layer.

## 10. Fresh-session rule

At the beginning of a new CoHai Travel session:

1. inspect live Git state;
2. read governance and handover docs;
3. read relevant reports/plans;
4. identify task and mode;
5. pick the appropriate engineer/model;
6. state the evidence and handoff deliverable.

Do not treat prior chat memory as authoritative.
