/**
 * Apply ordered SQL files in /migrations against DATABASE_URL.
 * Usage: DATABASE_URL=... npm run db:migrate
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is required. Copy .env.example to .env first.");
  process.exit(1);
}

const files = readdirSync(join(root, "migrations"))
  .filter((f) => f.endsWith(".sql"))
  .sort();

const sql = postgres(url, {
  max: 1,
  ssl: url.includes("localhost") ? false : "prefer",
});

await sql`
  create table if not exists _migrations (
    id text primary key,
    applied_at timestamptz not null default now()
  )
`;

for (const file of files) {
  const [done] = await sql`select id from _migrations where id = ${file}`;
  if (done) {
    console.log(`skip  ${file}`);
    continue;
  }
  const body = readFileSync(join(root, "migrations", file), "utf8");
  await sql.unsafe(body);
  await sql`insert into _migrations (id) values (${file})`;
  console.log(`apply ${file}`);
}

await sql.end();
console.log("migrations up to date");
