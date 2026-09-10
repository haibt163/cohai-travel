import { CalendarDays, Check, Clock3, MapPinned } from "lucide-react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTour } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { seoHead } from "@/lib/seo";
import { BookingForm } from "@/components/booking-form";
import { Cover } from "@/components/cover";

export const Route = createFileRoute("/$locale/tours/$slug")({
  loader: async ({ params }) => {
    const data = await getTour({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => loaderData ? seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: `${params.locale === "vn" ? loaderData.tour.title_vn : loaderData.tour.title_en} | CoHai Travel`, description: params.locale === "vn" ? loaderData.tour.excerpt_vn : loaderData.tour.excerpt_en, pathname: `/${params.locale}/tours/${loaderData.tour.slug}`, alternatePathname: (locale) => `/${locale}/tours/${loaderData.tour.slug}`, image: loaderData.tour.image }) : {},
  component: TourDetail,
});

function TourDetail() {
  const { tour, departures } = Route.useLoaderData();
  const { locale, t } = useI18n();
  const title = field(tour, locale, "title");
  return (
    <article>
      <section className="relative min-h-[64vh] overflow-hidden bg-ink">
        <Cover src={tour.image} alt={title} priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,21,20,.9),rgba(8,21,20,.48)_52%,rgba(8,21,20,.22))]" />
        <div className="relative mx-auto flex min-h-[64vh] max-w-7xl items-end px-4 pb-10 sm:px-6 md:pb-14">
          <div className="max-w-3xl text-paper">
            <Link to="/$locale/destinations/$slug" params={{ locale, slug: tour.dest_slug }} className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-caps backdrop-blur-sm hover:bg-paper/15"><MapPinned className="size-3.5" />{field(tour, locale, "dest_title")}</Link>
            <h1 className="mt-5 text-5xl md:text-7xl">{title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-paper-2"><span className="inline-flex items-center gap-2"><Clock3 className="size-4" />{tour.duration_days} {t("days")}</span><span className="size-1 rounded-full bg-paper/40" /><span className="inline-flex items-center gap-2"><CalendarDays className="size-4" />{departures.length} {t("departure")}</span></div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.15fr_.75fr] md:py-16 lg:gap-16">
        <div>
          <p className="max-w-3xl text-xl leading-8 text-muted">{field(tour, locale, "excerpt")}</p>
          <div className="my-9 editorial-divider" />
          <div className="max-w-none whitespace-pre-line leading-8 text-ink">{field(tour, locale, "body")}</div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-surface p-4 shadow-border"><Check className="size-4 text-accent" /><p className="mt-3 text-sm font-semibold">{t("seatsLeft")}</p></div><div className="rounded-2xl bg-surface p-4 shadow-border"><Check className="size-4 text-accent" /><p className="mt-3 text-sm font-semibold">{t("currency")}</p></div><div className="rounded-2xl bg-surface p-4 shadow-border"><Check className="size-4 text-accent" /><p className="mt-3 text-sm font-semibold">{t("operator")}</p></div></div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between gap-3"><div><p className="eyebrow text-accent">{t("book")}</p><p className="mt-1 text-sm text-muted">{tour.from_price > 0 ? `${t("from")} ${aud(tour.from_price)} ${t("perPerson")}` : ""}</p></div></div>
          <BookingForm kind="tour" itemId={tour.id} departures={departures} unitPrice={tour.from_price} />
        </div>
      </section>
    </article>
  );
}
