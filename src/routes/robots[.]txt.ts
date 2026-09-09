import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const origin =
          (import.meta.env.VITE_SITE_URL?.trim() || requestUrl.origin).replace(/\/$/, "");
        const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
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
