/**
 * Languages: English at the root (/), German under /de/. Every page and component reads its language from
 * Astro.currentLocale (set by the URL), so one component serves both languages.
 */
export type Locale = 'en' | 'de';
export const locales: Locale[] = ['en', 'de'];

export const asLocale = (l?: string): Locale => (l === 'de' ? 'de' : 'en');

/** A site path in the given language: "/contact" stays "/contact" in English and becomes "/de/contact" in German. */
export function lp(locale: string | undefined, path: string): string {
  if (asLocale(locale) === 'en' || path.startsWith('#') || /^[a-z]+:/i.test(path)) return path;
  if (path === '/' || path === '') return '/de/';
  if (path.startsWith('/#')) return `/de/${path.slice(1)}`;
  return path.startsWith('/de/') ? path : `/de${path}`;
}

/** The same page in another language, from the current pathname. */
export function switchPath(pathname: string, target: Locale): string {
  const bare = pathname.replace(/^\/de(?=\/|$)/, '') || '/';
  return lp(target, bare);
}

/** Number format per language (de: 1.200, en: 1,200). */
export const numberLocale = (l?: string) => (asLocale(l) === 'de' ? 'de-DE' : 'en-GB');
