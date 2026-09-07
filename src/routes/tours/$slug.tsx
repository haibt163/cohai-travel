import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTour } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { BookingForm } from "@/components/booking-form";
import { Cover } from "@/components/cover";

export const Route = createFileRoute("/tours/$slug")({
  loader: async ({ params }) => {
    const data = await getTour({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  component: TourDetail,
});

function TourDetail() {
  const { tour, departures } = Route.useLoaderData();
  const { locale, t } = useI18n();

  return (
    <article>
      <div className="relative h-cover min-h-72 overflow-hidden">
        <Cover src={tour.image} alt={field(tour, locale, "title")} priority />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-8 text-paper">
          <p className="text-xs uppercase tracking-caps">
            <Link to="/destinations/$slug" params={{ slug: tour.dest_slug }} className="underline-offset-4 hover:underline">
              {field(tour, locale, "dest_title")}
            </Link>{" "}
            · {tour.duration_days} {t("days")}
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{field(tour, locale, "title")}</h1>
          {tour.from_price > 0 ? (
            <p className="mt-2 tabular-nums">
              {t("from")} {aud(tour.from_price)} {t("perPerson")}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="text-lg text-muted">{field(tour, locale, "excerpt")}</p>
          <div className="mt-6 space-y-4 whitespace-pre-line text-ink">{field(tour, locale, "body")}</div>
        </div>
        <div className="lg:col-span-2">
          <BookingForm kind="tour" itemId={tour.id} departures={departures} />
        </div>
      </div>
    </article>
  );
}
