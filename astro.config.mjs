// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: final domain not decided yet. Set SITE_URL in the Cloudflare Pages
// environment (or here) once it is known. Used for canonical URLs, Open Graph and the sitemap.
const SITE = process.env.SITE_URL || 'https://example.com';

export default defineConfig({
  site: SITE,
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
  integrations: [sitemap()],
});
