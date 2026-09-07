create table if not exists destinations (
  id text primary key,
  slug text not null unique,
  country text not null,
  title_en text not null,
  title_vn text not null,
  excerpt_en text not null,
  excerpt_vn text not null,
  body_en text not null,
  body_vn text not null,
  image text not null,
  languages text,
  currency text
);

create table if not exists tours (
  id text primary key,
  slug text not null unique,
  destination_id text not null references destinations(id),
  chapter text not null,
  duration_days integer not null,
  title_en text not null,
  title_vn text not null,
  excerpt_en text not null,
  excerpt_vn text not null,
  body_en text not null,
  body_vn text not null,
  image text not null,
  featured boolean not null default false
);

create table if not exists tour_departures (
  id text primary key,
  tour_id text not null references tours(id),
  start_date date not null,
  price numeric(10, 2) not null,
  max_people integer not null
);

create index if not exists tour_departures_tour_idx on tour_departures (tour_id, start_date);

create table if not exists stays (
  id text primary key,
  slug text not null unique,
  destination_id text not null references destinations(id),
  star_count integer not null default 4,
  price_per_night numeric(10, 2) not null,
  title_en text not null,
  title_vn text not null,
  excerpt_en text not null,
  excerpt_vn text not null,
  body_en text not null,
  body_vn text not null,
  image text not null
);

create table if not exists cars (
  id text primary key,
  slug text not null unique,
  pickup_id text not null references destinations(id),
  seats integer not null,
  transmission text not null,
  price_per_day numeric(10, 2) not null,
  title_en text not null,
  title_vn text not null,
  excerpt_en text not null,
  excerpt_vn text not null,
  image text not null
);

create table if not exists bookings (
  id text primary key,
  user_id text not null,
  kind text not null,
  item_id text not null,
  departure_id text,
  start_date date not null,
  guests integer not null default 1,
  nights integer not null default 1,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  notes text,
  total_price numeric(10, 2) not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_idx on bookings (user_id, created_at desc);
create index if not exists bookings_departure_idx on bookings (departure_id);

create table if not exists contact_messages (
  id text primary key,
  user_id text not null,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
