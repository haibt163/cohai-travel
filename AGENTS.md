# CoHai Travel — Agent Contract

## Purpose

This file defines the repository-wide contract for AI and human engineering
agents working on CoHai Travel.

It is harness-neutral.

Project-specific engineering rules belong in `AGENTS.project.md`.
Harness-specific operating rules belong in the relevant harness directory
— in particular, Claude Code operates under `CLAUDE.md`, which grants it
more working discretion than the baseline rules below, within the same
hard boundaries (§5, §7).
Detailed procedures and historical evidence remain under `docs/`.

---

## 1. Read Before Substantive Work

Before substantive work:

1. inspect the current Git state;
2. read `AGENTS.project.md`;
3. read the relevant governance/workflow documents;
4. inspect the relevant implementation;
5. inspect relevant tests;
6. inspect historical/provenance material when applicable.

Do not treat prior conversation, model reports, or handoffs as authoritative
when the repository can provide direct evidence.

---

## 2. Task Modes

### Read-only audit / investigation

Inspect and report findings without modifying application code unless explicitly
authorized.

State:

`NO APPLICATION CODE CHANGES.`

### Implementation

Modify only the files and surfaces necessary for the authorized task.

Use an isolated feature branch or worktree when parallel development could
conflict.

---

## 3. Evidence Standard

Use these statuses consistently:

- **VERIFIED** — supported by direct repository, command, test, CI, or
  runtime evidence.
- **UNVERIFIED** — inference, proposal, or claim without sufficient evidence.
- **FAILED** — confirmed execution failure.

Never claim that work is implemented, tested, passing, verified, complete, or
production-ready without the relevant evidence.

Report verification limitations explicitly. In particular, state whether
the evidence came from direct local execution (a lane with real shell
access, such as Claude Code, Codex CLI, or OMP) or from inspecting
material handed over into a chat session with no independent repository
access. These are not equivalent and should not be described as if they were.

---

## 4. Scope Discipline

Prefer the smallest correct change.

Do not add unrelated refactors, dependency upgrades, aesthetic rewrites, or
architecture changes to a scoped task unless required or explicitly
authorized.

When an existing project mechanism already solves the need, prefer it over
introducing a parallel mechanism.

---

## 5. Security, Data, and Provenance

Treat authentication, authorization, booking/inventory, customer data,
database writes, notifications, secrets, migration, provenance, and production
configuration as sensitive boundaries.

Never:

- commit credentials or secrets;
- bypass authorization or validation;
- expose sensitive data unnecessarily;
- represent synthetic data as historical migration content;
- discard source provenance for convenience.

---

## 6. Documentation

Keep durable project knowledge in repository-visible documentation.

When current behavior changes:

- update current documentation where useful;
- preserve historical audits and reports;
- do not rewrite historical evidence merely to match later conclusions;
- avoid duplicating detailed procedures unnecessarily.

---

## 7. Git and Review Boundary

`main` is the protected canonical integration branch.

Normal implementation work should use a dedicated feature branch or worktree.

Implementation agents must not bypass the project's review and approval
process, regardless of which lane or harness they run under.

Passing tests do not by themselves authorize a merge.

**Approval to merge is held by Claude (chat, as Chief Engineer) or the
Project Owner. Execution of the merge is held by Claude Code or the
Project Owner only** — Claude-chat has no repository write access and
never executes a merge itself. Codex CLI/App and OMP
(DeepSeek/GLM/Kimi/Qwen) are Main-Engineer lanes only and never hold
either approval or execution authority for a merge to `main`, however
much implementation work they perform. The authoritative definition is
`docs/ENGINEERING_GOVERNANCE.md` §6a; `CLAUDE.md` §6 restates it for
Claude Code specifically.

See:

- `AGENTS.project.md`
- `CLAUDE.md`
- `docs/ENGINEERING_GOVERNANCE.md`
- `docs/AI_ENGINEERING_WORKFLOW.md`

for the current project-specific governance model.

---

## 8. Completion

Every substantive task must leave a factual evidence trail.

A completion report should state:

- task;
- mode;
- implementation or findings;
- tests / verification;
- evidence;
- files changed;
- remaining risks / limitations;
- Git state;
- handoff.

Do not report more certainty than the evidence supports.
