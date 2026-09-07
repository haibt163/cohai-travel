import { getSql } from "@/lib/db";

export default defineEventHandler(async (event) => {
  const sql = getSql();
  const [destinations, tours, stays, cars] = await Promise.all([
    sql`select slug from destinations order by slug`,
    sql`select slug from tours order by slug`,
    sql`select slug from stays order by slug`,
    sql`select slug from cars order by slug`,
  ]);

  const origin = process.env.VITE_SITE_URL?.replace(/\/$/, "") || getRequestURL(event).origin;
  const urls = [
    `${origin}/`,
    ...destinations.rows.map((row) => `${origin}/destinations/${row.slug}`),
    ...tours.rows.map((row) => `${origin}/tours/${row.slug}`),
    ...stays.rows.map((row) => `${origin}/stays/${row.slug}`),
    ...cars.rows.map((row) => `${origin}/cars/${row.slug}`),
  ];

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=3600, s-maxage=86400");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((url) => `<url><loc>${escapeXml(url)}</loc></url>`)
    .join("")}</urlset>`;
});

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities = { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" };
    return entities[character as keyof typeof entities];
  });
}
