import { ArrowUpRight, CarFront, Hotel, MapPinned } from "lucide-react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDestination, toursForDestination } from "@/lib/catalog";
import { carsForDestination, staysForDestination } from "@/lib/destination-products";
import { field, useI18n } from "@/lib/locale";
import { seoHead } from "@/lib/seo";
import { Cover } from "@/components/cover";
import { TourCard } from "@/components/tour-card";

export const Route = createFileRoute("/$locale/destinations/$slug")({
  loader: async ({ params }) => {
    const destination = await getDestination({ data: params.slug });
    if (!destination) throw notFound();
    const [tours, stays, cars] = await Promise.all([
      toursForDestination({ data: destination.id }),
      staysForDestination({ data: destination.id }),
      carsForDestination({ data: destination.id }),
    ]);
    return { destination, tours, stays, cars };
  },
  head: ({ loaderData, params }) => loaderData ? seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: `${params.locale === "vn" ? loaderData.destination.title_vn : loaderData.destination.title_en} | CoHai Travel`, description: params.locale === "vn" ? loaderData.destination.excerpt_vn : loaderData.destination.excerpt_en, pathname: `/${params.locale}/destinations/${loaderData.destination.slug}`, alternatePathname: (l) => `/${l}/destinations/${loaderData.destination.slug}`, image: loaderData.destination.image }) : {},
  component: DestinationDetail,
});

function DestinationDetail() {
  const { destination, tours, stays, cars } = Route.useLoaderData();
  const { locale, t } = useI18n();
  const isVietnamese = locale === "vn";
  return (
    <article>
      <div className="relative h-cover overflow-hidden"><Cover src={destination.image} alt={field(destination, locale, "title")} priority /><div className="absolute inset-0 bg-ink/35" /><div className="absolute bottom-0 mx-auto w-full max-w-6xl px-4 pb-8 text-paper"><p className="text-xs uppercase tracking-caps">{destination.country}</p><h1 className="font-display text-5xl">{field(destination, locale, "title")}</h1></div></div>
      <div className="mx-auto max-w-3xl px-4 py-10"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-caps text-muted"><MapPinned className="size-3.5" />{isVietnamese ? "Điểm đến" : "Destination"}</div><p className="text-lg text-muted">{field(destination, locale, "excerpt")}</p><p className="mt-4 whitespace-pre-line">{field(destination, locale, "body")}</p>{destination.languages ? <p className="mt-6 text-sm text-muted">{destination.languages} · {destination.currency}</p> : null}</div>
      <section className="mx-auto max-w-6xl px-4 pb-12" aria-label={isVietnamese ? "Khám phá điểm đến" : "Explore destination"}>
        <div className="grid overflow-hidden rounded-3xl border border-border bg-surface shadow-border sm:grid-cols-3">
          <a href={tours.length ? "#journeys" : undefined} className={`group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-paper ${!tours.length ? "pointer-events-none opacity-50" : ""}`}>
            <div><p className="text-xs uppercase tracking-caps text-muted">{isVietnamese ? "Hành trình" : "Journeys"}</p><p className="mt-1 text-2xl font-semibold">{tours.length}</p></div><ArrowUpRight className="size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a href={stays.length ? "#stays" : undefined} className={`group flex items-center justify-between gap-4 border-t border-border p-5 transition-colors hover:bg-paper sm:border-l sm:border-t-0 ${!stays.length ? "pointer-events-none opacity-50" : ""}`}>
            <div><p className="text-xs uppercase tracking-caps text-muted">{isVietnamese ? "Nơi ở" : "Stays"}</p><p className="mt-1 text-2xl font-semibold">{stays.length}</p></div><Hotel className="size-5 text-muted" />
          </a>
          <a href={cars.length ? "#cars" : undefined} className={`group flex items-center justify-between gap-4 border-t border-border p-5 transition-colors hover:bg-paper sm:border-l sm:border-t-0 ${!cars.length ? "pointer-events-none opacity-50" : ""}`}>
            <div><p className="text-xs uppercase tracking-caps text-muted">{isVietnamese ? "Xe" : "Cars"}</p><p className="mt-1 text-2xl font-semibold">{cars.length}</p></div><CarFront className="size-5 text-muted" />
          </a>
        </div>
      </section>
      {tours.length ? <div id="journeys" className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-16"><h2 className="mb-6 font-display text-3xl">{t("journeys")}</h2><div className="grid gap-6 md:grid-cols-3">{tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}</div></div> : null}
      {(stays.length || cars.length) ? <section className="border-t border-border bg-surface/55 py-16"><div className="mx-auto max-w-6xl px-4"><div className="max-w-2xl"><p className="eyebrow text-accent">{isVietnamese ? "Ở & di chuyển" : "Stay & move"}</p><h2 className="mt-2 font-display text-4xl">{isVietnamese ? "Ở lại, rồi đi tiếp." : "Stay here, then keep moving."}</h2><p className="mt-3 text-muted">{isVietnamese ? "Những lựa chọn gắn với điểm đến này, theo cùng một hành trình." : "Useful places to stay and ways to move, connected to the same destination."}</p></div><div className="mt-8 grid gap-8 lg:grid-cols-2">
        {stays.length ? <div id="stays" className="scroll-mt-8"><div className="mb-4 flex items-center gap-2"><Hotel className="size-5 text-accent" /><h3 className="font-semibold">{isVietnamese ? "Nơi ở" : "Stays"}</h3></div><div className="space-y-3">{stays.slice(0, 4).map((stay) => <Link key={stay.id} to="/$locale/stays/$slug" params={{ locale, slug: stay.slug }} className="group flex gap-4 rounded-2xl bg-surface p-3 shadow-border transition-transform hover:-translate-y-0.5"><div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-ink"><Cover src={stay.image} alt={stay.title_en} className="h-full w-full" /></div><div className="min-w-0 flex-1 py-1"><div className="flex items-start justify-between gap-3"><h4 className="truncate font-semibold">{isVietnamese ? stay.title_vn : stay.title_en}</h4><ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p className="mt-1 line-clamp-2 text-sm text-muted">{isVietnamese ? stay.excerpt_vn : stay.excerpt_en}</p><p className="mt-2 text-sm font-semibold">{new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 }).format(stay.price_per_night)} AUD / night</p></div></Link>)}</div></div> : null}
        {cars.length ? <div id="cars" className="scroll-mt-8"><div className="mb-4 flex items-center gap-2"><CarFront className="size-5 text-accent" /><h3 className="font-semibold">{isVietnamese ? "Xe" : "Cars"}</h3></div><div className="space-y-3">{cars.slice(0, 4).map((car) => <Link key={car.id} to="/$locale/cars/$slug" params={{ locale, slug: car.slug }} className="group flex gap-4 rounded-2xl bg-surface p-3 shadow-border transition-transform hover:-translate-y-0.5"><div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-ink"><Cover src={car.image} alt={car.title_en} className="h-full w-full" /></div><div className="min-w-0 flex-1 py-1"><div className="flex items-start justify-between gap-3"><h4 className="truncate font-semibold">{isVietnamese ? car.title_vn : car.title_en}</h4><ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p className="mt-1 text-sm text-muted">{car.seats} {isVietnamese ? "chỗ" : "seats"} · {car.transmission}</p><p className="mt-2 text-sm font-semibold">{new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 }).format(car.price_per_day)} AUD / day</p></div></Link>)}</div></div> : null}
      </div></div></section> : null}
    </article>
  );
}
