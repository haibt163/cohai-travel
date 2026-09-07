import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/locale";

const links = [
  { to: "/tours", key: "journeys" as const },
  { to: "/destinations", key: "places" as const },
  { to: "/stays", key: "stays" as const },
  { to: "/cars", key: "cars" as const },
  { to: "/contact", key: "contact" as const },
];

export function Shell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs">
          <p className="text-muted">{t("heroKicker")}</p>
          <div className="flex items-center gap-3">
            <span className="tabular-nums tracking-wide">{t("currency")}</span>
            <button
              type="button"
              className="min-h-11 px-1 font-medium"
              onClick={() => setLocale(locale === "en" ? "vn" : "en")}
              aria-label="Language"
            >
              {locale === "en" ? "EN / VN" : "VN / EN"}
            </button>
            <AuthSlot />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="font-display text-2xl tracking-tight">
            {t("brand")}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={
                  pathname.startsWith(l.to)
                    ? "text-sm font-medium text-accent"
                    : "text-sm text-muted hover:text-ink"
                }
              >
                {t(l.key)}
              </Link>
            ))}
            <Link to="/search" className="inline-flex min-h-11 items-center gap-1 text-sm">
              <Search className="size-4" />
              {t("search")}
            </Link>
          </nav>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open ? (
          <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="min-h-11 py-2"
                onClick={() => setOpen(false)}
              >
                {t(l.key)}
              </Link>
            ))}
            <Link to="/search" className="min-h-11 py-2" onClick={() => setOpen(false)}>
              {t("search")}
            </Link>
          </nav>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-border bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl">{t("brand")}</p>
            <p className="mt-3 max-w-sm text-sm text-paper-2">{t("footerNote")}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="min-h-11 py-2 hover:opacity-80">
                {t(l.key)}
              </Link>
            ))}
          </div>
          <div className="text-sm text-paper-2">
            <p>{t("operator")}</p>
            <p className="mt-2">desk@cohai.travel</p>
            <p>+84 24 3933 0000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthSlot() {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-20 animate-pulse rounded-md bg-paper-2" />;
  }
  return (
    <>
      <SignedOut>
        <Link to="/login" className="inline-flex min-h-11 items-center font-medium">
          {t("signIn")}
        </Link>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-2">
          <Link to="/account" className="hidden min-h-11 items-center sm:inline-flex">
            {user?.displayName ?? t("account")}
          </Link>
          <UserButton />
        </div>
      </SignedIn>
    </>
  );
}

export function PageHead({
  kicker,
  title,
  body,
}: {
  kicker?: string;
  title: string;
  body?: string;
}) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-8 pt-10">
      {kicker ? (
        <p className="text-xs uppercase tracking-caps text-accent">{kicker}</p>
      ) : null}
      <h1 className="mt-2 max-w-3xl font-display text-4xl md:text-5xl">{title}</h1>
      {body ? <p className="mt-4 max-w-2xl text-muted">{body}</p> : null}
    </header>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="px-4 py-12 text-center text-muted">{children}</p>;
}
