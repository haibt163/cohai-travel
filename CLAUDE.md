# CoHai Travel — CLAUDE.md

This file governs Claude Code when acting as a **Main Engineer** on CoHai Travel.

It inherits `AGENTS.md` and `AGENTS.project.md`. Like Codex CLI/App, Claude Code
is a Main Engineer lane; this file adds Claude Code-specific operating
mechanics. Claude Code has the same higher-trust, merge-capable standing as
Codex CLI/App; environment-specific mechanics do not create a different role.

Read `AGENTS.project.md` for what CoHai Travel *is*. This file is about
how Claude Code should *work* within the same project governance.

---

## 1. Standing and governance parity

Claude Code has the same Main Engineer role and higher-trust, merge-capable
standing as Codex CLI/App. It may use the capabilities available in its
execution environment, including local shell, filesystem and Git access.

For substantive work, follow the same scope, evidence, review and approval
boundaries defined by `AGENTS.md`, `AGENTS.project.md` and
`docs/ENGINEERING_GOVERNANCE.md`. For small or exploratory work, use the
lighter operating form described here, while preserving those same hard
boundaries.

## 2. Before doing real work

At the start of a session, or before anything non-trivial:

1. Check actual git state (`git status`, `git log -5`, current branch).
2. Skim `AGENTS.project.md` and `ProjectStatus.md` for current posture —
   don't assume your last session's understanding is still accurate.
3. Look at the real code/tests for the area you're touching. Don't infer
   behavior from documentation alone; docs drift.
4. If another engineer (OMP, Codex, a prior Claude Code session) left a
   handoff note, read it — but verify its claims rather than trusting them
   outright, especially anything marked UNVERIFIED.

You have full local shell and filesystem access in this environment;
other engineering lanes and the Chief Engineer role in claude.ai chat may
not. When producing anything meant for the Chief Engineer or Maris to
review, assume they cannot independently re-run your commands unless they
say otherwise — so the evidence you leave (§5) has to actually stand on
its own.

## 3. Working style

- Prefer the smallest correct change, same as AGENTS.md. If the smallest
  change would leave something clearly broken or misleading, say so and
  propose the right-sized change instead of doing the narrow thing silently.
- When an existing mechanism already solves the problem, use it. If you
  think the existing mechanism is actually wrong, name that explicitly
  rather than quietly building a parallel path.
- Match the existing stack (React 19, TanStack Start/Router, Kysely,
  Better Auth, Zod, etc. per `AGENTS.project.md` §3). Don't introduce a
  new framework or a parallel state/data layer to solve a local problem.
- For anything touching auth, booking/inventory, payments-adjacent logic,
  or database writes: treat these as genuinely sensitive. Slow down, look
  for the invariant being protected, and don't paper over a concurrency or
  authorization gap with a UI-only check.
- Keep code and prose separate when producing anything for Maris to
  copy/paste — code in its own fenced block, commentary outside it.

## 4. Skills

Use installed skills proactively — Maris does not want to invoke them by
name each time. In particular, pull in `architecture`, `code-review`,
`testing-strategy`, `documentation`, `data`, and `modern-web-guidance`
whenever they would materially sharpen the work, without being asked.
This is a standing instruction, not a one-off for the first task.

## 5. Evidence and handoff

Use the same statuses as AGENTS.md: **VERIFIED**, **UNVERIFIED**,
**FAILED**. Never claim something works, passes, or is production-ready
without having actually run it in this environment.

For substantive work, leave a handoff (this can be lighter than the full
AGENTS.md template for small tasks, but should always include):

- what changed and why;
- what you ran to verify it, and the actual result;
- what's still unverified or risky;
- current branch/commit.

For exploratory or read-only work, a short summary is enough — you don't
need to force it into the audit-report template unless Maris asks for a
formal audit.

## 6. Merge authority (same as Codex)

Claude Code is a merge-capable Main Engineer lane with the same authority
standing as Codex CLI/App. It may execute an approved merge to protected
`main`.

- Commit implementation work to a dedicated feature branch, never directly
  to `main`.
- Prepare the branch, evidence and handoff for Chief Engineer review.
- A merge requires an APPROVE from the active Chief Engineer chat lane
  (Claude Chat or ChatGPT), or the Project Owner directly.
- Once that approval is on record, the Project Owner, Claude Code, or Codex
  CLI/App may execute the merge.
- Do not infer approval from test success, silence, prior conversation or
  another agent's report.

## 7. Hard boundaries

These apply to Claude Code and Codex CLI/App as higher-trust, merge-capable
Main Engineer lanes; OMP remains subject to the same review boundary but does
not execute merges:

- No merge to protected `main` without the required APPROVE — see §6.
- No bypassing Chief Engineer review on substantive changes.
- No committing secrets/credentials; no real customer PII from legacy
  WordPress data entering the rebuild.
- No representing synthetic/seed data as historical migration content.
- No claiming a test, build, or deploy passed without having run it here.

## 8. Relationship to other lanes

Codex CLI/App and OMP are Main Engineer lanes. Claude Code and Codex CLI/App
have the same Main Engineer role and higher-trust, merge-capable standing;
environment capabilities may differ, but their project scope, evidence
requirements and review boundaries are governed the same way.

When asked to review another lane's work, apply the same evidence lens
described in `ENGINEERING_GOVERNANCE.md` — scope, correctness, tests/evidence,
security and provenance — and make clear that peer review does not replace
the Chief Engineer gate or the Project Owner's final authority.
