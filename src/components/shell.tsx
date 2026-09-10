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
  const goLocale = () => { const next = locale === "en" ? "vn" : "en"; window.location.assign(switchLocale(pathname, location.searchStr, location.hash, next)); };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-ink text-paper"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[0.7rem] tracking-wide sm:px-6"><div className="flex min-w-0 items-center gap-2"><Sparkles className="size-3.5 shrink-0" /><span className="truncate">{t("heroKicker")}</span></div><div className="flex items-center gap-3 text-paper-2"><span className="hidden rounded-full border border-paper/15 bg-paper/5 px-2.5 py-1 sm:inline tabular-nums">{t("currency")}</span><button type="button" className="font-medium transition-colors hover:text-paper" onClick={goLocale} aria-label="Language">{locale === "en" ? "EN / VN" : "VN / EN"}</button><AuthSlot locale={locale} /></div></div></div>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-paper/80 backdrop-blur-2xl"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6"><Link to="/$locale" params={{ locale }} className="group flex items-center gap-3" onClick={() => setOpen(false)}><span className="grid size-11 place-items-center rounded-full bg-ink text-paper shadow-soft transition-transform duration-250 group-hover:rotate-6"><span className="font-display text-lg">C</span></span><span><span className="block font-display text-2xl leading-none tracking-tight">{t("brand")}</span><span className="mt-1 hidden max-w-56 truncate text-[0.62rem] uppercase tracking-caps text-muted sm:block">{t("tagline")}</span></span></Link><nav className="surface-glass hidden items-center gap-1 rounded-full p-1.5 md:flex" aria-label="Primary">{links.map((l) => <Link key={l.path} to={l.to} params={{ locale }} className={pathname.startsWith(`/${locale}${l.path}`) ? "rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper" : "rounded-full px-4 py-2.5 text-sm text-muted transition-[background-color,color] hover:bg-paper-2 hover:text-ink"}>{t(l.key)}</Link>)}<Link to="/$locale/search" params={{ locale }} className="ml-1 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-transform hover:-translate-y-0.5"><Search className="size-4" />{t("search")}</Link></nav><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-surface shadow-border md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>{open ? <nav className="mx-3 mb-3 flex flex-col gap-1 rounded-3xl border border-border bg-surface p-2 shadow-lift md:hidden" aria-label="Mobile primary">{links.map((l) => <Link key={l.path} to={l.to} params={{ locale }} className="rounded-2xl px-4 py-3.5 text-sm font-medium" onClick={() => setOpen(false)}>{t(l.key)}</Link>)}<Link to="/$locale/search" params={{ locale }} className="rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-accent-fg" onClick={() => setOpen(false)}>{t("search")}</Link></nav> : null}</header>
      <main>{children}</main>
      <footer className="mt-20 bg-ink text-paper"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_0.8fr_0.9fr]"><div><p className="font-display text-4xl tracking-tight">{t("brand")}</p><p className="mt-4 max-w-md text-sm leading-6 text-paper-2">{t("footerNote")}</p></div><div><p className="eyebrow text-paper/50">{t("journeys")}</p><div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1 text-sm">{links.map((l) => <Link key={l.path} to={l.to} params={{ locale }} className="rounded-xl py-2 text-paper-2 transition-colors hover:text-paper">{t(l.key)}</Link>)}</div></div><div className="text-sm text-paper-2"><p>{t("operator")}</p><p className="mt-3">desk@cohai.travel</p><p>+84 24 3933 0000</p><div className="mt-6 h-px w-16 bg-paper/25" /><p className="mt-3 text-xs text-paper/50">{t("tagline")}</p></div></div></footer>
    </div>
  );
}

function AuthSlot({ locale }: { locale: Locale }) { const { t } = useI18n(); const { user, isPending } = useCurrentUserState(); if (isPending) return <div className="h-6 w-16 animate-pulse rounded-full bg-paper/10" />; return <><SignedOut><Link to="/$locale/login" params={{ locale }} className="font-medium transition-colors hover:text-paper">{t("signIn")}</Link></SignedOut><SignedIn><div className="flex items-center gap-2"><Link to="/$locale/account" params={{ locale }} className="hidden font-medium transition-colors hover:text-paper sm:inline">{user?.displayName ?? t("account")}</Link><UserButton /></div></SignedIn></>; }

export function PageHead({ kicker, title, body }: { kicker?: string; title: string; body?: string }) { return <header className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 md:pb-14 md:pt-14"><div className="relative overflow-hidden rounded-[2.75rem] bg-ink px-6 py-10 text-paper shadow-lift sm:px-10 md:px-14 md:py-14"><div className="absolute -right-24 -top-20 size-72 rounded-full bg-accent/25 blur-3xl" /><div className="absolute -bottom-28 left-1/4 size-80 rounded-full bg-warm/15 blur-3xl" /><div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-paper/5 to-transparent" /><div className="relative max-w-3xl">{kicker ? <p className="eyebrow text-paper-2">{kicker}</p> : null}<h1 className="mt-3 text-5xl md:text-7xl">{title}</h1>{body ? <p className="mt-5 max-w-2xl text-base leading-7 text-paper-2 md:text-lg">{body}</p> : null}</div></div></header>; }
export function EmptyNote({ children }: { children: ReactNode }) { return <p className="mx-auto max-w-2xl px-4 py-20 text-center text-muted">{children}</p>; }
