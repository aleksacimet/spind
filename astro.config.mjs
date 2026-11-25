// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import baseLinks from './integrations/base-links.mjs';

// TODO: final domain not decided yet. SITE_URL is used for canonical URLs, Open Graph and the sitemap.
// On GitHub Pages the deploy workflow sets SITE_URL (origin) and BASE_PATH (e.g. /spind) automatically.
const SITE = process.env.SITE_URL || 'https://example.com';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  // Use case pages and legal pages load before the click (hover or in view), so navigation feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  i18n: {
    defaultLocale: 'en',
    // Add 'de' here (and src/pages/de/...) when the German translation is ready.
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap(), baseLinks()],
});
