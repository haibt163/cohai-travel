import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { Cover } from "@/components/cover";
import type { TourCard as Tour } from "@/lib/catalog";

const chapterLabel = {
  nature: { en: "Nature", vn: "Thiên nhiên" },
  beach: { en: "Coast", vn: "Biển" },
  unesco: { en: "UNESCO", vn: "UNESCO" },
} as const;

export function TourCard({ tour }: { tour: Tour }) {
  const { locale, t } = useI18n();
  const hasLiveDeparture = tour.from_price > 0 && Boolean(tour.next_departure);
  const chapter = chapterLabel[tour.chapter][locale];
  const nextDate = tour.next_departure ? new Intl.DateTimeFormat(locale === "vn" ? "vi-VN" : "en-AU", { day: "numeric", month: "short" }).format(new Date(`${tour.next_departure}T00:00:00`)) : null;
  return (
    <Link to="/$locale/tours/$slug" params={{ locale, slug: tour.slug }} className="group block overflow-hidden rounded-3xl bg-surface shadow-border transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
      <div className="relative aspect-photo overflow-hidden bg-ink"><Cover src={tour.image} alt={field(tour, locale, "title")} className="absolute inset-0 h-full w-full transition-transform duration-350 group-hover:scale-[1.055]" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(9,24,23,.8))]" /><div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4"><div className="flex flex-wrap gap-2"><span className="rounded-full border border-paper/25 bg-ink/35 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-caps text-paper backdrop-blur-sm">{field(tour, locale, "dest_title")}</span><span className="rounded-full border border-paper/20 bg-paper/10 px-3 py-1.5 text-[0.65rem] font-medium text-paper backdrop-blur-sm">{chapter}</span></div><span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper/90 text-ink transition-transform group-hover:rotate-6"><ArrowUpRight className="size-4" /></span></div><div className="absolute inset-x-0 bottom-0 p-5 text-paper"><p className="flex items-center gap-2 text-xs text-paper-2"><Clock3 className="size-3.5" />{tour.duration_days} {t("days")}</p><h3 className="mt-2 text-2xl md:text-3xl">{field(tour, locale, "title")}</h3></div></div>
      <div className="p-5"><p className="line-clamp-2 text-sm leading-6 text-muted">{field(tour, locale, "excerpt")}</p><div className="mt-5 flex items-end justify-between gap-3"><div>{hasLiveDeparture ? <><p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-caps text-accent"><CalendarDays className="size-3.5" />{locale === "vn" ? "Khởi hành tiếp theo" : "Next departure"}</p><p className="mt-1 text-sm font-semibold">{nextDate}{tour.available_departures > 1 ? <span className="ml-2 text-xs font-normal text-muted">· {tour.available_departures} {locale === "vn" ? "ngày còn chỗ" : "dates available"}</span> : null}</p><p className="mt-1 text-lg font-semibold tabular-nums">{aud(tour.from_price)} <span className="text-xs font-normal text-muted">{t("perPerson")}</span></p></> : <p className="text-sm font-medium text-muted">{locale === "vn" ? "Liên hệ để lên lịch" : "Dates on request"}</p>}</div><span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-accent">{t("more")}</span></div></div>
    </Link>
  );
}
