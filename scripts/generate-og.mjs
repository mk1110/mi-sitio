/**
 * Genera la imagen de Open Graph (1200x630) a partir de los datos de
 * src/data/site.ts.
 *
 *   npm run og
 *
 * Los datos se leen del mismo archivo que usa el sitio, así que la imagen
 * se mantiene sincronizada con el contenido real.
 *
 * Si cambiás el diseño y los previews siguen mostrando la imagen vieja,
 * subí la versión en `site.ogImage` (og-v2.png -> og-v3.png) y volvé a
 * correr este script: WhatsApp y LinkedIn cachean la imagen por mucho tiempo
 * y no la vuelven a pedir aunque el archivo haya cambiado.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const { site } = await import('../src/data/site.ts');

const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 84;

/** Escapa los caracteres que romperían el XML del SVG. */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Parte el texto en líneas de a lo sumo `max` caracteres.
 * Las previsualizaciones se ven chicas: un titular largo se vuelve ilegible.
 */
function wrap(text, max) {
  const lines = [];
  let line = '';

  for (const word of String(text).split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Dibuja varias líneas de texto y devuelve el `y` donde sigue el bloque.
 */
function textBlock({ lines, x, y, size, lineHeight, fill, anchor = 'start' }) {
  const body = lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lineHeight}" fill="${fill}" font-size="${size}" text-anchor="${anchor}">${esc(line)}</text>`,
    )
    .join('\n    ');

  return { body, end: y + (lines.length - 1) * lineHeight };
}

// --- Contenido -------------------------------------------------------

const nameLines = wrap(site.name, 14);
const taglineLines = wrap(site.tagline, 56);

// El badge se dibuja con ancho fijo y el texto centrado. Así el padding
// queda parejo aunque la fuente que resuelva el nombre sea más angosta o
// más ancha de lo esperado.
const BADGE_W = 520;

// --- Posiciones verticales -------------------------------------------
// Se arman en cascada para que todo siga encajando si el nombre
// ocupa una o dos líneas.

const badgeY = 96;

const nameBlock = textBlock({
  lines: nameLines,
  x: PAD,
  y: 238,
  size: 96,
  lineHeight: 100,
  fill: 'url(#titleGradient)',
});

const taglineBlock = textBlock({
  lines: taglineLines,
  x: PAD,
  y: nameBlock.end + 76,
  size: 31,
  lineHeight: 44,
  fill: '#a1a1aa',
});

const FOOTER_Y = HEIGHT - 108;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="Segoe UI, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#09090b"/>
      <stop offset="55%" stop-color="#101018"/>
      <stop offset="100%" stop-color="#160f26"/>
    </linearGradient>

    <radialGradient id="glowA" cx="78%" cy="18%" r="52%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="glowB" cx="18%" cy="92%" r="48%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="accentBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="50%" stop-color="#8b3dff"/>
      <stop offset="100%" stop-color="#d946ef"/>
    </linearGradient>

    <linearGradient id="titleGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e9d5ff"/>
    </linearGradient>

    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>

    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="#ffffff" fill-opacity="0.10"/>
    </pattern>
  </defs>

  <!-- Fondo -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowA)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowB)"/>

  <!-- Barra superior de acento -->
  <rect x="0" y="0" width="${WIDTH}" height="8" fill="url(#accentBar)"/>

  <!-- Badge con el rol -->
  <rect x="${PAD}" y="${badgeY}" width="${BADGE_W}" height="46" rx="23" fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="${PAD + BADGE_W / 2}" y="${badgeY + 31}" fill="#d4d4d8" font-size="21" font-weight="600" letter-spacing="1.5" text-anchor="middle">${esc(site.role).toUpperCase()}</text>

  <!-- Nombre y bajada -->
  ${nameBlock.body}
  ${taglineBlock.body}

  <!-- Pie: disponibilidad + ubicación -->
  <circle cx="${PAD + 6}" cy="${FOOTER_Y + 20}" r="8" fill="#34d399"/>
  <text x="${PAD + 28}" y="${FOOTER_Y + 28}" fill="#6ee7b7" font-size="24" font-weight="600">${esc(site.availability)}</text>
  <text x="660" y="${FOOTER_Y + 28}" fill="#71717a" font-size="24">${esc(site.location)}</text>

  <!-- Monograma al costado -->
  <g transform="translate(1054, 180)">
    <rect x="0" y="0" width="86" height="86" rx="24" fill="url(#accentBar)"/>
    <text x="43" y="59" fill="#ffffff" font-size="46" font-weight="700" text-anchor="middle">${esc(site.name.charAt(0))}</text>
  </g>
</svg>`;

const output = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  site.ogImage.replace(/^\//, ''),
);

await mkdir(dirname(output), { recursive: true });
// Sin `quality`: activa la cuantización a paleta de sharp y deja manchas
// de tramado sobre los degradados y los patrones de puntos.
await writeFile(output, await sharp(Buffer.from(svg)).png().toBuffer());

console.log(`Imagen OG generada en ${output}`);
