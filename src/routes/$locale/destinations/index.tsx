import { ArrowUpRight, MapPinned } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listDestinations } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { Cover } from "@/components/cover";
import { PageHead } from "@/components/shell";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/destinations/")({
  loader: async () => ({ destinations: await listDestinations() }),
  head: ({ params }) => seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: "Places | CoHai Travel", description: "Explore destinations across Vietnam and its neighbours.", pathname: `/${params.locale}/destinations`, alternatePathname: (l) => `/${l}/destinations` }),
  component: DestinationsPage,
});

function DestinationsPage() {
  const { destinations } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return (
    <div>
      <PageHead kicker={t("places")} title={t("places")} body={t("operator")} />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mb-8 flex items-center gap-3 rounded-3xl bg-surface/80 p-5 shadow-border"><span className="grid size-11 place-items-center rounded-2xl bg-surface-2 text-accent"><MapPinned className="size-5" /></span><div><p className="text-sm font-semibold">{t("places")}</p><p className="text-sm text-muted">{t("operator")}</p></div></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link key={d.id} to="/$locale/destinations/$slug" params={{ locale, slug: d.slug }} className="group overflow-hidden rounded-3xl bg-surface shadow-border transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink"><Cover src={d.image} alt={field(d, locale, "title")} className="h-full w-full transition-transform duration-350 group-hover:scale-[1.05]" /><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(9,24,23,.72))]" /><div className="absolute inset-x-0 top-0 flex items-center justify-between p-4"><span className="rounded-full border border-paper/25 bg-ink/40 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-caps text-paper backdrop-blur-sm">{d.country}</span><span className="grid size-9 place-items-center rounded-full bg-paper/90 text-ink transition-transform group-hover:rotate-6"><ArrowUpRight className="size-4" /></span></div><div className="absolute inset-x-0 bottom-0 p-5 text-paper"><h2 className="text-3xl">{field(d, locale, "title")}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-paper-2">{field(d, locale, "excerpt")}</p></div></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
