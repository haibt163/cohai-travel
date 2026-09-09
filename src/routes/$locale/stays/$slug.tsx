import { createFileRoute, notFound } from "@tanstack/react-router";
import { getStay } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { seoHead } from "@/lib/seo";
import { BookingForm } from "@/components/booking-form";
import { Cover } from "@/components/cover";

export const Route = createFileRoute("/$locale/stays/$slug")({
  loader: async ({ params }) => {
    const stay = await getStay({ data: params.slug });
    if (!stay) throw notFound();
    return { stay };
  },
  head: ({ loaderData, params }) => loaderData ? seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: `${params.locale === "vn" ? loaderData.stay.title_vn : loaderData.stay.title_en} | CoHai Travel`, description: params.locale === "vn" ? loaderData.stay.excerpt_vn : loaderData.stay.excerpt_en, pathname: `/${params.locale}/stays/${loaderData.stay.slug}`, alternatePathname: (l) => `/${l}/stays/${loaderData.stay.slug}`, image: loaderData.stay.image }) : {},
  component: StayDetail,
});

function StayDetail() {
  const { stay } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return <article><div className="relative h-cover overflow-hidden"><Cover src={stay.image} alt={field(stay, locale, "title")} priority /><div className="absolute inset-0 bg-ink/30" /><div className="absolute bottom-0 mx-auto w-full max-w-6xl px-4 pb-8 text-paper"><p className="text-xs uppercase tracking-caps">{field(stay, locale, "dest_title")}</p><h1 className="font-display text-4xl">{field(stay, locale, "title")}</h1><p className="tabular-nums">{aud(stay.price_per_night)} {t("perNight")}</p></div></div><div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-5"><div className="lg:col-span-3"><p className="text-lg text-muted">{field(stay, locale, "excerpt")}</p><p className="mt-4 whitespace-pre-line">{field(stay, locale, "body")}</p></div><div className="lg:col-span-2"><BookingForm kind="stay" itemId={stay.id} unitPrice={stay.price_per_night} /></div></div></article>;
}
