# Booking test strategy

Last reviewed: 9 September 2026.

## Invariants

- Tour capacity must never be exceeded under concurrent booking attempts.
- Stay and car inventory must never be exceeded for overlapping confirmed date ranges.
- Same-day stay checkout/check-in uses half-open intervals.
- Cancelled bookings do not consume inventory.
- A booking must derive price and capacity from server-side catalog data, never from client-supplied totals.

## Current automated coverage

`npm run test:domain` includes:

- date-range overlap rules;
- finite-inventory admission rules;
- final-unit acceptance/rejection;
- pure concurrency admission invariants.

## Remaining integration coverage

The production booking functions in `src/lib/bookings.ts` still need database-backed integration tests covering:

1. two concurrent tour booking requests competing for the final seats;
2. two concurrent stay bookings competing for the final inventory unit(s);
3. two concurrent car bookings over the same date range;
4. cancellation freeing the previously consumed inventory;
5. PGLite and Neon result-shape parity for date, count and numeric values.

## Test principle

The pure tests prove domain arithmetic. They do not prove transaction locking. The final production gate therefore requires at least one DB-backed concurrency test against the same transaction code used by the application.
