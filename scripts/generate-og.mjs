/**
 * Genera public/og.png (1200x630) a partir de los datos de src/data/site.ts.
 *
 *   npm run og
 *
 * Los datos se leen del mismo archivo que usa el sitio, así que la imagen
 * se mantiene sincronizada con el contenido real.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const { site } = await import('../src/data/site.ts');

const WIDTH = 1200;
const HEIGHT = 630;

/** Escapa los caracteres que romperían el XML del SVG. */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0b0f"/>
      <stop offset="100%" stop-color="#131320"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="15%" r="55%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="#0ea5e9"/>

  <g transform="translate(80, 145)">
    <text x="0" y="0" fill="#71717a" font-family="Segoe UI, Arial, sans-serif" font-size="26" letter-spacing="4">${esc(site.role).toUpperCase()}</text>

    <text x="0" y="108" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="-2">${esc(site.name)}</text>

    <text x="0" y="184" fill="#a1a1aa" font-family="Segoe UI, Arial, sans-serif" font-size="32">${esc(site.tagline)}</text>

    <g transform="translate(0, 244)">
      <rect x="0" y="0" width="56" height="56" rx="14" fill="#0ea5e9"/>
      <g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 17 13 28l9 11"/>
        <path d="M34 17l9 11-9 11"/>
      </g>
    </g>
  </g>
</svg>`;

const output = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og.png');

await mkdir(dirname(output), { recursive: true });
await writeFile(output, await sharp(Buffer.from(svg)).png().toBuffer());

console.log(`og.png generado en ${output}`);
