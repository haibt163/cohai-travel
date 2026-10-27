#!/usr/bin/env node
/**
 * Production build guard for the public site URL.
 *
 * SEO metadata, canonical links, robots.txt and sitemap.xml use the
 * owner-confirmed canonical domain below; they do not depend on a stale
 * Vercel project alias or an optional VITE_SITE_URL setting.
 * Non-production builds (CI, previews, local) are never blocked.
 */
import { pathToFileURL } from "node:url";

const CANONICAL_SITE_URL = "https://cohaitravel.com";

export function checkSiteUrl(env) {
  if (env.VERCEL_ENV !== "production") return { ok: true, skipped: true };

  let parsed;
  try {
    parsed = new URL(CANONICAL_SITE_URL);
  } catch {
    return { ok: false, reason: "The canonical production URL is malformed" };
  }
  if (parsed.protocol !== "https:" || !parsed.hostname) {
    return { ok: false, reason: "The canonical production URL must use HTTPS and a public hostname" };
  }
  return { ok: true, siteUrl: CANONICAL_SITE_URL };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkSiteUrl(process.env);
  if (!result.ok) {
    console.error("[site-url] " + result.reason + ".");
    process.exit(1);
  }
  if (!result.skipped) console.log("[site-url] canonical production URL ok: " + result.siteUrl);
}
