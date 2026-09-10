import { ArrowUpRight, CarFront } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listCars } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { Cover } from "@/components/cover";
import { PageHead } from "@/components/shell";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/cars/")({
  loader: async () => ({ cars: await listCars() }),
  head: ({ params }) => seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: "Cars | CoHai Travel", description: "Private cars for your journey.", pathname: `/${params.locale}/cars`, alternatePathname: (l) => `/${l}/cars` }),
  component: CarsPage,
});

function CarsPage() {
  const { cars } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return (
    <div>
      <PageHead kicker={t("cars")} title={t("cars")} body={t("operator")} />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mb-8 rounded-3xl bg-ink p-6 text-paper shadow-soft sm:p-8"><div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper/10"><CarFront className="size-6" /></span><div><p className="eyebrow text-paper-2">{t("cars")}</p><p className="mt-2 max-w-2xl text-sm leading-6 text-paper-2">{t("footerNote")}</p></div></div></div>
        <div className="grid gap-6 md:grid-cols-2">
          {cars.map((c) => (
            <Link key={c.id} to="/$locale/cars/$slug" params={{ locale, slug: c.slug }} className="group relative grid overflow-hidden rounded-3xl bg-surface shadow-border transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-lift sm:grid-cols-[40%_60%]">
              <div className="relative min-h-60 overflow-hidden bg-ink"><Cover src={c.image} alt={field(c, locale, "title")} className="h-full w-full transition-transform duration-350 group-hover:scale-[1.05]" /><div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" /></div>
              <div className="flex flex-col justify-between p-6"><div><div className="flex items-center justify-between gap-3"><p className="text-[0.68rem] font-semibold uppercase tracking-caps text-accent">{t("pickup")} · {field(c, locale, "dest_title")}</p><span className="grid size-9 place-items-center rounded-full bg-surface-2 transition-transform group-hover:rotate-6"><ArrowUpRight className="size-4" /></span></div><h2 className="mt-3 text-2xl md:text-3xl">{field(c, locale, "title")}</h2><p className="mt-3 text-sm leading-6 text-muted">{field(c, locale, "excerpt")}</p></div><div className="mt-6 border-t border-border pt-4"><div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-wide text-muted"><span>{c.seats} {t("seats")}</span><span>{c.transmission}</span></div><p className="mt-3 text-lg font-semibold tabular-nums">{aud(c.price_per_day)} <span className="text-xs font-normal text-muted">{t("perDay")}</span></p></div></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
