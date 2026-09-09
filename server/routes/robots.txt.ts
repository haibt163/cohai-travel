import type { IncomingMessage, ServerResponse } from "node:http";

function requestOrigin(req: IncomingMessage): string {
  const configured = process.env.VITE_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  const forwardedProto = String(req.headers["x-forwarded-proto"] ?? "http").split(",")[0] ?? "http";
  const forwardedHost = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:3000").split(",")[0] ?? "localhost:3000";
  return `${forwardedProto}://${forwardedHost}`;
}

export default function robots(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "public, max-age=3600, s-maxage=86400");
  res.end(`User-agent: *\nAllow: /\n\nSitemap: ${requestOrigin(req)}/sitemap.xml\n`);
}
