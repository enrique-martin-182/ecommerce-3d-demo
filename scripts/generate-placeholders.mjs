// Generates minimal valid GLB placeholder files and solid-color WebP images
// Run: node scripts/generate-placeholders.mjs
import { writeFileSync } from "fs";
import sharp from "sharp";

// ── GLB placeholders ────────────────────────────────────────────────────────
function makeGlb() {
  const json = JSON.stringify({ asset: { version: "2.0" } });
  const padded = json + " ".repeat((4 - (json.length % 4)) % 4);
  const jsonBytes = Buffer.from(padded, "utf8");
  const totalLen = 12 + 8 + jsonBytes.length;
  const buf = Buffer.alloc(totalLen);
  let offset = 0;
  buf.write("glTF", offset, "ascii"); offset += 4;
  buf.writeUInt32LE(2, offset); offset += 4;
  buf.writeUInt32LE(totalLen, offset); offset += 4;
  buf.writeUInt32LE(jsonBytes.length, offset); offset += 4;
  buf.write("JSON", offset, "ascii"); offset += 4;
  jsonBytes.copy(buf, offset);
  return buf;
}

const glbBuf = makeGlb();
for (const name of ["headphones", "chair", "bag", "sneaker"]) {
  writeFileSync(`public/models/${name}.glb`, glbBuf);
  console.log(`public/models/${name}.glb (${glbBuf.length} bytes)`);
}

// ── WebP placeholder images ─────────────────────────────────────────────────
const products = [
  { name: "headphones", bg: "#1a1a1a" },
  { name: "chair",      bg: "#d4a96a" },
  { name: "bag",        bg: "#c68642" },
  { name: "sneaker",    bg: "#f5f5f5" },
];

for (const { name, bg } of products) {
  const r = parseInt(bg.slice(1, 3), 16);
  const g = parseInt(bg.slice(3, 5), 16);
  const b = parseInt(bg.slice(5, 7), 16);
  await sharp({ create: { width: 400, height: 400, channels: 3, background: { r, g, b } } })
    .webp()
    .toFile(`public/products/${name}.webp`);
  console.log(`public/products/${name}.webp`);
}
