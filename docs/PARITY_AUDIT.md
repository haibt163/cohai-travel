# Repository ↔ Preview parity audit

Last reviewed: 9 September 2026.

## Gate

GitHub is the source of record. Parity is closed only when a clean checkout can install, test, typecheck, lint, build, start, and serve the same application contract without relying on hidden Grok workspace files.

## Findings

- Core application routes and server functions are tracked.
- Some runtime/helper files were previously hidden by `.gitignore` even though tracked source imported them; this is being corrected.
- `npm ci` passes after the temporary peer-resolution policy.
- The historical CI run reached and passed the booking domain tests, but stopped at TypeScript errors before lint/build/smoke.
- Sitemap/robots are being implemented as TanStack Start server routes under `src/routes`, matching current framework guidance.

## Parity checklist

| Check | Status |
| --- | --- |
| Tracked source contains imported runtime helpers | 🟡 |
| No application source hidden by `.gitignore` | 🟡 |
| `npm ci` | 🟢 verified |
| Domain booking tests | 🟢 verified |
| Typecheck | 🟡 repair in progress |
| Lint | 🔴 blocked pending typecheck |
| Production build | 🔴 blocked pending lint/typecheck |
| Production smoke | 🔴 blocked pending build |
| Preview/production route parity | 🟡 pending full green CI |
| Dependency lockfile normalization | 🟡 pending |

## Closure rule

Do not mark parity complete based on source inspection alone. Final evidence must be a fresh successful CI run from the GitHub commit being audited.
