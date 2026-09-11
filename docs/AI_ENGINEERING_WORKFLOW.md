# CoHai Travel — AI Engineering Workflow

Last updated: 11 September 2026.

## Purpose

This document is the persistent engineering contract for ChatGPT and other AI-assisted coding sessions on CoHai Travel. It is designed to prevent quality drift during long conversations, stale-context mistakes, unverified claims, and source-of-truth confusion.

## 1. Source of truth

- GitHub `main` is the canonical repository source of truth unless a task explicitly states otherwise.
- A user-supplied local project folder/ZIP is an analysis and working copy, not automatically the canonical state.
- Before making substantive changes, establish the actual current repository state and reconcile it with the current project documentation.
- Never assume a previous conversation's code is still current.
- Never treat a plan, prior answer, generated patch, or memory as proof of the current implementation.

## 2. Local folder / GitHub availability check

At the beginning of a coding task, determine whether the current session has access to:

1. the current GitHub repository; and/or
2. the user's current local project folder/ZIP.

If neither is available for a task that depends on repository contents, stop short of inventing implementation details and explicitly tell the user which source is missing.

When the user says local and GitHub are in sync, still verify the GitHub revision before substantive work. Do not claim local parity unless local files are actually available to inspect.

If the user has forgotten to attach the local folder/ZIP for a task where local inspection is materially useful, remind them before proceeding. Likewise, if GitHub access/connection is unavailable or stale, remind them that the GitHub connection needs to be refreshed/reconnected.

## 3. Context discipline

Long conversations are not the source of truth. As a project enters a new major phase, or the conversation becomes large enough that historical details may compete with current facts, start a fresh conversation using the repository's current documentation and verified status.

A fresh session should first read the active project instructions, current status, architecture/decision documentation, and relevant phase documents before editing code.

Do not carry assumptions from an older conversation when the repository or project status may have changed.

## 4. Verification standard — mandatory

Never confuse reasoning with execution.

Every statement about lint, typecheck, tests, build, smoke tests, deployment, or integration behavior must use one of these states:

- `VERIFIED` — supported by actual execution evidence from the local sandbox, GitHub Actions, or another concrete runtime/test result.
- `UNVERIFIED` — reasoned or reviewed but not actually executed.
- `FAILED` — actual execution evidence shows failure.

Never say or imply that a command "passes", "works", "is fixed", or "is ready" when it is only predicted to work.

For a bug fix, prefer this loop:

`inspect actual code/error → identify root cause → make smallest appropriate change → execute validation → inspect actual result/log → fix remaining issue → repeat until verified`

Do not produce repeated speculative patches without first examining the actual failure evidence available.

### Stop rule — avoid diagnostic loops

Diagnose only until the evidence is sufficient to establish the cause and choose a safe action. Once the root cause is sufficiently established, take the smallest safe intervention and verify the result. Do not keep requesting marginal diagnostics when they are unlikely to change the decision.

For routine, reversible problems, prefer the shortest safe path. Do not turn a simple Git, dependency, lint, typecheck, build, or generated-file issue into a long diagnostic loop when existing evidence already establishes that a safe fix is appropriate.

If a diagnostic command produces enough evidence to support a safe repair, act rather than asking the user to run another redundant diagnostic. After the repair, run one concise verification step and stop when the expected clean state is reached.

## 5. Validation hierarchy

Prefer independent execution evidence over model confidence.

For this project, the primary quality gate is the repository CI workflow. The expected gate is:

`npm ci → npm run test:domain → npm run typecheck → npm run lint → npm run build → npm run test:smoke`

The CI workflow is authoritative for committed repository state. When CI is available, inspect the actual workflow result and logs rather than assuming local success.

The user may also run `npm run dev` locally for interactive preview. A working dev server is useful evidence for runtime startup, but it does not replace lint, typecheck, build, domain tests, or smoke tests.

## 6. GitHub vs local working copy

Use GitHub for repository truth, history, commits, branches, pull requests, and CI evidence.

Use the local project folder/ZIP when deep whole-project inspection or file manipulation is more efficient and the local environment is available.

Use GitHub Actions as the independent remote execution environment when local shell execution is unavailable to the assistant.

Do not claim that GitHub read access and a local ZIP are equivalent. They provide different capabilities and should be used deliberately.

## 7. Change scope and safety

- Inspect before editing.
- Prefer the smallest change that solves the verified problem.
- Preserve existing project contracts, architecture, and intentional behavior unless the task explicitly changes them.
- Do not overwrite large files or broad areas merely to make a local patch convenient.
- For sensitive migrations or production work, follow the project's existing data-handling and source-fidelity rules.

## 8. Git workflow for user-run updates

When the user is expected to update their local checkout, provide the Git update steps as ready-to-run Bash commands.

Prefer a concise sequence such as:

```bash
git status
git add <specific-files>
git commit -m "<clear message>"
git push origin main
```

Do not ask the user to manually reconstruct Git commands when exact commands can be supplied.

If the assistant itself writes to GitHub, report the resulting commit/reference and still distinguish repository update from local-folder synchronization.

## 9. Scripts and copy-ready output

Any script, shell command block, PowerShell block, file replacement, migration, or configuration snippet intended for user execution must be presented in a copy-ready code block so the UI provides a direct copy affordance.

Prefer complete runnable scripts over fragments when a script is required.

Never hide required commands in prose.

## 10. Fresh-session handoff

Before starting a new major project phase, update the persistent status documentation with:

- current verified commit/reference;
- what is verified passing;
- what is not verified;
- known issues;
- current phase;
- next prioritized work;
- relevant decisions or constraints.

The next fresh conversation should use this as a handoff, then verify the live repository before editing.

## 11. User interaction rule

The user may and should push for verification. Useful instructions include:

- "Do not assume it passes. Verify it."
- "Inspect the actual error before proposing another fix."
- "Show me the evidence."
- "Mark it UNVERIFIED if you cannot execute it."

The assistant should apply this standard proactively even when the user does not repeat it.

## 12. Fresh-phase trigger and handoff rule

Start a fresh conversation at a major project phase boundary or when the conversation has become long enough that historical discussion may compete with current repository facts. Do not wait for obvious quality degradation. The fresh session should begin from the repository's current documentation and live repository state.

Before asking the user to begin a new phase, ensure the persistent status documentation records the current verified commit, validation state, known issues, current phase, and prioritized next work.

## 13. Current CoHai Travel baseline

As of this update, `ProjectStatus.md` records the engineering baseline and full-site visual modernization as green and identifies the P2 WordPress reconstruction as the major unfinished phase. The project's CI gate is already defined as `npm ci → domain tests → typecheck → lint → build → smoke`. Preserve that gate and use its results as execution evidence. 

The user reports that the current local folder and GitHub repository are in sync and that `npm run dev` works locally. This local interactive result is user-reported and is therefore recorded here as `USER-REPORTED`, not assistant-verified.

As of the latest checkpoint, local `main` and `origin/main` were verified to resolve to the same commit `882979e892fd66875d00f0756e4581634e5de20f`, and `git status --short` was clean after resolving a false-positive `src/routeTree.gen.ts` modification. The file's working-tree hash matched the `HEAD` blob hash exactly before the safe `git restore` cleanup. This Git state is user-executed evidence from 11 September 2026, not assistant-executed shell evidence.
