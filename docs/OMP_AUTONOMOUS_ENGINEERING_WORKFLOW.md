# CoHai Travel — OMP Autonomous Engineering Workflow

Last updated: 13 September 2026 (model-role roster revision).

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

DeepSeek V4.1 models and onward are the primary implementation/key-engineer tier for substantive coding work. It is preferred for:

- feature implementation;
- non-trivial bug fixes;
- refactoring;
- multi-file changes;
- difficult debugging;
- implementation work requiring stronger coding/reasoning capability at low API cost.

DeepSeek must not merge its own work into `main` and must not bypass repository protections.

### Routine / Git Interaction Engineer

A suitable currently available **free model** will be selected for:

- routine repository exploration;
- Git interaction and repository housekeeping;
- pull/push workflow preparation;
- branch/status inspection;
- documentation-only edits;
- small, well-scoped fixes;
- low-risk maintenance tasks.

**No specific free model is permanently assigned to this role.** OpenRouter free-model availability, pricing, latency, throughput, and routing can change. A candidate becomes the standing choice only after benchmarking.

### Deep Repository Archaeology / Investigation

A suitable currently available **free model** will be selected for:

- repository archaeology;
- large-scale architecture reconnaissance;
- legacy-system analysis;
- investigation of unfamiliar subsystems;
- comparative analysis of existing implementation versus historical/project documentation.

**No specific free model is permanently assigned to this role.** Candidate models are benchmarked against the same investigation task before being adopted.

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

Use a currently available, benchmarked free model for routine/Git work and a currently available, benchmarked free model for deep archaeology. These assignments are intentionally TBD and may change as OpenRouter availability and model quality change.

### Primary implementation tier

Use DeepSeek V4.1 models and onward for substantive coding work where coding quality and autonomous execution matter and its cost advantage is significant.

### Premium review / escalation tier

GPT-5.6 Luna or another premium model may be used for unusually difficult architectural problems, high-impact debugging, security-sensitive changes, major migrations, or final expert review when the expected value justifies the additional spend.

## OpenRouter and model-selection policy

OpenRouter is the preferred model gateway for OMP. The project does **not** permanently pin a particular model merely because it is currently free, fast, or highly ranked.

The provider/gateway is stable; the actual model remains replaceable.

Free models are treated as replaceable infrastructure. They can become unavailable, rate-limited, repriced, removed from a free tier, or slower under load. Maintain a tested backup candidate for each free role when practical.

## Cost discipline

Avoid spending a premium model's budget on avoidable reconnaissance or trivial shell work.

Before escalating to a paid or premium model, determine whether the task can be safely handled by the free/routine tier. Conversely, do not force a free model to struggle indefinitely with a high-risk or genuinely difficult engineering problem when a stronger model would materially reduce risk.

## Repository and session continuity

The local working copy, Git history, project documentation, CI records, and committed engineering decisions are the durable project memory.

OMP session history is useful for continuity, but changing models does not transfer conversational context automatically unless the same OMP session is retained. Model switching should therefore be used when continuity is useful, while fresh sessions should be used for controlled benchmark comparisons. Model switching does not change the approval chain.

## Benchmarking protocol

When comparing models for CoHai work:

- use the same repository state;
- use the same task/prompt for each candidate;
- compare newly released free models rather than assuming public rankings are sufficient;
- do not leak one model's conclusions to another during blind comparison;
- compare correctness, verification discipline, tool-call reliability, efficiency, speed, and engineering usefulness;
- record meaningful results rather than selecting a model solely from public benchmark rankings.

## Current model roles

The following is the **current benchmark-derived working roster as of 13 September 2026**. The free-model assignments are operational picks, not permanent pins. They may be replaced when OpenRouter availability, pricing, latency, throughput, context limits, or observed CoHai performance changes.

| Role | Current working pick | Context | Default use |
| --- | --- | ---: | --- |
| Primary implementation / key engineer | **DeepSeek V4.1 models and onward** | up to 1M-class where available | substantive coding, debugging, refactoring, multi-file implementation |
| Routine / Git / small edits | **Cohere North Mini Code (free)** | **256K** | routine exploration, Git interaction, housekeeping, documentation, small/low-risk fixes |
| Deep archaeology / investigation | **Thinking Machines Inkling (free)** | **1.048M** | large-context repository archaeology, legacy analysis, architecture reconnaissance |
| Fast scout / lightweight investigation | **InclusionAI Ling 3.0 Flash Fin (free)** | **262K** | rapid repository scans, focused questions, disposable exploration |
| Deep-archaeology backup / independent second opinion | **NVIDIA Nemotron 3 Ultra (free)** | **1M** | difficult investigations, large-context second opinions, fallback when Inkling is unavailable |
| Routine backup | **Poolside Laguna S 2.1 (free)** | **262K** | fallback routine exploration, Git work, small fixes |
| Premium escalation / high-stakes review | **GPT-5.6-class or equivalent** | model-dependent | difficult architecture, critical fixes, security-sensitive changes, final expert review |

### Context-window policy

Context size is matched to task scope rather than treated as a quality ranking:

- **1M-class models** are preferred for deep archaeology, large legacy investigations, and tasks requiring broad simultaneous repository context.
- **~262K models** are preferred for focused exploration, routine maintenance, Git operations, and small changes where 1M context provides little practical benefit.
- **DeepSeek V4.1+** remains the primary implementation tier; context availability should still be considered when assigning unusually large implementation tasks.
- A smaller-context model must not be forced into a large-context archaeology task merely because it is faster.
- A 1M-context model should not be used for trivial work solely because the larger window is available.

### Free-model replacement and fallback policy

No free model is permanently assigned to a governance role. The current picks above are the starting roster for the next engineering phase.

For each free role, maintain at least one practical fallback when possible. A model may be replaced when it becomes unavailable, rate-limited, repriced, removed from the free tier, materially slower, unreliable, or demonstrably weaker on the project's benchmark task.

Current fallback relationships:

- Routine/Git: **North Mini Code → Laguna S 2.1**
- Deep archaeology: **Inkling → Nemotron 3 Ultra**
- Fast scout: **Ling 3.0 Flash Fin**, with either routine or archaeology models used when the task exceeds Ling's appropriate scope.

These assignments are intentionally replaceable and must not be interpreted as permanent model configuration in OMP.

## Current governance rule

For the current CoHai Travel workflow, autonomous agents may prepare branches, commits, pull requests, diagnostics, tests, and reports within the scope explicitly authorized for the task. They may not merge changes into `main` without Chief Engineer review and Product Owner final approval.
