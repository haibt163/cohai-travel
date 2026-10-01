import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSeoHead, resolveSiteUrl } from "./seo.ts";

test("production never falls back to localhost", () => {
  assert.equal(resolveSiteUrl(undefined, false), undefined);
  assert.equal(resolveSiteUrl("  ", false), undefined);
  assert.equal(resolveSiteUrl("http://localhost:3000", false), undefined);
  assert.equal(resolveSiteUrl("http://127.0.0.1:8080", false), undefined);
  assert.equal(resolveSiteUrl("http://example.com", false), undefined);
});

test("malformed or non-http values are rejected instead of throwing later", () => {
  assert.equal(resolveSiteUrl("example.com", false), undefined);
  assert.equal(resolveSiteUrl("ftp://example.com", false), undefined);
});

test("dev keeps a localhost fallback and allows localhost values", () => {
  assert.equal(resolveSiteUrl(undefined, true), "http://localhost:3000");
  assert.equal(resolveSiteUrl("http://localhost:8080/", true), "http://localhost:8080");
});

test("a real public URL is normalised without a trailing slash", () => {
  assert.equal(resolveSiteUrl("https://www.example.com/", false), "https://www.example.com");
});

test("seoHead emits canonical, og:url and hreflang from the public URL", () => {
  const head = buildSeoHead("https://www.example.com", {
    title: "Tours",
    pathname: "/en/tours",
    locale: "en",
    alternatePathname: (l) => `/${l}/tours`,
  });
  assert.deepEqual(head.links[0], { rel: "canonical", href: "https://www.example.com/en/tours" });
  assert.ok(head.meta.some((m) => "property" in m && m.property === "og:url" && m.content === "https://www.example.com/en/tours"));
  assert.deepEqual(
    head.links.filter((l) => l.rel === "alternate").map((l) => l.hrefLang),
    ["en", "vi", "x-default"],
  );
});

test("seoHead omits canonical, og:url and hreflang when no public URL is known", () => {
  const head = buildSeoHead(undefined, {
    title: "Tours",
    pathname: "/en/tours",
    image: "/media/x.jpg",
    locale: "en",
    alternatePathname: (l) => `/${l}/tours`,
  });
  assert.equal(head.links.length, 0);
  assert.ok(!head.meta.some((m) => "property" in m && (m.property === "og:url" || m.property === "og:image")));
  assert.ok(!JSON.stringify(head).includes("localhost"));
});
