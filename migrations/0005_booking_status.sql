-- Booking state is intentionally small until a payment/hold workflow exists.
-- `confirmed` means the inventory is immediately committed.
-- `cancelled` releases inventory because availability queries count confirmed rows only.
alter table bookings
  add constraint bookings_status_check
  check (status in ('confirmed', 'cancelled'));
