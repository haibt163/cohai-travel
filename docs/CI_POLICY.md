# CI policy

Last reviewed: 9 September 2026.

## Required gate

Every `main` commit is considered deployable only after this ordered chain succeeds:

1. `npm ci`
2. `npm run test:domain`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`
6. `npm run test:smoke`

A failure at an earlier step blocks later steps; skipped later steps are therefore not evidence about the skipped check itself.

## Dependency policy

The repository currently uses `legacy-peer-deps=true` because the checked-in lockfile was produced in a dependency graph that npm's strict peer resolver did not reproduce cleanly. This is a temporary reproducibility bridge, not the target architecture.

Target state: regenerate/normalize `package-lock.json` so a plain `npm ci` can succeed without the workaround, then remove the `.npmrc` override and prove the full CI chain again.

## Runtime parity policy

CI is the repository parity gate. A successful production smoke test must boot the checked-in production bundle using the tracked runtime and verify the public application document. Preview-only behavior must not be required for the build to pass.
