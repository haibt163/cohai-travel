# Repository ↔ Preview parity audit

Last reviewed: 9 September 2026.

## Gate

GitHub is the source of record. Parity closes only when a clean checkout can install, test, typecheck, lint, build, start, and serve the same application contract without relying on hidden Grok workspace files.

## Current findings

| Area | Status | Notes |
| --- | --- | --- |
| Application source | 🟢 | Core `src/` routes and server functions are tracked. |
| Imported helper source | 🟡 | Missing helper modules found during CI are being restored and the ignore policy tightened. |
| SEO server routes | 🟡 | Sitemap/robots are being moved into TanStack Start `src/routes` server handlers. |
| Dependencies | 🟡 | `npm ci` passes with the current peer-resolution policy; clean lockfile normalization remains. |
| Typecheck | 🟡 | Repair work is in progress. |
| Lint/build/smoke | 🔴 | Must be re-certified by a fresh successful CI run after typecheck repair. |
| Preview ↔ production parity | 🟡 | Source parity is being repaired; final closure requires green CI and production smoke evidence. |

## Required clean-checkout test

1. `npm ci`
2. `npm run test:domain`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`
6. `npm run test:smoke`
7. Verify SEO endpoints and auth routes use the same tracked source tree.

## Ignore-list rule

`.gitignore` must not hide application/runtime files imported by tracked source or required by the build/deployed server. Platform-generated files may remain ignored only when their contract is explicitly documented.

## Current remediation

- Restored tracked helper modules required by `src/lib/db.ts`, auth client code and the preview bridge.
- Corrected route metadata reads to use the typed language-specific fields.
- Added TanStack server-route implementations for `/sitemap.xml` and `/robots.txt`.
- Removed the obsolete standalone sitemap handler.
- Added homepage route metadata foundation.
- Added this parity ledger so source inspection and runtime certification are clearly separated.

## Closure rule

Do not mark parity complete from source inspection alone. The final evidence must be a fresh successful CI run from the GitHub commit being audited.
