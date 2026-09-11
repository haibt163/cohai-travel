import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listMyBookings, type BookingRow } from "@/lib/bookings";
import { field, siteCopy, useI18n } from "@/lib/locale";
import { aud, formatDay } from "@/lib/utils";
import { EmptyNote, PageHead } from "@/components/shell";
import { seoHead } from "@/lib/seo";
import { getOperatorSnapshot, type OperatorSnapshot } from "@/lib/operator";

export const Route = createFileRoute("/$locale/account")({
  head: ({ params }) => { const locale = params.locale === "vn" ? "vn" : "en"; return seoHead({ locale, title: siteCopy(locale, "metaAccountTitle"), description: siteCopy(locale, "metaAccountDescription"), pathname: `/${params.locale}/account`, alternatePathname: (l) => `/${l}/account` }); },
  component: AccountPage,
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState(); const { t, locale } = useI18n(); const [rows, setRows] = useState<BookingRow[] | null>(null); const [ops, setOps] = useState<OperatorSnapshot | null>(null);
  useEffect(() => { if (user) { listMyBookings().then(setRows).catch(() => setRows([])); getOperatorSnapshot().then(setOps).catch(() => setOps(null)); } }, [user]);
  if (isPending) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="h-24 animate-pulse rounded-3xl bg-paper-2" /></div>;
  if (!user) return <RedirectToSignIn />;
  return <div className="mx-auto max-w-7xl px-4"><PageHead kicker={t("account")} title={user.displayName ?? t("account")} />
    <section className="mx-auto max-w-3xl pb-16">
      {rows === null ? <div className="h-24 animate-pulse rounded-3xl bg-paper-2" /> : rows.length === 0 ? <EmptyNote>{t("emptyTrips")}</EmptyNote> : <ul className="space-y-3">{rows.map((b) => <li key={b.id} className="rounded-3xl bg-surface p-5 shadow-border"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-caps text-accent">{b.kind}</p><h2 className="mt-1 text-2xl">{field(b, locale, "title")}</h2><p className="mt-1 text-sm text-muted">{formatDay(b.start_date, locale)} · {b.guests} {t("guests")}{b.kind !== "tour" ? ` · ${b.nights} ${b.kind === "car" ? t("days") : t("nights")}` : ""}</p></div><p className="tabular-nums text-lg font-semibold">{aud(b.total_price)}</p></div><p className="mt-4 text-xs font-semibold uppercase tracking-caps text-muted">{b.status}</p></li>)}</ul>}
    </section>
    {ops ? <section className="border-t border-border py-14"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow text-accent">{t("operations")}</p><h2 className="mt-2 text-4xl">{t("operations")}</h2></div><div className="grid grid-cols-3 gap-2"><Metric label={t("bookingCount")} value={ops.counts.bookings} /><Metric label={t("inquiryCount")} value={ops.counts.inquiries} /><Metric label={t("confirmedCount")} value={ops.counts.confirmed} /></div></div><div className="mt-8 grid gap-6 lg:grid-cols-2"><QueueCard title={t("recentBookings")}><div className="divide-y divide-border">{ops.bookings.map((b) => <div key={b.id} className="grid gap-2 py-4 sm:grid-cols-[1.2fr_.9fr_auto]"><div><p className="font-medium">{b.customer}</p><p className="text-xs text-muted">{b.email}</p></div><div><p className="text-sm">{b.item}</p><p className="text-xs uppercase tracking-wide text-muted">{b.kind} · {formatDay(b.startDate, locale)}</p></div><div className="text-sm font-semibold tabular-nums">{aud(b.totalPrice)}</div></div>)}</div></QueueCard><QueueCard title={t("recentInquiries")}><div className="divide-y divide-border">{ops.inquiries.map((m) => <div key={m.id} className="py-4"><div className="flex justify-between gap-4"><div><p className="font-medium">{m.name}</p><p className="text-xs text-muted">{m.email}</p></div><p className="text-xs text-muted">{formatDay(m.received, locale)}</p></div><p className="mt-2 line-clamp-2 text-sm text-muted">{m.message}</p></div>)}</div></QueueCard></div></div></section> : null}
  </div>;
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="min-w-20 rounded-2xl bg-surface p-3 text-center shadow-border"><p className="font-display text-xl">{value}</p><p className="mt-1 text-[0.6rem] uppercase tracking-caps text-muted">{label}</p></div>; }
function QueueCard({ title, children }: { title: string; children: ReactNode }) { return <div className="rounded-3xl bg-surface p-5 shadow-border sm:p-6"><h3 className="text-2xl">{title}</h3><div className="mt-2">{children}</div></div>; }
