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

## Current baseline

GitHub Actions has verified that `npm ci` and the current domain booking-rule suite pass. The previous failing run stopped at TypeScript before lint/build/smoke. Source repairs are being committed directly to `main`, and every new commit must pass the same chain.

## Dependency reproducibility

The repository currently uses a temporary npm peer-resolution policy because the existing lockfile was not originally aligned with strict peer resolution. The target state is a clean package-lock/package configuration that installs with plain `npm ci` without relying on a workaround. Until that state is reached, the policy must remain explicit and CI must prove the checked-in lockfile is installable.

## Runtime parity

CI is also the repository parity gate. A successful production smoke test must boot the checked-in build with the repository's tracked runtime and confirm the public application document is served.
