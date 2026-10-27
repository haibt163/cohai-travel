import { createFileRoute } from "@tanstack/react-router";
import { siteOriginFor } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const isPreview = process.env.VERCEL_ENV === "preview";
        const body = isPreview
          ? "User-agent: *\nDisallow: /\n"
          : "User-agent: *\nAllow: /\n\nSitemap: " + siteOriginFor(new URL(request.url).origin) + "/sitemap.xml\n";
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
