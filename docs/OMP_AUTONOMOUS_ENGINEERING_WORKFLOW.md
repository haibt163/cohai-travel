# CoHai Travel — OMP Autonomous Engineering Workflow

Last updated: 12 September 2026.

## Purpose

CoHai Travel uses OMP as an autonomous implementation environment. The project intentionally separates engineering responsibilities across models and human review so that routine work can be performed economically while important architectural and production decisions remain under explicit human control.

GitHub `main` remains the canonical source of truth for repository state. OMP session history is working context only and must never replace repository documentation, Git history, CI evidence, or explicit project decisions.

## Chain of command

### Product Owner

The project owner is the final human authority for product decisions and final approval of changes entering `main`.

### Chief Engineer

ChatGPT acts as Chief Engineer and primary reviewer. Responsibilities include:

- architecture and technical direction;
- review of implementation plans and significant code changes;
- deciding when an issue should be returned to the implementation engineer for correction;
- deciding whether a change is acceptable for final human approval;
- protecting project scope, data integrity, security, provenance, and engineering governance.

### Primary Implementation / Key Engineer

DeepSeek V4.1 Flash is the primary implementation engineer for substantive coding work. It is preferred for:

- feature implementation;
- non-trivial bug fixes;
- refactoring;
- multi-file changes;
- difficult debugging;
- implementation work requiring stronger coding/reasoning capability at low API cost.

DeepSeek must not merge its own work into `main` and must not bypass repository protections.

### Routine / Git Interaction Engineer

Laguna S 2.1 is the preferred low-cost/free agent for routine engineering work, including:

- Git interaction and repository housekeeping;
- pull/push workflow preparation;
- branch/status inspection;
- routine exploration;
- documentation-only edits;
- small, well-scoped fixes;
- low-risk maintenance tasks.

Laguna may perform changes only after the Chief Engineer has authorized the task and the Product Owner has provided the required approval under the normal chain of command.

### Deep Repository Archaeology / Investigation

Nemotron 3 Ultra is the preferred deep-investigation model for:

- repository archaeology;
- large-scale architecture reconnaissance;
- legacy-system analysis;
- investigation of unfamiliar subsystems;
- comparative analysis of existing implementation versus historical/project documentation.

Investigation results are advisory engineering evidence and remain subject to Chief Engineer review.

## Standard execution flow

1. Chief Engineer defines or approves the task.
2. Appropriate model is selected for the task.
3. Implementation work is performed on a feature branch, never directly on `main`.
4. The agent executes the relevant tests, type checks, lint/build/smoke checks as appropriate to the task.
5. The agent reports what was actually verified, using `VERIFIED`, `UNVERIFIED`, or `FAILED` where relevant.
6. Chief Engineer reviews the diff, verification evidence, and scope.
7. If defects or shortcomings are found, the work is returned to the implementation engineer for correction.
8. Only after Chief Engineer review does the change proceed to Product Owner final approval.
9. `main` is updated only through the repository's protected review/merge process.

## Approval boundary

No autonomous agent may treat silence, a successful local test, or its own confidence as authorization to merge into `main`.

A change is considered approved for merge only when both conditions are satisfied:

- Chief Engineer has reviewed and accepted the implementation; and
- Product Owner has given final approval.

## Evidence standard

Do not confuse reasoning with execution.

- `VERIFIED` = supported by actual repository, command, test, CI, or other direct evidence.
- `UNVERIFIED` = inferred, reasoned, or documented but not directly executed/confirmed in the current evidence set.
- `FAILED` = execution evidence shows failure.

Do not describe a change as fixed, working, passing, production-ready, or complete unless the relevant evidence exists.

## Model-selection philosophy

The project deliberately uses different models for different cost/quality requirements rather than forcing a single model to perform every task.

### Free / routine tier

Use Laguna S 2.1 and Nemotron 3 Ultra for high-volume, lower-risk work where strong reasoning is useful but premium model spend is not justified.

### Primary implementation tier

Use DeepSeek V4.1 Flash for substantive coding work where coding quality and autonomous execution matter and its cost advantage is significant.

### Premium review / escalation tier

GPT-5.6 Luna or another premium model may be used for unusually difficult architectural problems, high-impact debugging, security-sensitive changes, major migrations, or final expert review when the expected value justifies the additional spend.

## Cost discipline

Avoid spending a premium model's budget on avoidable reconnaissance or trivial shell work.

Before escalating to a paid or premium model, determine whether the task can be safely handled by the free/routine tier. Conversely, do not force a free model to struggle indefinitely with a high-risk or genuinely difficult engineering problem when a stronger model would materially reduce risk.

## Repository and session continuity

The local working copy, Git history, project documentation, CI records, and committed engineering decisions are the durable project memory.

OMP session history is useful for continuity, but changing models does not transfer conversational context automatically unless the same OMP session is retained. Model switching should therefore be preferred for continuity when appropriate, while fresh sessions should be used for controlled benchmark comparisons.

## Benchmarking protocol

When comparing models for CoHai work:

- use the same repository state;
- use the same task/prompt;
- do not leak one model's conclusions to another during blind comparison;
- compare correctness, verification discipline, tool-call reliability, efficiency, speed, and engineering usefulness;
- record meaningful results rather than selecting a model solely from public benchmark rankings.

## Current preferred model roles

| Role | Preferred model | Default use |
| --- | --- | --- |
| Primary implementation / key engineer | DeepSeek V4.1 Flash | substantive coding and debugging |
| Routine / Git / small edits | Laguna S 2.1 (free) | housekeeping, exploration, low-risk changes |
| Deep archaeology / investigation | Nemotron 3 Ultra (free) | architecture and legacy analysis |
| Premium escalation / high-stakes review | GPT-5.6 Luna or equivalent | difficult architecture, critical fixes, final expert review |

## Current governance rule

For the current CoHai Travel workflow, autonomous agents may prepare branches, commits, pull requests, diagnostics, tests, and reports within the scope explicitly authorized for the task. They may not merge changes into `main` without Chief Engineer review and Product Owner final approval.
