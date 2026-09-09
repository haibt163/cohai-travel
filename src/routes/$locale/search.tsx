import { createFileRoute, Link } from "@tanstack/react-router";
import { searchCatalog } from "@/lib/catalog";
import { field, useI18n } from "@/lib/locale";
import { Cover } from "@/components/cover";
import { SearchBox } from "@/components/search-box";
import { EmptyNote, PageHead } from "@/components/shell";
import { seoHead } from "@/lib/seo";

type Search = { q?: string; chapter?: string };

export const Route = createFileRoute("/$locale/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({ q: typeof s.q === "string" ? s.q : undefined, chapter: typeof s.chapter === "string" ? s.chapter : undefined }),
  loaderDeps: ({ search }) => ({ q: search.q, chapter: search.chapter }),
  loader: async ({ deps }) => ({ hits: await searchCatalog({ data: { q: deps.q, chapter: deps.chapter } }) }),
  head: ({ params }) => seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: "Search | CoHai Travel", pathname: `/${params.locale}/search`, alternatePathname: (l) => `/${l}/search` }),
  component: SearchPage,
});

function SearchPage() {
  const { hits } = Route.useLoaderData();
  const { locale, t } = useI18n();
  const hrefFor = (kind: string, slug: string) => kind === "tour" ? { to: "/$locale/tours/$slug" as const, params: { locale, slug } } : kind === "stay" ? { to: "/$locale/stays/$slug" as const, params: { locale, slug } } : kind === "car" ? { to: "/$locale/cars/$slug" as const, params: { locale, slug } } : { to: "/$locale/destinations/$slug" as const, params: { locale, slug } };
  return <div><PageHead kicker={t("search")} title={t("search")} /><div className="mx-auto max-w-6xl px-4"><SearchBox variant="page" /></div>{hits.length === 0 ? <EmptyNote>{t("noResults")}</EmptyNote> : <div className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">{hits.map((h) => { const dest = hrefFor(h.kind, h.slug); return <Link key={`${h.kind}-${h.slug}`} to={dest.to} params={dest.params} className="flex gap-4 overflow-hidden rounded-xl bg-surface shadow-border"><div className="h-28 w-36 shrink-0"><Cover src={h.image} alt={field(h, locale, "title")} /></div><div className="py-3 pr-3"><p className="text-xs uppercase tracking-wide text-muted">{h.kind}</p><h2 className="font-display text-xl">{field(h, locale, "title")}</h2><p className="text-sm text-muted">{field(h, locale, "excerpt")}</p></div></Link>; })}</div>}</div>;
}
