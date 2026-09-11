import assert from "node:assert/strict";
import { test } from "node:test";
import { dateRangesOverlap, inventoryAvailable } from "./booking-rules.ts";

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

test("inventory accepts multiple units when capacity remains", () => {
  assert.equal(inventoryAvailable(5, 2, 3), true);
});

test("inventory rejects multiple units when capacity would be exceeded", () => {
  assert.equal(inventoryAvailable(5, 3, 3), false);
});
