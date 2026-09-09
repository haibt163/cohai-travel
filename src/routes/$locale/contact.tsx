import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { sendContact } from "@/lib/bookings";
import { useI18n } from "@/lib/locale";
import { PageHead } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/contact")({
  head: ({ params }) => seoHead({ locale: params.locale === "vn" ? "vn" : "en", title: "Contact | CoHai Travel", description: "Tell CoHai Travel your dates, pace and who is travelling.", pathname: `/${params.locale}/contact`, alternatePathname: (l) => `/${l}/contact` }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    try {
      await sendContact({ data: { name: String(fd.get("name") ?? ""), email: String(fd.get("email") ?? ""), message: String(fd.get("message") ?? ""), website: String(fd.get("website") ?? "") } });
      setStatus("ok"); e.currentTarget.reset();
    } catch (err) { setStatus("err"); setError(err instanceof Error ? err.message : "Failed"); }
  }
  return <div><PageHead kicker={t("contact")} title={t("contact")} body={t("contactLead")} /><div className="mx-auto max-w-2xl px-4 pb-16"><div className="rounded-xl bg-surface p-6 shadow-border">{status === "ok" ? <p>{t("thanks")}</p> : <form className="space-y-3" onSubmit={onSubmit}><div><Label htmlFor="name">{t("name")}</Label><Input id="name" name="name" required autoComplete="name" /></div><div><Label htmlFor="email">{t("email")}</Label><Input id="email" name="email" type="email" required autoComplete="email" /></div><div><Label htmlFor="message">{t("message")}</Label><Textarea id="message" name="message" required /></div><div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><Label htmlFor="website">Website</Label><Input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>{error ? <p className="text-sm text-danger">{error}</p> : null}<Button type="submit">{t("send")}</Button></form>}</div></div></div>;
}
