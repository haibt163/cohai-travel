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
        const origin = (import.meta.env.VITE_SITE_URL?.trim() || requestUrl.origin).replace(/\/$/, "");
        const publicPaths = [
          "/",
          "/tours",
          "/destinations",
          "/stays",
          "/cars",
          "/contact",
          ...destinations.map((row) => `/destinations/${row.slug}`),
          ...tours.map((row) => `/tours/${row.slug}`),
          ...stays.map((row) => `/stays/${row.slug}`),
          ...cars.map((row) => `/cars/${row.slug}`),
        ];
        const urls = publicPaths.flatMap((path) => [`${origin}/en${path === "/" ? "" : path}`, `${origin}/vn${path === "/" ? "" : path}`]);
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join("")}</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=86400" } });
      },
    },
  },
});

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[character] ?? character));
}
