import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { LocaleProvider, type Locale } from "@/lib/locale";
import { Shell } from "@/components/shell";
import { absoluteUrl } from "@/lib/seo";
import appCss from "../styles.css?url";

const APP_NAME = "CoHai Travel";
const APP_DESCRIPTION = "Private journeys in Vietnam, Cambodia and Thailand. Booked in AUD.";

function localeFromPathname(pathname: string): Locale {
  return pathname.split("/").filter(Boolean)[0] === "vn" ? "vn" : "en";
}

const fetchSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const u = await getSessionUser();
  return u ? { id: u.id, email: u.email } : null;
});

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => ({
    sessionUser: await fetchSessionUser(),
    locale: localeFromPathname(location.publicHref || location.href),
  }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#1c1914" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: APP_NAME,
          description: APP_DESCRIPTION,
          url: absoluteUrl("/en"),
        }),
      },
    ],
  }),
  component: Root,
});

function Root() {
  const { locale } = Route.useRouteContext();
  return (
    <html lang={locale === "vn" ? "vi" : "en"} className="antialiased" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <LocaleProvider initialLocale={locale}>
            <Shell><Outlet /></Shell>
          </LocaleProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
