import { BedDouble, Star } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listStays } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { Cover } from "@/components/cover";
import { PageHead } from "@/components/shell";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/stays/")({
  loader: async () => ({ stays: await listStays() }),
  head: ({ params }) => seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: "Stays | CoHai Travel", description: "Places to stay across the journey.", pathname: `/${params.locale}/stays`, alternatePathname: (l) => `/${l}/stays` }),
  component: StaysPage,
});

function StaysPage() {
  const { stays } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return (
    <div>
      <PageHead kicker={t("stays")} title={t("stays")} body={t("operator")} />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mb-8 flex items-center gap-3 rounded-3xl bg-surface/80 p-5 shadow-border"><span className="grid size-11 place-items-center rounded-2xl bg-surface-2 text-accent"><BedDouble className="size-5" /></span><div><p className="text-sm font-semibold">{t("stays")}</p><p className="text-sm text-muted">{t("operator")}</p></div></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((s) => (
            <Link key={s.id} to="/$locale/stays/$slug" params={{ locale, slug: s.slug }} className="group overflow-hidden rounded-3xl bg-surface shadow-border transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink"><Cover src={s.image} alt={field(s, locale, "title")} className="h-full w-full transition-transform duration-350 group-hover:scale-[1.05]" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(9,24,23,.55))]" /><span className="absolute left-4 top-4 rounded-full border border-paper/25 bg-ink/40 px-3 py-1.5 text-[0.68rem] uppercase tracking-caps text-paper backdrop-blur-sm">{field(s, locale, "dest_title")}</span></div>
              <div className="p-5"><div className="flex items-center justify-between gap-3"><p className="flex items-center gap-1 text-xs uppercase tracking-caps text-muted"><Star className="size-3.5 fill-current" />{s.star_count}</p><p className="text-xs text-muted">{t("perNight")}</p></div><h2 className="mt-2 text-2xl md:text-3xl">{field(s, locale, "title")}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{field(s, locale, "excerpt")}</p><p className="mt-5 text-lg font-semibold tabular-nums">{aud(s.price_per_night)} <span className="text-xs font-normal text-muted">{t("perNight")}</span></p></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
