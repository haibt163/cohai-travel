# Repository ↔ Preview parity audit

Last reviewed: 9 September 2026.

## Gate

GitHub is the source of record. Parity is closed only when a clean checkout can install, test, typecheck, lint, build, start, and serve the same application contract without relying on hidden Grok workspace files.

## Findings

- Core application routes and server functions are tracked.
- Some runtime/helper files were previously hidden by `.gitignore` even though tracked source imported them; this is being corrected.
- `npm ci` passes after the temporary peer-resolution policy.
- The historical CI run reached and passed the booking domain tests, but stopped at TypeScript errors before lint/build/smoke.
- Sitemap/robots handlers were using standalone Nitro APIs that do not match the current TanStack Start route contract; they are being migrated to `src/routes` server routes.

## Parity checklist

| Check | Status |
| --- | --- |
| Tracked source contains imported runtime helpers | 🟡 |
| No application source hidden by `.gitignore` | 🟡 |
| `npm ci` | 🟢 verified |
| Domain booking tests | 🟢 verified |
| Typecheck | 🟡 repair in progress |
| Lint | 🔴 blocked by earlier typecheck failure |
| Production build | 🔴 blocked by earlier typecheck failure |
| Production smoke | 🔴 blocked by earlier build gate |
| Preview/production route parity | 🟡 pending full green CI |
| Dependency lockfile normalization | 🟡 pending |

## Rule for closure

Do not mark parity complete based on source inspection alone. The final evidence must be a fresh successful CI run from the GitHub commit being audited.
