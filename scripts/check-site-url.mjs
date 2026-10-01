#!/usr/bin/env node
/**
 * Production build guard for the public site URL.
 *
 * VITE_* values are inlined at build time, so a missing or localhost
 * VITE_SITE_URL on a Vercel production build ships wrong (or no) canonical,
 * og:url, hreflang and sitemap addresses. Fail that build loudly.
 * Non-production builds (CI, previews, local) are never blocked.
 */
import { pathToFileURL } from "node:url";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);

export function checkSiteUrl(env) {
  if (env.VERCEL_ENV !== "production") return { ok: true, skipped: true };
  const value = env.VITE_SITE_URL?.trim();
  if (!value) return { ok: false, reason: "VITE_SITE_URL is not set" };
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, reason: `VITE_SITE_URL is not a valid URL: ${value}` };
  }
  if (parsed.protocol !== "https:") {
    return { ok: false, reason: `VITE_SITE_URL must use https:// (got ${value})` };
  }
  if (LOCAL_HOSTNAMES.has(parsed.hostname)) {
    return { ok: false, reason: `VITE_SITE_URL points at a local address: ${value}` };
  }
  return { ok: true };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkSiteUrl(process.env);
  if (!result.ok) {
    console.error(
      `[site-url] ${result.reason}.\n` +
        "Set VITE_SITE_URL to the public production URL (for example https://your-domain) " +
        "in Vercel -> Settings -> Environment Variables (Production), then redeploy.",
    );
    process.exit(1);
  }
  if (!result.skipped) console.log(`[site-url] VITE_SITE_URL ok: ${process.env.VITE_SITE_URL.trim()}`);
}
