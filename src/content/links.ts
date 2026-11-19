/** "#id" points at a home page section, "/path" at a page. base is "" on the home page, "/" elsewhere. */
export function href(link: string, base: string, prefix = ''): string {
  return link.startsWith('#') ? `${base}${link}` : `${prefix}${link}`;
}
