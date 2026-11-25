// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Hosted on Cloudflare Pages (spind-8ty.pages.dev). SITE_URL is set in the Pages project's environment
// variables; change it there when the final domain is known. Used for canonical URLs, Open Graph and the sitemap.
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
