import { CalendarDays, CheckCircle2, LockKeyhole, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { createBooking } from "@/lib/bookings";
import { useI18n } from "@/lib/locale";
import { aud } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import type { Departure } from "@/lib/catalog";

type Kind = "tour" | "stay" | "car";

export function BookingForm({ kind, itemId, departures, unitPrice }: { kind: Kind; itemId: string; departures?: Departure[]; unitPrice?: number }) {
  const { t } = useI18n();
  const [departureId, setDepartureId] = useState(departures?.[0]?.id ?? "");
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(kind === "stay" ? 3 : 2);
  const [startDate, setStartDate] = useState("2026-10-20");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [error, setError] = useState("");
  const dep = departures?.find((d) => d.id === departureId);
  const left = dep ? dep.max_people - dep.booked : 99;
  const price = kind === "tour" ? (dep?.price ?? 0) * guests : (unitPrice ?? 0) * nights;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("busy"); setError("");
    try {
      await createBooking({ data: { kind, itemId, departureId: kind === "tour" ? departureId : undefined, startDate: kind === "tour" ? (dep?.start_date ?? startDate) : startDate, guests: kind === "car" ? 1 : guests, nights: kind === "tour" ? 1 : nights, firstName: String(fd.get("firstName") ?? ""), lastName: String(fd.get("lastName") ?? ""), email: String(fd.get("email") ?? ""), phone: String(fd.get("phone") ?? "") || undefined, notes: String(fd.get("notes") ?? "") || undefined } });
      setStatus("ok");
    } catch (err) { setStatus("err"); setError(err instanceof Error ? err.message : "Could not book"); }
  }

  return (
    <aside className="overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-lift">
      <div className="bg-ink p-5 text-paper sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-paper-2">{kind === "tour" ? t("book") : kind === "stay" ? t("bookStay") : t("bookCar")}</p><p className="mt-2 text-3xl font-semibold tabular-nums">{price > 0 ? aud(price) : "—"}</p></div><span className="grid size-10 place-items-center rounded-2xl bg-paper/10"><LockKeyhole className="size-4" /></span></div></div>
      <div className="p-5 sm:p-6">
        <SignedOut><div className="rounded-2xl bg-surface-2 p-4"><p className="text-sm leading-6">{t("needSignIn")}</p><Link to="/login" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper">{t("signIn")}</Link></div></SignedOut>
        <SignedIn>
          {status === "ok" ? <div className="rounded-2xl bg-surface-2 p-5"><CheckCircle2 className="size-7 text-accent" /><p className="mt-3 font-display text-2xl">{t("booked")}</p><Link to="/account" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm font-semibold text-paper">{t("account")}</Link></div> : (
            <form className="space-y-4" onSubmit={onSubmit}>
              {kind === "tour" && departures ? <div><Label htmlFor="dep">{t("departure")}</Label><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted" /><select id="dep" value={departureId} onChange={(e) => setDepartureId(e.target.value)} className="mt-1 min-h-12 w-full pl-10">{departures.map((d) => { const seats = d.max_people - d.booked; return <option key={d.id} value={d.id} disabled={seats <= 0}>{d.start_date} · {aud(d.price)} · {seats} {t("seatsLeft")}</option>; })}</select></div></div> : <div><Label htmlFor="start">{t("start")}</Label><Input id="start" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>}
              {kind !== "car" ? <div><Label htmlFor="guests">{t("guests")}</Label><Input id="guests" type="number" min={1} max={kind === "tour" ? Math.max(1, left) : 8} value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></div> : null}
              {kind !== "tour" ? <div><Label htmlFor="nights">{kind === "car" ? t("days") : t("nights")}</Label><Input id="nights" type="number" min={1} max={21} value={nights} onChange={(e) => setNights(Number(e.target.value))} /></div> : null}
              <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="firstName">{t("firstName")}</Label><Input id="firstName" name="firstName" required autoComplete="given-name" /></div><div><Label htmlFor="lastName">{t("lastName")}</Label><Input id="lastName" name="lastName" required autoComplete="family-name" /></div></div>
              <div><Label htmlFor="email">{t("email")}</Label><Input id="email" name="email" type="email" required autoComplete="email" /></div>
              <div><Label htmlFor="phone">{t("phone")}</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
              <div><Label htmlFor="notes">{t("notes")}</Label><Textarea id="notes" name="notes" /></div>
              {error ? <p role="alert" className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p> : null}
              <Button type="submit" disabled={status === "busy" || (kind === "tour" && left <= 0)} className="w-full">{kind === "tour" && left <= 0 ? t("soldOut") : <><UserRound className="mr-2 size-4" />{t("confirm")}</>}</Button>
            </form>
          )}
        </SignedIn>
      </div>
    </aside>
  );
}
