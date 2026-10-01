import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = readFileSync("src/routes/__root.tsx", "utf8");

// Icon-ish hrefs the root layout links to; every one must be a tracked file in public/.
const hrefs = [...root.matchAll(/rel:\s*"(?:icon|manifest|apple-touch-icon)"[^}]*?href:\s*"([^"]+)"/g)].map((m) => m[1]);

function pngSize(path) {
  const b = readFileSync(path);
  assert.equal(b.subarray(1, 4).toString(), "PNG", `${path} is not a PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

test("root layout links at least favicon, manifest and apple-touch-icon", () => {
  for (const wanted of ["/favicon.svg", "/site.webmanifest", "/icon-180.png"]) {
    assert.ok(hrefs.includes(wanted), `missing link to ${wanted}`);
  }
});

test("every icon/manifest link resolves to a file shipped in public/ (not gitignored /__grok/)", () => {
  for (const href of hrefs) {
    assert.ok(!href.startsWith("/__grok/"), `${href} lives in the gitignored __grok folder`);
    assert.ok(existsSync(`public${href}`), `public${href} does not exist`);
  }
});

test("apple-touch-icon is 180x180", () => {
  assert.deepEqual(pngSize("public/icon-180.png"), [180, 180]);
});

test("manifest icons exist with the sizes they declare, including a maskable one", () => {
  const manifest = JSON.parse(readFileSync("public/site.webmanifest", "utf8"));
  assert.ok(manifest.name && manifest.start_url);
  assert.ok(manifest.icons.some((i) => i.purpose === "maskable"), "no maskable icon");
  for (const icon of manifest.icons) {
    const [w, h] = icon.sizes.split("x").map(Number);
    assert.deepEqual(pngSize(`public${icon.src}`), [w, h], icon.src);
  }
});
