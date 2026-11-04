import assert from "node:assert/strict";
import { test } from "node:test";
import { isMigrationFile, migrationName, pendingMigrations } from "./migration-plan.mjs";

test("accepts only migrations/<number>_<name>.sql paths", () => {
  for (const path of [
    "migrations/0001_auth.sql",
    "migrations/0012_add_thanh_hoa_destination_and_reassign_puluong.sql",
    "./migrations/0005_public_contact.sql",
    "/migrations/0010_repair_provenance_schema.sql",
  ]) {
    assert.equal(isMigrationFile(path), true, path);
  }

  for (const path of [
    "migrations/0001.sql",
    "migrations/auth/0001_auth.sql",
    "src/migrations/0001_auth.sql",
    "migrations/0001_auth.SQL",
    "migrations/0001_auth.sql.bak",
    "0001_auth.sql",
  ]) {
    assert.equal(isMigrationFile(path), false, path);
  }
});

test("extracts the migration name without the .sql suffix", () => {
  assert.equal(
    migrationName("migrations/0010_repair_provenance_schema.sql"),
    "0010_repair_provenance_schema",
  );
  assert.equal(migrationName("./migrations/0005_public_contact.sql"), "0005_public_contact");
  assert.equal(
    migrationName("migrations/0012_add_thanh_hoa_destination_and_reassign_puluong.sql"),
    "0012_add_thanh_hoa_destination_and_reassign_puluong",
  );
});

test("excludes already-applied migrations and ignores non-migration files", () => {
  const paths = [
    "migrations/0010_repair_provenance_schema.sql",
    "migrations/0003_seed.sql",
    "migrations/README.md",
    "migrations/auth/0001_auth.sql",
    "migrations/0002_catalog.sql",
  ];

  assert.deepEqual(
    pendingMigrations(paths, ["0003_seed", "0002_catalog"]).map(({ name }) => name),
    ["0010_repair_provenance_schema"],
  );
});

test("returns pending migrations in numeric order", () => {
  const paths = [
    "migrations/0011_fact_checked_modern_additions.sql",
    "migrations/0002_catalog.sql",
    "migrations/0010_repair_provenance_schema.sql",
    "migrations/0009_fact_checked_source_backed_journeys.sql",
    "migrations/0012_add_thanh_hoa_destination_and_reassign_puluong.sql",
  ];

  assert.deepEqual(
    pendingMigrations(paths, []).map(({ name }) => name),
    [
      "0002_catalog",
      "0009_fact_checked_source_backed_journeys",
      "0010_repair_provenance_schema",
      "0011_fact_checked_modern_additions",
      "0012_add_thanh_hoa_destination_and_reassign_puluong",
    ],
  );
});

test("sorts non-zero-padded migration numbers numerically", () => {
  const paths = ["migrations/10_ten.sql", "migrations/2_two.sql"];
  assert.deepEqual(
    pendingMigrations(paths, []).map(({ name }) => name),
    ["2_two", "10_ten"],
  );
});

test("returns an empty list when every migration is applied", () => {
  const paths = ["migrations/0001_auth.sql", "migrations/0002_catalog.sql"];
  assert.deepEqual(pendingMigrations(paths, ["0001_auth", "0002_catalog"]), []);
});
