/** Line icons (22 x 22 viewBox, stroke only), one per solution, shared by tiles and menus. */
export const solutionIcons: Record<string, string> = {
  'eol-rollout': 'M4 7h10v8H4zM10 15v3M7 18h6M14 9l4-2v10',
  'faulty-device-swap': 'M5 4h8v14H5zM16 8l3 3-3 3M19 11h-6',
  'new-device-pickup': 'M6 4h10v14H6zM9 15h4',
  onboarding: 'M4 19c0-4 3-6 7-6s7 2 7 6M11 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  offboarding: 'M5 5h9v13H5zM14 11h6M17 8l3 3-3 3',
  'multi-site': 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM3 11h16M11 3c3 3 3 13 0 16M11 3c-3 3-3 13 0 16',
};
/** Icon for a menu or tile link, from its /solutions/<slug> href. */
export const iconForHref = (href: string) => solutionIcons[href.replace('/solutions/', '')];
