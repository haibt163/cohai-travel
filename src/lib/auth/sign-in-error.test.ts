import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { describeSignInError } from "./sign-in-error.ts";

describe("describeSignInError", () => {
  it("returns the message of an Error", () => {
    assert.equal(describeSignInError(new Error("Provider not found")), "Provider not found");
  });
  it("accepts a plain string", () => {
    assert.equal(describeSignInError("Pop-up blocked"), "Pop-up blocked");
  });
  it("returns an empty string for unknown shapes", () => {
    assert.equal(describeSignInError(undefined), "");
    assert.equal(describeSignInError({ code: 1 }), "");
  });
  it("trims and caps very long messages", () => {
    assert.equal(describeSignInError(new Error("  x  ")), "x");
    assert.equal(describeSignInError(new Error("y".repeat(500))).length, 200);
  });
});
