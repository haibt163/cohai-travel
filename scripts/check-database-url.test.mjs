import assert from "node:assert/strict";
import { test } from "node:test";
import { checkDatabaseUrl } from "./check-database-url.mjs";

const prod = (extra = {}) => ({ VERCEL_ENV: "production", ...extra });

test("non-production builds are never blocked", () => {
  assert.deepEqual(checkDatabaseUrl({}), { ok: true, skipped: true });
  assert.deepEqual(checkDatabaseUrl({ VERCEL_ENV: "preview" }), {
    ok: true,
    skipped: true,
  });
  assert.equal(checkDatabaseUrl({ VERCEL_ENV: "preview", DATABASE_URL: "not-a-url" }).ok, true);
});

test("production fails when DATABASE_URL is missing or blank", () => {
  for (const env of [prod(), prod({ DATABASE_URL: "" }), prod({ DATABASE_URL: "   " })]) {
    const result = checkDatabaseUrl(env);
    assert.equal(result.ok, false);
    assert.match(result.reason, /DATABASE_URL/);
  }
});

test("production rejects values that are not PostgreSQL connection strings", () => {
  for (const value of ["mysql://user:pass@host/db", "https://example.com", "user:pass@host/db"]) {
    const result = checkDatabaseUrl(prod({ DATABASE_URL: value }));
    assert.equal(result.ok, false, value);
    assert.match(result.reason, /postgres/i);
    assert.equal(result.reason.includes(value), false, "reason must not leak the value");
  }
});

test("production accepts PostgreSQL connection strings", () => {
  assert.deepEqual(checkDatabaseUrl(prod({ DATABASE_URL: "postgres://user:pass@host/db" })), {
    ok: true,
  });
  assert.deepEqual(checkDatabaseUrl(prod({ DATABASE_URL: "postgresql://user:pass@host/db" })), {
    ok: true,
  });
});
