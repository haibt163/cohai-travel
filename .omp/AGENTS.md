# OMP Agent Instructions — CoHai Travel

## Purpose

OMP is an implementation and investigation harness for CoHai Travel.

This file defines OMP-specific operating procedure.

Project-wide rules are defined in:

- `AGENTS.md`
- `AGENTS.project.md`

Hard OMP guardrails are defined in:

- `.omp/RULES.md`

Detailed project governance remains under `docs/`.

---

## 1. Establish Context Before Editing

Before substantive work:

1. read `AGENTS.md`;
2. read `AGENTS.project.md`;
3. read `.omp/RULES.md`;
4. read relevant governance/workflow documentation;
5. inspect live Git state;
6. inspect the relevant implementation;
7. inspect relevant tests;
8. inspect historical/provenance material when applicable.

Do not treat a prior agent report as proof of current repository state.

Claude Code and Codex CLI/App are higher-trust, merge-capable Main Engineer
lanes under the project governance. OMP remains an implementation lane and
does not execute merges to protected `main`.

---

## 2. Task Modes

### Read-only audit / investigation

Inspect and report findings without application-code changes unless explicitly
authorized.

State:

`NO APPLICATION CODE CHANGES.`

### Implementation

Modify only the authorized scope.

Use an isolated feature branch or worktree when parallel work could conflict.

---

## 3. Operating Sequence

For a non-trivial task:

Understand
→ inspect
→ identify exact gap
→ plan smallest correct change
→ implement
→ verify
→ inspect diff
→ report evidence

Do not implement solely from the task description when repository evidence is
available.

---

## 4. Scope Discipline

For a scoped change:

- fix the requested issue;
- fix defects directly caused by the change;
- preserve unrelated behavior;
- avoid unrelated refactors;
- avoid dependency upgrades unless required;
- preserve historical/provenance material.

The target is a focused, reviewable patch.

---

## 5. Verification

Use the project evidence vocabulary:

- **VERIFIED**
- **UNVERIFIED**
- **FAILED**

Never claim a test, build, lint, typecheck, runtime behavior, or production
state without direct evidence.

If verification is blocked by the environment, report that limitation.

---

## 6. Tests

When a change introduces or modifies an invariant:

- add or update executable verification where practical;
- cover intended valid behavior;
- cover meaningful invalid/failure behavior;
- run the relevant tests.

A verification command only counts as evidence after it has actually run.

---

## 7. Sensitive Boundaries

Take extra care with:

- authentication and authorization;
- booking and inventory;
- database mutations;
- notifications;
- customer data;
- secrets;
- migration/provenance;
- production configuration.

Do not weaken safeguards to obtain a passing result.

---

## 8. Documentation

When current behavior changes:

- update the appropriate current documentation where useful;
- preserve historical audits and reports;
- do not rewrite historical evidence;
- avoid duplicating detailed procedures unnecessarily.

---

## 9. Cross-Agent Handoffs

When continuing another agent's work:

read governance
→ read current handoff/report
→ inspect Git state
→ inspect relevant implementation
→ verify important claims
→ continue from evidence

A previous model's conversation is context, not project truth.

When OMP hands work to another lane, the incoming engineer must follow the
shared governance: Claude Chat and ChatGPT are peer Chief Engineer chat lanes;
Claude Code and Codex CLI/App are peer higher-trust, merge-capable Main Engineer
lanes; OMP does not hold merge authority.

---

## 10. Completion Report

Every substantive OMP task should finish with:

- task;
- mode;
- implementation or findings;
- tests / verification;
- evidence;
- files changed;
- remaining risks / limitations;
- Git state;
- handoff.

Read-only tasks must state:

`NO APPLICATION CODE CHANGES.`

---

## 11. Model Choice

Use the least expensive capable model that can safely perform the task.

Model selection may vary with:

- task complexity;
- context needs;
- repository size;
- quality;
- latency;
- availability;
- cost.

Changing models does not change project governance. OMP cannot promote
itself into a merge-capable lane merely by changing its model.
