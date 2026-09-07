/**
 * Download curated Unsplash stills into public/media/*.jpg
 * so Cover can use the seed paths without a CDN at runtime.
 *
 * Usage: npm run media
 */
import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "public", "media");
mkdirSync(dest, { recursive: true });

const shots = {
  "hero-halong.jpg": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80",
  "nature-sapa.jpg": "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80",
  "beach-phuquoc.jpg": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  "unesco-hue.jpg": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80",
  "dest-hanoi.jpg": "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1600&q=80",
  "dest-hoian.jpg": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80",
  "dest-mekong.jpg": "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=80",
  "dest-nhatrang.jpg": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=80",
  "dest-angkor.jpg": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
  "dest-bangkok.jpg": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1600&q=80",
  "stay-hanoi.jpg": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  "stay-sapa.jpg": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
  "stay-phuquoc.jpg": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80",
  "car-innova.jpg": "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1600&q=80",
};

let failed = 0;
for (const [name, url] of Object.entries(shots)) {
  const target = join(dest, name);
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok || !res.body) throw new Error(`${res.status} ${res.statusText}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(target));
    console.log(`ok    ${name}`);
  } catch (err) {
    failed += 1;
    console.warn(`fail  ${name}: ${err instanceof Error ? err.message : err}`);
  }
}

if (failed) {
  console.warn(`${failed} downloads failed. SVG plates in public/media still cover first paint.`);
  process.exitCode = 1;
} else {
  console.log("media downloaded");
}
