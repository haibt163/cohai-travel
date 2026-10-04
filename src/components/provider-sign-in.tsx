import { useState } from "react";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { describeSignInError } from "@/lib/auth/sign-in-error";
import { useI18n } from "@/lib/locale";
import { Button } from "@/components/ui/button";

/** Provider buttons for the login pages. Shows a visible error if sign-in cannot start. */
export function ProviderSignIn({ callbackURL }: { callbackURL: string }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(providerId: string) {
    setBusy(providerId);
    setError(null);
    try {
      await signIn(providerId, { callbackURL });
    } catch (err) {
      setError(describeSignInError(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {GROK_PROVIDERS.map((p) => (
        <Button
          key={p.providerId}
          type="button"
          variant="outline"
          className="w-full"
          disabled={busy !== null}
          onClick={() => void start(p.providerId)}
        >
          Continue with {p.label}
        </Button>
      ))}
      {error !== null && (
        <p role="alert" className="pt-2 text-sm leading-6 text-accent">
          {t("signInFailed")}
          {error ? <span className="block text-xs text-muted">{error}</span> : null}
        </p>
      )}
    </>
  );
}
