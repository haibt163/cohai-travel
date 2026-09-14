# CoHai Travel — OMP Autonomous Engineering Workflow

**Last updated: 14 September 2026**

## Purpose

This document defines the current multi-agent engineering workflow. GitHub `main` is canonical. Agent conversation memory is useful context only; durable project memory is repository documentation, Git history, PRs, and execution evidence.

## Chain of command

**Product Owner:** final human authority and final green light before `main`.

**Senior Engineer / Chief Engineer:** GPT-5.6-class models and above. Owns architecture, model assignment, review, correction decisions, exceptional local repair, and the final engineering recommendation.

**Main Developer:** DeepSeek V4 Flash 0731 and above for substantive coding, debugging, refactoring, fine-tuning and completion.

**Backup Main Developer:** GLM 5.3 Flash and above when DeepSeek is unavailable, unsuitable, rate-limited, or unable to complete the task acceptably.

**Junior Developer:** Laguna S 2.1 FREE for routine work, Git, small/low-risk fixes, exploration and scaffolding. **Backup:** NVIDIA Nemotron 3 Ultra FREE.

## Standard routing

### Simple task

```text
Laguna → tests/evidence → Chief Engineer review → Product Owner green light → protected main
```

### Complicated task

```text
Laguna scaffolding/recon → DeepSeek V4 Flash 0731+ completion → tests/evidence
→ Chief Engineer APPROVE or REQUEST CORRECTION → Product Owner green light → protected main
```

If DeepSeek cannot resolve the issue, use GLM 5.3 Flash+. If the main developers still cannot safely resolve it, the Product Owner may provide a ZIP/local project copy for the Chief Engineer to repair locally.

## Read-only audits

Multiple agents may inspect the **same clean repository state** concurrently for read-only work. They must not modify application code unless explicitly authorized.

## Implementation isolation

Every implementation agent gets its own branch and worktree. Never allow two coding agents to modify the same worktree simultaneously. This applies to OMP, Codex, and other agents.

## Audit trail

Substantial work must leave a durable handoff.

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

For read-only audits, state `NO APPLICATION CODE CHANGES.`

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

## Evidence standard

Use:

- `VERIFIED` — direct repository, command, test, CI, or runtime evidence;
- `UNVERIFIED` — inference/proposal without sufficient direct evidence;
- `FAILED` — execution failure.

Do not claim fixed, working, passing, or complete without evidence.

## Senior review

The Chief Engineer reviews scope, architecture, code, tests, evidence, security, provenance and remaining risk.

**APPROVE:** acceptable for Product Owner consideration.

**REQUEST CORRECTION:** return the task to the appropriate developer with explicit corrective actions and re-verification requirements.

## Context-window policy

- **~262K:** Laguna, routine engineering, Git, focused exploration and small fixes.
- **1M-class:** Nemotron and similar models for broad archaeology/investigation.
- Match context capacity to the task; do not force a smaller-context model into broad archaeology or spend 1M capacity on trivial work.

Observed OMP behavior shows that Laguna can continue long-running work across context windows. This improves session continuity, but important findings still belong in durable repository artifacts.

## Model switching

Model switching is allowed when it improves cost, quality, latency, reliability or task fit. Switching does not change the approval chain.

Free-model assignments are replaceable. Re-benchmark when availability, pricing, routing or observed CoHai performance changes.

## Cost discipline

Use the least expensive model that can safely perform the task. Current working hierarchy:

```text
Laguna FREE → DeepSeek V4 Flash 0731+ → GLM 5.3 Flash+ backup → GPT-5.6-class+ escalation/review
```

Nemotron 3 Ultra FREE remains the junior/deep-investigation backup.

OpenRouter spend guardrails remain active.

## Final principle

The objective is **verified, maintainable, product-correct progress under explicit engineering and human authority**.
