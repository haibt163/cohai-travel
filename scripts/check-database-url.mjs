#!/usr/bin/env node
/**
 * Production build guard for the application database.
 *
 * Production must use hosted PostgreSQL. Without a DATABASE_URL the app
 * silently falls back to the in-process PGlite database, which does not
 * persist across deployments. Non-production builds (CI, previews, local)
 * may keep using that fallback.
 *
 * The connection string is never printed: it contains credentials.
 */
import { pathToFileURL } from "node:url";

const POSTGRES_SCHEMES = ["postgres://", "postgresql://"];
const PRODUCTION_VARIABLE_LOCATION = "Vercel → Settings → Environment Variables → Production";

export function checkDatabaseUrl(env) {
  if (env.VERCEL_ENV !== "production") return { ok: true, skipped: true };

  const value = typeof env.DATABASE_URL === "string" ? env.DATABASE_URL.trim() : "";
  if (!value) {
    return {
      ok: false,
      reason: `DATABASE_URL is required for production builds; set it in ${PRODUCTION_VARIABLE_LOCATION}`,
    };
  }
  if (!POSTGRES_SCHEMES.some((scheme) => value.startsWith(scheme))) {
    return {
      ok: false,
      reason: `DATABASE_URL must be a PostgreSQL connection string starting with postgres:// or postgresql://; check it in ${PRODUCTION_VARIABLE_LOCATION}`,
    };
  }
  return { ok: true };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkDatabaseUrl(process.env);
  if (!result.ok) {
    console.error("[database-url] " + result.reason + ".");
    process.exit(1);
  }
  if (!result.skipped) console.log("[database-url] production database URL ok");
}
