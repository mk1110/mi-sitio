// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: cambia esto por tu dominio real (lo usan el sitemap y las URLs canónicas)
  site: 'https://portfolio-astro.netlify.app',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
