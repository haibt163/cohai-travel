import { createFileRoute, notFound } from "@tanstack/react-router";
import { getDestination, toursForDestination } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { seoHead } from "@/lib/seo";
import { Cover } from "@/components/cover";
import { TourCard } from "@/components/tour-card";

export const Route = createFileRoute("/destinations/$slug")({
  loader: async ({ params }) => {
    const destination = await getDestination({ data: params.slug });
    if (!destination) throw notFound();
    const tours = await toursForDestination({ data: destination.id });
    return { destination, tours };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seoHead({
          title: `${loaderData.destination.title_en} | CoHai Travel`,
          description: loaderData.destination.excerpt_en,
          pathname: `/destinations/${loaderData.destination.slug}`,
          image: loaderData.destination.image,
        })
      : {},
  component: DestinationDetail,
});

function DestinationDetail() {
  const { destination, tours } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return (
    <article>
      <div className="relative h-cover overflow-hidden">
        <Cover src={destination.image} alt={field(destination, locale, "title")} priority />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute bottom-0 mx-auto w-full max-w-6xl px-4 pb-8 text-paper">
          <p className="text-xs uppercase tracking-caps">{destination.country}</p>
          <h1 className="font-display text-5xl">{field(destination, locale, "title")}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-lg text-muted">{field(destination, locale, "excerpt")}</p>
        <p className="mt-4 whitespace-pre-line">{field(destination, locale, "body")}</p>
        {destination.languages ? (
          <p className="mt-6 text-sm text-muted">{destination.languages} · {destination.currency}</p>
        ) : null}
      </div>
      {tours.length ? (
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-6 font-display text-3xl">{t("journeys")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        </div>
      ) : null}
    </article>
  );
}
