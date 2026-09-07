import { createFileRoute, Link } from "@tanstack/react-router";
import { listCars } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { Cover } from "@/components/cover";
import { PageHead } from "@/components/shell";

export const Route = createFileRoute("/cars/")({
  loader: async () => ({ cars: await listCars() }),
  component: CarsPage,
});

function CarsPage() {
  const { cars } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return (
    <div>
      <PageHead kicker={t("cars")} title={t("cars")} body={t("operator")} />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-2">
        {cars.map((c) => (
          <Link
            key={c.id}
            to="/cars/$slug"
            params={{ slug: c.slug }}
            className="flex overflow-hidden rounded-xl bg-surface shadow-border"
          >
            <div className="w-2/5 min-h-36">
              <Cover src={c.image} alt={field(c, locale, "title")} />
            </div>
            <div className="flex-1 space-y-1 p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                {t("pickup")} {field(c, locale, "dest_title")}
              </p>
              <h2 className="font-display text-2xl">{field(c, locale, "title")}</h2>
              <p className="text-sm text-muted">{field(c, locale, "excerpt")}</p>
              <p className="pt-2 text-sm">
                {c.seats} {t("seats")} · {c.transmission}
              </p>
              <p className="tabular-nums">
                {aud(c.price_per_day)} <span className="text-muted">{t("perDay")}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
