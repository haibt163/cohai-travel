-- P0 #4: model finite inventory for stays and cars.
-- A stay inventory unit is one concurrently bookable room/villa.
-- A car inventory unit is one concurrently bookable vehicle for that listing.
-- Existing bookings consume one unit by default.

alter table stays add column if not exists inventory_unit_count integer not null default 1;
alter table cars add column if not exists inventory_unit_count integer not null default 1;
alter table bookings add column if not exists inventory_units integer not null default 1;

-- These room counts are explicitly stated by the seeded stay descriptions.
update stays set inventory_unit_count = 12 where id = 'maison-hanoi';
update stays set inventory_unit_count = 6 where id = 'junk-suite';
update stays set inventory_unit_count = 4 where id = 'hoian-river';
update stays set inventory_unit_count = 8 where id = 'sapa-lodge';
update stays set inventory_unit_count = 4 where id = 'phuquoc-villa';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stays_inventory_unit_count_positive'
  ) THEN
    ALTER TABLE stays ADD CONSTRAINT stays_inventory_unit_count_positive
      CHECK (inventory_unit_count > 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'cars_inventory_unit_count_positive'
  ) THEN
    ALTER TABLE cars ADD CONSTRAINT cars_inventory_unit_count_positive
      CHECK (inventory_unit_count > 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'bookings_inventory_units_positive'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_inventory_units_positive
      CHECK (inventory_units > 0);
  END IF;
END $$;

create index if not exists bookings_inventory_lookup_idx
  on bookings (kind, item_id, status, start_date);
