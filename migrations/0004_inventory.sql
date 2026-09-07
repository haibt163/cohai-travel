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

alter table stays add constraint stays_inventory_unit_count_positive check (inventory_unit_count > 0);
alter table cars add constraint cars_inventory_unit_count_positive check (inventory_unit_count > 0);
alter table bookings add constraint bookings_inventory_units_positive check (inventory_units > 0);

create index if not exists bookings_inventory_lookup_idx
  on bookings (kind, item_id, status, start_date);
