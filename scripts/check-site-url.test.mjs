import assert from "node:assert/strict";
import { test } from "node:test";
import { checkSiteUrl } from "./check-site-url.mjs";

const prod = (extra = {}) => ({ VERCEL_ENV: "production", ...extra });

test("non-production builds are never blocked", () => {
  assert.equal(checkSiteUrl({}).ok, true);
  assert.equal(checkSiteUrl({ VERCEL_ENV: "preview" }).ok, true);
  assert.equal(checkSiteUrl({ VERCEL_ENV: "preview", VITE_SITE_URL: "http://localhost:3000" }).ok, true);
});

test("production build fails when VITE_SITE_URL is missing or blank", () => {
  assert.equal(checkSiteUrl(prod()).ok, false);
  assert.equal(checkSiteUrl(prod({ VITE_SITE_URL: "   " })).ok, false);
});

test("production build fails on localhost, malformed, or non-http values", () => {
  for (const bad of ["http://example.com", "http://localhost:3000", "http://127.0.0.1:8080", "https://0.0.0.0", "example.com", "ftp://example.com"]) {
    assert.equal(checkSiteUrl(prod({ VITE_SITE_URL: bad })).ok, false, bad);
  }
});

test("production build passes with a real https URL", () => {
  assert.equal(checkSiteUrl(prod({ VITE_SITE_URL: "https://www.example.com" })).ok, true);
});
