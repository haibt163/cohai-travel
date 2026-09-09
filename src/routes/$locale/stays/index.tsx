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
  return <div><PageHead kicker={t("stays")} title={t("stays")} body={t("operator")} /><div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-3">{stays.map((s) => <Link key={s.id} to="/$locale/stays/$slug" params={{ locale, slug: s.slug }} className="overflow-hidden rounded-xl bg-surface shadow-border"><div className="aspect-photo overflow-hidden"><Cover src={s.image} alt={field(s, locale, "title")} /></div><div className="space-y-1 p-4"><p className="text-xs uppercase tracking-wide text-muted">{field(s, locale, "dest_title")} · {s.star_count}★</p><h2 className="font-display text-2xl">{field(s, locale, "title")}</h2><p className="text-sm text-muted">{field(s, locale, "excerpt")}</p><p className="pt-1 tabular-nums">{aud(s.price_per_night)} <span className="text-muted">{t("perNight")}</span></p></div></Link>)}</div></div>;
}
