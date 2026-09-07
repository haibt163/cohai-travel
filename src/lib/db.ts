import postgres from "postgres";

/**
 * Thin Postgres client.
 * Preview: PGLite via DATABASE_URL injected by the host.
 * Deploy: Neon. Do not commit credentials.
 */
const connectionString = process.env.DATABASE_URL ?? "";

export const sql = postgres(connectionString, {
  max: 4,
  ssl: connectionString.includes("localhost") || connectionString.includes("pglite")
    ? false
    : "prefer",
});
