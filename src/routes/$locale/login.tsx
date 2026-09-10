import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { siteCopy, useI18n } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/$locale/login")({
  head: ({ params }) => { const locale = params.locale === "vn" ? "vn" : "en"; return seoHead({ locale, title: siteCopy(locale, "metaLoginTitle"), description: siteCopy(locale, "metaLoginDescription"), pathname: `/${params.locale}/login`, alternatePathname: (l) => `/${l}/login` }); },
  component: Login,
});

function Login() {
  const { t } = useI18n(); const { user, isPending } = useCurrentUserState(); const locale = Route.useParams().locale;
  if (isPending) return <div className="mx-auto max-w-md px-4 py-24"><div className="h-48 animate-pulse rounded-3xl bg-paper-2" /></div>;
  if (user) return <Navigate to="/$locale/account" params={{ locale }} />;
  return <div className="mx-auto grid min-h-hero max-w-md place-items-center px-4 py-16"><div className="w-full rounded-3xl bg-surface p-7 shadow-soft"><p className="eyebrow text-accent">{t("brand")}</p><h1 className="mt-3 text-4xl">{t("signIn")}</h1><p className="mt-3 text-sm leading-6 text-muted">{t("signInLead")}</p><div className="mt-7 space-y-2">{authEnabled ? GROK_PROVIDERS.map((p) => <Button key={p.providerId} type="button" variant="outline" className="w-full" onClick={() => signIn(p.providerId, { callbackURL: `/${locale}/account` })}>Continue with {p.label}</Button>) : <p className="text-sm text-muted">{t("needSignIn")}</p>}</div></div></div>;
}
