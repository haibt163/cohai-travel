import postgres from "postgres";

/**
 * Thin Postgres client.
 * Preview: PGLite via DATABASE_URL injected by the host.
 * Standalone: Neon. Do not commit credentials.
 */
const connectionString = process.env.DATABASE_URL ?? "";

export const sql = postgres(connectionString || "postgresql://127.0.0.1:5432/cohai", {
  max: 4,
  ssl:
    !connectionString ||
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1") ||
    connectionString.includes("pglite")
      ? false
      : "prefer",
});
