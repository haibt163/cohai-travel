import type { SqlTransaction } from "./db.ts";
import { inventoryAvailable } from "./booking-rules.ts";
import { num } from "./utils.ts";

export type BookingRequest = {
  kind: "tour" | "stay" | "car";
  itemId: string;
  departureId?: string;
  startDate: string;
  guests: number;
  nights: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
};

/**
 * The booking transaction body used by `createBooking`: locks the catalog row,
 * checks capacity/inventory, prices the booking from server-side catalog data
 * and inserts it. Kept free of framework imports so it can be exercised
 * directly by `scripts/booking-concurrency.integration.mjs`.
 *
 * Must be called inside a database transaction (`sql.transaction`).
 */
export async function placeBooking(
  tx: SqlTransaction,
  userId: string,
  data: BookingRequest,
): Promise<{ id: string; total: number }> {
  let total = 0;
  let startDate = data.startDate;
  const inventoryUnits = 1;

  if (data.kind === "tour") {
    if (!data.departureId) throw new Error("Choose a departure");
    // Lock the departure row first, then count seats in a separate statement:
    // a count inside the locking statement uses the snapshot taken before the
    // lock wait and would not see a booking committed by the lock holder.
    const deps = await tx<{
      id: string;
      start_date: string;
      price: string | number;
      max_people: number;
    }>`
      select td.id, td.start_date, td.price, td.max_people
      from tour_departures td
      where td.id = ${data.departureId} and td.tour_id = ${data.itemId}
      for update
    `;
    const dep = deps[0];
    if (!dep) throw new Error("Departure not found");
    const seatRows = await tx<{ booked: number }>`
      select coalesce(sum(guests), 0)::int as booked
      from bookings
      where departure_id = ${dep.id} and status = 'confirmed'
    `;
    const left = dep.max_people - num(seatRows[0]?.booked ?? 0);
    if (data.guests > left) throw new Error("Not enough seats on that departure");
    total = num(dep.price) * data.guests;
    startDate = dep.start_date;
  } else if (data.kind === "stay") {
    const stays = await tx<{
      price_per_night: string | number;
      inventory_unit_count: number;
    }>`
      select price_per_night, inventory_unit_count
      from stays
      where id = ${data.itemId}
      for update
    `;
    const stay = stays[0];
    if (!stay) throw new Error("Stay not found");
    const conflicts = await tx<{ booked_units: number }>`
      select coalesce(sum(inventory_units), 0)::int as booked_units
      from bookings
      where kind = 'stay'
        and item_id = ${data.itemId}
        and status = 'confirmed'
        and start_date < (${startDate}::date + ${data.nights}::int)
        and (start_date + nights) > ${startDate}::date
    `;
    const bookedUnits = num(conflicts[0]?.booked_units ?? 0);
    if (!inventoryAvailable(stay.inventory_unit_count, bookedUnits, inventoryUnits)) {
      throw new Error("Not enough rooms for those dates");
    }
    total = num(stay.price_per_night) * data.nights;
  } else {
    const cars = await tx<{ price_per_day: string | number; inventory_unit_count: number }>`
      select price_per_day, inventory_unit_count
      from cars
      where id = ${data.itemId}
      for update
    `;
    const car = cars[0];
    if (!car) throw new Error("Car not found");
    const conflicts = await tx<{ booked_units: number }>`
      select coalesce(sum(inventory_units), 0)::int as booked_units
      from bookings
      where kind = 'car'
        and item_id = ${data.itemId}
        and status = 'confirmed'
        and start_date < (${startDate}::date + ${data.nights}::int)
        and (start_date + nights) > ${startDate}::date
    `;
    if (!inventoryAvailable(car.inventory_unit_count, num(conflicts[0]?.booked_units ?? 0), inventoryUnits)) {
      throw new Error("Car is unavailable for those dates");
    }
    total = num(car.price_per_day) * data.nights;
  }

  const id = crypto.randomUUID();
  await tx`
    insert into bookings (
      id, user_id, kind, item_id, departure_id, start_date, guests, nights, inventory_units,
      first_name, last_name, email, phone, notes, total_price, status
    ) values (
      ${id}, ${userId}, ${data.kind}, ${data.itemId}, ${data.departureId ?? null},
      ${startDate}, ${data.guests}, ${data.nights}, ${inventoryUnits}, ${data.firstName}, ${data.lastName},
      ${data.email}, ${data.phone ?? null}, ${data.notes ?? null}, ${total}, 'confirmed'
    )
  `;
  return { id, total };
}
