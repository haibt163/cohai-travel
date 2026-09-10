import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, MapPinned } from "lucide-react";
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
    { key: "nature" as const, image: "/media/nature-sapa.jpg", label: "Slow landscapes" },
    { key: "beach" as const, image: "/media/beach-phuquoc.jpg", label: "Coastal escapes" },
    { key: "unesco" as const, image: "/media/unesco-hue.jpg", label: "Living heritage" },
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-ink">
        <Cover src="/media/hero-halong.jpg" alt="Ha Long Bay at dawn" priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(9,24,23,.88),rgba(9,24,23,.43)_48%,rgba(9,24,23,.22))]" />
        <div className="absolute -right-24 top-1/4 size-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-96 rounded-full bg-warm/20 blur-3xl" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 md:pb-18">
          <div className="max-w-3xl text-paper">
            <div className="mb-5 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-caps">
              <span className="rounded-full border border-paper/25 bg-paper/10 px-3 py-2 backdrop-blur-sm">Vietnam</span>
              <span className="rounded-full border border-paper/25 bg-paper/10 px-3 py-2 backdrop-blur-sm">Tailored journeys</span>
            </div>
            <p className="eyebrow text-paper-2">{t("heroKicker")}</p>
            <h1 className="mt-4 max-w-3xl text-5xl leading-[0.96] sm:text-6xl md:text-7xl">{t("heroTitle")}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-paper-2 md:text-lg">{t("heroBody")}</p>
            <div className="mt-8 max-w-3xl rounded-2xl bg-paper/95 p-2 shadow-lift backdrop-blur-xl">
              <SearchBox />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-paper-2">
              <span className="inline-flex items-center gap-2"><Compass className="size-4" />Local perspective</span>
              <span className="inline-flex items-center gap-2"><MapPinned className="size-4" />Handpicked places</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div><p className="eyebrow text-accent">{t("chaptersKicker")}</p><h2 className="mt-2 text-4xl md:text-5xl">Travel by mood.</h2></div>
          <Link to="/$locale/tours" params={{ locale }} className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 sm:inline-flex">{t("allJourneys")}<ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {chapters.map((ch) => (
            <Link key={ch.key} to="/$locale/tours" params={{ locale }} search={{ chapter: ch.key }} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-ink shadow-soft">
              <Cover src={ch.image} alt={t(ch.key)} className="absolute inset-0 h-full w-full transition-transform duration-350 group-hover:scale-[1.055]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(8,21,20,.82))]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-paper"><p className="text-xs uppercase tracking-caps text-paper-2">{ch.label}</p><h3 className="mt-2 text-3xl md:text-4xl">{t(ch.key)}</h3><span className="mt-4 inline-flex items-center gap-2 text-sm text-paper-2 transition-transform group-hover:translate-x-1">{t("allJourneys")}<ArrowRight className="size-4" /></span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface/70 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-6"><div><p className="eyebrow text-accent">{t("journeys")}</p><h2 className="mt-2 text-4xl md:text-5xl">Journeys worth remembering.</h2></div><Link to="/$locale/tours" params={{ locale }} className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5 sm:inline-flex">{t("allJourneys")}<ArrowRight className="size-4" /></Link></div>
          <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{tours.filter((x) => x.featured).slice(0, 6).map((tour) => <TourCard key={tour.id} tour={tour} />)}</div>
        </div>
      </section>
    </div>
  );
}
