import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dest = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "media");
mkdirSync(dest, { recursive: true });

const plates = [
  { file: "hero-halong.svg", ink: "#0d2a2c", mid: "#1f6f6d", paper: "#c9b48a", title: "Ha Long" },
  { file: "nature-sapa.svg", ink: "#1c2a16", mid: "#4d6b3a", paper: "#d7c9a3", title: "Sa Pa" },
  { file: "beach-phuquoc.svg", ink: "#16333a", mid: "#2a7a7a", paper: "#e2d2b0", title: "Phu Quoc" },
  { file: "unesco-hue.svg", ink: "#3a2416", mid: "#8a5a32", paper: "#e6d7b8", title: "Hue" },
  { file: "dest-hanoi.svg", ink: "#241c16", mid: "#6f4b32", paper: "#e8dcc6", title: "Hanoi" },
  { file: "dest-hoian.svg", ink: "#4a2410", mid: "#c26b2a", paper: "#f0d7b0", title: "Hoi An" },
  { file: "dest-mekong.svg", ink: "#1a2e22", mid: "#3f6b4a", paper: "#d9cba8", title: "Mekong" },
  { file: "dest-nhatrang.svg", ink: "#12303a", mid: "#2f6f86", paper: "#d7e0d8", title: "Nha Trang" },
  { file: "dest-angkor.svg", ink: "#2b2114", mid: "#7a5a32", paper: "#dcc9a0", title: "Angkor" },
  { file: "dest-bangkok.svg", ink: "#2a1614", mid: "#8a3a2a", paper: "#e8d2b4", title: "Bangkok" },
  { file: "stay-hanoi.svg", ink: "#1c1914", mid: "#5a4632", paper: "#efe6d4", title: "Maison" },
  { file: "stay-sapa.svg", ink: "#1a2216", mid: "#4a5a32", paper: "#ddd4bc", title: "Lodge" },
  { file: "stay-phuquoc.svg", ink: "#143038", mid: "#1f6f6d", paper: "#e6dcc4", title: "Villa" },
  { file: "car-innova.svg", ink: "#161412", mid: "#4a4540", paper: "#d8d0c2", title: "Car" },
];

function svg({ ink, mid, paper, title }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1067" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${mid}"/>
      <stop offset="1" stop-color="${ink}"/>
    </linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${paper}"/>
      <stop offset="1" stop-color="${mid}"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.18 0"/>
    </filter>
  </defs>
  <rect width="1600" height="1067" fill="url(#sky)"/>
  <path d="M0 720 C240 640 380 780 560 700 C760 610 880 820 1120 690 C1280 610 1460 740 1600 680 L1600 1067 L0 1067 Z" fill="url(#land)" opacity="0.92"/>
  <ellipse cx="1180" cy="240" rx="90" ry="90" fill="${paper}" opacity="0.35"/>
  <rect width="1600" height="1067" filter="url(#grain)"/>
  <text x="64" y="980" fill="${paper}" font-family="Georgia, serif" font-size="42" letter-spacing="6">${title.toUpperCase()}</text>
</svg>
`;
}

for (const p of plates) {
  writeFileSync(join(dest, p.file), svg(p));
  console.log(p.file);
}
