import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/locale";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="mx-auto max-w-md px-4 py-24"><div className="h-48 animate-pulse rounded-xl bg-paper-2" /></div>;
  }
  if (user) return <Navigate to="/account" />;

  return (
    <div className="mx-auto grid min-h-hero max-w-md place-items-center px-4 py-16">
      <div className="w-full rounded-xl bg-surface p-6 shadow-border">
        <p className="text-xs uppercase tracking-caps text-accent">{t("brand")}</p>
        <h1 className="mt-2 font-display text-3xl">{t("signIn")}</h1>
        <p className="mt-2 text-sm text-muted">{t("signInLead")}</p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/account" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
