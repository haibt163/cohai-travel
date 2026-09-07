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

export function BookingForm({
  kind,
  itemId,
  departures,
  unitPrice,
}: {
  kind: Kind;
  itemId: string;
  departures?: Departure[];
  unitPrice?: number;
}) {
  const { t } = useI18n();
  const [departureId, setDepartureId] = useState(departures?.[0]?.id ?? "");
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(kind === "stay" ? 3 : 2);
  const [startDate, setStartDate] = useState("2026-10-20");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  const dep = departures?.find((d) => d.id === departureId);
  const left = dep ? dep.max_people - dep.booked : 99;
  const price =
    kind === "tour" ? (dep?.price ?? 0) * guests : (unitPrice ?? 0) * nights;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("busy");
    setError("");
    try {
      await createBooking({
        data: {
          kind,
          itemId,
          departureId: kind === "tour" ? departureId : undefined,
          startDate: kind === "tour" ? (dep?.start_date ?? startDate) : startDate,
          guests: kind === "car" ? 1 : guests,
          nights: kind === "tour" ? 1 : nights,
          firstName: String(fd.get("firstName") ?? ""),
          lastName: String(fd.get("lastName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? "") || undefined,
          notes: String(fd.get("notes") ?? "") || undefined,
        },
      });
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Could not book");
    }
  }

  return (
    <aside className="rounded-xl bg-surface p-5 shadow-border">
      <h2 className="font-display text-2xl">
        {kind === "tour" ? t("book") : kind === "stay" ? t("bookStay") : t("bookCar")}
      </h2>
      <p className="mt-1 text-sm text-muted tabular-nums">{price > 0 ? aud(price) : "—"}</p>

      <SignedOut>
        <p className="mt-4 text-sm">{t("needSignIn")}</p>
        <Link to="/login" className="mt-3 inline-flex min-h-11 items-center text-accent">
          {t("signIn")}
        </Link>
      </SignedOut>

      <SignedIn>
        {status === "ok" ? (
          <p className="mt-4 text-sm">
            {t("booked")}{" "}
            <Link to="/account" className="text-accent">
              {t("account")}
            </Link>
          </p>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            {kind === "tour" && departures ? (
              <div>
                <Label htmlFor="dep">{t("departure")}</Label>
                <select
                  id="dep"
                  value={departureId}
                  onChange={(e) => setDepartureId(e.target.value)}
                  className="mt-1 min-h-11 w-full rounded-md bg-paper px-3 shadow-border"
                >
                  {departures.map((d) => {
                    const seats = d.max_people - d.booked;
                    return (
                      <option key={d.id} value={d.id} disabled={seats <= 0}>
                        {d.start_date} · {aud(d.price)} · {seats} {t("seatsLeft")}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : (
              <div>
                <Label htmlFor="start">{t("start")}</Label>
                <Input
                  id="start"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            )}

            {kind !== "car" ? (
              <div>
                <Label htmlFor="guests">{t("guests")}</Label>
                <Input
                  id="guests"
                  type="number"
                  min={1}
                  max={kind === "tour" ? Math.max(1, left) : 8}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </div>
            ) : null}

            {kind !== "tour" ? (
              <div>
                <Label htmlFor="nights">{kind === "car" ? t("days") : t("nights")}</Label>
                <Input
                  id="nights"
                  type="number"
                  min={1}
                  max={21}
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                />
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input id="firstName" name="firstName" required autoComplete="given-name" />
              </div>
              <div>
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input id="lastName" name="lastName" required autoComplete="family-name" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <div>
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea id="notes" name="notes" />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={status === "busy" || (kind === "tour" && left <= 0)}>
              {kind === "tour" && left <= 0 ? t("soldOut") : t("confirm")}
            </Button>
          </form>
        )}
      </SignedIn>
    </aside>
  );
}
