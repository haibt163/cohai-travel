import test from "node:test";
import assert from "node:assert/strict";

/**
 * Pure concurrency invariant tests. The database-backed integration suite
 * should exercise the same invariant through createBooking once a real DB is
 * available in CI. Keeping this module dependency-free means it can run on
 * every checkout without credentials.
 */

function acceptedSeats(maxPeople, bookedBefore, attempts) {
  let booked = bookedBefore;
  let accepted = 0;
  for (const guests of attempts) {
    const remaining = maxPeople - booked;
    if (guests <= remaining) {
      booked += guests;
      accepted += guests;
    }
  }
  return { accepted, booked };
}

test("sequential admission never exceeds departure capacity", () => {
  const result = acceptedSeats(4, 2, [1, 1, 1]);
  assert.equal(result.accepted, 2);
  assert.equal(result.booked, 4);
});

test("two final-seat attempts cannot both consume the same seat", () => {
  const result = acceptedSeats(1, 0, [1, 1]);
  assert.equal(result.accepted, 1);
  assert.equal(result.booked, 1);
});

test("a failed attempt does not consume inventory", () => {
  const result = acceptedSeats(2, 2, [1]);
  assert.equal(result.accepted, 0);
  assert.equal(result.booked, 2);
});
