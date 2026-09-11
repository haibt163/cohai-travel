import migration0001 from "../../migrations/0001_auth.sql?raw";
import migration0002 from "../../migrations/0002_catalog.sql?raw";
import migration0003 from "../../migrations/0003_seed.sql?raw";
import migration0004 from "../../migrations/0004_inventory.sql?raw";
import migration0005BookingStatus from "../../migrations/0005_booking_status.sql?raw";
import migration0005PublicContact from "../../migrations/0005_public_contact.sql?raw";
import migration0006 from "../../migrations/0006_provenance.sql?raw";
import migration0007 from "../../migrations/0007_fact_checked_destinations.sql?raw";
import migration0008 from "../../migrations/0008_fact_checked_coastal_destinations.sql?raw";
import migration0009 from "../../migrations/0009_fact_checked_source_backed_journeys.sql?raw";
import migration0010 from "../../migrations/0010_repair_provenance_schema.sql?raw";

/**
 * SQL is bundled explicitly instead of discovered with import.meta.glob().
 * Vite's SSR module graph does not reliably expose relative SQL globs during
 * the dev-server bootstrap, so explicit raw imports make the local schema
 * deterministic in dev, preview and production bundles.
 */
export const localMigrations = [
  { name: "0001_auth.sql", text: migration0001 },
  { name: "0002_catalog.sql", text: migration0002 },
  { name: "0003_seed.sql", text: migration0003 },
  { name: "0004_inventory.sql", text: migration0004 },
  { name: "0005_booking_status.sql", text: migration0005BookingStatus },
  { name: "0005_public_contact.sql", text: migration0005PublicContact },
  { name: "0006_provenance.sql", text: migration0006 },
  { name: "0007_fact_checked_destinations.sql", text: migration0007 },
  { name: "0008_fact_checked_coastal_destinations.sql", text: migration0008 },
  { name: "0009_fact_checked_source_backed_journeys.sql", text: migration0009 },
  { name: "0010_repair_provenance_schema.sql", text: migration0010 },
] as const;
