import { createFileRoute, Link } from "@tanstack/react-router";
import { listTours } from "@/lib/catalog";
import { useI18n } from "@/lib/locale";
import { PageHead } from "@/components/shell";
import { TourCard } from "@/components/tour-card";

type Search = { chapter?: string };

export const Route = createFileRoute("/tours/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    chapter: typeof s.chapter === "string" ? s.chapter : undefined,
  }),
  loaderDeps: ({ search }) => ({ chapter: search.chapter }),
  loader: async ({ deps }) => ({
    tours: await listTours({ data: { chapter: deps.chapter } }),
  }),
  component: ToursPage,
});

function ToursPage() {
  const { tours } = Route.useLoaderData();
  const { chapter } = Route.useSearch();
  const { t } = useI18n();
  const filters = ["all", "nature", "beach", "unesco"] as const;

  return (
    <div>
      <PageHead kicker={t("journeys")} title={t("heroTitle")} body={t("heroBody")} />
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-8">
        {filters.map((f) => (
          <Link
            key={f}
            to="/tours"
            search={f === "all" ? {} : { chapter: f }}
            className={
              (chapter ?? "all") === f
                ? "inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm text-paper"
                : "inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm text-muted shadow-border"
            }
          >
            {f === "all" ? t("allJourneys") : t(f)}
          </Link>
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-3">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
