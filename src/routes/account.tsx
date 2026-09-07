import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listMyBookings, type BookingRow } from "@/lib/bookings";
import { field, useI18n } from "@/lib/locale";
import { aud, formatDay } from "@/lib/utils";
import { EmptyNote, PageHead } from "@/components/shell";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const { t, locale } = useI18n();
  const [rows, setRows] = useState<BookingRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    listMyBookings()
      .then(setRows)
      .catch(() => setRows([]));
  }, [user]);

  if (isPending) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-muted">…</div>;
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="mx-auto max-w-3xl px-4">
      <PageHead kicker={t("account")} title={user.displayName ?? t("account")} />
      {rows === null ? (
        <div className="h-24 animate-pulse rounded-xl bg-paper-2" />
      ) : rows.length === 0 ? (
        <EmptyNote>{t("emptyTrips")}</EmptyNote>
      ) : (
        <ul className="space-y-3 pb-16">
          {rows.map((b) => (
            <li key={b.id} className="rounded-xl bg-surface p-4 shadow-border">
              <p className="text-xs uppercase tracking-wide text-muted">{b.kind}</p>
              <h2 className="font-display text-2xl">{field(b, locale, "title")}</h2>
              <p className="text-sm text-muted">
                {formatDay(b.start_date, locale)} · {b.guests} {t("guests")}
                {b.kind !== "tour" ? ` · ${b.nights} ${b.kind === "car" ? t("days") : t("nights")}` : ""}
              </p>
              <p className="mt-2 tabular-nums">
                {aud(b.total_price)} · {b.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
