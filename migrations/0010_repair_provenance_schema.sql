-- P2 #15: repair a stale local schema whose migration ledger may claim
-- provenance was applied even though the columns are absent. This migration is
-- intentionally idempotent and safe on fresh or already-correct databases.

alter table destinations
  add column if not exists source_ref text,
  add column if not exists provenance_state text not null default 'synthetic-pending';

alter table tours
  add column if not exists source_ref text,
  add column if not exists provenance_state text not null default 'synthetic-pending';

create index if not exists destinations_provenance_idx
  on destinations (provenance_state, source_ref);

create index if not exists tours_provenance_idx
  on tours (provenance_state, source_ref);

update destinations set source_ref = 'wp_posts:206', provenance_state = 'source-backed' where id = 'hanoi';
update destinations set source_ref = 'wp_posts:579,580,707', provenance_state = 'source-backed' where id = 'halong';
update destinations set source_ref = 'wp_posts:223,719', provenance_state = 'source-backed' where id = 'hoian';
update destinations set source_ref = 'wp_posts:718', provenance_state = 'source-backed' where id = 'hue';
update destinations set source_ref = 'wp_posts:581,570', provenance_state = 'source-backed' where id = 'sapa';
update destinations set source_ref = 'wp_posts:221', provenance_state = 'source-backed' where id = 'mekong';
update destinations set source_ref = 'wp_posts:702', provenance_state = 'source-backed' where id = 'phuquoc';
update destinations set source_ref = 'wp_posts:700', provenance_state = 'source-backed' where id = 'nhatrang';
update destinations set provenance_state = 'modern-addition' where id in ('siemreap', 'bangkok');

update tours set source_ref = 'wp_posts:707', provenance_state = 'source-backed' where id = 'junk-halong';
update tours set source_ref = 'wp_posts:718,719', provenance_state = 'source-backed' where id = 'hue-hoian';
update tours set source_ref = 'wp_posts:713', provenance_state = 'source-backed' where id = 'hanoi-heritage';
update tours set source_ref = 'wp_posts:570', provenance_state = 'source-backed' where id = 'sapa-terraces';
update tours set source_ref = 'wp_posts:221', provenance_state = 'source-backed' where id = 'mekong-slow';
update tours set source_ref = 'wp_posts:702', provenance_state = 'source-backed' where id = 'phuquoc-drift';
update tours set source_ref = 'wp_posts:700,701,703,704,705,706,708,709,710,711,712,714', provenance_state = 'source-backed' where id = 'central-coast';
update tours set provenance_state = 'modern-addition' where id in ('angkor-dawn', 'puluong');
