import type { IncomingMessage, ServerResponse } from "node:http";
import { getSql } from "@/lib/db";

type SlugRow = { slug: string };

function requestOrigin(req: IncomingMessage): string {
  const configured = process.env.VITE_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  const forwardedProto = String(req.headers["x-forwarded-proto"] ?? "http").split(",")[0] ?? "http";
  const forwardedHost = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:3000").split(",")[0] ?? "localhost:3000";
  return `${forwardedProto}://${forwardedHost}`;
}

export default async function sitemap(req: IncomingMessage, res: ServerResponse) {
  const sql = await getSql();
  const [destinations, tours, stays, cars] = await Promise.all([
    sql<SlugRow>`select slug from destinations order by slug`,
    sql<SlugRow>`select slug from tours order by slug`,
    sql<SlugRow>`select slug from stays order by slug`,
    sql<SlugRow>`select slug from cars order by slug`,
  ]);

  const origin = requestOrigin(req);
  const urls = [
    `${origin}/`,
    ...destinations.map((row) => `${origin}/destinations/${row.slug}`),
    ...tours.map((row) => `${origin}/tours/${row.slug}`),
    ...stays.map((row) => `${origin}/stays/${row.slug}`),
    ...cars.map((row) => `${origin}/cars/${row.slug}`),
  ];

  res.setHeader("content-type", "application/xml; charset=utf-8");
  res.setHeader("cache-control", "public, max-age=3600, s-maxage=86400");
  res.end(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
      .map((url) => `<url><loc>${escapeXml(url)}</loc></url>`)
      .join("")}</urlset>`,
  );
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '\"': "&quot;",
    };
    return entities[character as keyof typeof entities];
  });
}
