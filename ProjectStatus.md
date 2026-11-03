# Cô Hai Travel — project status

Last updated: 3 November 2026 (direct repository/CI review of `main` @ `1556e31`; see "Evidence — 3 November 2026" below).

## Executive status

The engineering baseline is green on `main` @ `1556e31` (GitHub Actions run #319, 27 October 2026). The displayed brand is **Cô Hai Travel**; production SEO is fixed to `https://cohaitravel.com`; the localized sitemap and preview-disallowing robots behavior merged in PR #27, and the Google Search Console verification file merged in PR #28.

P1 includes crawlable bilingual routing, locale-aware metadata, operational visibility for allowlisted staff and a provider-neutral notification contract. P2 is explicitly **Legacy Product Archaeology & Modern Reconstruction**: the 15+ year-old WordPress project is treated as a historical product/content source, not a customer-data migration target.

Repository and CI evidence does **not** prove the live Vercel preview, Google Search Console property verification or the Owner's Vercel environment-variable values. Those remain outside this review.

## Current engineering governance

Cô Hai Travel now operates under a three-role governance model:

- **Main Engineers:** Claude Code (governed by `CLAUDE.md` for Claude-specific operating details), Codex CLI / Codex App with GPT/Codex models, or OMP CLI with DeepSeek / GLM / Kimi / Qwen through OpenRouter or OpenCode Go. Claude Code and Codex CLI/App have the same Main Engineer role and the same higher-trust, merge-capable governance standing; these remain interchangeable implementation lanes rather than a primary-plus-backup hierarchy, and switching between them — including because a session limit was hit — is routine.
- **Chief Engineer:** the active chat/review lane, either Claude Chat or ChatGPT, providing the independent engineering review gate for codebases, architecture, tests, evidence, security, provenance and PRs. Claude Chat and ChatGPT have the same Chief Engineer role. Chat/repository access differences are environment capabilities, not governance differences.
- **Project Owner:** Maris — final human authority and final green light before protected `main`.

**Merge authority to `main`:** approval is held by Claude Chat, ChatGPT, or Maris; execution is held by Maris, Claude Code, or Codex CLI/App after the approval gate is satisfied (see `docs/ENGINEERING_GOVERNANCE.md` §6a). Chat/review lanes do not execute merges from chat-only environments, and OMP does not execute merges.

**Codex Cloud is retired from the project governance and is not an approved engineering lane.**

See `docs/ENGINEERING_GOVERNANCE.md` for the authoritative governance contract, `docs/AI_ENGINEERING_WORKFLOW.md` for the operating procedure, and `CLAUDE.md` for Claude Code's harness-specific rules.

## Audit matrix

| Item | Status | Next action |
| --- | --- | --- |
| P0.1 Reproducible checkout | 🟢 | GitHub `main` remains source of record; keep local checkout synchronized at implementation checkpoints. |
| P0.2 Preview/repo parity | 🟡 | Repository build and smoke are green (run #319), but no browser check of the live Vercel preview exists in this review. Owner to verify the preview at desktop and iPhone width; CI is not visual proof. |
| P0.3 Atomic tour booking | 🟢 | Preserve DB-backed transaction/locking semantics. |
| P0.4 Stay/car finite inventory | 🟢 | Keep current finite-inventory model until a broader UX requirement is explicit. |
| P0.5 CI | 🟢 | Latest full gate is VERIFIED by GitHub Actions run #319 on commit `1556e31efbd68b47ee11f97b6ba06a94bd7b9675` (27 October 2026), including the PostgreSQL 16 booking integration. |
| P0.6 Runtime migration bootstrap | 🟢 | Existing populated databases are adopted without reseeding; bundled migrations run deterministically and schema verification is enforced. |
| P1.6 EN/VN URL architecture | 🟢 | Locale-prefixed application routes are canonical. |
| P1.7 Locale-aware metadata | 🟢 | Titles/descriptions use locale-specific copy on public routes. |
| P1.8 Sitemap/robots | 🟢 | Locale-aware SEO endpoints remain under TanStack Start; the canonical host is fixed in `src/lib/seo.ts`, the sitemap emits EN/VN alternates, and preview robots disallow crawling (PR #27). |
| P1.9 Images | 🟢 | Provenance/licensing reviewed and confirmed by the Project Owner (2 October 2026). Legacy media may be migrated when useful. |
| P1.10 Booking tests | 🟢 | `scripts/booking-concurrency.integration.mjs` runs inside `test:domain`; GitHub Actions run #319 logs `[integration] backend: real PostgreSQL` and `PASS on real PostgreSQL (row locking exercised)`. Local PGlite runs remain logic-only. |
| P1.11 Booking state | 🟢 | Current confirmed/cancelled model remains locked. |
| P1.12 Public contact | 🟢 | Public endpoint with anti-spam/rate-limit protections. |
| P1 operations/admin | 🟢 | Allowlisted users get an operator desk section in My trips, including current P2 provenance coverage. |
| P1 notifications | ⚪ optional | Contract documented. Provider, credentials, delivery worker and monitoring are **optional / not a current priority** (Project Owner, 2 October 2026). |
| P2.14 Legacy product archaeology | 🟢 | Original product/business/UX intent is documented in `docs/P2_LEGACY_PRODUCT_ARCHAEOLOGY.md`. |
| P2.15 Source migration matrix | 🟢 | Working record dispositions remain traceability tools; accepted records can move to `migrate` after publication gates. |
| P2.16 Legacy URL mapping | 🟢 | Preserve valuable legacy paths through verified canonical replacements. |
| P2.17 Seed reconciliation | 🟢 | Use source-backed subjects to reconstruct the modern catalog; retain intentional modern additions separately. |
| P2.18 Fidelity report | 🟡 | A first bilingual, source-led travel-information surface is now implemented; close remaining factual, editorial, media, URL, schedule and source-coverage gaps during reconstruction. |
| P2.19 Connected destination hub | 🟢 | Destination-scoped journeys/stays/cars and cross-navigation are implemented and full CI verified. |
| P2.20 Provenance guard | 🟢 | Canonical provenance schema, regression coverage and operator-only reconstruction metrics are implemented and full CI verified. |
| P2.21 Canonical record plan | 🟢 | Publication-gate checklist and current destination/journey reconstruction set are documented in `docs/P2_CANONICAL_RECORD_PLAN.md`. |
| P2.22 2026 destination fact refresh | 🟢 | First source-backed destination and journey fact refresh is implemented with a current source ledger. |

> **Note on this matrix (25 September 2026):** the rows above are carried
> forward unchanged from the 15 September 2026 version. This governance
> revision (chat session, no repository access) did not independently
> re-verify any 🟢/🟡 status. Have a direct-repository Main Engineer
> re-confirm current state against live Git/CI evidence at the next
> implementation session before treating these as current.

> **Matrix review — 3 November 2026:** the matrix was re-checked against `main` @ `1556e31`, GitHub Actions run #319 and the cited source files. Rows updated in this pass: P0.2 (to 🟡), P0.5, P1.8, P1.10 (to 🟢). Other colours were left unchanged. Live preview, Vercel environment settings and Search Console property verification remain outside repository evidence.

## Evidence — 3 November 2026 (documentation accuracy sweep; `main` @ `1556e31`, no application-code changes)

Author lane: OMP (DeepSeek V4.1 Flash). Direct repository and GitHub Actions review. No access to Vercel settings, Neon data, Google Search Console, the Grok preview or a browser.

| Item | Status | Evidence |
| --- | --- | --- |
| Current `main` repository gate | **VERIFIED** | GitHub Actions run #319 completed successfully on `1556e31` (27 October 2026). Its log shows `[integration] backend: real PostgreSQL` and `[integration] PASS on real PostgreSQL (row locking exercised)`. |
| Displayed brand and public contact | **VERIFIED (code)** | `src/lib/locale.tsx` uses `Cô Hai Travel` for both locales; `src/components/shell.tsx` renders `cohaitravel@gmail.com` and `+614 5060 1626`, with the Saigon/Sydney footer note. |
| Canonical SEO, sitemap and robots | **VERIFIED (code)** | `src/lib/seo.ts` and `scripts/check-site-url.mjs` fix the production host to `https://cohaitravel.com`; `src/routes/sitemap[.]xml.ts` emits EN/VN URLs with `hreflang`; `src/routes/robots[.]txt.ts` disallows crawling when `VERCEL_ENV=preview` (PR #27). |
| Google Search Console verification file | **VERIFIED (repository file only)** | `public/google0fd2e62fb070df98.html` was committed in PR #28 and contains the expected static token. The file's presence does **not** prove the Search Console property was verified. |
| Google Search Console property verification | **UNVERIFIED** | No Search Console evidence or fresh Owner confirmation exists in this review. |
| Vercel Production `DATABASE_URL`, `BETTER_AUTH_*` and `GROK_AUTH_*` values | **UNVERIFIED** | This lane cannot read Vercel settings. The last Owner confirmation is the 5 October 2026 entry above. |
| Live Vercel/Grok preview visual parity | **UNVERIFIED** | No browser observation of the live preview was available. CI build and smoke are repository evidence only. |
| P1.10 booking hardening | **VERIFIED** | CI run #319 exercised the real PostgreSQL 16 path; the test is part of `test:domain` and fails in CI when `TEST_DATABASE_URL` is absent. |
| Migration planner test reference | **FAILED (repository defect)** | `package.json` lists `scripts/migration-plan.test.mjs`, but the file is not tracked. Node 22 exits 0 when that missing path is supplied alongside other test files, so the named planner test is skipped. This predates the branch; it is documented in `docs/REPO_PREVIEW_PARITY.md` and not changed here. |
| Documentation-only scope | **VERIFIED (diff)** | This branch changes documentation and configuration comments only; no application runtime, booking, auth, migration or UI code. |
| Internal documentation links | **VERIFIED (local check)** | A script checked every relative Markdown link in the tracked first-party docs against the tree; 0 broken links. The only missing backtick path is the intentionally documented absent `scripts/migration-plan.test.mjs`. |
| Standard gate on this docs branch | **VERIFIED (local execution)** | `npm ci`, `test:domain`, `typecheck`, `lint` (0 errors, 4 pre-existing warnings), `build` and `test:smoke` all exited 0. `test:domain` used PGlite because this machine has no `TEST_DATABASE_URL`; run #319 supplies the PostgreSQL 16 evidence for `main`. |

The earlier travel-notes handoff remains **HISTORICAL**: its Cloud-reported checks were superseded by later CI runs, and its production-preview PGlite concern has not been re-tested in a browser.

## Evidence — 5 October 2026 (booking identity path and OAuth status; documentation only, no code changed)

Author lane: Claude Chat, reading the uploaded review ZIP at `2035255`. No access to Vercel, Neon or the live site; Vercel statements below are Owner-confirmed.

| Item | Status | Evidence |
| --- | --- | --- |
| Booking creation is tied to the authenticated Better Auth `userId` and stored in Postgres | **VERIFIED (code)** | `createBooking` in `src/lib/bookings.ts` runs `authMiddleware` → `requireUserId` (session cookie, never a client-supplied id), then `placeBooking(tx, context.userId, …)` inserts `user_id` in one transaction. `listMyBookings` filters `where user_id = …`. With auth off and `DATABASE_URL` set, it rejects every request (fail closed). `.grok/app-env.json` does not disable auth. |
| OAuth credentials are not part of the booking transaction | **VERIFIED (code)** | `booking-core.ts`, `bookings.ts` and `auth/middleware.ts` contain no provider, broker or OAuth reference; they use only the session user id. Sign-in is a precondition: a booking needs a signed-in user. |
| `BETTER_AUTH_SECRET` and Neon `DATABASE_URL` set in Vercel; `BETTER_AUTH_URL`, `VITE_BETTER_AUTH_URL`, `VITE_SITE_URL` = `https://cohaitravel.vercel.app` | **Owner-confirmed** (not seen by Claude) | Owner statement 5 Oct. Code uses Neon only when `DATABASE_URL` is non-empty; otherwise it silently uses local PGlite, and nothing in the app reports which backend is active. Observable proof: a test booking appearing in the Neon `bookings` table. |
| Production Google/X sign-in | **Owner decision: deferred** | Site is not live for real customers. Credentials are not required now; `server.ts` / `client.ts` clean-up is planned later. Until it is done, no one can sign in on production, so no one can create a booking there. |

**Note added 3 November 2026:** the `VITE_SITE_URL` value in the table above is historical. PR #27 fixed production canonical links, Open Graph URLs, robots and sitemap output to `https://cohaitravel.com` in `src/lib/seo.ts`; `VITE_SITE_URL` is now a development-only override and is not required in Vercel Production. The Owner-confirmed statements about the other variables are preserved as written and were not re-checked.

## Evidence — 4 October 2026 (branch `fix/auth-signin-error-surface`, from `main` @ `33caefc`)

Author lane: Claude Chat, on an uploaded review ZIP in a sandbox (Node 22, `npm ci`). No access to GitHub, Vercel, Google, X or the auth broker (`auth.grok.me`).

| Item | Status | Evidence |
| --- | --- | --- |
| Login buttons called `signIn()` without catching a rejection (`src/routes/login.tsx`, `src/routes/$locale/login.tsx`), so a failed start showed nothing | **VERIFIED (code)** | Read from source; `signIn()` in `src/lib/auth/client.ts` throws on error. |
| Fix: both login pages now show a visible, localized (EN/VN) error and disable buttons while starting | **VERIFIED (static)** / **UNVERIFIED (browser)** | `typecheck` pass, `lint` 0 errors / 4 existing warnings, `test:domain` pass (4 new tests for the error helper), `vite build` pass. `test:smoke` not run. Not exercised in a browser. |
| `.env.example` listed unused `GOOGLE_*` / `TWITTER_*` variables | **Fixed in branch** | Replaced with the `GROK_AUTH_*` variables that `src/lib/auth/server.ts` actually reads. |
| `GROK_AUTH_ISSUER`, `GROK_AUTH_CLIENT_ID`, `GROK_AUTH_CLIENT_SECRET` set in Vercel Production | **UNVERIFIED** | Only `DATABASE_URL` (Neon) has been confirmed. If missing, the server falls back to the preview-only client (`src/lib/auth/preview.ts`), which the broker accepts only for `*.grok-sandbox.com`. |
| Google and X sign-in working on the live site | **UNVERIFIED** | Not reachable from the review environment. |
| X consent screen shows "Grok App Builder" | **Owner decision** | The name comes from the broker's registered X application, not from this repository (`label: "X"` is button text only). |

## Evidence — 2 October 2026 (`main` @ `828b88e`, PR #16 merge)

Run by Claude Chat on an uploaded review ZIP in a sandbox (Node 22, `npm ci`); no access to GitHub, Vercel or the live Neon database.

| Item | Status | Evidence |
| --- | --- | --- |
| `npm ci`, `test:domain` (29 tests), `typecheck`, `lint` (0 errors, 4 warnings), `build`, `test:smoke` | **VERIFIED** | Run in the sandbox; all exit 0. |
| Local folder vs `main` | **VERIFIED** | Differences are line-ending only, plus `create-project-zip.ps1` deleted locally and `create-project-zip-universal.ps1` untracked (handled in a separate branch). |
| Catalog data in Neon vs migrations | **VERIFIED** | Project Owner's JSON exports of `destinations`, `tours`, `stays`, `cars`, `tour_departures` (10/9/6/4/23 rows) compared field by field with a database built from `migrations/`: 0 differences. A deliberately altered copy was detected, so the comparison is sensitive. |
| Booking prices charged | **VERIFIED (code)** | The server prices bookings from database rows (stay = nightly rate × nights, car = daily rate × days, tour = departure price × guests). A booking-panel headline that showed unit price × default quantity (e.g. $210/night shown as $630) was a display issue, not a database one; fix is in a separate PR. |
| `booking-concurrency.integration.mjs` | **FAILED on `main`, fixed in a separate PR** | Not run by CI. Rewritten to call the real booking code on real PostgreSQL 16 it exposed two production defects: stay/car availability SQL errors (`date + unknown`), and a tour seat count that could over-book under contention. Fixes and the CI wiring are in a separate PR and are **UNVERIFIED in GitHub Actions until it runs there**. |
| P1.10 Booking tests | 🟡 until the PR above is merged and CI is green | |
| Live site after PRs #15 (canonical URL) and #16 (icons) | **UNVERIFIED** | Not reachable from the review environment; Project Owner to check view-source canonical, `/favicon.ico`, `/site.webmanifest`. |

**Owner decisions recorded 2 October 2026:** image rights — done; notifications — optional; five superseded September branches — delete; `create-project-zip-universal.ps1` — adopt, remove the old script.

## Current verified checkpoint — 11 September 2026

- GitHub Actions run #251 on commit `fbd44997d1120f95f6ba116b33cca71cfdc45b6e` passed `npm ci`, domain tests, typecheck, lint, build and production smoke — **VERIFIED**.
- The local Windows checkout pulled `main` successfully to `fbd44997d1120f95f6ba116b33cca71cfdc45b6e` and then started `npm run dev` successfully.
- The local runtime log shows the database bootstrap adopting existing catalog data instead of replaying the seed, then applying migrations `0004_inventory`, `0005_booking_status`, `0005_public_contact`, `0006_provenance`, `0007_fact_checked_destinations`, `0008_fact_checked_coastal_destinations`, `0009_fact_checked_source_backed_journeys` and `0010_repair_provenance_schema` successfully.
- The user confirmed the previously blocking `column t.provenance_state does not exist` failure is now resolved in the local application.
- The runtime incident was caused by migration/bootstrap behavior, not user database edits. No manual SQL or database deletion was required.
- The final local startup still emits the PostgreSQL `sslmode` deprecation/security warning; this is separate from the migration/schema failure and is not currently treated as the blocking runtime defect.
- The frozen legacy source audit produced 30 tables, 19 populated tables, 207 `wp_posts`, 22 media attachments, 48 taxonomy rows, 294 term relationships, 4 tour schedules, 47 currency rows and 76 domain-relevant published records. Raw customer booking records are not exported.
- The owner has clarified that the old WordPress project was a template-based project built more than 15 years ago around their own travel ideas, not a live customer-data system. Many destination, tour and travel-information subjects remain broadly relevant and should be treated as valuable source material rather than obsolete by default.
- Legacy media is a migration candidate: preserve/inspect/verify/optimize first, replace only when quality, licensing, factual relevance or visual needs justify replacement.

## Evidence rule for completion claims

A change is called **fixed** only after the relevant execution evidence exists. Code review or model confidence is insufficient. For an interactive defect, the evidence must include the relevant runtime/test result and, where the assistant cannot directly access the user's machine, the user's observed confirmation. Use `VERIFIED`, `UNVERIFIED`, or `FAILED` explicitly.

## Engineering execution rule

Use `docs/AI_ENGINEERING_WORKFLOW.md`. Inspect actual code/error first; choose the appropriate Main Engineer lane; make the smallest safe change; execute validation; inspect the actual result; produce a durable handoff; then stop once verified. Diagnose only until evidence is sufficient. Do not enter redundant diagnostic loops or present predicted behavior as a passing build, lint, test, deployment or integration result.

## Product boundaries

The legacy WordPress tree is source material, not runtime CMS. Historical customer PII, passwords, secrets, credentials and auth tokens never enter the rebuild. Old commercial values remain historical until revalidated.

## Ordered execution

### P1 — production foundation

Bilingual canonical routes and metadata are implemented. Operator visibility is available to an explicit allowlist via `COHAI_OPERATOR_USER_IDS`. Notification behavior is specified but intentionally not faked without a production provider.

### P2 — Legacy Product Archaeology & Modern Reconstruction

The archaeology and traceability foundation is complete, and the local runtime migration/bootstrap incident is now closed. Connected destination hubs, provenance controls, canonical publication planning, the first fact-checked destination/journey refresh, and an initial source-led travel-information surface are implemented. CI run #319 covers the repository build and smoke for the travel-notes route. The earlier production-preview PGlite concern and the live visual rendering remain **UNVERIFIED**: no browser check of the Vercel or Grok preview was available in this review. Next: continue source-backed canonical reconstruction, selectively verify stays/cars, reconcile departures, migrate useful legacy media, and implement verified legacy redirects. Every future fix must meet the explicit evidence rule above before being described as fixed.
