-- Domain integrity constraints for catalog and bookings.
-- Added after the initial migration set so existing databases upgrade safely.
alter table tours add constraint tours_chapter_check check (chapter in ('nature', 'beach', 'unesco'));
alter table tours add constraint tours_duration_positive check (duration_days > 0);
alter table tour_departures add constraint tour_departures_price_nonnegative check (price >= 0);
alter table tour_departures add constraint tour_departures_capacity_positive check (max_people > 0);
alter table stays add constraint stays_star_count_check check (star_count between 1 and 5);
alter table stays add constraint stays_price_nonnegative check (price_per_night >= 0);
alter table cars add constraint cars_seats_positive check (seats > 0);
alter table cars add constraint cars_price_nonnegative check (price_per_day >= 0);
alter table bookings add constraint bookings_kind_check check (kind in ('tour', 'stay', 'car'));
alter table bookings add constraint bookings_guests_positive check (guests > 0);
alter table bookings add constraint bookings_nights_positive check (nights > 0);
alter table bookings add constraint bookings_total_nonnegative check (total_price >= 0);
