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
 * Describe customers by industry and size only, for example "Logistics network, 12 sites".
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
              { label: 'Integrations', text: 'MDM, ITSM, identity and partners', href: '/integrations', icon: 'integrations' },
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
    map: 'Architecture',
    systems: 'Systems',
    methods: 'Connection methods',
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

  // From Pera's integration proposal (Nov 2026). Statuses: available, request (to be confirmed) or pilot (proposal).
  // TODO (Pera): confirm every "request" entry before launch.
  integrationsPage: {
    meta: 'How Spind connects to MDM, ITSM, identity, HR, Microsoft Teams and AI assistants in enterprise IT.',
    label: 'Integrations',
    title: 'Keep using the systems you already have',
    intro: 'Spind is where devices are physically available. Our application connects processes, permissions and data, so employees request devices where they already work.',
    primary: 'Talk to our integration team',
    secondary: 'Calculate your business case',
    mapTitle: 'How it fits together',
    mapIntro: '',
    mapLeft: 'Your systems',
    mapHub: 'Our application',
    mapHubText: 'Asset records, rules and the full audit trail',
    mapRight: 'Spind lockers',
    sites: ['Headquarters', 'Branch offices', 'Plants and warehouses'],
    systemsTitle: 'Systems we connect',
    systemsIntro: '',
    /** The map on the left lists every system except LISSA Asset (it is the application in the middle). */
    systems: [
      { key: 'lissa', title: 'LISSA Asset', examples: 'Asset management', text: 'Every device in a drawer is an asset with its full history.', logo: true, status: 'available' as IntegrationStatus },
      { key: 'endpoint', title: 'MDM and endpoints', examples: 'e.g. Microsoft Intune, Jamf', text: 'Employees enroll their own devices, secured through your MDM.', status: 'available' as IntegrationStatus },
      { key: 'service', title: 'Field service', examples: 'Our service partner', text: 'Collects defective devices and places new ones in the drawer.', status: 'available' as IntegrationStatus },
      { key: 'servicedesk', title: 'ITSM and service desk', examples: 'e.g. ServiceNow', text: 'Informed without a ticket, with CMDB sync instead of double maintenance.', status: 'request' as IntegrationStatus },
      { key: 'teams', title: 'Microsoft Teams', examples: 'LISSA agent', text: 'Employees ask in chat and receive a pickup code.', status: 'request' as IntegrationStatus },
      { key: 'sso', title: 'Identity and SSO', examples: 'e.g. Microsoft Entra ID, Okta', text: 'Access with the corporate identity, permissions per employee.', status: 'pilot' as IntegrationStatus },
      { key: 'hr', title: 'HR systems', examples: 'e.g. SAP SuccessFactors, Workday', text: 'Joiners and leavers set locker permissions automatically.', status: 'pilot' as IntegrationStatus },
      { key: 'ai', title: 'AI assistants', examples: 'MCP server', text: 'Assistants trigger actions, like a replacement for drawer 4.', status: 'pilot' as IntegrationStatus },
    ],
    methodsTitle: 'How it connects and runs',
    methodsIntro: '',
    methods: [
      { key: 'api', title: 'REST API', text: 'Read and set drawers, access, bookings and device status.', status: 'request' as IntegrationStatus },
      { key: 'events', title: 'Webhooks', text: 'Events like "device placed" or "drawer opened" go to your systems.', status: 'request' as IntegrationStatus },
      { key: 'access', title: 'Locker access', text: 'RFID badge, QR code or PIN, whatever employees already carry.', status: 'available' as IntegrationStatus },
      { key: 'filling', title: 'Filling model', text: 'Our partner fills and empties the lockers, or your IT does it for a better price.', status: 'available' as IntegrationStatus },
    ],
    stagesTitle: 'Roll it out in three stages',
    stages: [
      { label: 'Stage 1', title: 'Lockers, access and filling', text: 'Lockers, badge access, the filling model and the API. Usable immediately.' },
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
      { q: 'Who builds the integration?', a: 'We do, together with your IT team: the basics in week 2 of the rollout, identity, HR and ITSM in a second stage.' },
      { q: 'Our system is not on the list. Can you still connect it?', a: 'Most likely yes, through the API or webhooks. We check it in the first workshop.' },
      { q: 'Can one integration serve all our sites?', a: 'Yes, the connection runs through our application, so every new locker and site uses it from day one.' },
    ],
    ctaTitle: 'Map your landscape with us',
    ctaText: 'Bring your system list to a short call. We show you where Spind plugs in and what the first site needs.',
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

  solutions: {
    label: 'Use case',
    breadcrumb: 'Use cases',
    primary: 'Book a call',
    secondary: 'Calculate your business case',
    todayTitle: 'What it looks like today',
    flowTitle: 'How it works with Spind',
    benefitsTitle: 'What changes',
    faqTitle: 'Questions about this',
    moreTitle: 'More use cases',
    visualLabel: 'with a Spind locker',
    items: [
      {
        slug: 'faulty-device-swap',
        title: 'Faulty device swap',
        heroTitle: 'A broken laptop shouldn’t cost a working day',
        intro: 'Employees request a swap in the app or simply tap their badge at the locker, take the replacement and leave the faulty device in the drawer, the same day and without waiting for IT.',
        today: [
          'The employee writes a ticket and waits for a reply',
          'IT books a slot or ships a replacement',
          'The faulty device stays with the employee for days',
        ],
        steps: [
          { title: 'Report', text: 'The employee reports the fault in the app, or walks straight up to the locker.' },
          { title: 'Identify', text: 'They tap their RFID badge, or scan the QR code or enter the PIN.' },
          { title: 'Swap', text: 'Spind opens the right drawer: they take the new device and leave the broken one.' },
          { title: 'Collected', text: 'Our field service partner picks up the faulty device, and every step is logged.' },
        ],
        benefits: [
          { title: 'Same day', text: 'Replacement devices wait in the locker, ready for the next fault.' },
          { title: 'No appointment', text: 'The swap happens when the employee has time, 24/7.' },
          { title: 'Nothing gets lost', text: 'Every return and pickup is logged against the device and the person.' },
        ],
      },
      {
        slug: 'temporary-device',
        title: 'Temporary devices',
        heroTitle: 'Lend a device for exactly as long as it is needed',
        intro: 'Employees borrow a laptop or phone for a project, a trip or the time a repair takes, collect it from the locker and bring it back when the loan ends.',
        today: [
          'Loan devices are tracked in spreadsheets',
          'Nobody reminds the borrower when the loan ends',
          'Devices come back late or not at all',
        ],
        steps: [
          { title: 'Request', text: 'The employee requests a device for a set period in the app.' },
          { title: 'Pick up', text: 'They tap their badge at the locker and the drawer opens.' },
          { title: 'Use', text: 'The loan runs until the agreed end date, with a reminder before it ends.' },
          { title: 'Return', text: 'They put the device back in a drawer and the loan closes itself.' },
        ],
        benefits: [
          { title: 'A set end date', text: 'Every loan has a start and an end, visible in our application.' },
          { title: 'Always a spare', text: 'A pool of loan devices waits in the locker for the next project.' },
          { title: 'Nothing goes missing', text: 'Every pickup and return is logged against the person and the device.' },
        ],
      },
      {
        slug: 'lost-device',
        title: 'Lost device',
        heroTitle: 'A lost phone shouldn’t stop anyone for days',
        intro: 'When a device is lost, IT blocks it through the MDM and the employee collects a replacement from the locker the same day.',
        today: [
          'The employee calls IT and waits',
          'A replacement is ordered or shipped',
          'The lost device is not blocked right away',
        ],
        steps: [
          { title: 'Report', text: 'The employee reports the loss in the app, in Teams or at the locker.' },
          { title: 'Block', text: 'IT blocks the lost device through the MDM in one step.' },
          { title: 'Pick up', text: 'A replacement waits in a drawer and opens with the employee’s badge.' },
          { title: 'Logged', text: 'The loss and the replacement are logged against the person and the device.' },
        ],
        benefits: [
          { title: 'Same day', text: 'The employee is working again within hours, not days.' },
          { title: 'Secured fast', text: 'The lost device is blocked before anyone can use it.' },
          { title: 'A clear record', text: 'Every loss is on record, with the person, the device and the time.' },
        ],
      },
      {
        slug: 'eou-rollout',
        title: 'EOU rollout',
        heroTitle: 'Roll out new devices without a single appointment',
        intro: 'Employees return their end-of-use device and collect the new one in the same visit, whenever it suits them, while IT loads the lockers only once.',
        today: [
          'IT plans hundreds of handover slots',
          'Employees miss appointments and rebook',
          'Old devices go missing after the rollout',
        ],
        steps: [
          { title: 'Plan', text: 'IT assigns the new devices to employees in our application.' },
          { title: 'Load', text: 'Our field partner fills the drawers with staged devices.' },
          { title: 'Exchange', text: 'The employee returns the old device and opens the drawer with the new one.' },
          { title: 'Refurbish', text: 'Old devices are collected, wiped and logged on their way back to the pool.' },
        ],
        benefits: [
          { title: 'At their own pace', text: 'Devices are collected over days, not in one crowded week.' },
          { title: 'Old devices come back', text: 'Return and pickup happen in the same visit to the locker.' },
          { title: 'One view of progress', text: 'Our application shows which requests are pending, done or expired.' },
        ],
      },
      {
        slug: 'onboarding',
        title: 'Onboarding',
        heroTitle: 'New hires have a working laptop from minute one',
        intro: 'IT prepares the starter kit in advance, and new hires collect it from the locker at their own site, even when IT isn’t there.',
        today: [
          'IT coordinates start dates by email',
          'Kits wait at headquarters, not at the branch',
          'The first day starts with waiting for a laptop',
        ],
        steps: [
          { title: 'Prepare', text: 'IT assigns the starter devices to the new hire in our application.' },
          { title: 'Load', text: 'Our field partner puts the kit into a drawer at the right site.' },
          { title: 'Welcome', text: 'The new hire receives a QR code and PIN before day one.' },
          { title: 'Start', text: 'They collect the kit at the locker and the assignment is logged.' },
        ],
        benefits: [
          { title: 'Ready on time', text: 'Kits are in place at the employee’s own site before they arrive.' },
          { title: 'Every site', text: 'Branches without IT staff onboard the same way as headquarters.' },
          { title: 'Clear ownership', text: 'Each device is assigned to the new hire from the first pickup.' },
        ],
      },
      {
        slug: 'offboarding',
        title: 'Offboarding return',
        heroTitle: 'Get every device back when people leave',
        intro: 'Leavers return laptops, phones and accessories to a drawer on their last day, even after hours, and every return is logged against their name.',
        today: [
          'Returns are chased by email for weeks',
          'Devices are left on desks or at reception',
          'Nobody knows what was actually returned',
        ],
        steps: [
          { title: 'Announce', text: 'IT creates the return request in our application.' },
          { title: 'Identify', text: 'The leaver taps their badge or uses the QR code for an empty drawer.' },
          { title: 'Return', text: 'They place the devices in the drawer and close it.' },
          { title: 'Collect', text: 'Our field partner collects the devices and every step is logged.' },
        ],
        benefits: [
          { title: 'Last day, any hour', text: 'Returns fit the leaver’s schedule, not the opening hours of the IT desk.' },
          { title: 'Audit trail', text: 'Each return is logged per device, person and locker.' },
          { title: 'Back into the pool', text: 'Returned devices are wiped and refurbished for the next employee.' },
        ],
      },
      {
        slug: 'multi-site',
        title: 'Multi-site IT',
        heroTitle: 'The same IT service at every site',
        intro: 'A Spind at each branch gives every employee the same pickup, return and swap, and our partner network services every locker.',
        today: [
          'Branches without IT wait for the next visit',
          'Every site invents its own process',
          'Travel between sites eats the IT budget',
        ],
        steps: [
          { title: 'Place', text: 'A Spind is installed at each site that needs one.' },
          { title: 'Connect', text: 'Every locker appears on the map in our application.' },
          { title: 'Service', text: 'Our field partner fills, collects and maintains the lockers.' },
          { title: 'Oversee', text: 'IT sees live status and capacity for every site in one place.' },
        ],
        benefits: [
          { title: 'One process', text: 'Employees follow the same steps at every branch.' },
          { title: 'Partner network', text: 'We manage the network of partners for servicing.' },
          { title: 'Fewer trips', text: 'IT stops driving devices between sites.' },
        ],
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
    facts: { industry: 'Industry', size: 'Size', sites: 'Sites', solutions: 'Use cases' },
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
        company: 'Logistics network',
        navLabel: 'Logistics, 12 sites',
        size: 'Shift work, no IT on site',
        sites: '12 sites',
        solutions: ['faulty-device-swap', 'multi-site'],
        headline: 'Defective scanner at 10 p.m.: the driver swaps it themselves',
        summary: 'A logistics network with twelve sites and no IT staff on site keeps scanners and handhelds running through shift work.',
        metrics: [
          { value: '12', label: 'sites without IT on site' },
          { value: '24/7', label: 'swaps, also on weekends' },
          { value: '1', label: 'overview of every swap' },
        ],
        challenge: 'When a scanner failed at one site, it meant a ticket, a courier and often two days without a device.',
        solution: 'Each site has a Spind locker. Drivers and dispatchers collect the replacement scanner themselves and put the defective one into the drawer, our field service partner collects it and places a new device, and the light shows which drawer needs swapping.',
        results: 'Swaps happen without a hotline, and dispatchers see every swap per site in one overview. Shift changes, night routes and weekends are covered, because self-pickup works at any time.',
        quote: { text: 'Our drivers no longer lose a shift to a broken scanner, they swap it at the start of the route.', role: 'Head of IT, logistics network' },
      },
      {
        slug: 'hospital-network',
        industry: 'Healthcare',
        industryKey: 'healthcare',
        company: 'Hospital network',
        navLabel: 'Hospital network',
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
        size: '600 employees',
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
        .map((s) => ({ label: s.navLabel, text: s.solutions.map(title).join(', '), href: `/customers/${s.slug}`, icon: `ind-${s.industryKey}` })),
    })),
    feature: c.nav.caseStudies.feature,
  } as (typeof c.nav.groups)[number]);
  return c;
}

const content: Record<string, SiteContent> = { en: withCaseStudies(en), de: withCaseStudies(de) };

export function getContent(locale?: string): SiteContent {
  return content[locale ?? 'en'] ?? content.en;
}
