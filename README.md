# Portfolio — Astro + Tailwind CSS

Portfolio personal de una sola página, construido con [Astro](https://astro.build) 7 y
[Tailwind CSS](https://tailwindcss.com) 4. Salida 100% estática: sin cliente JavaScript de
frameworks, sin dependencias de iconos, sin peticiones a fuentes externas.

## Requisitos

- **Node.js 24+** (Astro 7 lo requiere)

Si tienes `nvm-windows`:

```bash
nvm install 24
nvm use 24
```

## Comandos

```bash
npm install       # Instala dependencias
npm run dev       # Servidor de desarrollo en http://localhost:4321
npm run build     # Build de producción en dist/
npm run preview   # Sirve el build de producción
npm run check     # Chequeo de tipos (TypeScript estricto)
npm run og        # Regenera public/og.png desde src/data/site.ts
```

## Cómo personalizar el sitio

**Todo tu contenido está en un único archivo: [`src/data/site.ts`](src/data/site.ts).**
Ahí están tu nombre, rol, redes, email, navegación, stack tecnológico y proyectos.
Edita ese archivo y el sitio entero se actualiza.

Los valores vienen como placeholders marcados con `// TODO`. Búscalos con:

```bash
grep -rn "TODO" src/
```

### Cambiar el color de acento

En [`src/styles/global.css`](src/styles/global.css), dentro de `@theme`, edita las variables
`--color-accent-50` … `--color-accent-950`. Se actualizan botones, enlaces, badges e iconos.

### Cambiar el dominio

Actualiza `site` en [`astro.config.mjs`](astro.config.mjs) y la línea `Sitemap` de
[`public/robots.txt`](public/robots.txt).

### Añadir un icono

Los trazados viven en [`src/components/icons/Icon.astro`](src/components/icons/Icon.astro).
Copia un icono de [Lucide](https://lucide.dev), añade su nombre a `IconName` en
[`src/types.ts`](src/types.ts) y listo.

## Estructura

```
src/
├── data/site.ts          ← tu contenido (edita aquí)
├── types.ts              ← tipos compartidos
├── styles/global.css     ← tokens de diseño, variante dark, utilidades propias
├── layouts/BaseLayout.astro  ← <head>, SEO, OpenGraph, JSON-LD, anti-FOUC
├── components/
│   ├── Section.astro     ← wrapper reutilizable de sección
│   ├── Header.astro      ← navegación + menú móvil
│   ├── ThemeToggle.astro ← alternador oscuro/claro
│   ├── Hero.astro
│   ├── About.astro
│   ├── Skills.astro
│   ├── Projects.astro
│   ├── ProjectCard.astro ← tarjeta parametrizada por props
│   ├── Contact.astro
│   ├── Footer.astro
│   └── icons/Icon.astro  ← SVG en línea, sin dependencias
└── pages/
    ├── index.astro       ← ensambla todas las secciones
    └── 404.astro
```

## Despliegue

El proyecto ya incluye `netlify.toml` y `vercel.json`. Solo sube el código a un repositorio
y conéctalo; no hace falta configuración adicional.

- **Netlify** — build `npm run build`, publicación `dist`
- **Vercel** — idem, detectado automáticamente

Ambos fijan `NODE_VERSION = "24"` para que el build use la versión correcta de Node.

## Detalles de implementación

- **Modo oscuro por defecto** con alternancia a claro. Se implementa con la variante
  `@custom-variant dark` de Tailwind v4 (estrategia por clase, no por media query), un
  script anti-FOUC en el `<head>` y persistencia en `localStorage`.
- **Accesibilidad**: enlace de salto al contenido, landmarks semánticos, jerarquía de
  encabezados sin saltos, `aria-expanded`/`aria-controls` en el menú móvil, cierre con Escape,
  foco visible y respeto por `prefers-reduced-motion`.
- **SEO**: canonical, OpenGraph, Twitter card, JSON-LD `schema.org/Person` y sitemap
  generado por `@astrojs/sitemap`.
- **Iconos**: SVG de Lucide en línea. Cero dependencias, cero peticiones extra.
- **Fuentes**: pila de fuentes del sistema. 0 KB y sin peticiones de red.
