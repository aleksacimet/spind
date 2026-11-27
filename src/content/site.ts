/**
 * All website copy, flags and contact data live in this file (English) and in site.de.ts (German).
 *
 * Editing tips for non-developers:
 * - Change only the text between quotes. Keep the quotes and commas.
 * - Titles have no full stop. Body copy is one sentence with one full stop.
 * - Do not use em dashes.
 * - When you change English copy here, change the same line in site.de.ts.
 *
 * Customer rule (Nov 2026): no logos, no company names and no names of people anywhere on the site.
 * Describe customers by industry and size only, for example "Logistics company, 12 sites".
 */
import { de } from './site.de';

export const flags = {
  /**
   * Shows the "Already running at enterprise clients" section (anonymized: industry and size, no names).
   * TODO: keep false until the clients approve even the anonymized figures.
   */
  showClients: false,
  /**
   * Shows the anonymized SAMPLE cases (Pera's four cases: office, hospital, logistics, campus), labelled "Example".
   * Results and quotes are placeholders until a customer approves real ones in writing.
   */
  exampleProof: true,
};

/** Customer stories pages, menu and footer links are built when there is something to show. */
export const showStories = flags.showClients || flags.exampleProof;

export const contact = {
  name: 'Pera Jovicki',
  photo: '/images/pera-jovicki.png',
  email: 'pjovicki@cimet.rs',
  phone: '+43 664 171 88 84',
  phoneHref: '+436641718884',
};

/** Status of an integration, from Pera's integration proposal (Nov 2026). */
export type IntegrationStatus = 'available' | 'request' | 'pilot';

const en = {
  meta: {
    /** Home page title: the brand name only. Other pages read "Page | Spind". */
    title: 'Spind',
    description:
      'Spind is the smart locker for enterprise IT: employees pick up, return and swap devices around the clock, at every site, while IT sees every handover.',
    ogAlt: 'Spind, the smart locker for enterprise IT',
    homeLabel: 'Spind, home',
  },

  nav: {
    /**
     * Header menus (mega menu on desktop, accordion on mobile) and footer link groups.
     * href: "#id" is a section on the home page, "/path" is a page. Keep the subtitles short (one line in the menu).
     */
    groups: [
      {
        id: 'product',
        label: 'Product',
        columns: [
          {
            title: 'Spind locker',
            items: [
              { label: 'How it works', text: 'Request, identify, open, logged', href: '#how-it-works' },
              { label: 'Modules and sizes', text: 'Start with one, grow as you go', href: '/locker' },
            ],
          },
          {
            title: 'Platform',
            items: [
              { label: 'Platform', text: 'Full control of every locker', href: '/platform', icon: 'platform' },
              { label: 'Workflows', text: 'Today compared with Spind', href: '/workflows', icon: 'workflows' },
              { label: 'Integrations', text: 'Your systems and your partners', href: '/integrations', icon: 'integrations' },
            ],
          },
        ],
        feature: {
          label: 'Video',
          title: 'See Spind in action',
          text: 'A short film of a real pickup, from the request to the open drawer.',
          cta: 'Watch the video',
          href: '#video',
        },
      },
      {
        id: 'use-cases',
        label: 'Use cases',
        columns: [
          {
            title: 'Device lifecycle',
            items: [
              { label: 'Faulty device swap', text: 'Take the new one, leave the old', href: '/use-cases/faulty-device-swap' },
              { label: 'Temporary devices', text: 'A loan device for a project', href: '/use-cases/temporary-device' },
              { label: 'Lost device', text: 'A replacement on the same day', href: '/use-cases/lost-device' },
              { label: 'EOU rollout', text: 'Old device in, new device out', href: '/use-cases/eou-rollout' },
            ],
          },
          {
            title: 'People and sites',
            items: [
              { label: 'Onboarding', text: 'Day one starts at the locker', href: '/use-cases/onboarding' },
              { label: 'Offboarding return', text: 'Return equipment any time', href: '/use-cases/offboarding' },
              { label: 'Multi-site IT', text: 'One process for every branch', href: '/use-cases/multi-site' },
            ],
          },
        ],
        feature: {
          label: 'Business case',
          title: 'See how much IT time Spind saves',
          text: 'Put in your own numbers and see the hours your IT team gets back.',
          cta: 'Open the calculator',
          href: '/business-case',
        },
      },
    ],
    /** Plain links after the menus. Pricing was removed from the navigation (round 8). */
    links: [] as { id: string; label: string; href: string }[],
    // Customer stories are linked from the quotes section when there are stories to show (showStories).
    customers: { label: 'Customer stories', text: 'How IT teams use Spind', href: '/customers' },
    caseStudies: {
      label: 'Case studies',
      feature: {
        label: 'All stories',
        title: 'How IT teams run handovers with Spind',
        text: 'Every customer story in one place, filtered by industry.',
        cta: 'See all stories',
        href: '/customers',
      },
    },
    cta: 'Book a call',
    /** Language selector at the end of the menu. */
    languages: [
      { code: 'en', label: 'English' },
      { code: 'de', label: 'Deutsch' },
    ],
    languageLabel: 'Language',
    menu: 'Menu',
    close: 'Close menu',
    skip: 'Skip to content',
  },

  hero: {
    title: 'Devices available 24/7, without bothering the IT desk',
    intro: 'Employees request a device in the app or simply tap their badge at the locker, Spind opens the right drawer, and IT sees every handover.',
    primary: 'Book a call',
    secondary: 'See how it works',
    lockerLabel: 'Front view of a Spind locker with a master module and drawers, one drawer open',
    /** Text on the touch screen of the 3D locker in the hero. {n} is the drawer number. Keep it short. */
    screen: {
      idleTitle: 'Pick up a device',
      idleText: 'Tap your badge to start',
      start: 'Start',
      openTitle: 'Drawer {n} is open',
      openText: 'Take your device and close it',
      footer: 'Open 24/7',
    },
  },

  problem: {
    title: 'Touchpoints for one faulty device',
    intro: '',
    cards: [
      { icon: 'waste', title: 'Talent waste', text: 'Senior people spend hours on handovers instead of working' },
      { icon: 'hybrid', title: 'Hybrid work', text: 'Employees are rarely on site when IT staff is' },
      { icon: 'sites', title: 'Many sites', text: 'Every branch expects the same service, but few have IT staff' },
      { icon: 'offhours', title: 'Off-hours', text: 'Devices break at 6 am and on weekends, not 9 to 5' },
    ],
  },

  /** Drawer label strips (mono caps above each section), by section id. */
  sectionLabels: {
    problem: 'The problem',
    'how-it-works': 'How it works',
    modules: 'Modules and sizes',
    workflows: 'Use cases',
    compare: 'Today vs Spind',
    platform: 'Platform',
    integrations: 'Integrations',
    clients: 'Clients',
    quotes: 'Customers',
    pricing: 'Pricing',
    'go-live': 'Rollout',
    faq: 'Frequently asked questions',
    'integration-faq': 'Frequently asked questions',
    video: 'Video',
    service: 'Service',
    flow: 'How it works',
    more: 'More use cases',
    glance: 'At a glance',
    situation: 'The problem',
    log: 'Activity log',
    benefits: 'What changes',
    connects: 'Integrations',
    proof: 'Customers',
    'uc-faq': 'Frequently asked questions',
    kinds: 'Overview',
    map: 'Architecture',
    systems: 'Systems',
    services: 'Services',
    levels: 'Partner access',
    stages: 'Rollout stages',
    security: 'Security',
    contact: 'Contact',
    'business-case': 'Business case',
    stories: 'Customer stories',
    cta: 'Next step',
    features: 'Features',
  } as Record<string, string>,

  how: {
    title: 'From request to device in 4 steps',
    intro: '',
    steps: [
      { role: 'Employee', title: 'Request', text: 'The employee asks in the app or in Teams, or simply walks up to the locker.' },
      { role: 'Employee', title: 'Identify', text: 'They tap their RFID badge, or scan the QR code or enter the PIN from the app.' },
      { role: 'Spind', title: 'Open', text: 'Spind opens the right drawer: they take the new device and leave the old one.' },
      { role: 'IT', title: 'Tracked', text: 'Every action is logged in our application.' },
    ],
    lockerLabel: 'Spind locker showing the current step: request, identify, open drawer or logged',
    /** Locker screen per step. Keep each under 18 characters. */
    screen: { request: 'New request', code: 'Badge, QR or PIN', open: 'Drawer 08 open', logged: 'Logged' },
    /** Smaller line under the title on the screen, per step. */
    screenSub: { request: 'Swap a faulty device', code: 'Tap your badge or scan the code', open: 'Take the new one, leave the old one', logged: 'Swap saved for IT' },
    drawerLabel: 'Drawer',
  },

  modules: {
    title: 'Built with respect to industry standards',
    intro: '',
    labels: { master: 'Otto', s24: 'Lotte', n8: 'Bruno', m124: 'Greta' },
    height: '850 MM',
    lockerLabel: 'Spind modules side by side: Otto, Lotte, Bruno and Greta, 850 mm high',
    fitTitle: 'Drawer size example',
    fit: [
      // Two reference devices: the largest common phone and laptop sizes.
      { device: 'iPhone 17 Pro Max', size: '163 × 78 × 9', opening: '175 × 90', result: '12 mm spare left', drawer: 'small', draw: { w: 175, h: 90, dw: 163, dh: 9 } },
      { device: 'MacBook Pro 16″', size: '356 × 248 × 17', opening: '500 × 90', result: '144 mm spare left', drawer: 'wide', draw: { w: 500, h: 90, dw: 356, dh: 17 } },
    ],
    fitHead: { size: 'Size (mm)', opening: 'Opening W × H (mm)' },
    /** Front view drawn in the 'Drawer size example' tile when a drawer on the locker (or a device card) is hovered, in mm. */
    fitHint: 'Hover a drawer to see what fits in it',
  },

  workflows: {
    compareTitle: 'What changes with Spind',
    title: 'Built to save time and increase efficiency',
    intro: '',
    cards: [
      { slug: 'faulty-device-swap', title: 'Faulty device swap', text: 'Take the replacement and leave the broken device, same day.' },
      { slug: 'temporary-device', title: 'Temporary devices', text: 'Lend a device for a project and get it back on time.' },
      { slug: 'lost-device', title: 'Lost device', text: 'A replacement waits in the locker while IT locks the lost one.' },
      { slug: 'eou-rollout', title: 'EOU rollout', text: 'Return the old device and collect the new one.' },
      { slug: 'onboarding', title: 'Onboarding', text: 'Day one starts at the locker, not at the IT desk.' },
      { slug: 'offboarding', title: 'Offboarding return', text: 'Leavers return equipment any time, fully logged.' },
    ],
    more: 'Learn more',
    today: 'Today',
    withLead: 'With',
    withBrand: 'Spind',
    compare: [
      ['Write a ticket', 'Request in the app, or tap your badge at the locker'],
      ['Wait for an appointment', 'Pick up any time, 24/7'],
      ['Handover by IT staff', 'No IT person on site'],
      ['Chase the old device', 'Old device goes back in the drawer'],
      ['A different process per site', 'One process for every branch'],
    ],
  },

  platform: {
    title: 'Full control from one application',
    intro: '',
    features: [
      { key: 'status', title: 'Live status', text: "Track every locker's availability" },
      { key: 'capacity', title: 'Capacity', text: 'What you can do with the space you have' },
      { key: 'requests', title: 'Requests', text: 'Pending, done, cancelled or expired' },
      { key: 'expiry', title: 'Code expiry', text: 'Choose how long codes stay valid' },
      { key: 'log', title: 'Activity log', text: 'Every fill, pickup and return, per locker' },
      { key: 'maps', title: 'Maps', text: 'Find any locker by branch, location or serial' },
    ],
    mockLabel: 'Our application: locker overview and recent requests',
  },

  /** Status pills on integration cards. */
  status: { available: 'Available', request: 'On request', pilot: 'Pilot' } as Record<IntegrationStatus, string>,

  // Home page integrations. Statuses follow Pera's integration proposal (Nov 2026).
  // TODO (Pera): every "request" entry was marked "to be confirmed"; confirm it before launch or remove it.
  integrations: {
    title: 'Connected to the tools you already run',
    intro: '',
    hubTitle: 'Our application',
    readFull: 'Read full',
    lissaHref: '/integrations',
    hubText: 'One record for every locker, drawer, device and handover.',
    items: [
      { key: 'lissa', title: 'LISSA Asset', text: 'Every device in a drawer is an asset with its full history.', logo: true, status: 'available' as IntegrationStatus },
      { key: 'access', title: 'Badge, QR or PIN', text: 'Employees open drawers with their RFID badge, a QR code or a PIN.', status: 'available' as IntegrationStatus },
      { key: 'endpoint', title: 'Endpoint management', text: 'Devices are enrolled and secured through your MDM.', status: 'available' as IntegrationStatus },
      { key: 'service', title: 'Field service', text: 'Our partner collects faulty devices and places new ones.', status: 'available' as IntegrationStatus },
      { key: 'teams', title: 'Microsoft Teams', text: 'Employees ask in chat and receive a pickup code.', status: 'request' as IntegrationStatus },
      { key: 'servicedesk', title: 'Your service desk', text: 'Kept informed without a ticket, with CMDB sync.', status: 'request' as IntegrationStatus },
    ],
    note: 'Need a specific system? We connect it during the Connect phase of your rollout.',
    more: 'See all integrations',
  },

  /** Template pages for Platform and Workflows (moved off the home page). */
  platformPage: {
    label: 'Platform',
    title: 'Every action under control',
    intro: 'Every request is visible and traceable in the application that runs behind every Spind.',
    meta: 'Live status, capacity, requests, code expiry, activity log and maps for every Spind locker in one application.',
    primary: 'Book a demo',
    secondary: 'Calculate your business case',
    featuresTitle: 'What IT sees in our application',
  },
  /** The locker itself, technically: modules, heights and drawer sizes. Modular: start with one module and grow. */
  lockerPage: {
    label: 'Locker',
    title: 'Build your own Spind, one module at a time',
    intro: 'Start with one module and add more as you grow: Otto, Lotte, Bruno and Greta are 850 mm high and combine into one locker for phones, laptops and accessories.',
    meta: 'The modular Spind locker: start with one module and grow. Otto holds the screen, Lotte has 24 small drawers, Bruno 8 wide drawers and Greta both, all 850 mm high.',
    primary: 'Book a call',
    secondary: 'Calculate your business case',
    visualLabel: 'Spind locker with the Otto screen module and Lotte drawer module',
    ctaTitle: 'Plan the locker for your site',
    ctaText: 'Start with one module at one site, then add modules and sites as you need them. Tell us which devices you hand out and we suggest the first setup.',
    cta: 'Book a call',
  },
  workflowsPage: {
    label: 'Workflows',
    title: 'Hand over devices without an appointment',
    intro: 'Every pickup, return and swap runs 24/7 on our secure servers.',
    meta: 'Spind workflows: faulty device swap, temporary devices, lost devices, EOU rollout, onboarding, offboarding and multi-site IT, compared with today.',
    primary: 'Book a call',
    secondary: 'Calculate your business case',
  },

  /**
   * Integrations page. Two kinds of integration, kept apart on purpose:
   * - systems: software that exchanges data with our application (MDM, ITSM, identity, HR, Teams, AI, badges).
   * - services: people and companies who physically handle devices at the locker (field service, couriers,
   *   suppliers, repair, your own IT). They need no software of their own: see levels (badge or code, our
   *   application, system to system). REST API and webhooks are the third level, not a headline feature.
   * Statuses from Pera's integration proposal (Nov 2026): available, request (to be confirmed) or pilot (proposal).
   * TODO (Pera): confirm every "request" entry, the partner levels and the service partner types before launch.
   */
  integrationsPage: {
    meta: 'How Spind connects to your systems, from MDM and ITSM to identity and HR, and works with the partners who handle your devices.',
    label: 'Integrations',
    title: 'Spind works with your systems and your partners',
    intro: 'Your software shares data with our application, and the people who handle your devices, from field service to couriers, get their own access to the lockers, with or without software of their own.',
    primary: 'Talk to our integration team',
    secondary: 'Calculate your business case',
    /** Small blue line on integration tiles on the use case pages. */
    kindSystem: 'Your system',
    kindService: 'Service partner',
    kindsTitle: 'Integration means two things',
    kinds: [
      {
        key: 'api',
        label: 'Systems',
        title: 'Software that talks to software',
        text: 'Your MDM, service desk, identity provider and HR system exchange data with our application, so nobody types a request twice.',
        needsLabel: 'What it needs',
        needs: 'An interface on both sides, which we set up with your IT team.',
        chips: ['endpoint', 'servicedesk', 'sso', 'hr', 'teams'],
        href: '#systems',
        cta: 'Systems we connect',
      },
      {
        key: 'partners',
        label: 'Services',
        title: 'People who handle your devices',
        text: 'Field service, couriers, suppliers and your own site staff fill, empty and collect at the locker, each with a role that shows only their own work.',
        needsLabel: 'What it needs',
        needs: 'A badge, a code or a login, and no software of their own.',
        chips: ['service', 'partner', 'logistics', 'supplier'],
        href: '#services',
        cta: 'Services we work with',
      },
    ],
    mapTitle: 'How it fits together',
    mapIntro: '',
    mapLeft: 'Your systems',
    mapPartners: 'Your partners',
    mapHub: 'Our application',
    mapHubText: 'Asset records, requests, roles and the full audit trail',
    mapRight: 'Spind lockers',
    sites: ['Headquarters', 'Branch offices', 'Plants and warehouses'],
    mapSystems: ['endpoint', 'servicedesk', 'sso', 'hr', 'teams'],
    mapServices: ['service', 'partner', 'logistics', 'supplier'],
    systemsTitle: 'Systems we connect',
    systemsIntro: '',
    /** Software only. "short" is the name on the map and on the overview chips. */
    systems: [
      { key: 'lissa', title: 'LISSA Asset', short: 'LISSA Asset', examples: 'Included: asset management', text: 'Every device in a drawer is an asset with its full history.', logo: true, status: 'available' as IntegrationStatus },
      { key: 'access', title: 'Badges and access', short: 'Badges', examples: 'Your RFID badges, QR code or PIN', text: 'Employees open drawers with the badge they already carry, or with a QR code or PIN.', status: 'available' as IntegrationStatus },
      { key: 'endpoint', title: 'MDM and endpoints', short: 'MDM', examples: 'e.g. Microsoft Intune, Jamf', text: 'Devices are enrolled and secured through your MDM before and after the drawer.', status: 'available' as IntegrationStatus },
      { key: 'servicedesk', title: 'ITSM and service desk', short: 'Service desk', examples: 'e.g. ServiceNow', text: 'Informed without a ticket, with CMDB sync instead of double maintenance.', status: 'request' as IntegrationStatus },
      { key: 'teams', title: 'Microsoft Teams', short: 'Microsoft Teams', examples: 'LISSA agent', text: 'Employees ask in chat and receive a pickup code.', status: 'request' as IntegrationStatus },
      { key: 'sso', title: 'Identity and SSO', short: 'Identity and SSO', examples: 'e.g. Microsoft Entra ID, Okta', text: 'Access with the corporate identity, permissions per employee.', status: 'pilot' as IntegrationStatus },
      { key: 'hr', title: 'HR systems', short: 'HR system', examples: 'e.g. SAP SuccessFactors, Workday', text: 'Joiners and leavers set locker permissions automatically.', status: 'pilot' as IntegrationStatus },
      { key: 'ai', title: 'AI assistants', short: 'AI assistants', examples: 'MCP server', text: 'Assistants trigger actions, like a replacement for drawer 4.', status: 'pilot' as IntegrationStatus },
    ],
    servicesTitle: 'Services we work with',
    /** People and companies at the locker. No status pill: every one of them can work at level 1 (badge or code). */
    services: [
      { key: 'service', title: 'Spind field service', short: 'Our field service', examples: 'Our partner network', text: 'Fills the drawers, collects faulty and returned devices and maintains the lockers.' },
      { key: 'partner', title: 'Your service partner', short: 'Your service partner', examples: 'e.g. your IT field service company', text: 'Keeps working for you, now at the locker with its own role, so your contracts stay as they are.' },
      { key: 'logistics', title: 'Logistics and couriers', short: 'Couriers', examples: 'e.g. your parcel or courier service', text: 'Deliver devices straight into a drawer and pick up returns, without a stop at reception.' },
      { key: 'supplier', title: 'Suppliers and staging', short: 'Suppliers', examples: 'e.g. your device supplier or leasing partner', text: 'Load staged, ready-to-use devices into the drawers, so they skip the detour via headquarters.' },
      { key: 'repair', title: 'Repair and refurbishment', short: 'Repair', examples: 'e.g. your repair or recycling partner', text: 'Collect faulty and end-of-use devices, wipe them and send them back to the pool.' },
      { key: 'filling', title: 'Your own IT and site staff', short: 'Your IT', examples: 'Filling model', text: 'Fill and empty the lockers yourselves for a lower price, with the same requests and log.' },
    ],
    levelsTitle: 'Every partner can work with Spind, with or without software',
    levels: [
      { key: 'access', label: 'Level 1', title: 'A badge or a code', text: 'IT creates a fill or pickup request, the partner opens exactly those drawers with a badge, QR code or PIN, and every step is logged.', note: 'No software needed', chips: [] as string[], status: 'available' as IntegrationStatus },
      { key: 'lissa', label: 'Level 2', title: 'A login to our application', text: 'The partner signs in and sees only its own sites, requests and history, nothing else.', note: 'Nothing to install', chips: [] as string[], status: 'available' as IntegrationStatus },
      { key: 'api', label: 'Level 3', title: 'System to system', text: 'If the partner runs its own dispatch or ticket system, requests and status updates flow through our REST API and webhooks.', note: 'For partners with their own software', chips: ['REST API', 'Webhooks'], status: 'request' as IntegrationStatus },
    ],
    stagesTitle: 'Roll it out in three stages',
    stages: [
      { label: 'Stage 1', title: 'Lockers, access and partners', text: 'Lockers, badge access and your service partners at the locker. Usable immediately.' },
      { label: 'Stage 2', title: 'Identity, HR and ITSM', text: 'Permissions and workflows run automatically from your own systems.' },
      { label: 'Stage 3', title: 'Teams and AI assistants', text: 'Employees trigger everything by chat or voice, where they already work.' },
    ],
    securityTitle: 'Built for enterprise security reviews',
    security: [
      { key: 'iso', title: 'ISO 27001 certified', text: 'Our information security management is certified to ISO 27001 by TÜV Austria.' },
      { key: 'log', title: 'Full audit trail', text: 'Every fill, pickup, return and swap is logged with person, device, drawer and time.' },
      { key: 'roles', title: 'Roles and permissions', text: 'IT, partners and site staff only see and do what their role allows.' },
      // TODO (Pera): tenant separation is the core of the campus case; confirm it explicitly before launch.
      { key: 'tenant', title: 'Tenant separation', text: 'On a shared site, each company sees only its own drawers, permissions and devices.' },
      { key: 'eu', title: 'Data in the EU', text: 'Hosting and processing in the EU, in line with GDPR.' },
      { key: 'shield', title: 'Security review support', text: 'We answer your questionnaire and join the call with your security team.' },
    ],
    faqTitle: 'Integration questions',
    faq: [
      { q: 'Do we need to replace any of our systems?', a: 'No, your MDM, service desk and identity provider stay where they are and Spind connects to them.' },
      { q: 'Our service partner has no software. Can they still work with Spind?', a: 'Yes, they get a role and open the drawers of each request with a badge, QR code or PIN, so a phone is all they need.' },
      { q: 'Do we have to switch to your field service?', a: 'No, keep your own partner, use ours, or fill the lockers with your own IT team for a lower price.' },
      { q: 'Who builds the integration?', a: 'We do, together with your IT team: the basics in week 2 of the rollout, identity, HR and ITSM in a second stage.' },
      { q: 'Our system is not on the list. Can you still connect it?', a: 'Most likely yes, through the REST API or webhooks. We check it in the first workshop.' },
      { q: 'Can one integration serve all our sites?', a: 'Yes, the connection runs through our application, so every new locker and site uses it from day one.' },
    ],
    ctaTitle: 'Map your systems and partners with us',
    ctaText: 'Bring your system list and the partners who handle your devices to a short call. We show you where Spind plugs in and what the first site needs.',
    cta: 'Book a call',
  },

  service: {
    title: 'You never touch the locker',
    intro: '',
    lifecycleTitle: 'Supports the full device lifecycle',
    lifecycle: [
      { title: 'Pool', text: 'New devices in stock' },
      { title: 'Spind', text: 'Loaded by our field partner' },
      { title: 'Employee', text: 'Picked up with badge, QR or PIN' },
      { title: 'Return', text: 'Faulty device returned' },
      { title: 'Refurbish', text: 'Wiped, back to the pool' },
    ],
    lifecycleFooter: 'Every step tracked and audit-proof',
  },

  /** Anonymized: industry and size only, never a name. */
  clients: {
    title: 'Already running at enterprise clients',
    items: [
      { name: 'Public transport operator', count: 19500, suffix: '+ employees' },
      { name: 'Municipal utility', count: 17000, suffix: '+ employees' },
    ],
  },

  businessCase: {
    title: 'See how much money Spind saves',
    intro: 'Enter your sites, handovers and the hourly cost of your IT staff to see your monthly savings, based on your figures rather than ours.',
    inputsTitle: 'Your numbers',
    inputs: {
      lockers: { label: 'Lockers', hint: 'One Spind per site', min: 1, max: 50, step: 1, value: 1 },
      handovers: { label: 'Handovers per locker per month', hint: 'Pickups, returns and swaps', min: 5, max: 300, step: 5, value: 40 },
      minutesToday: { label: 'IT minutes per handover today', hint: 'Booking, waiting, walking and paperwork', min: 5, max: 120, step: 5, value: 30 },
      hourlyCost: { label: 'IT staff cost per hour (€)', hint: 'Starting hourly rate of an IT professional', min: 20, max: 150, step: 5, value: 45 },
    },
    /** IT minutes per handover with Spind (approving and following the request). Fixed, not a slider. */
    minutesSpind: 10,
    resultTitle: 'Per month',
    today: 'IT cost today',
    withSpind: 'IT cost with Spind',
    withSpindHint: '10 IT minutes per handover',
    handovers: 'Handovers per month',
    difference: 'Saved every month',
    positive: 'IT hours back for real IT work',
    hoursUnit: 'h',
    currency: '€',
    note: 'Estimate from your inputs, your offer is tailored to your sites and devices after a short call.',
    cta: 'Check it with us',
  },

  /**
   * Use case pages. Every page tells the same story in the same order (see src/pages/use-cases/[slug].astro):
   * facts (at a glance), situation (a typical day today and who pays for it), steps (who does what), log (what IT
   * sees), benefits (for IT and for employees), connects (keys from integrationsPage.systems and .services),
   * faq, cta. Scenes and log entries are typical examples, not customer data.
   */
  solutions: {
    label: 'Use case',
    breadcrumb: 'Use cases',
    primary: 'Book a call',
    secondary: 'Calculate your business case',
    /** "At a glance" strip under the hero. */
    facts: { who: 'For', devices: 'Devices', start: 'Starts with', where: 'Where' },
    /** Label on the dark story card in "The problem". */
    sceneLabel: 'A typical day today',
    /** Who pays for the problem (pain cards). */
    who: { employee: 'Employee', it: 'IT team', company: 'Company' } as Record<string, string>,
    /** Who does a step (How it works). */
    roles: { employee: 'Employee', it: 'IT', spind: 'Spind', partner: 'Partner' } as Record<string, string>,
    flowTitle: 'How it works with Spind',
    logHead: 'Activity log',
    logFieldsLabel: 'Recorded every time',
    logFields: ['Person', 'Device and serial number', 'Locker and drawer', 'Date and time'],
    benefitsTitle: 'What changes for IT and for employees',
    forIt: 'For your IT team',
    forPeople: 'For employees',
    connectsTitle: 'What it connects to',
    connectsLink: 'See all integrations',
    proofTitle: 'How IT teams use it',
    proofLink: 'Read the story',
    faqTitle: 'Questions about this use case',
    moreTitle: 'More use cases',
    visualLabel: 'with a Spind locker',
    items: [
      {
        slug: 'faulty-device-swap',
        title: 'Faulty device swap',
        heroTitle: 'A broken laptop shouldn’t cost a working day',
        intro: 'Employees request a swap in the app or simply tap their badge at the locker, take the replacement and leave the faulty device in the drawer, the same day and without waiting for IT.',
        facts: {
          who: 'Every employee whose device fails',
          devices: 'Laptops, phones, headsets and scanners',
          start: 'A request in the app or a badge tap',
          where: 'Every site with a Spind, 24/7',
        },
        situation: {
          title: 'One broken laptop, two lost days',
          scene: 'Monday, 7:40, an hour before the first customer call, a sales manager’s laptop won’t start. The ticket gets an answer before lunch with a handover slot on Wednesday at headquarters, so until then the work happens on a phone.',
          pains: [
            { who: 'employee', title: 'Days without a working device', text: 'Work moves to a phone or waits until the handover slot.' },
            { who: 'it', title: 'Senior time spent on handovers', text: 'Booking slots, walking to the desk and updating records takes longer than the fix.' },
            { who: 'company', title: 'Faulty devices that never come back', text: 'Broken laptops sit in drawers for weeks, unwiped and off the records.' },
          ],
        },
        steps: [
          { role: 'employee', title: 'Report', text: 'The employee reports the fault in the app, or walks straight up to the locker.' },
          { role: 'employee', title: 'Identify', text: 'They tap their RFID badge, or scan the QR code or enter the PIN.' },
          { role: 'spind', title: 'Swap', text: 'Spind opens the right drawer: they take the replacement and leave the broken device.' },
          { role: 'partner', title: 'Collect', text: 'Our field service partner collects the faulty device and puts in a new replacement.' },
        ],
        log: {
          title: 'Every swap is on record',
          text: 'Both devices change hands in one visit, and our application records each move against the person, the drawer and the serial number.',
          locker: 'Main office, lobby',
          entries: [
            { time: '07:52', event: 'Swap requested', detail: 'Employee, Sales · Laptop 14″' },
            { time: '07:58', event: 'Drawer 08 opened', detail: 'RFID badge' },
            { time: '07:59', event: 'Replacement taken', detail: 'Laptop SN …4821 · assigned' },
            { time: '07:59', event: 'Faulty laptop returned', detail: 'Laptop SN …1177 · marked for repair' },
            { time: '14:20', event: 'Collected and refilled', detail: 'Field service partner' },
          ],
        },
        benefits: {
          it: [
            { title: 'No handover appointments', text: 'Swaps run without a slot, a walk or a phone call.' },
            { title: 'Records that update themselves', text: 'Which device went to whom is in the log the moment the drawer closes.' },
            { title: 'Faulty devices come back', text: 'The old device is returned in the same visit, ready for repair.' },
          ],
          people: [
            { title: 'Working again the same day', text: 'The replacement is waiting in the locker, ready to use.' },
            { title: 'At any hour', text: 'Early shift, late shift or weekend, the locker is open.' },
            { title: 'No ticket to chase', text: 'One request or one badge tap, and the drawer opens.' },
          ],
        },
        connects: [
          { key: 'access', text: 'Employees open the drawer with the badge they already carry.' },
          { key: 'endpoint', text: 'The replacement is enrolled and secured before it goes in.' },
          { key: 'servicedesk', text: 'The swap is noted in your service desk without a new ticket.' },
          { key: 'service', text: 'Collects the faulty device and puts in a new replacement.' },
        ],
        faq: [
          { q: 'What if no replacement is left in the locker?', a: 'Our application shows how many replacements each locker has left, so it is refilled before it runs empty.' },
          { q: 'Does the employee get their apps and settings back?', a: 'The replacement is enrolled through your MDM, so apps and settings arrive when the employee signs in.' },
          { q: 'Who repairs the faulty device?', a: 'Our field service partner collects it, or your own service partner does, and the log shows where it is at every step.' },
        ],
        cta: {
          title: 'Plan your first swap locker',
          text: 'Tell us which devices fail most often and at which sites, and we show you how many replacements a locker needs.',
        },
      },
      {
        slug: 'temporary-device',
        title: 'Temporary devices',
        heroTitle: 'Lend a device for exactly as long as it is needed',
        intro: 'Employees borrow a laptop or phone for a project, a trip or the time a repair takes, collect it from the locker and bring it back when the loan ends.',
        facts: {
          who: 'Projects, trips, trainings and repairs',
          devices: 'Laptops, phones, tablets and headsets',
          start: 'A loan request with an end date',
          where: 'Every site with a Spind, 24/7',
        },
        situation: {
          title: 'Loan devices disappear into spreadsheets',
          scene: 'A project team needs five extra laptops for a three-week trial, and IT hands them out on a Friday afternoon with the names in a spreadsheet. Two months later three are back, one is in a desk drawer and nobody knows where the fifth one went.',
          pains: [
            { who: 'employee', title: 'Waiting for a spare', text: 'A short-term need still means a ticket, an approval and a pickup slot.' },
            { who: 'it', title: 'Chasing returns by hand', text: 'Every loan needs a reminder, and every late return needs another one.' },
            { who: 'company', title: 'Devices nobody can find', text: 'Unreturned loan devices are lost money and an open security risk.' },
          ],
        },
        steps: [
          { role: 'employee', title: 'Request', text: 'The employee requests a device for a set period in the app.' },
          { role: 'employee', title: 'Pick up', text: 'They tap their badge at the locker and the drawer with the loan device opens.' },
          { role: 'spind', title: 'Remind', text: 'Before the loan ends, the borrower gets a reminder with the return date.' },
          { role: 'employee', title: 'Return', text: 'They put the device back in a drawer, and the loan closes itself.' },
        ],
        log: {
          title: 'Every loan has a start and an end',
          text: 'Our application shows who has which loan device and until when, so no loan runs past its end date unnoticed.',
          locker: 'Head office, 2nd floor',
          entries: [
            { time: 'Mon 09:12', event: 'Loan requested', detail: 'Project team · 5 laptops · 3 weeks' },
            { time: 'Mon 09:40', event: 'Drawers 03 to 07 opened', detail: 'RFID badges' },
            { time: 'Fri 16:00', event: 'Return reminder sent', detail: 'Loan ends Monday' },
            { time: 'Mon 08:31', event: 'Laptops returned', detail: '5 of 5 · loan closed' },
          ],
        },
        benefits: {
          it: [
            { title: 'A pool instead of a spreadsheet', text: 'Loan devices live in the locker, with their status in our application.' },
            { title: 'Returns without chasing', text: 'The reminder goes out by itself before the loan ends.' },
            { title: 'Fewer devices to buy', text: 'A shared pool covers short needs that would otherwise mean new purchases.' },
          ],
          people: [
            { title: 'A device when the project starts', text: 'Pick it up the same day, also before or after office hours.' },
            { title: 'A clear end date', text: 'Everyone knows when the device is due back.' },
            { title: 'Return in passing', text: 'Drop it in a drawer on the way out, no appointment needed.' },
          ],
        },
        connects: [
          { key: 'access', text: 'Borrowers open the drawer with their own badge.' },
          { key: 'endpoint', text: 'Loan devices are reset through your MDM between two loans.' },
          { key: 'teams', text: 'Employees ask for a loan device in chat.' },
          { key: 'filling', text: 'Your IT keeps the loan pool filled, or our partner does.' },
        ],
        faq: [
          { q: 'What happens when a loan runs late?', a: 'The request shows as expired in our application, and IT sees at once who still has the device.' },
          { q: 'Who resets a device between two loans?', a: 'Your IT or our field service partner resets it through your MDM before it goes back into a drawer.' },
          { q: 'Do loan devices need their own locker?', a: 'No, loan devices share the locker with replacements and new devices, each in its own drawer.' },
        ],
        cta: {
          title: 'Set up a loan pool at one site',
          text: 'Tell us which devices teams borrow most, and we size the first pool and the drawers for it.',
        },
      },
      {
        slug: 'lost-device',
        title: 'Lost device',
        heroTitle: 'A lost phone shouldn’t stop anyone for days',
        intro: 'When a device is lost, IT blocks it through the MDM and the employee collects a replacement from the locker the same day.',
        facts: {
          who: 'Anyone who loses a phone or laptop',
          devices: 'Phones, laptops and tablets',
          start: 'A loss report in the app or Teams',
          where: 'The locker closest to the employee',
        },
        situation: {
          title: 'A lost phone is two problems at once',
          scene: 'A technician leaves the company phone in a taxi on Thursday evening. The loss is reported on Friday and the replacement ordered on Monday, and for three days the phone with every customer contact on it is still active.',
          pains: [
            { who: 'employee', title: 'Unreachable for days', text: 'Without a phone there are no calls, no authenticator app and no customer app.' },
            { who: 'it', title: 'Two urgent jobs at once', text: 'Securing the lost device and finding a replacement land on the same desk.' },
            { who: 'company', title: 'Data on an open device', text: 'Until it is blocked, the lost device is a door into company data.' },
          ],
        },
        steps: [
          { role: 'employee', title: 'Report', text: 'The employee reports the loss in the app, in Teams or at the locker.' },
          { role: 'it', title: 'Block', text: 'IT blocks the lost device through the MDM in one step.' },
          { role: 'employee', title: 'Pick up', text: 'A replacement waits in a drawer and opens with the employee’s badge.' },
          { role: 'spind', title: 'Logged', text: 'The loss and the replacement are logged against the person and the device.' },
        ],
        log: {
          title: 'The loss and the replacement in one record',
          text: 'IT sees when the loss was reported, when the device was blocked and which replacement went out, ready for your security team.',
          locker: 'Branch 07, hall 3',
          entries: [
            { time: 'Fri 07:05', event: 'Loss reported', detail: 'Technician · Phone SN …3306' },
            { time: 'Fri 07:09', event: 'Lost phone blocked', detail: 'Through your MDM' },
            { time: 'Fri 07:31', event: 'Drawer 14 opened', detail: 'RFID badge' },
            { time: 'Fri 07:31', event: 'Replacement taken', detail: 'Phone SN …7741 · assigned' },
          ],
        },
        benefits: {
          it: [
            { title: 'Secure first, then replace', text: 'Blocking the lost device and handing out a new one are one flow.' },
            { title: 'A record for every audit', text: 'Each loss is documented with person, device and time.' },
            { title: 'No courier for a phone', text: 'The replacement is already on site, not in a parcel.' },
          ],
          people: [
            { title: 'Back online within hours', text: 'The replacement is waiting at their own site.' },
            { title: 'One report, not three calls', text: 'Report it once, and IT takes it from there.' },
            { title: 'Also on the night shift', text: 'The locker hands out replacements at any hour.' },
          ],
        },
        connects: [
          { key: 'endpoint', text: 'Blocks the lost device and enrolls the replacement.' },
          { key: 'teams', text: 'Employees report the loss in chat.' },
          { key: 'access', text: 'The replacement opens with the employee’s badge.' },
          { key: 'servicedesk', text: 'The loss is recorded in your service desk for follow-up.' },
        ],
        faq: [
          { q: 'What if the badge was lost too?', a: 'IT creates a PIN for this one request, and the drawer opens without the badge.' },
          { q: 'Can the replacement wait at another site?', a: 'Yes, IT picks the locker closest to the employee when it creates the request.' },
          { q: 'What if the lost device turns up again?', a: 'It goes back into a drawer like any return, and IT decides whether it is unblocked or refurbished.' },
        ],
        cta: {
          title: 'Keep replacements where people work',
          text: 'Tell us how often devices go missing and where, and we suggest how many replacements each site needs.',
        },
      },
      {
        slug: 'eou-rollout',
        title: 'EOU rollout',
        heroTitle: 'Roll out new devices without a single appointment',
        intro: 'Employees return their end-of-use device and collect the new one in the same visit, whenever it suits them, while IT loads the lockers only once.',
        facts: {
          who: 'Refresh cycles and system upgrades',
          devices: 'Laptops and phones, hundreds at a time',
          start: 'An assignment in our application',
          where: 'Every site in the rollout',
        },
        situation: {
          title: 'A rollout of 800 laptops is 1,600 handovers',
          scene: 'Every laptop in a rollout changes hands twice: the new one goes out and the old one has to come back. IT books slots for weeks, people miss them and rebook, and months later the asset list still shows old laptops nobody can find.',
          pains: [
            { who: 'employee', title: 'An appointment for a laptop', text: 'Handover slots fall into meetings, holidays and site visits.' },
            { who: 'it', title: 'Weeks of handover slots', text: 'Skilled staff spend the rollout handing out boxes instead of fixing issues.' },
            { who: 'company', title: 'Old devices that never return', text: 'Every missing end-of-use device is unwiped data and lost resale value.' },
          ],
        },
        steps: [
          { role: 'it', title: 'Plan', text: 'IT assigns the new devices to employees in our application.' },
          { role: 'partner', title: 'Load', text: 'Our field partner fills the drawers with staged, ready-to-use devices.' },
          { role: 'employee', title: 'Exchange', text: 'The employee returns the old device and opens the drawer with the new one.' },
          { role: 'partner', title: 'Refurbish', text: 'Old devices are collected, wiped and logged on their way back to the pool.' },
        ],
        log: {
          title: 'Progress you can read at a glance',
          text: 'Our application shows which exchanges are pending, done or expired, per site and per person, so IT follows up only where it is needed.',
          locker: 'Head office, lobby',
          entries: [
            { time: 'Mon 08:00', event: 'Rollout wave 3 assigned', detail: '120 employees · 3 sites' },
            { time: 'Mon 18:30', event: 'Drawers filled', detail: 'Field partner · 40 laptops' },
            { time: 'Tue 07:46', event: 'Old laptop returned', detail: 'SN …0932 · end of use' },
            { time: 'Tue 07:46', event: 'New laptop taken', detail: 'SN …5518 · assigned' },
            { time: 'Fri 17:00', event: 'Wave 3 status', detail: '96 done · 18 pending · 6 expired' },
          ],
        },
        benefits: {
          it: [
            { title: 'No slot planning', text: 'Employees exchange within a window, not at a booked time.' },
            { title: 'Old devices come back', text: 'Return and pickup happen in the same visit to the locker.' },
            { title: 'A live view of the rollout', text: 'Pending, done and expired exchanges per site in one place.' },
          ],
          people: [
            { title: 'Exchange when it suits them', text: 'Before work, after lunch or on the way home.' },
            { title: 'A ready-to-use device', text: 'Staged and enrolled before it goes into the drawer.' },
            { title: 'One stop, two jobs', text: 'Hand in the old device and take the new one in the same visit.' },
          ],
        },
        connects: [
          { key: 'endpoint', text: 'New devices are enrolled before they reach the drawer.' },
          { key: 'lissa', text: 'Old and new devices change owners in the asset record.' },
          { key: 'service', text: 'Loads the staged devices and collects the old ones.' },
          { key: 'supplier', text: 'Can load staged devices straight from staging.' },
        ],
        faq: [
          { q: 'How many people can one locker serve in a rollout?', a: 'Drawers are refilled in waves, so one locker serves many more employees than it has drawers.' },
          { q: 'What if someone never comes to the locker?', a: 'Their exchange shows as pending or expired in our application, and IT follows up with just those people.' },
          { q: 'Who wipes the old devices?', a: 'Our field partner collects them for wiping and refurbishment, or your own service partner does, and each device stays in the log.' },
        ],
        cta: {
          title: 'Plan your next rollout wave',
          text: 'Share your rollout size and sites, and we show you how many lockers and refill rounds it takes.',
        },
      },
      {
        slug: 'onboarding',
        title: 'Onboarding',
        heroTitle: 'New hires have a working laptop from minute one',
        intro: 'IT prepares the starter kit in advance, and new hires collect it from the locker at their own site, even when IT isn’t there.',
        facts: {
          who: 'New hires and internal moves',
          devices: 'Starter kit: laptop, phone and headset',
          start: 'A new hire set up in our application',
          where: 'The new hire’s own site',
        },
        situation: {
          title: 'Day one often starts with waiting',
          scene: 'A new hire starts at a branch on Monday at 8:00. The laptop was prepared at headquarters on Thursday and is still in the courier’s van, so the first morning goes by on a borrowed desk with a guest login.',
          pains: [
            { who: 'employee', title: 'A slow first impression', text: 'The first day goes to waiting instead of getting started.' },
            { who: 'it', title: 'Start dates by email', text: 'Every hire means coordinating managers, couriers and sites by hand.' },
            { who: 'company', title: 'Paid days without work', text: 'A new hire without a device costs a salary and can’t get going.' },
          ],
        },
        steps: [
          { role: 'it', title: 'Prepare', text: 'IT assigns the starter devices to the new hire in our application.' },
          { role: 'partner', title: 'Load', text: 'Our field partner puts the kit into a drawer at the right site.' },
          { role: 'spind', title: 'Welcome', text: 'The new hire receives a QR code and PIN before day one.' },
          { role: 'employee', title: 'Start', text: 'They collect the kit at the locker, and the assignment is logged.' },
        ],
        log: {
          title: 'Ready before the first day',
          text: 'IT sees whether every kit is in its drawer before the start date, and when the new hire collected it.',
          locker: 'Branch 02, reception',
          entries: [
            { time: 'Wed 10:15', event: 'Starter kit assigned', detail: 'New hire, Finance · starts Monday' },
            { time: 'Thu 16:40', event: 'Kit placed in drawer 21', detail: 'Field partner' },
            { time: 'Fri 09:00', event: 'Welcome code sent', detail: 'QR code and PIN' },
            { time: 'Mon 07:52', event: 'Kit collected', detail: 'Laptop, phone, headset · assigned' },
          ],
        },
        benefits: {
          it: [
            { title: 'Prepare once, centrally', text: 'Kits are assigned in one place and reach every site the same way.' },
            { title: 'No first-day handover', text: 'Nobody needs to be at the branch at 8:00.' },
            { title: 'Clear ownership', text: 'Each device is assigned to the new hire from the first pickup.' },
          ],
          people: [
            { title: 'Working from minute one', text: 'The kit is waiting at their own site.' },
            { title: 'A welcome, not a wait', text: 'The code arrives before the first day, with no ticket to write.' },
            { title: 'The same at every site', text: 'Branches without IT onboard just like headquarters.' },
          ],
        },
        connects: [
          { key: 'hr', text: 'A new hire in your HR system prepares the kit request.' },
          { key: 'sso', text: 'The new hire signs in with the corporate identity.' },
          { key: 'endpoint', text: 'The kit is enrolled and ready before pickup.' },
          { key: 'service', text: 'Places the kit in the right drawer at the right site.' },
        ],
        faq: [
          { q: 'Can the new hire collect the kit before the start date?', a: 'IT sets how long the welcome code stays valid, so pickup can start a day early or on day one.' },
          { q: 'What if the start date moves?', a: 'IT changes the request in our application, and the kit stays locked in its drawer until then.' },
          { q: 'Does the new hire need the app?', a: 'No, the QR code or PIN arrives before day one, and that is all they need at the locker.' },
        ],
        cta: {
          title: 'Make day one work at every site',
          text: 'Tell us how many people start each month and where, and we plan the drawers for their kits.',
        },
      },
      {
        slug: 'offboarding',
        title: 'Offboarding return',
        heroTitle: 'Get every device back when people leave',
        intro: 'Leavers return laptops, phones and accessories to a drawer on their last day, even after hours, and every return is logged against their name.',
        facts: {
          who: 'Leavers, contractors and internal moves',
          devices: 'Laptops, phones, tablets and accessories',
          start: 'A return request from IT',
          where: 'Any site with a Spind, also after hours',
        },
        situation: {
          title: 'Leavers take their time, and sometimes the laptop',
          scene: 'An employee’s last day is a Friday and the IT desk closes at four, so the laptop is left at reception and the phone goes home in a bag. Three weeks later IT is still writing emails about a charger and a headset.',
          pains: [
            { who: 'employee', title: 'An awkward goodbye', text: 'The last day turns into a hunt for someone to hand things to.' },
            { who: 'it', title: 'Weeks of chasing', text: 'Every missing return means reminders, calls and a note to the manager.' },
            { who: 'company', title: 'Data that walks out', text: 'A device that isn’t returned is company data outside your control.' },
          ],
        },
        steps: [
          { role: 'it', title: 'Announce', text: 'IT creates the return request in our application.' },
          { role: 'employee', title: 'Identify', text: 'The leaver taps their badge or uses the QR code for an empty drawer.' },
          { role: 'employee', title: 'Return', text: 'They place the devices in the drawer and close it.' },
          { role: 'partner', title: 'Collect', text: 'Our field partner collects the devices, and every step is logged.' },
        ],
        log: {
          title: 'Proof of every return',
          text: 'Each return is logged per device, person and locker, so the leaver’s file closes with a record instead of a guess.',
          locker: 'Head office, lobby',
          entries: [
            { time: 'Mon 11:20', event: 'Return requested', detail: 'Leaver, Marketing · last day Friday' },
            { time: 'Fri 18:47', event: 'Drawer 05 opened', detail: 'QR code' },
            { time: 'Fri 18:48', event: 'Laptop and phone returned', detail: 'SN …2290 · SN …6013' },
            { time: 'Mon 09:30', event: 'Collected for wiping', detail: 'Field partner' },
          ],
        },
        benefits: {
          it: [
            { title: 'No more chasing', text: 'The return request and its status sit in one place.' },
            { title: 'An audit trail per leaver', text: 'Each device is logged in and out with person and time.' },
            { title: 'Back into the pool', text: 'Returned devices are wiped and refurbished for the next employee.' },
          ],
          people: [
            { title: 'Last day, any hour', text: 'Returns fit the leaver’s schedule, not the IT desk’s.' },
            { title: 'No handover needed', text: 'Everything goes into one drawer, and the goodbye can go on.' },
            { title: 'A clean finish', text: 'The return is on record, so nobody asks for it again later.' },
          ],
        },
        connects: [
          { key: 'hr', text: 'A leaving date in your HR system prepares the return request.' },
          { key: 'access', text: 'Leavers open an empty drawer with a badge or QR code.' },
          { key: 'lissa', text: 'Returned devices are booked back into the asset record.' },
          { key: 'repair', text: 'Wipes and refurbishes the returns for the next employee.' },
        ],
        faq: [
          { q: 'What if the leaver no longer has a badge?', a: 'IT sends a QR code or PIN for the return, valid for as long as IT sets.' },
          { q: 'Can someone else return the devices?', a: 'Yes, IT can send the return code to a manager or colleague, and the log shows who returned what.' },
          { q: 'What happens to the data on returned devices?', a: 'The devices are collected for wiping and refurbishment, and the log shows each step until they are back in the pool.' },
        ],
        cta: {
          title: 'Close every leaver’s file with a record',
          text: 'Tell us how many people leave each month and where, and we show you how returns run at each site.',
        },
      },
      {
        slug: 'multi-site',
        title: 'Multi-site IT',
        heroTitle: 'The same IT service at every site',
        intro: 'A Spind at each branch gives every employee the same pickup, return and swap, and our partner network services every locker.',
        facts: {
          who: 'Branches, plants, warehouses and campuses',
          devices: 'Every device your sites hand out',
          start: 'One Spind at each site that needs one',
          where: 'All sites in one view',
        },
        situation: {
          title: 'IT sits at headquarters, devices break everywhere',
          scene: 'A company has an IT team at the head office and fourteen sites without one. A broken scanner at a warehouse means a ticket, a courier and two days of waiting, and every site has its own way of handling it.',
          pains: [
            { who: 'employee', title: 'Second-class service', text: 'Branch staff wait days for what headquarters gets in minutes.' },
            { who: 'it', title: 'Hours on the road', text: 'Driving devices between sites eats time and budget.' },
            { who: 'company', title: 'Fourteen ways to do one thing', text: 'Without a common process there is no overview and nothing to compare.' },
          ],
        },
        steps: [
          { role: 'spind', title: 'Place', text: 'A Spind is installed at each site that needs one.' },
          { role: 'it', title: 'Connect', text: 'Every locker appears on the map in our application.' },
          { role: 'partner', title: 'Service', text: 'Our field partner fills, collects and maintains the lockers.' },
          { role: 'it', title: 'Oversee', text: 'IT sees live status and capacity for every site in one place.' },
        ],
        log: {
          title: 'Every site in one view',
          text: 'Live status, capacity and requests for every locker sit side by side, so IT knows which site needs a refill before anyone calls.',
          locker: 'All sites',
          entries: [
            { time: '06:10', event: 'Warehouse East · swap done', detail: 'Scanner · drawer 12' },
            { time: '07:25', event: 'Branch 02 · kit collected', detail: 'New hire, Sales' },
            { time: '09:40', event: 'Depot North · 2 replacements left', detail: 'Refill requested' },
            { time: '15:05', event: 'Depot North · drawers filled', detail: 'Field partner' },
          ],
        },
        benefits: {
          it: [
            { title: 'One process everywhere', text: 'Every site follows the same steps, in the same application.' },
            { title: 'Fewer trips', text: 'IT stops driving devices between sites.' },
            { title: 'A partner network', text: 'We manage the partners who service your lockers on site.' },
          ],
          people: [
            { title: 'The service headquarters gets', text: 'Branch staff get replacements just as fast.' },
            { title: 'Open on their shift', text: 'Plants and warehouses run around the clock, and so does the locker.' },
            { title: 'No IT visit to wait for', text: 'The device is already on site.' },
          ],
        },
        connects: [
          { key: 'lissa', text: 'Every locker, drawer and device across all sites in one record.' },
          { key: 'sso', text: 'One corporate identity opens lockers at every site.' },
          { key: 'service', text: 'Fills and maintains the lockers at every site.' },
          { key: 'partner', text: 'Your local service partner can take over a site with its own access.' },
        ],
        faq: [
          { q: 'Does every site need its own IT staff?', a: 'No, employees use the locker on their own, and our field partner fills and maintains it.' },
          { q: 'Can we start with one site?', a: 'Yes, start with one site and add a locker wherever it pays off, and every new one joins the same view.' },
          { q: 'Who services lockers at remote sites?', a: 'Our partner network covers your sites, or your own local service partner takes over with its own access.' },
        ],
        cta: {
          title: 'Map your sites with us',
          text: 'Bring your list of sites, and we show you where a Spind pays off first.',
        },
      },
    ],
  },

  customers: {
    title: 'Customer stories',
    heroTitle: 'How enterprise IT teams run handovers with Spind',
    intro: 'Four typical setups, from one office lobby to a shared campus, described by industry and size.',
    exampleBadge: 'Example',
    exampleNote: 'Anonymized sample cases: they show typical setups. Figures and quotes follow only with the customer’s written approval.',
    all: 'All',
    filterLabel: 'Filter by industry',
    countOne: 'story',
    countMany: 'stories',
    featured: 'Featured story',
    read: 'Read the story',
    readFull: 'Read full',
    quotesTitle: 'What IT teams say',
    quotesCta: 'All customer stories',
    facts: { industry: 'Industry', employees: 'Employees', size: 'Setup', sites: 'Sites', solutions: 'Use cases' },
    sections: { challenge: 'The challenge', solution: 'What they did', results: 'Self-service, around the clock' },
    more: 'More stories',
    ctaTitle: 'Write the next story with us',
    ctaText: 'Start with one Spind at one site and see the results within weeks.',
    ctaButton: 'Plan a pilot',
    back: 'All customer stories',
  },

  /**
   * Anonymized SAMPLE cases from Pera's document (Nov 2026). No logos, no company names, no names of people.
   * Quotes are examples attributed to a role only. TODO: replace with approved quotes and results before launch.
   */
  proof: {
    stories: [
      {
        slug: 'logistics-network',
        industry: 'Logistics',
        industryKey: 'logistics',
        company: 'Logistics company',
        navLabel: 'Logistics company, 12 sites',
        type: 'Logistics company',
        employees: '2,400',
        size: 'Shift work, no IT on site',
        sites: '12 sites',
        solutions: ['faulty-device-swap', 'multi-site'],
        headline: 'Defective scanner at 10 p.m.: the driver swaps it themselves',
        summary: 'A logistics company with twelve sites and no IT staff on site keeps scanners and handhelds running through shift work.',
        metrics: [
          { value: '12', label: 'sites without IT on site' },
          { value: '24/7', label: 'swaps, also on weekends' },
          { value: '1', label: 'overview of every swap' },
        ],
        challenge: 'When a scanner failed at one site, it meant a ticket, a courier and often two days without a device.',
        solution: 'Each site has a Spind locker. Drivers and dispatchers collect the replacement scanner themselves and put the defective one into the drawer, our field service partner collects it and places a new device, and the light shows which drawer needs swapping.',
        results: 'Swaps happen without a hotline, and dispatchers see every swap per site in one overview. Shift changes, night routes and weekends are covered, because self-pickup works at any time.',
        quote: { text: 'Our drivers no longer lose a shift to a broken scanner, they swap it at the start of the route.', role: 'Head of IT, logistics company' },
      },
      {
        slug: 'hospital-network',
        industry: 'Healthcare',
        industryKey: 'healthcare',
        company: 'Hospital network',
        navLabel: 'Hospital network',
        type: 'Hospital network',
        employees: '5,000',
        size: 'Three shifts',
        sites: 'Wards and outpatient area',
        solutions: ['faulty-device-swap', 'temporary-device'],
        headline: 'Night shift at three in the morning: a replacement device in minutes',
        summary: 'A hospital network with three shifts keeps nursing staff and doctors supplied with working devices around the clock.',
        metrics: [
          { value: '3', label: 'shifts covered' },
          { value: '24/7', label: 'access with the staff badge' },
          { value: '100%', label: 'of accesses logged' },
        ],
        challenge: 'A failed tablet or a defective scanner during the night shift takes time away from patient care, and IT is not staffed at night.',
        solution: 'Spind lockers stand on the wards and in the outpatient area, and access uses the staff ID badge. Hospital IT fills the drawers during the day, at night staff take out and exchange devices themselves.',
        results: 'Removing and returning a device needs no ticket, and every access is logged, so it is always clear who had which device and when. Access is open around the clock, while filling happens during day shifts at fixed times so nothing runs out at night.',
        quote: { text: 'At three in the morning a broken tablet is now a two-minute walk, not a problem for the next day.', role: 'IT lead, hospital network' },
      },
      {
        slug: 'office-head-office',
        industry: 'Office',
        industryKey: 'office',
        company: 'Mid-sized company',
        navLabel: 'Office, 600 employees',
        type: 'Corporate office',
        employees: '600',
        size: 'Office hours, IT on site',
        sites: '1 head office',
        solutions: ['faulty-device-swap', 'temporary-device'],
        headline: 'Replacement hardware in the office, without a trip to IT',
        summary: 'A mid-sized company with 600 employees now collects accessories from a locker themselves.',
        metrics: [
          { value: '600', label: 'employees served' },
          { value: 'Teams', label: 'to request a device' },
          { value: 'Badge', label: 'or QR code to open' },
        ],
        challenge: 'A broken mouse, dock or headset used to mean a ticket, a wait and often a walk to the IT department, which cost time on both sides.',
        solution: 'A Spind locker stands in the lobby of the head office. Employees check in with their company badge or a QR code, take the replacement and put the defective device back into the drawer, and the light on the drawer shows which device needs swapping.',
        results: 'The request runs through Teams and the employee receives a pickup code, while devices are enrolled through the MDM. Access and pickup also work early in the morning and in the evening, when IT is not on site.',
        quote: { text: 'A broken headset no longer means a ticket and a walk to IT, people just swap it in the lobby.', role: 'Head of IT, mid-sized company' },
      },
      {
        slug: 'office-campus',
        industry: 'Campus',
        industryKey: 'campus',
        company: 'Campus operator',
        navLabel: 'Campus, 10 companies',
        type: 'Campus operator',
        employees: '3,500 across all tenants',
        size: '10 tenant companies',
        sites: '1 shared lobby',
        solutions: ['multi-site', 'onboarding'],
        headline: 'Ten companies, one system, one lobby',
        summary: 'A campus operator offers its tenants a shared IT service around the clock.',
        metrics: [
          { value: '10', label: 'companies on one system' },
          { value: '1', label: 'shared lobby' },
          { value: 'Per tenant', label: 'access and billing' },
        ],
        challenge: 'Ten companies on the campus each have their own IT department, devices and rules, and a shared service was not possible because each company may only see its own employees and devices.',
        solution: 'One Spind system in the campus lobby with tenant-separated access. Each company sees only its own drawers, permissions and devices, and billing is per tenant.',
        results: 'Employees check in with their own company badge or QR code. The companies stay responsible for their employees, the campus operator provides the infrastructure, the lobby is reachable around the clock and filling runs through the operator on a fixed schedule.',
        quote: { text: 'We offer every tenant the same IT service, and no company ever sees another company’s devices.', role: 'Managing director, campus operator' },
      },
    ],
  },

  checklist: {
    title: 'Rollout checklist',
    heading: 'Everything to prepare before your first Spind',
    intro: 'Site, modules, system setup and go-live in the order you will need them, ready to print or save as a PDF.',
    print: 'Print or save as PDF',
    back: 'Back to the homepage',
    cta: 'Plan a pilot with us',
    phases: [
      {
        title: 'Choose the site',
        items: [
          'Pick a branch where devices change hands often or where no IT staff is on site.',
          'Find a spot employees pass every day, with room for the modules you need at 850 mm height.',
          'Ask us about power and network at that spot before the delivery date.',
        ],
      },
      {
        title: 'Choose the modules',
        items: [
          'Every Spind starts with Otto, the module that holds the screen and the badge reader.',
          'Add Lotte for small devices, Bruno for laptops and Greta for a mix of both.',
          'Check your largest devices against the drawer openings, 175 × 90 mm for phones and 500 × 90 mm for laptops.',
        ],
      },
      {
        title: 'Prepare the application',
        items: [
          'Decide which handovers the pilot covers, for example swap, loan, onboarding or offboarding.',
          'Choose how employees open drawers: RFID badge, QR code or PIN, and how long codes stay valid.',
          'Decide who fills the lockers: our field partner, or your own IT team.',
        ],
      },
      {
        title: 'Go live',
        items: [
          'Agree on the first devices that go into the drawers.',
          'Tell the employees at the site how to request a device and open a drawer.',
          'Plan a review of pending, done and expired requests and the activity log.',
        ],
      },
    ],
  },

  roles: {
    title: 'Who does what',
    items: [
      { title: 'Employee', text: 'Opens the right drawer with a badge, QR code or PIN, any time.' },
      { title: 'IT team', text: 'Creates and follows every request in our application.' },
      { title: 'Field partner', text: 'Fills the drawers and collects returned devices.' },
    ],
  },

  pricing: {
    title: 'Pricing that fits your setup',
    text: 'Every Spind is priced for your sites, devices and use cases, and filling the lockers yourself lowers the price, so we put together your offer after a short call.',
    cta: 'Book a call',
  },

  goLive: {
    title: 'Go live in 8 weeks',
    intro: '',
    phases: [
      { label: 'Week 1', from: 1, to: 1, title: 'Plan', text: 'We map your sites, devices and handover flows in one workshop.' },
      { label: 'Week 2', from: 2, to: 2, title: 'Connect', text: 'We link Spind to your sign-in, your MDM and your asset records.' },
      { label: 'Weeks 3–6', from: 3, to: 6, title: 'Prepare', text: 'We build your locker, set up the drawers and train your team.' },
      { label: 'Weeks 7–8', from: 7, to: 8, title: 'Go live', text: 'Our field partner installs Spind and runs the first handovers with you.' },
    ],
  },

  video: {
    title: 'See Spind in action',
    intro: '',
    /** Paste the video file URL (mp4) and a poster image here once the film is ready. Empty shows the placeholder. */
    src: '',
    poster: '/images/video-poster.jpg',
    play: 'Play the Spind video',
    placeholder: '',
  },

  faq: {
    title: 'FAQ',
    items: [
      {
        q: 'How do employees open a drawer?',
        a: 'With their RFID company badge, or with the QR code or PIN they get when they request a device in the app or in Teams.',
      },
      {
        q: 'Do employees need the app?',
        a: 'No. They can request a device in the app, or simply walk up to the locker, tap their badge and Spind opens the right drawer.',
      },
      {
        q: 'Who fills and empties the locker?',
        a: 'Our field service partner places new devices and collects faulty ones. If your own IT team prefers to fill the lockers, the price is lower.',
      },
      {
        q: 'Is it really open 24/7?',
        a: 'Access and self-pickup work around the clock. Filling and emptying run on a fixed schedule, so nothing runs out at night.',
      },
      {
        q: 'Is Spind secure?',
        a: 'Yes. Our information security management is ISO 27001 certified by TÜV Austria, data stays in the EU and every action is logged.',
      },
      {
        q: 'Which devices fit?',
        a: 'Phones up to the size of an iPhone 17 Pro Max and laptops up to a MacBook Pro 16″ fit, with the opening sizes listed under Modules.',
      },
      {
        q: 'What does it cost?',
        a: 'Pricing depends on your sites, devices and use cases, so we put together your offer after a short call.',
      },
      {
        q: 'How do we start?',
        a: 'Start small with one module at one site and add modules and sites as you grow. We deliver, connect and set it up in 8 weeks.',
      },
    ],
  },

  contact: {
    title: 'Plan your first Spind site in one call',
    intro: 'Show us your sites and devices, and in 30 minutes we will show you how Spind fits and what a pilot needs.',
    form: {
      name: 'Name',
      company: 'Company',
      email: 'Work email',
      sites: 'Number of sites',
      message: 'Message',
      optional: 'optional',
      submit: 'Send request',
      fewer: 'Fewer sites',
      moreSites: 'More sites',
      // Neutral hints in the empty fields (no names of people or companies).
      placeholders: {
        name: 'First and last name',
        company: 'Company name',
        email: 'name@company.com',
        sites: '5',
        message: 'Tell us about your sites and how many devices change hands each month.',
      },
      sending: 'Sending',
      success: 'Thank you, your request is on its way.',
      failure: 'Something went wrong, please email us directly.',
      mailtoNote: 'Your email app will open with the request filled in.',
      errors: {
        required: 'Please fill in this field.',
        email: 'Please enter a valid work email, for example name@company.com.',
        sites: 'Please enter a whole number of 1 or more.',
        summary: 'Please check the highlighted fields.',
      },
      subject: 'Spind call request',
    },
  },

  footer: {
    byline: 'Spind by Cimet',
    impressum: 'Impressum',
    privacy: 'Privacy',
    rightsOwner: 'Cimet',
    rightsUrl: 'https://cimet.rs/',
    rights: 'All rights reserved.',
    productOf: 'Spind is a product of',
    copyright: 'Copyright',
    legalNav: 'Legal',
    pageNav: 'Sections',
    pricing: 'Pricing',
    checklist: 'Rollout checklist',
    faq: 'FAQ',
  },

  legal: {
    impressum: {
      title: 'Impressum',
      description: 'Legal notice for the Spind website by Cimet.',
      body: [
        'This page is a placeholder. The final legal notice will be provided by Cimet before launch.',
      ],
      heading: 'Company details',
      todo: 'TODO: legal text from Cimet (company name, address, commercial register number, VAT ID, managing directors, contact details, supervisory authority if applicable).',
    },
    privacy: {
      title: 'Privacy',
      description: 'Privacy policy for the Spind website by Cimet.',
      body: [
        'This page is a placeholder. The final privacy policy will be provided by Cimet before launch.',
      ],
      heading: 'Data we process',
      todo: 'TODO: legal text from Cimet (controller, data from the contact form and where it is sent, hosting on Cloudflare Pages, analytics if enabled, retention periods, rights of data subjects). Technical note: this site self-hosts its fonts, loads no third-party trackers and sets no cookies.',
    },
    back: 'Back to the homepage',
  },
};

export type SiteContent = typeof en;

/**
 * "Case studies" menu: built from the stories, one column per industry, so a visitor finds a story from their own
 * industry in one click. Shown only when there are stories to show (same rule as the customer story pages).
 */
function withCaseStudies(c: SiteContent): SiteContent {
  if (!showStories) return c;
  const industries = [...new Set(c.proof.stories.map((s) => s.industry))];
  const title = (k: string) => c.solutions.items.find((i) => i.slug === k)?.title ?? k;
  c.nav.groups.push({
    id: 'case-studies',
    label: c.nav.caseStudies.label,
    columns: industries.map((ind) => ({
      title: ind,
      items: c.proof.stories
        .filter((s) => s.industry === ind)
        .map((s) => ({ label: s.navLabel, footerLabel: s.type, text: s.solutions.map(title).join(', '), href: `/customers/${s.slug}`, icon: `ind-${s.industryKey}` })),
    })),
    feature: c.nav.caseStudies.feature,
  } as (typeof c.nav.groups)[number]);
  return c;
}

const content: Record<string, SiteContent> = { en: withCaseStudies(en), de: withCaseStudies(de) };

export function getContent(locale?: string): SiteContent {
  return content[locale ?? 'en'] ?? content.en;
}
