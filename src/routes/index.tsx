import { createFileRoute, Link } from "@tanstack/react-router";
import { listTours } from "@/lib/catalog";
import { useI18n } from "@/lib/locale";
import { Cover } from "@/components/cover";
import { TourCard } from "@/components/tour-card";
import { SearchBox } from "@/components/search-box";

export const Route = createFileRoute("/")({
  loader: async () => {
    const tours = await listTours({ data: {} });
    return { tours };
  },
  component: Home,
});

function Home() {
  const { tours } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const chapters = [
    { key: "nature" as const, image: "/media/nature-sapa.jpg" },
    { key: "beach" as const, image: "/media/beach-phuquoc.jpg" },
    { key: "unesco" as const, image: "/media/unesco-hue.jpg" },
  ];

  return (
    <div>
      <section className="relative min-h-hero overflow-hidden">
        <Cover
          src="/media/hero-halong.jpg"
          alt="Ha Long Bay at dawn"
          priority
          className="absolute inset-0 h-full w-full"
        />
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
            <Link
              key={ch.key}
              to="/tours"
              search={{ chapter: ch.key }}
              className="group relative block aspect-[4/5] overflow-hidden rounded-xl"
            >
              <Cover
                src={ch.image}
                alt={t(ch.key)}
                className="transition-transform duration-250 group-hover:scale-lift"
              />
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
          <Link to="/tours" className="text-sm text-accent">
            {t("allJourneys")}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {tours
            .filter((x) => x.featured)
            .slice(0, 6)
            .map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        <Link
          to="/destinations/$slug"
          params={{ slug: "siem-reap" }}
          className="relative block min-h-64 overflow-hidden rounded-xl"
        >
          <Cover src="/media/dest-angkor.jpg" alt="Angkor" />
          <div className="absolute inset-0 bg-ink/40" />
          <div className="absolute bottom-0 p-5 text-paper">
            <p className="text-xs uppercase tracking-caps">{t("partners")}</p>
            <h2 className="font-display text-3xl">{locale === "vn" ? "Campuchia" : "Cambodia"}</h2>
            <p className="text-sm text-paper-2">
              {locale === "vn" ? "Angkor lúc rạng đông, rồi hồ." : "Angkor at first light, then the lake."}
            </p>
          </div>
        </Link>
        <Link
          to="/destinations/$slug"
          params={{ slug: "bangkok" }}
          className="relative block min-h-64 overflow-hidden rounded-xl"
        >
          <Cover src="/media/dest-bangkok.jpg" alt="Bangkok" />
          <div className="absolute inset-0 bg-ink/40" />
          <div className="absolute bottom-0 p-5 text-paper">
            <p className="text-xs uppercase tracking-caps">{t("partners")}</p>
            <h2 className="font-display text-3xl">Bangkok</h2>
            <p className="text-sm text-paper-2">
              {locale === "vn" ? "Thành phố sông làm cổng phía nam." : "A river city as the southern gate."}
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
