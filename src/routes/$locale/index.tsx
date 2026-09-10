import { createFileRoute, Link } from "@tanstack/react-router";
import { listTours } from "@/lib/catalog";
import { useI18n } from "@/lib/locale";
import { Cover } from "@/components/cover";
import { SearchBox } from "@/components/search-box";
import { TourCard } from "@/components/tour-card";

export const Route = createFileRoute("/$locale/")({
  loader: async () => ({ tours: await listTours({ data: {} }) }),
  component: Home,
});

function Home() {
  const { tours } = Route.useLoaderData();
  const { t } = useI18n();
  const { locale } = Route.useParams();
  const chapters = [
    { key: "nature" as const, image: "/media/nature-sapa.jpg" },
    { key: "beach" as const, image: "/media/beach-phuquoc.jpg" },
    { key: "unesco" as const, image: "/media/unesco-hue.jpg" },
  ];

  return (
    <div>
      <section className="relative min-h-hero overflow-hidden">
        <Cover src="/media/hero-halong.jpg" alt="Ha Long Bay at dawn" priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative mx-auto flex min-h-hero max-w-6xl flex-col justify-end px-4 pb-12 pt-24 text-paper">
          <p className="text-xs uppercase tracking-caps text-paper-2">{t("heroKicker")}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl md:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-xl text-paper-2">{t("heroBody")}</p>
          <SearchBox />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs uppercase tracking-caps text-accent">{t("chaptersKicker")}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {chapters.map((ch) => (
            <Link key={ch.key} to="/$locale/tours" params={{ locale }} search={{ chapter: ch.key }} className="group relative block aspect-portrait overflow-hidden rounded-xl">
              <Cover src={ch.image} alt={t(ch.key)} className="transition-transform duration-250 group-hover:scale-lift" />
              <div className="absolute inset-0 bg-ink/35" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                <h2 className="font-display text-3xl">{t(ch.key)}</h2>
                <p className="mt-1 text-sm text-paper-2">{t("allJourneys")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl">{t("journeys")}</h2>
          <Link to="/$locale/tours" params={{ locale }} className="text-sm text-accent">{t("allJourneys")}</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {tours.filter((x) => x.featured).slice(0, 6).map((tour) => <TourCard key={tour.id} tour={tour} />)}
        </div>
      </section>
    </div>
  );
}
