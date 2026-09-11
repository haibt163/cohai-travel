import { createServerFn } from "@tanstack/react-start";
import { getSessionUser } from "@/lib/auth/verify.server";
import { getSql } from "@/lib/db";
import { num } from "@/lib/utils";

export type OperatorSnapshot = {
  counts: { bookings: number; inquiries: number; confirmed: number };
  provenance: {
    destinations: number;
    sourceBackedDestinations: number;
    modernAdditionDestinations: number;
    tours: number;
    sourceBackedTours: number;
    modernAdditionTours: number;
    syntheticPendingDestinations: number;
    syntheticPendingTours: number;
  };
  bookings: Array<{ id: string; customer: string; email: string; kind: string; item: string; startDate: string; totalPrice: number; status: string }>;
  inquiries: Array<{ id: string; name: string; email: string; message: string; received: string }>;
};

function operatorIds(): Set<string> {
  return new Set((process.env.COHAI_OPERATOR_USER_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean));
}

export const getOperatorSnapshot = createServerFn({ method: "GET" }).handler(async (): Promise<OperatorSnapshot | null> => {
  const user = await getSessionUser();
  if (!user || !operatorIds().has(user.id)) return null;
  const sql = await getSql();
  const bookings = await sql<{ id: string; customer: string; email: string; kind: string; item: string; startDate: string; totalPrice: string | number; status: string }>
    `select b.id, trim(concat(b.first_name, ' ', b.last_name)) as customer, b.email, b.kind,
      coalesce(t.title_en, s.title_en, c.title_en, d.title_en, b.item_id) as item,
      b.start_date as "startDate", b.total_price as "totalPrice", b.status
     from bookings b
     left join tours t on b.kind = 'tour' and b.item_id = t.id
     left join stays s on b.kind = 'stay' and b.item_id = s.id
     left join cars c on b.kind = 'car' and b.item_id = c.id
     left join destinations d on b.kind = 'place' and b.item_id = d.id
     order by b.created_at desc limit 50`;
  const inquiries = await sql<{ id: string; name: string; email: string; message: string; received: string }>
    `select id, name, email, message, created_at as received from contact_messages order by created_at desc limit 50`;
  const countRows = await sql<{ bookings: number | string; inquiries: number | string; confirmed: number | string }>
    `select (select count(*) from bookings)::int as bookings,
            (select count(*) from contact_messages)::int as inquiries,
            (select count(*) from bookings where status = 'confirmed')::int as confirmed`;
  const provenanceRows = await sql<{
    destinations: number | string;
    source_backed_destinations: number | string;
    modern_addition_destinations: number | string;
    synthetic_pending_destinations: number | string;
    tours: number | string;
    source_backed_tours: number | string;
    modern_addition_tours: number | string;
    synthetic_pending_tours: number | string;
  }>`
    `select
       (select count(*) from destinations)::int as destinations,
       (select count(*) from destinations where provenance_state = 'source-backed')::int as source_backed_destinations,
       (select count(*) from destinations where provenance_state = 'modern-addition')::int as modern_addition_destinations,
       (select count(*) from destinations where provenance_state = 'synthetic-pending')::int as synthetic_pending_destinations,
       (select count(*) from tours)::int as tours,
       (select count(*) from tours where provenance_state = 'source-backed')::int as source_backed_tours,
       (select count(*) from tours where provenance_state = 'modern-addition')::int as modern_addition_tours,
       (select count(*) from tours where provenance_state = 'synthetic-pending')::int as synthetic_pending_tours`;
  const counts = countRows[0] ?? { bookings: 0, inquiries: 0, confirmed: 0 };
  const provenance = provenanceRows[0] ?? {
    destinations: 0,
    source_backed_destinations: 0,
    modern_addition_destinations: 0,
    synthetic_pending_destinations: 0,
    tours: 0,
    source_backed_tours: 0,
    modern_addition_tours: 0,
    synthetic_pending_tours: 0,
  };
  return {
    counts: { bookings: num(counts.bookings), inquiries: num(counts.inquiries), confirmed: num(counts.confirmed) },
    provenance: {
      destinations: num(provenance.destinations),
      sourceBackedDestinations: num(provenance.source_backed_destinations),
      modernAdditionDestinations: num(provenance.modern_addition_destinations),
      tours: num(provenance.tours),
      sourceBackedTours: num(provenance.source_backed_tours),
      modernAdditionTours: num(provenance.modern_addition_tours),
      syntheticPendingDestinations: num(provenance.synthetic_pending_destinations),
      syntheticPendingTours: num(provenance.synthetic_pending_tours),
    },
    bookings: bookings.map((b) => ({ ...b, totalPrice: num(b.totalPrice) })),
    inquiries,
  };
});
