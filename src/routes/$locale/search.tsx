import { createFileRoute, Link } from "@tanstack/react-router";
import { searchCatalog } from "@/lib/catalog";
import { field, siteCopy, useI18n } from "@/lib/locale";
import { Cover } from "@/components/cover";
import { SearchBox } from "@/components/search-box";
import { EmptyNote, PageHead } from "@/components/shell";
import { seoHead } from "@/lib/seo";

type Search = { q?: string; chapter?: string };
export const Route = createFileRoute("/$locale/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({ q: typeof s.q === "string" ? s.q : undefined, chapter: typeof s.chapter === "string" ? s.chapter : undefined }),
  loaderDeps: ({ search }) => ({ q: search.q, chapter: search.chapter }),
  loader: async ({ deps }) => ({ hits: await searchCatalog({ data: { q: deps.q, chapter: deps.chapter } }) }),
  head: ({ params }) => { const locale = params.locale === "vn" ? "vn" : "en"; return seoHead({ locale, title: siteCopy(locale, "metaSearchTitle"), description: siteCopy(locale, "metaSearchDescription"), pathname: `/${params.locale}/search`, alternatePathname: (l) => `/${l}/search` }); },
  component: SearchPage,
});
function SearchPage() {
  const { hits } = Route.useLoaderData(); const { locale, t } = useI18n();
  const hrefFor = (kind: string, slug: string) => kind === "tour" ? { to: "/$locale/tours/$slug" as const, params: { locale, slug } } : kind === "stay" ? { to: "/$locale/stays/$slug" as const, params: { locale, slug } } : kind === "car" ? { to: "/$locale/cars/$slug" as const, params: { locale, slug } } : { to: "/$locale/destinations/$slug" as const, params: { locale, slug } };
  return <div><PageHead kicker={t("search")} title={t("search")} /><div className="mx-auto max-w-6xl px-4"><SearchBox variant="page" /></div>{hits.length === 0 ? <EmptyNote>{t("noResults")}</EmptyNote> : <div className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">{hits.map((h) => { const dest = hrefFor(h.kind, h.slug); return <Link key={`${h.kind}-${h.slug}`} to={dest.to} params={dest.params} className="group flex gap-4 overflow-hidden rounded-3xl bg-surface p-2 shadow-border transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-lift"><div className="h-28 w-36 shrink-0 overflow-hidden rounded-2xl"><Cover src={h.image} alt={field(h, locale, "title")} className="h-full w-full transition-transform duration-350 group-hover:scale-[1.05]" /></div><div className="py-2 pr-3"><p className="text-xs font-semibold uppercase tracking-caps text-accent">{h.kind}</p><h2 className="mt-1 text-xl">{field(h, locale, "title")}</h2><p className="mt-1 text-sm text-muted">{field(h, locale, "excerpt")}</p></div></Link>; })}</div>}</div>;
}
