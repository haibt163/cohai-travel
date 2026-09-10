import { Bath, BedDouble, Check, MapPinned, Sparkles } from "lucide-react";
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
  const title = field(stay, locale, "title");
  return (
    <article>
      <section className="relative min-h-[58vh] overflow-hidden bg-ink">
        <Cover src={stay.image} alt={title} priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,21,20,.82),rgba(8,21,20,.38)_65%,rgba(8,21,20,.18))]" />
        <div className="relative mx-auto flex min-h-[58vh] max-w-7xl items-end px-4 pb-10 sm:px-6 md:pb-14">
          <div className="max-w-3xl text-paper"><span className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-caps backdrop-blur-sm"><MapPinned className="size-3.5" />{field(stay, locale, "dest_title")}</span><h1 className="mt-5 text-5xl md:text-7xl">{title}</h1><div className="mt-5 flex items-center gap-3 text-paper-2"><span className="flex items-center gap-2"><BedDouble className="size-4" />{stay.star_count}★</span><span className="size-1 rounded-full bg-paper/40" /><span className="tabular-nums">{aud(stay.price_per_night)} {t("perNight")}</span></div></div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.15fr_.75fr] md:py-16 lg:gap-16">
        <div>
          <p className="max-w-3xl text-xl leading-8 text-muted">{field(stay, locale, "excerpt")}</p>
          <div className="my-9 editorial-divider" />
          <div className="whitespace-pre-line text-base leading-8 text-ink">{field(stay, locale, "body")}</div>
          <div className="mt-10 rounded-3xl bg-ink p-6 text-paper shadow-soft sm:p-8"><div className="flex items-start gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-paper/10"><Sparkles className="size-5" /></span><div><p className="eyebrow text-paper-2">{t("stays")}</p><p className="mt-2 text-lg">{t("operator")}</p></div></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-2 text-sm text-paper-2"><Check className="size-4" />{t("perNight")}</div><div className="flex items-center gap-2 text-sm text-paper-2"><Bath className="size-4" />{t("places")}</div></div></div>
        </div>
        <div><p className="eyebrow text-accent">{t("bookStay")}</p><p className="mt-2 mb-4 text-sm text-muted">{t("perNight")}</p><BookingForm kind="stay" itemId={stay.id} unitPrice={stay.price_per_night} /></div>
      </section>
    </article>
  );
}
