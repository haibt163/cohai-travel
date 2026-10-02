# Booking test strategy

Last reviewed: 2 October 2026.

## Invariants

- Tour capacity must never be exceeded under concurrent booking attempts.
- Stay and car inventory must never be exceeded for overlapping confirmed date ranges.
- Same-day stay checkout/check-in uses half-open intervals.
- Cancelled bookings do not consume inventory.
- A booking derives price and capacity from server-side catalog data, never from client-supplied totals.

## Automated coverage

`npm run test:domain` now runs the existing date-range/finite-inventory suite plus pure concurrency-admission invariants. These tests intentionally require no database credentials.

## Database-backed integration coverage

`scripts/booking-concurrency.integration.mjs` runs the real production booking transaction (`placeBooking` in `src/lib/booking-core.ts`, used by `createBooking`) against the real schema and seed data built from `migrations/`. It is part of `npm run test:domain`.

- **CI:** runs against a disposable PostgreSQL 16 service (`TEST_DATABASE_URL`) with one connection per concurrent booking, so row locking is genuinely exercised. CI fails if `TEST_DATABASE_URL` is missing.
- **Locally without `TEST_DATABASE_URL`:** falls back to in-memory PGlite. PGlite runs one transaction at a time, so this checks booking logic and pricing only; it does **not** prove row locking.
- **Covered:** concurrent tour, stay and car requests competing for the last seats/units; same-day check-out/check-in turnover; cancellation freeing inventory; price derived from catalog data, ignoring any client-supplied total.
- **Verified that the test can fail:** with the `FOR UPDATE` locks removed it fails on real PostgreSQL (and still passes on PGlite, which is why CI uses PostgreSQL).

## Remaining coverage

- PGLite/Neon result-shape parity for dates, counts and numerics beyond the paths above.
- The `createBooking` server-function wrapper (auth middleware and input validation) is not exercised by this test.

## Completion rule

Pure arithmetic tests do not prove row locking. The booking hardening item closes when this test has passed on real PostgreSQL in GitHub Actions on the merged branch.
