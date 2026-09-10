import { Compass, Sparkles } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { listTours } from "@/lib/catalog";
import { useI18n } from "@/lib/locale";
import { PageHead } from "@/components/shell";
import { TourCard } from "@/components/tour-card";

type Search = { chapter?: string };

export const Route = createFileRoute("/$locale/tours/")({
  validateSearch: (s: Record<string, unknown>): Search => ({ chapter: typeof s.chapter === "string" ? s.chapter : undefined }),
  loaderDeps: ({ search }) => ({ chapter: search.chapter }),
  loader: async ({ deps }) => ({ tours: await listTours({ data: { chapter: deps.chapter } }) }),
  component: ToursPage,
});

function ToursPage() {
  const { tours } = Route.useLoaderData();
  const { chapter } = Route.useSearch();
  const { t } = useI18n();
  const { locale } = Route.useParams();
  const filters = ["all", "nature", "beach", "unesco"] as const;

  return (
    <div>
      <PageHead kicker={t("journeys")} title={t("heroTitle")} body={t("heroBody")} />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mb-8 flex flex-col gap-5 rounded-3xl bg-surface/80 p-5 shadow-border backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl bg-surface-2 text-accent"><Compass className="size-5" /></span>
            <div><p className="text-sm font-semibold">{t("chaptersKicker")}</p><p className="mt-1 text-sm text-muted">{t("footerNote")}</p></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Link key={f} to="/$locale/tours" params={{ locale }} search={f === "all" ? {} : { chapter: f }} className={(chapter ?? "all") === f ? "inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-paper shadow-soft" : "inline-flex min-h-11 items-center rounded-full bg-paper px-5 text-sm font-medium text-muted shadow-border transition-transform hover:-translate-y-0.5 hover:text-ink"}>
                {f === "all" ? t("allJourneys") : t(f)}
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="eyebrow text-accent">{t("journeys")}</p><h2 className="mt-2 text-3xl md:text-4xl">{t("allJourneys")}</h2></div><div className="hidden items-center gap-2 text-xs uppercase tracking-caps text-muted sm:flex"><Sparkles className="size-4" />{t("heroKicker")}</div></div>
        {tours.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}</div> : <div className="rounded-3xl bg-surface p-12 text-center shadow-border"><p className="font-display text-2xl">{t("noResults")}</p></div>}
      </section>
    </div>
  );
}
