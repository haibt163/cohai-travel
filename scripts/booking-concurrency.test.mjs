import test from "node:test";
import assert from "node:assert/strict";

function admitSequentially(maxPeople, bookedBefore, attempts) {
  let booked = bookedBefore;
  let accepted = 0;
  for (const guests of attempts) {
    if (guests <= maxPeople - booked) {
      booked += guests;
      accepted += guests;
    }
  }
  return { accepted, booked };
}

test("capacity cannot be exceeded", () => {
  assert.deepEqual(admitSequentially(4, 2, [1, 1, 1]), { accepted: 2, booked: 4 });
});

test("only one final-seat attempt succeeds", () => {
  assert.deepEqual(admitSequentially(1, 0, [1, 1]), { accepted: 1, booked: 1 });
});

test("failed admission leaves inventory unchanged", () => {
  assert.deepEqual(admitSequentially(2, 2, [1]), { accepted: 0, booked: 2 });
});

// Model the database-lock invariant explicitly: once one transaction commits,
// every later transaction observes the new booked count before admission.
test("serialized transactions observe prior committed seats", () => {
  const result = admitSequentially(3, 0, [2, 2]);
  assert.equal(result.accepted, 2);
  assert.equal(result.booked, 2);
  assert.equal(result.booked <= 3, true);
});
