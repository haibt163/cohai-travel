export default defineEventHandler((event) => {
  const origin = process.env.VITE_SITE_URL?.replace(/\/$/, "") || getRequestURL(event).origin;

  setHeader(event, "content-type", "text/plain; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=3600, s-maxage=86400");

  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
});
