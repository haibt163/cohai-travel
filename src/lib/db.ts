import { pendingMigrations } from "../../scripts/migration-plan.mjs";
import { localMigrations } from "./local-migrations";

/** Which database backend is active. */
export type DbSource = "neon" | "pglite";

const rawDatabaseUrl =
  typeof process !== "undefined" ? process.env.DATABASE_URL : undefined;
const databaseUrl =
  rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : undefined;

export const dbSource: DbSource = databaseUrl ? "neon" : "pglite";

export interface SqlTransaction {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]>;
}

export interface Sql extends SqlTransaction {
  transaction<T>(fn: (tx: SqlTransaction) => Promise<T>): Promise<T>;
}

const globalRef = globalThis as typeof globalThis & {
  __pgSqlPromise__?: Promise<Sql>;
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
  __pgliteMigrateChain__?: Promise<void>;
};

const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;
const REPAIR_MIGRATION = "0010_repair_provenance_schema.sql";

type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

function buildSql(
  run: Run,
  transaction: (fn: (tx: SqlTransaction) => Promise<unknown>) => Promise<unknown>,
): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  sql.transaction = async <T>(fn: (tx: SqlTransaction) => Promise<T>) =>
    (await transaction(fn)) as T;
  return sql;
}

function buildTx(run: Run): SqlTransaction {
  const tx = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as SqlTransaction;
  tx.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return tx;
}

function repairMigrationText(): string {
  const repair = localMigrations.find(({ name }) => name === REPAIR_MIGRATION);
  if (!repair) throw new Error(`[db] bundled repair migration ${REPAIR_MIGRATION} is missing`);
  return repair.text;
}

async function ensureNeonMigrations(pool: import("pg").Pool): Promise<void> {
  await pool.query(
    "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
  );

  const appliedRows = await pool.query<{ name: string }>(
    "select name from _migrations",
  );
  const applied = appliedRows.rows.map((row) => row.name);
  const paths = localMigrations.map(({ name }) => `migrations/${name}`);
  const pending = pendingMigrations(paths, applied);

  for (const { name, path } of pending) {
    const migration = localMigrations.find(({ name: candidate }) => `migrations/${candidate}` === path);
    if (!migration) throw new Error(`[db] missing bundled migration text for ${name}`);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(migration.text);
      await client.query("insert into _migrations (name) values ($1)", [name]);
      await client.query("COMMIT");
      console.log(`[db] applied ${name}`);
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Keep the original migration error.
      }
      throw err;
    } finally {
      client.release();
    }
  }

  const repairText = repairMigrationText();
  const destinationColumn = await pool.query<{ exists: boolean }>(
    `select exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'destinations'
         and column_name = 'provenance_state'
     ) as exists`,
  );
  const tourColumn = await pool.query<{ exists: boolean }>(
    `select exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'tours'
         and column_name = 'provenance_state'
     ) as exists`,
  );
  if (!destinationColumn.rows[0]?.exists || !tourColumn.rows[0]?.exists) {
    console.log(`[db] repairing stale catalog schema with ${REPAIR_MIGRATION}`);
    await pool.query(repairText);
    await pool.query(
      "insert into _migrations (name) values ($1) on conflict (name) do nothing",
      [REPAIR_MIGRATION.replace(/\.sql$/, "")],
    );
  }

  const verifiedDestination = await pool.query<{ exists: boolean }>(
    `select exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'destinations'
         and column_name = 'provenance_state'
     ) as exists`,
  );
  const verifiedTour = await pool.query<{ exists: boolean }>(
    `select exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'tours'
         and column_name = 'provenance_state'
     ) as exists`,
  );
  if (!verifiedDestination.rows[0]?.exists || !verifiedTour.rows[0]?.exists) {
    throw new Error("[db] catalog schema verification failed: provenance_state columns are missing");
  }
}

function createNeonSql(): Promise<Sql> {
  globalRef.__pgSqlPromise__ ??= (async () => {
    const { Pool, types } = await import("pg");
    types.setTypeParser(OID_INT8, Number);
    types.setTypeParser(OID_DATE, identity);
    types.setTypeParser(OID_INTERVAL, identity);
    const pool = new Pool({ connectionString: databaseUrl });
    await ensureNeonMigrations(pool);
    const run = async <T>(text: string, params: unknown[]) => {
      const res = await pool.query(text, params);
      return res.rows as T[];
    };
    return buildSql(run, async <T>(fn: (tx: SqlTransaction) => Promise<T>) => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const tx = buildTx(async <R>(text: string, params: unknown[]) => {
          const res = await client.query(text, params);
          return res.rows as R[];
        });
        const result = await fn(tx);
        await client.query("COMMIT");
        return result;
      } catch (err) {
        try {
          await client.query("ROLLBACK");
        } catch {
          // Keep the original domain/database error.
        }
        throw err;
      } finally {
        client.release();
      }
    });
  })().catch((err) => {
    globalRef.__pgSqlPromise__ = undefined;
    throw err;
  });
  return globalRef.__pgSqlPromise__;
}

async function createPgliteSql(): Promise<Sql> {
  globalRef.__pgliteInstance__ ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite({
      parsers: {
        [OID_INT8]: Number,
        [OID_DATE]: identity,
        [OID_INTERVAL]: identity,
      },
    });
    await pg.waitReady;
    await pg.exec(
      "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
    );
    return pg;
  })().catch((err) => {
    globalRef.__pgliteInstance__ = undefined;
    throw err;
  });
  const pg = await globalRef.__pgliteInstance__;

  const migrate = async (): Promise<void> => {
    const migrationMap = Object.fromEntries(
      localMigrations.map(({ name, text }) => [`migrations/${name}`, text]),
    );
    const paths = Object.keys(migrationMap);
    const doneRows = await pg.query<{ name: string }>("select name from _migrations");
    const done = doneRows.rows.map((r) => r.name);
    const pending = pendingMigrations(paths, done);
    if (pending.length) {
      console.log(
        `[db] applying ${pending.length} local migration(s): ${pending
          .map(({ name }) => name)
          .join(", ")}`,
      );
    }
    for (const { name, path } of pending) {
      const text = migrationMap[path];
      if (typeof text !== "string") {
        throw new Error(`[db] missing bundled migration text for ${name}`);
      }
      await pg.transaction(async (tx) => {
        await tx.exec(text);
        await tx.query("insert into _migrations (name) values ($1)", [name]);
      });
      console.log(`[db] applied ${name}`);
    }

    const destinationColumn = await pg.query<{ exists: boolean }>(
      `select exists (
         select 1
         from information_schema.columns
         where table_schema = 'public'
           and table_name = 'destinations'
           and column_name = 'provenance_state'
       ) as exists`,
    );
    const tourColumn = await pg.query<{ exists: boolean }>(
      `select exists (
         select 1
         from information_schema.columns
         where table_schema = 'public'
           and table_name = 'tours'
           and column_name = 'provenance_state'
       ) as exists`,
    );
    if (!destinationColumn.rows[0]?.exists || !tourColumn.rows[0]?.exists) {
      console.log(`[db] repairing stale local schema with ${REPAIR_MIGRATION}`);
      await pg.exec(repairMigrationText());
      await pg.query(
        "insert into _migrations (name) values ($1) on conflict (name) do nothing",
        [REPAIR_MIGRATION.replace(/\.sql$/, "")],
      );
    }

    const verifiedDestination = await pg.query<{ exists: boolean }>(
      `select exists (
         select 1
         from information_schema.columns
         where table_schema = 'public'
           and table_name = 'destinations'
           and column_name = 'provenance_state'
       ) as exists`,
    );
    const verifiedTour = await pg.query<{ exists: boolean }>(
      `select exists (
         select 1
         from information_schema.columns
         where table_schema = 'public'
           and table_name = 'tours'
           and column_name = 'provenance_state'
       ) as exists`,
    );
    if (!verifiedDestination.rows[0]?.exists || !verifiedTour.rows[0]?.exists) {
      throw new Error("[db] catalog schema verification failed: provenance_state columns are missing");
    }
  };
  const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve())
    .catch(() => undefined)
    .then(migrate);
  globalRef.__pgliteMigrateChain__ = pass;
  await pass;

  const run = async <T>(text: string, params: unknown[]) => {
    const result = await pg.query<T>(text, params);
    return result.rows;
  };
  return buildSql(run, async <T>(fn: (tx: SqlTransaction) => Promise<T>) => {
    return pg.transaction(async (client) => {
      const tx = buildTx(async <R>(text: string, params: unknown[]) => {
        const result = await client.query<R>(text, params);
        return result.rows;
      });
      return fn(tx);
    });
  });
}

let sqlPromise: Promise<Sql> | null = null;

async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") {
    throw new Error(
      "@/lib/db is server-only — call getSql() from a createServerFn handler " +
        "or a server route loader, never from client code.",
    );
  }
  return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}

export function getSql(): Promise<Sql> {
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null;
    throw err;
  });
  return sqlPromise;
}

export async function getPglite(): Promise<import("@electric-sql/pglite").PGlite> {
  if (dbSource !== "pglite") {
    throw new Error("getPglite() is only available on the PGLite fallback (no DATABASE_URL)");
  }
  await getSql();
  const pg = await globalRef.__pgliteInstance__;
  if (!pg) throw new Error("PGLite instance failed to initialize");
  return pg;
}

export function ensureDbReady(): Promise<void> {
  return getSql().then(() => undefined);
}

const globalBoot = globalThis as typeof globalThis & {
  __pgBootstrapPromise__?: Promise<void>;
};
if (typeof window === "undefined") {
  globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
    globalBoot.__pgBootstrapPromise__ = undefined;
    console.error("[db] database bootstrap failed:", err);
    throw err;
  });
}
