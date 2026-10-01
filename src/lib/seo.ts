const DEV_SITE_URL = "http://localhost:3000";
export type SeoLocale = "en" | "vn";

type SeoLink = { rel: string; href: string; hrefLang?: string };

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);

/**
 * Resolve the public site URL from the configured value.
 *
 * Returns `undefined` instead of guessing when there is no trustworthy public URL:
 * a missing, malformed, or non-HTTPS public value, or a localhost value outside dev.
 * Callers must omit canonical/og:url/hreflang rather than emit a wrong address.
 */
export function resolveSiteUrl(configured: string | undefined, isDev: boolean): string | undefined {
  const value = configured?.trim();
  if (!value) return isDev ? DEV_SITE_URL : undefined;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return undefined;
  }
  if (isDev) {
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return undefined;
  } else {
    if (parsed.protocol !== "https:") return undefined;
    if (LOCAL_HOSTNAMES.has(parsed.hostname)) return undefined;
  }
  return parsed.origin + parsed.pathname.replace(/\/$/, "");
}

export function getSiteUrl(): string | undefined {
  return resolveSiteUrl(import.meta.env.VITE_SITE_URL, import.meta.env.DEV);
}

/** Origin for sitemap.xml and robots.txt: the configured public URL, else the request's own origin. */
export function siteOriginFor(requestOrigin: string): string {
  return getSiteUrl() ?? requestOrigin.replace(/\/$/, "");
}

function joinUrl(siteUrl: string, pathname: string): string {
  return new URL(pathname, `${siteUrl}/`).toString();
}

export function absoluteUrl(pathname: string): string | undefined {
  const siteUrl = getSiteUrl();
  return siteUrl ? joinUrl(siteUrl, pathname) : undefined;
}

type SeoArgs = {
  title: string;
  description?: string;
  pathname?: string;
  alternatePathname?: (locale: SeoLocale) => string;
  image?: string;
  locale?: SeoLocale;
};

/** Pure builder; `siteUrl` is `undefined` when no public URL is known. */
export function buildSeoHead(
  siteUrl: string | undefined,
  { title, description, pathname, alternatePathname, image, locale }: SeoArgs,
) {
  const abs = (path: string) => (siteUrl ? joinUrl(siteUrl, path) : undefined);
  const canonical = siteUrl ? (pathname ? joinUrl(siteUrl, pathname) : siteUrl) : undefined;
  const imageUrl = image ? abs(image) : undefined;
  const links: SeoLink[] = [];
  if (canonical) links.push({ rel: "canonical", href: canonical });
  if (siteUrl && alternatePathname && locale) {
    links.push({ rel: "alternate", hrefLang: "en", href: joinUrl(siteUrl, alternatePathname("en")) });
    links.push({ rel: "alternate", hrefLang: "vi", href: joinUrl(siteUrl, alternatePathname("vn")) });
    links.push({ rel: "alternate", hrefLang: "x-default", href: joinUrl(siteUrl, alternatePathname("en")) });
  }
  return {
    meta: [
      { title },
      ...(description ? [{ name: "description", content: description }] : []),
      { property: "og:title", content: title },
      ...(description ? [{ property: "og:description", content: description }] : []),
      { property: "og:type", content: "website" },
      ...(canonical ? [{ property: "og:url", content: canonical }] : []),
      ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
      { name: "twitter:card", content: imageUrl ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      ...(description ? [{ name: "twitter:description", content: description }] : []),
    ],
    links,
  };
}

export function seoHead(args: SeoArgs) {
  return buildSeoHead(getSiteUrl(), args);
}
