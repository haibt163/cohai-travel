# Booking test strategy

Last reviewed: 9 September 2026.

## Invariants

- Tour capacity must never be exceeded under concurrent booking attempts.
- Stay and car inventory must never be exceeded for overlapping confirmed date ranges.
- Same-day stay checkout/check-in uses half-open intervals.
- Cancelled bookings do not consume inventory.
- A booking derives price and capacity from server-side catalog data, never from client-supplied totals.

## Automated coverage

`npm run test:domain` includes the existing date-range/finite-inventory tests plus pure concurrency-admission invariants. The pure tests deliberately require no database or credentials so every clean checkout can run them.

## Remaining integration coverage

The production booking functions still need database-backed integration tests for:

1. two concurrent tour requests competing for the final seats;
2. two concurrent stay requests competing for the final inventory unit(s);
3. two concurrent car requests over the same date range;
4. cancellation freeing the previously consumed inventory;
5. PGLite/Neon result-shape parity for date, count and numeric values.

## Completion rule

Pure arithmetic tests do not prove transaction locking. The booking hardening item closes only after at least one DB-backed concurrency test exercises the same transaction code used by production.
