import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { searchCatalog } from "@/lib/catalog";
import { field, siteCopy, useI18n } from "@/lib/locale";
import { Cover } from "@/components/cover";
import { SearchBox } from "@/components/search-box";
import { EmptyNote, PageHead } from "@/components/shell";
import { seoHead } from "@/lib/seo";

type Search = { q?: string; chapter?: string; fromDate?: string };

function isDateOnly(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export const Route = createFileRoute("/$locale/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    chapter: typeof s.chapter === "string" ? s.chapter : undefined,
    fromDate: typeof s.fromDate === "string" && isDateOnly(s.fromDate) ? s.fromDate : undefined,
  }),
  loaderDeps: ({ search }) => ({ q: search.q, chapter: search.chapter, fromDate: search.fromDate }),
  loader: async ({ deps }) => {
    const hits = await searchCatalog({ data: { q: deps.q, chapter: deps.chapter } });
    if (!deps.fromDate) return { hits };
    return {
      hits: hits.filter((hit) => hit.kind !== "tour" || Boolean(hit.next_departure && hit.next_departure >= deps.fromDate!)),
    };
  },
  head: ({ params }) => {
    const locale = params.locale === "vn" ? "vn" : "en";
    return seoHead({ locale, title: siteCopy(locale, "metaSearchTitle"), description: siteCopy(locale, "metaSearchDescription"), pathname: `/${params.locale}/search`, alternatePathname: (l) => `/${l}/search` });
  },
  component: SearchPage,
});

function SearchPage() {
  const { hits } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { locale, t } = useI18n();
  const hrefFor = (kind: string, slug: string) => kind === "tour" ? { to: "/$locale/tours/$slug" as const, params: { locale, slug } } : kind === "stay" ? { to: "/$locale/stays/$slug" as const, params: { locale, slug } } : kind === "car" ? { to: "/$locale/cars/$slug" as const, params: { locale, slug } } : { to: "/$locale/destinations/$slug" as const, params: { locale, slug } };
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale === "vn" ? "vi-VN" : "en-AU", { day: "numeric", month: "short" }).format(new Date(`${value}T00:00:00`));
  const fromDate = isDateOnly(search.fromDate) ? search.fromDate : "";
  const hasDateFilter = Boolean(fromDate);

  return <div>
    <PageHead kicker={t("search")} title={t("search")} />
    <div className="mx-auto max-w-6xl px-4">
      <SearchBox variant="page" />
      <form
        className="mt-4 flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-border sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const nextDate = typeof form.get("fromDate") === "string" ? form.get("fromDate") as string : "";
          void navigate({
            to: "/$locale/search",
            params: { locale },
            search: (current) => ({ ...current, fromDate: isDateOnly(nextDate) ? nextDate : undefined }),
          });
        }}
      >
        <label className="min-w-0 flex-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-caps text-muted">{locale === "vn" ? "Khởi hành từ" : "Departing from"}</span>
          <input name="fromDate" type="date" value={fromDate} onChange={(event) => {
            void navigate({
              to: "/$locale/search",
              params: { locale },
              search: (current) => ({ ...current, fromDate: isDateOnly(event.currentTarget.value) ? event.currentTarget.value : undefined }),
            });
          }} className="h-11 w-full rounded-2xl border border-ink/10 bg-canvas px-3 text-sm outline-none focus:border-accent" />
        </label>
        {hasDateFilter ? <button type="button" className="h-11 rounded-2xl border border-ink/10 px-4 text-sm font-semibold transition hover:bg-canvas" onClick={() => void navigate({ to: "/$locale/search", params: { locale }, search: (current) => ({ ...current, fromDate: undefined }) })}>{locale === "vn" ? "Xóa ngày" : "Clear date"}</button> : null}
      </form>
      {hasDateFilter ? <p className="mt-3 text-sm text-muted">{locale === "vn" ? `Hiển thị hành trình có ngày khởi hành còn chỗ từ ${formatDate(fromDate)}` : `Showing journeys with an available departure from ${formatDate(fromDate)}`}</p> : null}
    </div>
    {hits.length === 0 ? <EmptyNote>{t("noResults")}</EmptyNote> : <div className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">{hits.map((h) => { const dest = hrefFor(h.kind, h.slug); const hasAvailability = h.kind === "tour" && Boolean(h.next_departure); return <Link key={`${h.kind}-${h.slug}`} to={dest.to} params={dest.params} className="group flex gap-4 overflow-hidden rounded-3xl bg-surface p-2 shadow-border transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-lift"><div className="h-28 w-36 shrink-0 overflow-hidden rounded-2xl"><Cover src={h.image} alt={field(h, locale, "title")} className="h-full w-full transition-transform duration-350 group-hover:scale-[1.05]" /></div><div className="min-w-0 py-2 pr-3"><p className="text-xs font-semibold uppercase tracking-caps text-accent">{h.kind}</p><h2 className="mt-1 text-xl">{field(h, locale, "title")}</h2><p className="mt-1 line-clamp-2 text-sm text-muted">{field(h, locale, "excerpt")}</p>{hasAvailability ? <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-accent"><CalendarDays className="size-3.5" />{locale === "vn" ? `Khởi hành ${formatDate(h.next_departure!)}` : `Next departure ${formatDate(h.next_departure!)}`}{h.available_departures && h.available_departures > 1 ? <span className="font-normal text-muted">· {h.available_departures} {locale === "vn" ? "ngày còn chỗ" : "dates available"}</span> : null}</p> : null}</div></Link>; })}</div>}
  </div>;
}
