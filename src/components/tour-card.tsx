import { Link } from "@tanstack/react-router";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { Cover } from "@/components/cover";
import type { TourCard as Tour } from "@/lib/catalog";

export function TourCard({ tour }: { tour: Tour }) {
  const { locale, t } = useI18n();
  return (
    <Link to="/$locale/tours/$slug" params={{ locale, slug: tour.slug }} className="group block overflow-hidden rounded-xl bg-surface shadow-border">
      <div className="aspect-photo overflow-hidden rounded-t-xl"><Cover src={tour.image} alt={field(tour, locale, "title")} className="transition-transform duration-250 group-hover:scale-lift" /></div>
      <div className="space-y-2 p-4"><p className="text-xs tracking-wide text-muted uppercase">{field(tour, locale, "dest_title")} · {tour.duration_days} {t("days")}</p><h3 className="font-display text-xl">{field(tour, locale, "title")}</h3><p className="text-sm text-muted">{field(tour, locale, "excerpt")}</p>{tour.from_price > 0 ? <p className="pt-1 font-medium tabular-nums">{t("from")} {aud(tour.from_price)} <span className="text-muted font-normal">{t("perPerson")}</span></p> : null}</div>
    </Link>
  );
}
