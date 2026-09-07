const DEFAULT_SITE_URL = "http://localhost:3000";

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
  image,
}: {
  title: string;
  description?: string;
  pathname?: string;
  image?: string;
}) {
  const canonical = pathname ? absoluteUrl(pathname) : getSiteUrl();
  const imageUrl = image ? absoluteUrl(image) : undefined;

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
    links: [{ rel: "canonical", href: canonical }],
  };
}
