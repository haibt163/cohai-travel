const DEFAULT_SITE_URL = "http://localhost:3000";
export type SeoLocale = "en" | "vn";

export function getSiteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  return (configured || DEFAULT_SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}

export function seoHead({
  title,
  description,
  pathname,
  alternatePathname,
  image,
  locale,
}: {
  title: string;
  description?: string;
  pathname?: string;
  alternatePathname?: (locale: SeoLocale) => string;
  image?: string;
  locale?: SeoLocale;
}) {
  const canonical = pathname ? absoluteUrl(pathname) : getSiteUrl();
  const imageUrl = image ? absoluteUrl(image) : undefined;
  const links = [{ rel: "canonical", href: canonical }];
  if (alternatePathname && locale) {
    const other: SeoLocale = locale === "en" ? "vn" : "en";
    links.push({ rel: "alternate", hrefLang: locale === "en" ? "en" : "vi", href: canonical });
    links.push({ rel: "alternate", hrefLang: other === "en" ? "en" : "vi", href: absoluteUrl(alternatePathname(other)) });
    links.push({ rel: "alternate", hrefLang: "x-default", href: absoluteUrl(alternatePathname("en")) });
  }

  return {
    meta: [
      { title },
      ...(description ? [{ name: "description", content: description }] : []),
      { property: "og:title", content: title },
      ...(description ? [{ property: "og:description", content: description }] : []),
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
      { name: "twitter:card", content: imageUrl ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      ...(description ? [{ name: "twitter:description", content: description }] : []),
    ],
    links,
  };
}
