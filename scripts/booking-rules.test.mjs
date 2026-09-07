import assert from "node:assert/strict";
import { test } from "node:test";

function dateRangesOverlap(requestedStart, requestedNights, existingStart, existingNights) {
  const addDays = (date, days) => {
    const value = new Date(`${date}T00:00:00Z`);
    value.setUTCDate(value.getUTCDate() + days);
    return value.toISOString().slice(0, 10);
  };
  const requestedEnd = addDays(requestedStart, requestedNights);
  const existingEnd = addDays(existingStart, existingNights);
  return requestedStart < existingEnd && existingStart < requestedEnd;
}

function inventoryAvailable(inventoryCount, confirmedUnits, requestedUnits = 1) {
  return inventoryCount > 0 && requestedUnits > 0 && confirmedUnits + requestedUnits <= inventoryCount;
}

test("half-open stay ranges allow same-day checkout and check-in", () => {
  assert.equal(dateRangesOverlap("2026-09-10", 3, "2026-09-13", 2), false);
});

test("overlapping stay ranges are detected", () => {
  assert.equal(dateRangesOverlap("2026-09-10", 3, "2026-09-12", 2), true);
});

test("inventory accepts the final available unit", () => {
  assert.equal(inventoryAvailable(4, 3), true);
});

test("inventory rejects an over-capacity booking", () => {
  assert.equal(inventoryAvailable(4, 4), false);
});
