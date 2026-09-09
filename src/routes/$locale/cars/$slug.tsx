import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCar } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { seoHead } from "@/lib/seo";
import { BookingForm } from "@/components/booking-form";
import { Cover } from "@/components/cover";

export const Route = createFileRoute("/$locale/cars/$slug")({
  loader: async ({ params }) => {
    const car = await getCar({ data: params.slug });
    if (!car) throw notFound();
    return { car };
  },
  head: ({ loaderData, params }) => loaderData ? seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: `${params.locale === "vn" ? loaderData.car.title_vn : loaderData.car.title_en} | CoHai Travel`, description: params.locale === "vn" ? loaderData.car.excerpt_vn : loaderData.car.excerpt_en, pathname: `/${params.locale}/cars/${loaderData.car.slug}`, alternatePathname: (l) => `/${l}/cars/${loaderData.car.slug}`, image: loaderData.car.image }) : {},
  component: CarDetail,
});

function CarDetail() {
  const { car } = Route.useLoaderData();
  const { locale, t } = useI18n();
  return <article className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-5"><div className="lg:col-span-3"><div className="overflow-hidden rounded-xl"><Cover src={car.image} alt={field(car, locale, "title")} priority /></div><p className="mt-6 text-xs uppercase tracking-caps text-muted">{t("pickup")} {field(car, locale, "dest_title")}</p><h1 className="font-display text-4xl">{field(car, locale, "title")}</h1><p className="mt-2 text-muted">{field(car, locale, "excerpt")}</p><p className="mt-4 tabular-nums">{car.seats} {t("seats")} · {car.transmission} · {aud(car.price_per_day)} {t("perDay")}</p></div><div className="lg:col-span-2"><BookingForm kind="car" itemId={car.id} unitPrice={car.price_per_day} /></div></article>;
}
