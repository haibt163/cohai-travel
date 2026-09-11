-- Booking state is intentionally small until a payment/hold workflow exists.
-- `confirmed` means the inventory is immediately committed.
-- `cancelled` releases inventory because availability queries count confirmed rows only.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'bookings_status_check'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_status_check
      CHECK (status in ('confirmed', 'cancelled'));
  END IF;
END $$;
