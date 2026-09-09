import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sql = await getSql();
        const [destinations, tours, stays, cars] = await Promise.all([
          sql<{ slug: string }>`select slug from destinations order by slug`,
          sql<{ slug: string }>`select slug from tours order by slug`,
          sql<{ slug: string }>`select slug from stays order by slug`,
          sql<{ slug: string }>`select slug from cars order by slug`,
        ]);

        const requestUrl = new URL(request.url);
        const origin =
          (import.meta.env.VITE_SITE_URL?.trim() || requestUrl.origin).replace(/\/$/, "");
        const urls = [
          `${origin}/`,
          `${origin}/tours`,
          `${origin}/destinations`,
          `${origin}/stays`,
          `${origin}/cars`,
          `${origin}/contact`,
          ...destinations.map((row) => `${origin}/destinations/${row.slug}`),
          ...tours.map((row) => `${origin}/tours/${row.slug}`),
          ...stays.map((row) => `${origin}/stays/${row.slug}`),
          ...cars.map((row) => `${origin}/cars/${row.slug}`),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
          .map((url) => `<url><loc>${escapeXml(url)}</loc></url>`)
          .join("")}</urlset>`;

        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}
