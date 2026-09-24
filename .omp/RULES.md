# OMP Rules — CoHai Travel

## Mandatory

1. Read `AGENTS.md` before substantive work.
2. Read `AGENTS.project.md` before substantive work.
3. Read `.omp/AGENTS.md` before substantive OMP work.
4. Inspect live repository state before changing files.
5. Treat repository evidence as authoritative over prior model claims.
6. Keep implementation scope narrow and reviewable.
7. Use an isolated feature branch/worktree when needed for safe implementation.
8. Verify every claimed result with direct evidence.
9. Run relevant tests after implementation.
10. Preserve historical documentation and provenance.
11. Never add secrets or credentials.
12. Report failures and limitations honestly.
13. Do not bypass the project's review/approval boundary.
14. Do not merge implementation work directly to protected `main`.

---

## Never

- never force-push;
- never rewrite historical commits without explicit authorization;
- never silently merge branches;
- never let two coding agents edit the same worktree concurrently;
- never claim a test passed without running it;
- never claim a build passed without running it;
- never claim verification without evidence;
- never downgrade a critical failure to obtain green status;
- never introduce unrelated refactors into a scoped task;
- never upgrade dependencies without a justified requirement;
- never add secrets or credentials to source control;
- never bypass authentication, authorization, validation, or provenance;
- never treat an agent report as proof when repository verification is possible;
- never treat silence or lack of objection as approval;
- never treat prior model approval as approval for the current change;
- never merge directly to protected `main`.

---

## Evidence

Use only:

`VERIFIED`

`UNVERIFIED`

`FAILED`

Read-only audits must state:

`NO APPLICATION CODE CHANGES.`

---

## Git Check

Before committing, inspect:

```text
git status
git diff
```

After committing, inspect:

```text
git status
git log --oneline --decorate -3
```

A clean test result does not authorize a merge.

---

## Approval Boundary

Implementation / investigation
→ tests + evidence + handoff
→ Chief Engineer review
→ Project Owner final approval
→ protected `main`

No model, harness, tool, test result, prior approval, or deadline bypasses this
boundary.
