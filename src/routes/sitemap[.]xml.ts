import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { siteOriginFor } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sql = await getSql();
        const [destinations, tours, stays, cars] = await Promise.all([
          sql<{ slug: string }>`
            select slug from destinations
            where provenance_state in ('source-backed', 'modern-addition')
            order by slug
          `,
          sql<{ slug: string }>`
            select slug from tours
            where provenance_state in ('source-backed', 'modern-addition')
            order by slug
          `,
          sql<{ slug: string }>`select slug from stays order by slug`,
          sql<{ slug: string }>`select slug from cars order by slug`,
        ]);
        const origin = siteOriginFor(new URL(request.url).origin);
        const publicPaths = [
          "/",
          "/tours",
          "/destinations",
          "/stays",
          "/cars",
          "/contact",
          "/travel-notes",
          ...destinations.map((row) => "/destinations/" + row.slug),
          ...tours.map((row) => "/tours/" + row.slug),
          ...stays.map((row) => "/stays/" + row.slug),
          ...cars.map((row) => "/cars/" + row.slug),
        ];
        const urls = publicPaths.flatMap((path) => {
          const suffix = path === "/" ? "" : path;
          const englishUrl = origin + "/en" + suffix;
          const vietnameseUrl = origin + "/vn" + suffix;
          return [
            { url: englishUrl, alternateEn: englishUrl, alternateVi: vietnameseUrl },
            { url: vietnameseUrl, alternateEn: englishUrl, alternateVi: vietnameseUrl },
          ];
        });
        const entries = urls.map(({ url, alternateEn, alternateVi }) =>
          "<url><loc>" + escapeXml(url) + "</loc>" +
          '<xhtml:link rel="alternate" hreflang="en" href="' + escapeXml(alternateEn) + '"/>' +
          '<xhtml:link rel="alternate" hreflang="vi" href="' + escapeXml(alternateVi) + '"/>' +
          '<xhtml:link rel="alternate" hreflang="x-default" href="' + escapeXml(alternateEn) + '"/>' +
          "</url>",
        );
        const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
          entries.join("") + "</urlset>";
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
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  }[character] ?? character));
}
