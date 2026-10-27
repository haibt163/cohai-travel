import assert from "node:assert/strict";
import { test } from "node:test";
import { checkSiteUrl } from "./check-site-url.mjs";

const prod = (extra = {}) => ({ VERCEL_ENV: "production", ...extra });

test("non-production builds are never blocked", () => {
  assert.equal(checkSiteUrl({}).ok, true);
  assert.equal(checkSiteUrl({ VERCEL_ENV: "preview" }).ok, true);
  assert.equal(checkSiteUrl({ VERCEL_ENV: "preview", VITE_SITE_URL: "http://localhost:3000" }).ok, true);
});

test("production uses the owner-confirmed canonical domain without requiring an environment variable", () => {
  assert.deepEqual(checkSiteUrl(prod()), { ok: true, siteUrl: "https://cohaitravel.com" });
  assert.deepEqual(checkSiteUrl(prod({ VITE_SITE_URL: "https://cohaitravel.vercel.app" })), {
    ok: true,
    siteUrl: "https://cohaitravel.com",
  });
});

test("production canonical domain is not affected by malformed or local environment values", () => {
  for (const value of ["   ", "http://localhost:3000", "http://127.0.0.1:8080", "example.com", "ftp://example.com"]) {
    assert.equal(checkSiteUrl(prod({ VITE_SITE_URL: value })).ok, true, value);
    assert.equal(checkSiteUrl(prod({ VITE_SITE_URL: value })).siteUrl, "https://cohaitravel.com", value);
  }
});
