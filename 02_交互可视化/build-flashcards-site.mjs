import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(sourceDir, ".flashcards-site");
const files = [
  ["积分与反常积分识记闪卡.html", "index.html"],
  ["math2-flashcards-data.js", "math2-flashcards-data.js"],
  ["katex-0.18.4.min.js", "katex-0.18.4.min.js"],
  ["manifest.webmanifest", "manifest.webmanifest"],
  ["sw.js", "sw.js"],
  ["flashcards-icon.svg", "flashcards-icon.svg"],
  ["icon-192.png", "icon-192.png"],
  ["icon-512.png", "icon-512.png"],
  ["_headers", "_headers"]
];

await mkdir(outputDir, { recursive: true });
await Promise.all(files.map(function ([source, destination]) {
  return copyFile(path.join(sourceDir, source), path.join(outputDir, destination));
}));

process.stdout.write(`Built ${files.length} static files at ${outputDir}\n`);
