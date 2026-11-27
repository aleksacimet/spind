/** Line icons (22 x 22 viewBox, stroke only), shared by menus and tiles. Same set as the Figma "Icon/*" components. */
export const solutionIcons: Record<string, string> = {
  'eou-rollout': 'M4 7h10v8H4zM10 15v3M7 18h6M14 9l4-2v10',
  'faulty-device-swap': 'M5 4h8v14H5zM16 8l3 3-3 3M19 11h-6',
  'temporary-device': 'M5 4h8v14H5zM8 15h2M17 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM17 9v2l1.2 1.2',
  'lost-device': 'M5 4h9v14H5zM8 15h3M16.5 8.5a2 2 0 1 1 2.5 1.9c-.6.2-1 .7-1 1.3v.8M18 15.5v.5',
  onboarding: 'M4 19c0-4 3-6 7-6s7 2 7 6M11 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  offboarding: 'M5 5h9v13H5zM14 11h6M17 8l3 3-3 3',
  'multi-site': 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM3 11h16M11 3c3 3 3 13 0 16M11 3c-3 3-3 13 0 16',
};
export const productIcons: Record<string, string> = {
  'how-it-works': 'M5 5h5v5H5zM12 12h5v5h-5zM10 7.5h4.5V12',
  modules: 'M3 4h7v14H3zM12 4h7v6h-7zM12 12h7v6h-7z',
  /* Industries (Case studies menu) */
  'ind-logistics': 'M2 6h11v9H2zM13 9h4l3 3v3h-7zM5 17a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M14 17a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0',
  'ind-office': 'M4 19V4h9v15M13 9h5v10M7 7h3M7 10.5h3M7 14h3M15.5 12h0.5M15.5 15h0.5M2 19h18',
  'ind-campus': 'M2 19h18M3 19V9l5-3 5 3v10M13 19V5h6v14M6 11h4M6 14.5h4M15.5 8h2M15.5 11.5h2M15.5 15h2',
  'ind-healthcare': 'M8.5 3h5v5.5H19v5h-5.5V19h-5v-5.5H3v-5h5.5z',
  service: 'M14.5 3.5a4 4 0 0 0-5 5L4 14l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z',
  platform: 'M3 4h16v11H3zM8 19h6M11 15v4',
  workflows: 'M4 6h5v4H4zM13 12h5v4h-5zM9 8h2a2 2 0 0 1 2 2v4',
  integrations: 'M8 3v4M14 3v4M6 7h10v4a5 5 0 0 1-10 0zM11 16v3',
  lifecycle: 'M18 11a7 7 0 0 1-12.5 4.3M4 11A7 7 0 0 1 16.5 6.7M16.5 3v3.7h-3.7M5.5 19v-3.7h3.7',
};
/** Integration icons (same 22px line style). */
/** Problem section (Touchpoints for one faulty device). */
export const problemIcons: Record<string, string> = {
  waste: 'M6 3h10M6 19h10M7 3v3l4 5-4 5v3M15 3v3l-4 5 4 5v3',
  hybrid: 'M3 10l8-6 8 6v9H3zM9 19v-5h4v5',
  sites: 'M8 19s-5-4.5-5-8.5a5 5 0 0 1 10 0c0 4-5 8.5-5 8.5zM8 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM14.5 5.6A5 5 0 0 1 19 10.5c0 3-3 6-4.5 7.5',
  offhours: 'M17.5 13.5A7 7 0 0 1 8.5 4.5a7 7 0 1 0 9 9z',
};

export const integrationIcons: Record<string, string> = {
  lissa: 'M3 4h16v11H3zM8 19h6M11 15v4M7 8h8M7 11h5',
  signin: 'M3 6h16v11H3zM8.5 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5.5 15c.5-1.5 1.6-2 3-2s2.5.5 3 2M13 9h3.5M13 12h3.5',
  servicedesk: 'M3 7h16v3a1.5 1.5 0 0 0 0 3v3H3v-3a1.5 1.5 0 0 0 0-3zM13 7v9M6.5 10.5h3M6.5 13h2',
  erp: 'M3 4h16v14H3zM3 9h16M9 9v9M3 13.5h16',
  hr: 'M2.5 18c0-3 2.2-5 5-5s5 2 5 5M7.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM14.5 10.5a2.5 2.5 0 1 0 0-5M15.5 13c2.2.4 4 2.2 4 5',
  endpoint: 'M3 5h16v10H3zM7 19h8M11 15v4M8 10l2 2 4-4',
  api: 'M7 6l-5 5 5 5M15 6l5 5-5 5M12.5 4l-3 14',
  events: 'M12 2 5 12.5h6L10 20l7-10.5h-6z',
  file: 'M6 3h7l4 4v12H6zM13 3v4h4M9 12h5M9 15h5',
  sso: 'M15 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM11.5 11v8M11.5 15h3M11.5 18h2',
  shield: 'M11 2.5l7 3v5.5c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V5.5zM8 11l2 2 4-4',
  log: 'M5 3h12v16H5zM8 7h6M8 10.5h6M8 14h4',
  roles: 'M11 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 19c0-3.5 2.6-6 6-6s6 2.5 6 6',
  eu: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM3 11h16M11 3c3 3 3 13 0 16M11 3c-3 3-3 13 0 16',
  partners: 'M2 6h11v9H2zM13 9h4l3 3v3h-7zM5 17a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M14 17a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0',
  logistics: 'M2 6h11v9H2zM13 9h4l3 3v3h-7zM5 17a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M14 17a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0',
  iso: 'M11 2.5l7 3v5.5c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V5.5zM11 7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9.5 13l-1 3.5 2.5-1.2 2.5 1.2-1-3.5',
  tenant: 'M3 3h7v7H3zM12 3h7v7h-7zM3 12h7v7H3zM12 12h7v7h-7z',
  teams: 'M3 5h12v9H8l-4 3v-3H3zM17 9h2v8h-1v2.5L15.5 17H11v-1.5',
  ai: 'M5 6h12v10H5zM8 3v3M14 3v3M8 16v3M14 16v3M2 9h3M2 13h3M17 9h3M17 13h3M9 9.5h4v3H9z',
  access: 'M4 6h14v10H4zM7 10h4M7 13h2M15 9.5v3',
  filling: 'M4 4h14v15H4zM4 9h14M4 14h14M9 6.5h4M9 11.5h4M9 16.5h4',
  service: 'M14.5 3.5a4 4 0 0 0-4.9 5.4L3.5 15l3.5 3.5 6.1-6.1a4 4 0 0 0 5.4-4.9l-2.6 2.6-2.4-.6-.6-2.4z',
  /* Service partners (Integrations > Services): the client's own partner, suppliers, repair. */
  partner: 'M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3.3 2.2-5.5 5-5.5M13 12h7v7h-7zM15 15.5h3',
  supplier: 'M3 7l8-4 8 4v8l-8 4-8-4zM3 7l8 4 8-4M11 11v8',
  repair: 'M18 11a7 7 0 0 1-12.5 4.3M4 11A7 7 0 0 1 16.5 6.7M16.5 3v3.7h-3.7M5.5 19v-3.7h3.7',
};

/** Use case pages: who pays for the problem (pain cards) and the two benefit columns. */
export const whoIcons: Record<string, string> = {
  employee: 'M11 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 19c0-3.5 2.6-6 6-6s6 2.5 6 6',
  it: 'M3 4h16v11H3zM8 19h6M11 15v4',
  company: 'M4 19V4h9v15M13 9h5v10M7 7h3M7 10.5h3M7 14h3M15.5 12h0.5M15.5 15h0.5M2 19h18',
};
const all: Record<string, string> = { ...solutionIcons, ...productIcons };
/** Icon for a menu link: its own icon key, else the slug of its /use-cases/<slug> or #section href. */
export const iconFor = (item: { href: string; icon?: string }) => all[item.icon ?? item.href.replace('/use-cases/', '').replace('#', '')];
/** Icon for a tile link, from its /use-cases/<slug> href. */
export const iconForHref = (href: string) => solutionIcons[href.replace('/use-cases/', '')];

/** Platform feature cards (22×22 line icons, same style as the rest). */
export const featureIcons: Record<string, string> = {
  status: 'M2 11h4l2-5 4 10 2-5h6',
  capacity: 'M3 3h16v16H3zM3 9h16M3 14h16M11 9v10',
  requests: 'M5 3h12v16H5zM8 8l1.5 1.5L12 7M8 13l1.5 1.5L12 12M14 8h1M14 13h1',
  expiry: 'M11 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM11 8v4l3 2M8 1.5h6',
  log: 'M5 3h12v16H5zM8 7h6M8 10.5h6M8 14h4',
  maps: 'M2 5l6-2 6 2 6-2v14l-6 2-6-2-6 2zM8 3v14M14 5v14',
};
