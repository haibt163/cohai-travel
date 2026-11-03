# CI policy

Last reviewed: 3 November 2026.

## Required gate

Every `main` commit is considered deployable only after this ordered chain succeeds:

1. `npm ci`
2. `npm run test:domain`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`
6. `npm run test:smoke`

A failure at an earlier step blocks later steps; skipped later steps are not evidence about the skipped check itself.

## Dependency policy

The repository has no root `.npmrc` and does not use `legacy-peer-deps`. `package.json` and `package-lock.json` are aligned, and the checked-in workflow runs plain `npm ci`. GitHub Actions run #319 on `1556e31` completed `npm ci`, `test:domain`, `typecheck`, `lint`, `build` and the production smoke test successfully. Keep the lockfile and manifest in parity; do not reintroduce a peer-resolution bypass.

## Runtime parity policy

CI is the repository parity gate. A successful production smoke test must boot the checked-in production bundle using the tracked runtime and verify the public application document. Preview-only state must not be required for the build to pass.

The `quality` job provisions PostgreSQL 16 and sets `TEST_DATABASE_URL` for `scripts/booking-concurrency.integration.mjs`, which exercises real row locking. Run #319 is the current successful evidence for the complete chain on `main` @ `1556e31`.
