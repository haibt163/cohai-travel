import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { sendContact } from "@/lib/bookings";
import { useI18n } from "@/lib/locale";
import { PageHead } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    try {
      await sendContact({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          message: String(fd.get("message") ?? ""),
        },
      });
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div>
      <PageHead kicker={t("contact")} title={t("contact")} body={t("contactLead")} />
      <div className="mx-auto max-w-2xl px-4 pb-16">
        <div className="rounded-xl bg-surface p-6 shadow-border">
          <SignedOut>
            <p>{t("needSignIn")}</p>
            <Link to="/login" className="mt-3 inline-flex min-h-11 text-accent">
              {t("signIn")}
            </Link>
          </SignedOut>
          <SignedIn>
            {status === "ok" ? (
              <p>{t("thanks")}</p>
            ) : (
              <form className="space-y-3" onSubmit={onSubmit}>
                <div>
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea id="message" name="message" required />
                </div>
                {error ? <p className="text-sm text-danger">{error}</p> : null}
                <Button type="submit">{t("send")}</Button>
              </form>
            )}
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
