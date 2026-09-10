import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n, type Locale } from "@/lib/locale";

const links = [
  { path: "/tours", to: "/$locale/tours" as const, key: "journeys" as const },
  { path: "/destinations", to: "/$locale/destinations" as const, key: "places" as const },
  { path: "/stays", to: "/$locale/stays" as const, key: "stays" as const },
  { path: "/cars", to: "/$locale/cars" as const, key: "cars" as const },
  { path: "/contact", to: "/$locale/contact" as const, key: "contact" as const },
];

function switchLocale(pathname: string, search: string, hash: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const rest = segments[0] === "en" || segments[0] === "vn" ? segments.slice(1) : segments;
  return `/${locale}${rest.length ? `/${rest.join("/")}` : ""}${search}${hash}`;
}

export function Shell({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const location = useRouterState({ select: (s) => ({ pathname: s.location.pathname, searchStr: s.location.searchStr, hash: s.location.hash }) });
  const pathname = location.pathname;

  const goLocale = () => {
    const next = locale === "en" ? "vn" : "en";
    window.location.assign(switchLocale(pathname, location.searchStr, location.hash, next));
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[0.7rem] tracking-wide sm:px-6">
          <div className="flex items-center gap-2"><Sparkles className="size-3.5" /><span>{t("heroKicker")}</span></div>
          <div className="flex items-center gap-3 text-paper-2"><span className="hidden sm:inline tabular-nums">{t("currency")}</span><button type="button" className="font-medium hover:text-paper" onClick={goLocale} aria-label="Language">{locale === "en" ? "EN / VN" : "VN / EN"}</button><AuthSlot locale={locale} /></div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-border/70 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/$locale" params={{ locale }} className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid size-10 place-items-center rounded-full bg-ink text-paper shadow-border transition-transform duration-250 group-hover:rotate-6"><span className="font-display text-lg">C</span></span>
            <span><span className="block font-display text-2xl leading-none tracking-tight">{t("brand")}</span><span className="mt-1 hidden text-[0.65rem] uppercase tracking-caps text-muted sm:block">Vietnam, thoughtfully</span></span>
          </Link>

          <nav className="surface-glass hidden items-center gap-1 rounded-full p-1.5 md:flex" aria-label="Primary">
            {links.map((l) => <Link key={l.path} to={l.to} params={{ locale }} className={pathname.startsWith(`/${locale}${l.path}`) ? "rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper" : "rounded-full px-4 py-2.5 text-sm text-muted transition-colors hover:bg-paper-2 hover:text-ink"}>{t(l.key)}</Link>)}
            <Link to="/$locale/search" params={{ locale }} className="ml-1 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"><Search className="size-4" />{t("search")}</Link>
          </nav>

          <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-surface shadow-border md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
        {open ? <nav className="mx-4 mb-4 flex flex-col gap-1 rounded-2xl bg-surface p-2 shadow-soft md:hidden" aria-label="Mobile primary">{links.map((l) => <Link key={l.path} to={l.to} params={{ locale }} className="rounded-xl px-4 py-3 text-sm" onClick={() => setOpen(false)}>{t(l.key)}</Link>)}<Link to="/$locale/search" params={{ locale }} className="rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-fg" onClick={() => setOpen(false)}>{t("search")}</Link></nav> : null}
      </header>

      <main>{children}</main>
      <footer className="mt-20 border-t border-border bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
          <div><p className="font-display text-3xl">{t("brand")}</p><p className="mt-4 max-w-md text-sm leading-6 text-paper-2">{t("footerNote")}</p></div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm">{links.map((l) => <Link key={l.path} to={l.to} params={{ locale }} className="py-2 text-paper-2 transition-colors hover:text-paper">{t(l.key)}</Link>)}</div>
          <div className="text-sm text-paper-2"><p>{t("operator")}</p><p className="mt-3">desk@cohai.travel</p><p>+84 24 3933 0000</p><div className="mt-6 h-px w-16 bg-paper/25" /><p className="mt-3 text-xs uppercase tracking-caps">Crafted for curious travellers</p></div>
        </div>
      </footer>
    </div>
  );
}

function AuthSlot({ locale }: { locale: Locale }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-6 w-16 animate-pulse rounded-full bg-paper/10" />;
  return <><SignedOut><Link to="/$locale/login" params={{ locale }} className="font-medium hover:text-paper">{t("signIn")}</Link></SignedOut><SignedIn><div className="flex items-center gap-2"><Link to="/$locale/account" params={{ locale }} className="hidden font-medium hover:text-paper sm:inline">{user?.displayName ?? t("account")}</Link><UserButton /></div></SignedIn></>;
}

export function PageHead({ kicker, title, body }: { kicker?: string; title: string; body?: string }) {
  return <header className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 md:pb-12 md:pt-16"><div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-paper shadow-soft sm:px-10 md:px-14 md:py-14"><div className="absolute -right-20 -top-24 size-64 rounded-full bg-accent/25 blur-3xl" /><div className="absolute -bottom-28 left-1/3 size-72 rounded-full bg-warm/15 blur-3xl" /><div className="relative max-w-3xl">{kicker ? <p className="eyebrow text-paper-2">{kicker}</p> : null}<h1 className="mt-3 text-4xl md:text-6xl">{title}</h1>{body ? <p className="mt-5 max-w-2xl text-base text-paper-2 md:text-lg">{body}</p> : null}</div></div></header>;
}

export function EmptyNote({ children }: { children: ReactNode }) { return <p className="px-4 py-16 text-center text-muted">{children}</p>; }
