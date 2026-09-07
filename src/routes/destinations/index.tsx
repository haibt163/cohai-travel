import { createFileRoute, Link } from "@tanstack/react-router";
import { listDestinations } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { Cover } from "@/components/cover";
import { PageHead } from "@/components/shell";

export const Route = createFileRoute("/destinations/")({
  loader: async () => ({ destinations: await listDestinations() }),
  component: DestinationsPage,
});

function DestinationsPage() {
  const { destinations } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return (
    <div>
      <PageHead kicker={t("places")} title={t("places")} body={t("operator")} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <Link
            key={d.id}
            to="/destinations/$slug"
            params={{ slug: d.slug }}
            className="group overflow-hidden rounded-xl bg-surface shadow-border"
          >
            <div className="aspect-photo overflow-hidden">
              <Cover
                src={d.image}
                alt={field(d, locale, "title")}
                className="transition-transform duration-250 group-hover:scale-lift"
              />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted">{d.country}</p>
              <h2 className="font-display text-2xl">{field(d, locale, "title")}</h2>
              <p className="mt-1 text-sm text-muted">{field(d, locale, "excerpt")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
