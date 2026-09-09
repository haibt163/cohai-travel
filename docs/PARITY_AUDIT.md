# Repository ↔ Preview parity audit

Last reviewed: 9 September 2026.

## Gate

GitHub is the source of record. Parity closes only when a clean checkout can install, test, typecheck, lint, build, start, and serve the same application contract without relying on hidden Grok workspace files.

## Current findings

| Area | Status | Notes |
| --- | --- | --- |
| Application source | 🟢 | Core `src/` routes and server functions are tracked. |
| Imported helper source | 🟡 | Imported helper modules that had been hidden by `.gitignore` are being restored/tracked. |
| SEO server routes | 🟡 | Sitemap/robots use TanStack Start server-route patterns under `src/routes`. Final runtime certification remains pending. |
| Dependencies | 🟡 | `npm ci` has passed; the temporary peer-resolution bridge is still present. |
| Typecheck | 🟡 | Source repairs are in progress; no fresh green CI certification yet. |
| Lint/build/smoke | 🔴 | Blocked from certification until typecheck passes in a fresh run. |
| Preview ↔ production parity | 🟡 | Source parity is substantially improved; closure requires a fresh green CI run and production smoke evidence. |

## Clean-checkout closure test

1. `npm ci`
2. `npm run test:domain`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`
6. `npm run test:smoke`
7. Verify SEO endpoints and auth routes through the same tracked source tree.

## Ignore-list rule

`.gitignore` must not hide application/runtime files imported by tracked source or required by the build/deployed server. Platform-generated assets may remain ignored only when their contract is explicitly documented.

## Current remediation

- Fixed stale catalog detail metadata field usage.
- Added TanStack Start sitemap/robots server routes.
- Removed the obsolete standalone sitemap implementation.
- Restored helper modules required by tracked imports.
- Added homepage metadata foundation.
- Added pure booking concurrency invariants and a documented DB-backed integration-test target.

## Closure rule

Do not mark parity complete from source inspection alone. The final evidence must be a fresh successful CI run from the exact GitHub commit being audited.
