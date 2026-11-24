/**
 * All website copy, flags and contact data live in this file.
 *
 * Editing tips for non-developers:
 * - Change only the text between quotes. Keep the quotes and commas.
 * - Titles have no full stop. Body copy is one sentence with one full stop.
 * - Do not use em dashes.
 *
 * German: copy the `en` object below into a new `de` object, translate it,
 * and add 'de' to the locales in astro.config.mjs (see README).
 */

export const flags = {
  /**
   * Shows the "Already running at enterprise clients" section.
   * TODO: permission to name BVG and Wiener Stadtwerke is not confirmed yet. Keep false until it is.
   */
  showClients: false,
  /**
   * Shows EXAMPLE social proof: fictional companies, mock logos and example quotes, each labelled "Example".
   * They show the layout only. TODO: replace with approved client stories, or set to false, before launch.
   */
  exampleProof: true,
};

/** Customer stories pages, menu and footer links are built when there is something to show. */
export const showStories = flags.showClients || flags.exampleProof;

export const contact = {
  name: 'Pera Jovicki',
  email: 'pjovicki@cimet.rs',
  phone: '+43 664 171 88 84',
  phoneHref: '+436641718884',
};

const en = {
  meta: {
    title: 'Spind, the smart locker for enterprise IT',
    description:
      'Spind is self-service pickup, return and swap for enterprise IT, around the clock at every site.',
  },

  nav: {
    /**
     * Header menus (mega menu on desktop, accordion on mobile) and footer link groups.
     * href: "#id" is a section on the home page, "/path" is a page.
     */
    groups: [
      {
        id: 'product',
        label: 'Product',
        columns: [
          {
            title: 'Spind locker',
            items: [
              { label: 'How it works', text: 'Request, code, open and logged', href: '#how-it-works' },
              { label: 'Modules and sizes', text: 'Master, S24, N8 and M12-4', href: '#modules' },
              { label: 'Service', text: 'We fill, collect and maintain', href: '#service' },
            ],
          },
          {
            title: 'LISSA Asset',
            items: [
              { label: 'Platform', text: 'Full control of every locker', href: '#platform' },
              { label: 'Workflows', text: 'Today compared with Spind', href: '#workflows' },
              { label: 'Device lifecycle', text: 'From the pool back to the pool', href: '#service' },
            ],
          },
        ],
        feature: {
          label: 'Pricing',
          title: 'Pricing that fits your setup',
          text: 'Priced for your sites, devices and use cases.',
          cta: 'Talk to us about pricing',
          href: '#pricing',
        },
      },
      {
        id: 'use-cases',
        label: 'Use cases',
        columns: [
          {
            title: 'Device lifecycle',
            items: [
              { label: 'New device pickup', text: 'Pre-staged devices, ready 24/7', href: '/use-cases/new-device-pickup' },
              { label: 'Faulty device swap', text: 'A working device on the same day', href: '/use-cases/faulty-device-swap' },
              { label: 'EOL rollout', text: 'Old device in, new device out', href: '/use-cases/eol-rollout' },
            ],
          },
          {
            title: 'People and sites',
            items: [
              { label: 'Onboarding', text: 'Day one starts at the locker', href: '/use-cases/onboarding' },
              { label: 'Offboarding return', text: 'Leavers return equipment any time', href: '/use-cases/offboarding' },
              { label: 'Multi-site IT', text: 'One process for every branch', href: '/use-cases/multi-site' },
            ],
          },
        ],
        feature: {
          label: 'Business case',
          title: 'See how much IT time Spind saves',
          text: 'Put in your own numbers and see the hours your IT team gets back.',
          cta: 'Open the calculator',
          href: '#business-case',
        },
      },
    ],
    links: [{ id: 'pricing', label: 'Pricing', href: '#pricing' }],
    // Customer stories are linked from the quotes section when there are stories to show (showStories).
    customers: { label: 'Customer stories', text: 'How IT teams use Spind', href: '/customers' },
    cta: 'Book a call',
    /** Language selector next to Pricing. A language with available: false is listed but not linked yet. */
    languages: [
      { code: 'de', label: 'Deutsch', href: '/de/', available: false },
      { code: 'en', label: 'English', href: '/', available: true },
    ],
    languageLabel: 'Language',
    soon: 'soon',
    menu: 'Menu',
    close: 'Close menu',
    skip: 'Skip to content',
  },

  hero: {
    title: 'Devices available 24/7 without bothering IT staff',
    subAccent: 'Spind',
    subRest: ' is self-service pickup, return and swap for enterprise IT, around the clock at every site.',
    primary: 'Book a call',
    secondary: 'See how it works',
    facts: [
      { k: 'Access', v: 'QR code or PIN' },
      { k: 'Availability', v: '24/7 at every site' },
      { k: 'Managed in', v: 'LISSA Asset' },
    ],
    lockerLabel: 'Front view of a Spind locker with a master module and drawers, one drawer open',
  },

  problem: {
    title: 'Touchpoints for one faulty device',
    intro: '',
    cards: [
      { title: 'Talent waste', text: 'Senior people spend hours on handovers instead of working' },
      { title: 'Hybrid work', text: 'Employees are rarely on site when IT staff is' },
      { title: 'Many sites', text: 'Every branch expects the same service, but few have IT staff' },
      { title: 'Off-hours', text: 'Devices break at 6 am and on weekends, not 9 to 5' },
    ],
  },

  how: {
    title: 'From request to device in four steps',
    intro: '',
    steps: [
      { role: 'Employee', title: 'Request', text: 'Employee himself resolves the problem with Spind.' },
      { role: 'LISSA Asset', title: 'QR or PIN code', text: 'The employee gets a QR code and PIN for performing actions.' },
      { role: 'Spind', title: 'Open', text: 'They scan it at the locker and the right drawer opens.' },
      { role: 'IT', title: 'Tracked', text: 'Every action in LISSA Asset is logged.' },
    ],
    lockerLabel: 'Spind locker showing the current step: request, code, open drawer or logged',
    screen: { request: 'New request', code: 'Scan or enter PIN', open: 'Drawer 08 open', logged: 'Logged' },
  },

  modules: {
    title: 'Built with respect to industry standards',
    intro: '',
    labels: { master: 'Master', s24: 'S24', n8: 'N8', m124: 'M12-4' },
    height: '850 MM',
    lockerLabel: 'Spind modules side by side: Master, S24, N8 and M12-4, 850 mm high',
    fitTitle: 'Drawer size examples',
    fit: [
      // Two reference devices: the largest common phone and laptop sizes.
      { device: 'iPhone 17 Pro Max', size: '163 × 78 × 9', opening: '175 × 90', result: '12 mm spare' },
      { device: 'MacBook Pro 16″', size: '356 × 248 × 17', opening: '500 × 90', result: '144 mm spare' },
    ],
    fitHead: { size: 'Size (mm)', opening: 'Opening W × H (mm)' },
  },

  workflows: {
    title: 'Built to save time and increase efficiency',
    intro: '',
    cards: [
      { slug: 'eol-rollout', title: 'EOL rollout', text: 'Return the old device and collect the new one.' },
      { slug: 'faulty-device-swap', title: 'Faulty device swap', text: 'Replacement device available on the same day.' },
      { slug: 'new-device-pickup', title: 'New device pickup', text: 'Pre-staged devices wait for the employee, 24/7.' },
      { slug: 'onboarding', title: 'Onboarding', text: 'Day one starts at the locker, not at the IT desk.' },
      { slug: 'offboarding', title: 'Offboarding return', text: 'Leavers return equipment any time, fully logged.' },
      { slug: 'multi-site', title: 'Worldwide', text: 'We manage the network of partners for servicing' },
    ],
    more: 'Learn more',
    today: 'Today',
    withLead: 'With',
    withBrand: 'Spind',
    compare: [
      ['Write a ticket', 'Request in LISSA, or at SPIND'],
      ['Wait for an appointment', 'Pick up any time, 24/7'],
      ['Handover by IT staff', 'No IT person on site'],
      ['Chase the old device', 'Old device goes back in the drawer'],
      ['A different process per site', 'One process for every branch'],
    ],
  },

  platform: {
    title: 'Full control from LISSA Asset',
    intro: '',
    features: [
      { title: 'Live status', text: "Track locker's availability" },
      { title: 'Capacity', text: 'What you can do with space you have' },
      { title: 'Requests', text: 'Pending, done, cancelled or expired' },
      { title: 'Code expiry', text: 'Choose how long you want codes to last' },
      { title: 'Activity log', text: 'Every fill, pickup and return, per locker' },
      { title: 'Maps', text: 'Find any locker by branch, location or serial' },
    ],
    mockLabel: 'The Smart Locker screens in LISSA Asset: locker overview and recent requests',
  },

  service: {
    title: 'You never touch the locker',
    intro: 'Our field partner runs the hardware so your team only sees the result in LISSA.',
    lifecycleTitle: 'Supports the full device lifecycle',
    lifecycle: [
      { title: 'Pool', text: 'New devices in stock' },
      { title: 'Spind', text: 'Loaded by our field partner' },
      { title: 'Employee', text: 'Picked up with QR or PIN' },
      { title: 'Return', text: 'Faulty device returned' },
      { title: 'Refurbish', text: 'Wiped, back to the pool' },
    ],
    lifecycleFooter: 'Every step tracked in LISSA Asset audit-proof',
  },

  clients: {
    title: 'Already running at enterprise clients',
    items: [
      { name: 'BVG', count: 19500, suffix: '+ employees in Berlin' },
      { name: 'Wiener Stadtwerke', count: 17000, suffix: '+ employees' },
    ],
  },

  businessCase: {
    title: 'Calculate your business case',
    intro: 'Put in your own numbers and see how many hours self-service handovers give back to your IT team each month.',
    inputsTitle: 'Your numbers',
    inputs: {
      lockers: { label: 'Lockers', hint: 'One Spind per site', min: 1, max: 50, step: 1, value: 1 },
      handovers: { label: 'Handovers per locker per month', hint: 'Pickups, returns and swaps', min: 5, max: 300, step: 5, value: 40 },
      minutesToday: { label: 'IT minutes per handover today', hint: 'Booking, waiting, walking and paperwork', min: 5, max: 120, step: 5, value: 30 },
      minutesSpind: { label: 'IT minutes per handover with Spind', hint: 'Approving the request in LISSA', min: 0, max: 30, step: 1, value: 3 },
    },
    resultTitle: 'Per month',
    today: 'IT time today',
    withSpind: 'IT time with Spind',
    handovers: 'Handovers per month',
    difference: 'IT time saved',
    positive: 'back for real IT work every month',
    hoursUnit: 'h',
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
    items: [
      {
        slug: 'new-device-pickup',
        title: 'New device pickup',
        heroTitle: 'Ordered devices wait in the locker, not on a desk in IT',
        intro: 'Staged phones and laptops are loaded into a drawer and the employee picks them up with a code, around the clock.',
        today: [
          'Devices sit in the IT office until someone is free',
          'Employees come by when nobody is there',
          'Handover is signed on paper or not at all',
        ],
        steps: [
          { title: 'Order', text: 'A device is requested or assigned in LISSA Asset.' },
          { title: 'Load', text: 'Our field partner places the staged device in a drawer.' },
          { title: 'Notify', text: 'The employee gets a QR code and PIN for that drawer.' },
          { title: 'Pick up', text: 'They scan it at the locker and the pickup is logged.' },
        ],
        benefits: [
          { title: 'Any shift', text: 'Night and weekend staff pick up on their own schedule.' },
          { title: 'Less desk traffic', text: 'IT staff stop handing over boxes and focus on real problems.' },
          { title: 'Proof of handover', text: 'Every pickup is logged with the person, the device and the drawer.' },
        ],
        faq: [3, 1, 0],
      },
      {
        slug: 'faulty-device-swap',
        title: 'Faulty device swap',
        heroTitle: 'A broken laptop should not cost a working day',
        intro: 'The employee returns the faulty device to one drawer and takes the replacement from another, without an IT appointment.',
        today: [
          'The employee writes a ticket and waits for a reply',
          'IT books a slot or ships a replacement',
          'The faulty device stays with the employee for days',
        ],
        steps: [
          { title: 'Report', text: 'The employee reports the fault in LISSA or at the locker.' },
          { title: 'Code', text: 'LISSA Asset sends a QR code and PIN for the swap.' },
          { title: 'Swap', text: 'One drawer takes the faulty device and another releases the replacement.' },
          { title: 'Collected', text: 'Our field partner picks up the faulty device and it is logged in LISSA.' },
        ],
        benefits: [
          { title: 'Same day', text: 'Replacement devices wait in the locker, ready for the next fault.' },
          { title: 'No appointment', text: 'The swap happens when the employee has time, 24/7.' },
          { title: 'Nothing gets lost', text: 'Every return and pickup is logged against the device and the person.' },
        ],
        faq: [3, 0, 4],
      },
      {
        slug: 'eol-rollout',
        title: 'EOL rollout',
        heroTitle: 'Roll out new devices without a single handover appointment',
        intro: 'Employees return their end-of-life device and collect the new one in the same visit, whenever it suits them.',
        today: [
          'IT plans hundreds of handover slots',
          'Employees miss appointments and rebook',
          'Old devices go missing after the rollout',
        ],
        steps: [
          { title: 'Plan', text: 'IT assigns the new devices to employees in LISSA Asset.' },
          { title: 'Load', text: 'Our field partner fills the drawers with staged devices.' },
          { title: 'Exchange', text: 'The employee returns the old device and opens the drawer with the new one.' },
          { title: 'Refurbish', text: 'Old devices are collected, wiped and logged on their way back to the pool.' },
        ],
        benefits: [
          { title: 'At their own pace', text: 'Devices are collected over days, not in one crowded week.' },
          { title: 'Old devices come back', text: 'Return and pickup happen in the same visit to the locker.' },
          { title: 'One view of progress', text: 'LISSA shows which requests are pending, done or expired.' },
        ],
        faq: [5, 1, 4],
      },
      {
        slug: 'onboarding',
        title: 'Onboarding',
        heroTitle: 'New hires get their equipment on day one, wherever they start',
        intro: 'IT prepares the starter kit in advance and the new employee collects it from the locker at their own site.',
        today: [
          'IT coordinates start dates by email',
          'Kits wait at headquarters, not at the branch',
          'The first day starts with waiting for a laptop',
        ],
        steps: [
          { title: 'Prepare', text: 'IT assigns the starter devices to the new hire in LISSA Asset.' },
          { title: 'Load', text: 'Our field partner puts the kit into a drawer at the right site.' },
          { title: 'Welcome', text: 'The new hire receives a QR code and PIN before day one.' },
          { title: 'Start', text: 'They collect the kit at the locker and the assignment is logged.' },
        ],
        benefits: [
          { title: 'Ready on time', text: 'Kits are in place at the employee’s own site before they arrive.' },
          { title: 'Every site', text: 'Branches without IT staff onboard the same way as headquarters.' },
          { title: 'Clear ownership', text: 'Each device is assigned to the new hire from the first pickup.' },
        ],
        faq: [3, 0, 5],
      },
      {
        slug: 'offboarding',
        title: 'Offboarding return',
        heroTitle: 'Get every device back when people leave',
        intro: 'Leavers return laptops, phones and accessories to a drawer on their last day, even after IT has gone home.',
        today: [
          'Returns are chased by email for weeks',
          'Devices are left on desks or at reception',
          'Nobody knows what was actually returned',
        ],
        steps: [
          { title: 'Announce', text: 'IT creates the return request in LISSA Asset.' },
          { title: 'Code', text: 'The leaver gets a QR code and PIN for an empty drawer.' },
          { title: 'Return', text: 'They place the devices in the drawer and close it.' },
          { title: 'Collect', text: 'Our field partner collects the devices and every step is logged.' },
        ],
        benefits: [
          { title: 'Last day, any hour', text: 'Returns fit the leaver’s schedule, not the opening hours of the IT desk.' },
          { title: 'Audit trail', text: 'Each return is logged per device, person and locker.' },
          { title: 'Back into the pool', text: 'Returned devices are wiped and refurbished for the next employee.' },
        ],
        faq: [3, 0, 4],
      },
      {
        slug: 'multi-site',
        title: 'Multi-site IT',
        heroTitle: 'The same IT service at every site, with or without IT staff',
        intro: 'A Spind at each branch gives every employee the same pickup, return and swap, and our partner network services them all.',
        today: [
          'Branches without IT wait for the next visit',
          'Every site invents its own process',
          'Travel between sites eats the IT budget',
        ],
        steps: [
          { title: 'Place', text: 'A Spind is installed at each site that needs one.' },
          { title: 'Connect', text: 'Every locker appears on the map in LISSA Asset.' },
          { title: 'Service', text: 'Our field partner fills, collects and maintains the lockers.' },
          { title: 'Oversee', text: 'IT sees live status and capacity for every site in one place.' },
        ],
        benefits: [
          { title: 'One process', text: 'Employees follow the same steps at every branch.' },
          { title: 'Partner network', text: 'We manage the network of partners for servicing.' },
          { title: 'Fewer trips', text: 'IT stops driving devices between sites.' },
        ],
        faq: [5, 0, 2],
      },
    ],
  },

  customers: {
    title: 'Customer stories',
    intro: 'How IT teams run self-service handovers with Spind, from one branch to every site.',
    exampleBadge: 'Example',
    exampleNote: 'Example stories: the companies, people, logos and numbers below are fictional and show the layout only.',
    all: 'All',
    filterLabel: 'Filter by industry',
    logosTitle: 'Trusted by IT teams in every industry',
    featured: 'Featured story',
    read: 'Read the story',
    quotesTitle: 'What IT teams say',
    quotesCta: 'All customer stories',
    facts: { industry: 'Industry', sites: 'Sites', lockers: 'Lockers', solutions: 'Solutions' },
    sections: { challenge: 'The challenge', solution: 'What they did', results: 'The results' },
    more: 'More stories',
    ctaTitle: 'Write the next story with us',
    ctaText: 'Start with one Spind at one site and see the results in LISSA.',
    ctaButton: 'Plan a pilot',
    back: 'All customer stories',
  },

  /**
   * EXAMPLE social proof (flags.exampleProof). Every company, person, quote and number here is fictional.
   * TODO: replace with approved client stories before launch.
   */
  proof: {
    logos: [
      { key: 'muster-logistik', name: 'Muster Logistik' },
      { key: 'beispiel-energie', name: 'Beispiel Energie' },
      { key: 'klinikum-musterstadt', name: 'Klinikum Musterstadt' },
      { key: 'beispiel-versicherung', name: 'Beispiel Versicherung' },
      { key: 'musterstadt-verkehr', name: 'Musterstadt Verkehr' },
      { key: 'demo-handel', name: 'Demo Handel' },
      { key: 'beispiel-bank', name: 'Beispiel Bank' },
      { key: 'muster-stadtwerke', name: 'Muster Stadtwerke' },
    ],
    stories: [
      {
        slug: 'muster-logistik',
        logo: 'muster-logistik',
        company: 'Muster Logistik GmbH',
        industry: 'Logistics',
        sites: '12 branches in Germany and Austria',
        lockers: '12',
        solutions: ['faulty-device-swap', 'multi-site'],
        headline: 'One swap process for twelve branches without IT staff',
        summary: 'Drivers and dispatchers swap faulty laptops and scanners at their own branch, around the clock.',
        metrics: [
          { value: '12', label: 'branches on one process' },
          { value: '24/7', label: 'device swaps' },
          { value: '0', label: 'handover appointments' },
        ],
        challenge: 'Only the head office had IT staff, so a broken scanner at a branch meant a ticket, a courier and two days without a device.',
        solution: 'Muster Logistik placed one Spind at each branch, our field partner keeps replacement devices in the drawers and IT approves each swap in LISSA Asset.',
        results: 'Drivers swap a faulty device at the start of their shift, and IT sees every swap, pickup and return per branch in one place.',
        quote: { text: 'Our branches finally get the same IT service as the head office, and nobody has to drive a laptop across the country anymore.', name: 'Anna Berger', role: 'Head of IT, Muster Logistik' },
      },
      {
        slug: 'beispiel-energie',
        logo: 'beispiel-energie',
        company: 'Beispiel Energie AG',
        industry: 'Energy',
        sites: '4 sites',
        lockers: '6',
        solutions: ['eol-rollout', 'new-device-pickup'],
        headline: 'A laptop rollout for 1,200 employees without a single handover slot',
        summary: 'Employees returned their old laptop and collected the new one in the same visit, whenever it suited them.',
        metrics: [
          { value: '1,200', label: 'laptops rolled out' },
          { value: '6 weeks', label: 'from first to last pickup' },
          { value: '100%', label: 'old devices returned' },
        ],
        challenge: 'The last rollout took months of booked slots, missed appointments and old laptops that never came back.',
        solution: 'IT assigned the new laptops in LISSA Asset, our field partner loaded the drawers in waves and each employee got a QR code and PIN.',
        results: 'The old laptop went into one drawer and the new one came out of another in the same visit, and both steps were logged in LISSA.',
        quote: { text: 'For the first time a rollout ran in the background while my team worked on real problems.', name: 'Jonas Keller', role: 'IT Workplace Lead, Beispiel Energie' },
      },
      {
        slug: 'klinikum-musterstadt',
        logo: 'klinikum-musterstadt',
        company: 'Klinikum Musterstadt',
        industry: 'Healthcare',
        sites: '1 campus, 3 buildings',
        lockers: '3',
        solutions: ['new-device-pickup', 'onboarding'],
        headline: 'Night shifts get their devices without waiting for the IT desk',
        summary: 'Nurses and doctors on night and weekend shifts pick up phones and tablets when they need them.',
        metrics: [
          { value: '3', label: 'buildings with a Spind' },
          { value: '24/7', label: 'pickup for every shift' },
          { value: 'Day 1', label: 'kits ready for new staff' },
        ],
        challenge: 'The IT desk closes at 5 pm, but a third of the staff works nights and weekends.',
        solution: 'A Spind in each building holds staged phones and tablets, and new hires receive their code before their first shift.',
        results: 'Shift staff collect devices on their own schedule and IT sees every pickup in LISSA the next morning.',
        quote: { text: 'Our night shift used to borrow devices from colleagues, now they simply pick up their own.', name: 'Dr. Lena Hoffmann', role: 'CIO, Klinikum Musterstadt' },
      },
      {
        slug: 'beispiel-versicherung',
        logo: 'beispiel-versicherung',
        company: 'Beispiel Versicherung AG',
        industry: 'Insurance',
        sites: '2 offices',
        lockers: '2',
        solutions: ['offboarding', 'onboarding'],
        headline: 'Every device comes back when people leave',
        summary: 'Leavers return laptops and phones on their last day, even after the IT team has gone home.',
        metrics: [
          { value: '2', label: 'offices' },
          { value: '0', label: 'returns chased by email' },
          { value: '1', label: 'audit trail for every device' },
        ],
        challenge: 'Returns were chased for weeks and devices were left on desks or at reception.',
        solution: 'IT creates a return request in LISSA Asset and the leaver gets a code for an empty drawer.',
        results: 'Each return is logged per device, person and locker, and returned devices go back into the pool.',
        quote: { text: 'Offboarding used to be the part nobody owned, now it closes itself.', name: 'Markus Brandt', role: 'IT Service Manager, Beispiel Versicherung' },
      },
    ],
  },

  checklist: {
    title: 'Rollout checklist',
    heading: 'Before your first Spind',
    intro: 'Everything to prepare for a Spind pilot, in the order you will need it.',
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
          'Every Spind starts with a Master module, which holds the screen and scanner.',
          'Add S24 for small devices, N8 for laptops and M12-4 for a mix of both.',
          'Check your largest devices against the drawer openings, 175 × 90 mm for phones and 500 × 90 mm for laptops.',
        ],
      },
      {
        title: 'Prepare LISSA Asset',
        items: [
          'Decide which handovers the pilot covers, for example pickup, return, swap, onboarding or offboarding.',
          'Choose how long QR codes and PINs stay valid.',
          'Name the people in IT who create requests and follow them in LISSA.',
        ],
      },
      {
        title: 'Go live',
        items: [
          'Agree on the first devices our field partner loads into the drawers.',
          'Tell the employees at the site how the QR code and PIN work.',
          'Plan a review: check pending, done and expired requests and the activity log in LISSA.',
        ],
      },
    ],
  },

  roles: {
    title: 'Who does what',
    items: [
      { title: 'Employee', text: 'Opens the right drawer with a QR code or PIN, any time.' },
      { title: 'IT team', text: 'Creates and follows every request in LISSA Asset.' },
      { title: 'Field partner', text: 'Fills the drawers and collects returned devices.' },
    ],
  },

  pricing: {
    title: 'Pricing that fits your setup',
    text: 'Every Spind is priced for your sites, devices and use cases, so we put together your offer after a short call.',
    cta: 'Book a call',
  },

  goLive: {
    title: 'Go live in 12 weeks',
    intro: 'From the first call to the first employee opening a drawer, we plan, connect and install everything together with your IT team in three months.',
    phases: [
      { label: 'Weeks 1–2', title: 'Plan', text: 'We map your sites, devices and handover flows in one workshop.' },
      { label: 'Weeks 3–6', title: 'Connect', text: 'We link Spind to LISSA Asset, your sign-in and your service desk.' },
      { label: 'Weeks 7–10', title: 'Prepare', text: 'We build your locker, set up the drawers and train your team.' },
      { label: 'Weeks 11–12', title: 'Go live', text: 'Our field partner installs Spind and runs the first handovers with you.' },
    ],
  },

  video: {
    title: 'See Spind in action',
    intro: 'A short film shows how an employee picks up a device in a minute and how IT sees every step in LISSA Asset.',
    /** Paste the video file URL (mp4) and a poster image here once the film is ready. Empty shows the placeholder. */
    src: '',
    poster: '',
    play: 'Play the Spind video',
    placeholder: 'Video coming soon',
  },

  faq: {
    title: 'FAQ',
    items: [
      {
        q: 'Who fills and empties the locker?',
        a: 'Our field partner loads new devices and collects old, swapped and faulty ones, so your IT team never touches the locker.',
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
        q: 'How do employees open a drawer?',
        a: 'They get a QR code and PIN from LISSA Asset, scan it at the locker and the right drawer opens.',
      },
      {
        q: 'Where do we manage Spind?',
        a: 'In the Spind module of LISSA Asset, with live status, request tracking, code expiry and an activity log per locker.',
      },
      {
        q: 'How do we start?',
        a: 'Start with one Spind at one site: we deliver and connect it, set it up with LISSA and your employees get their first codes.',
      },
      {
        q: 'Is a handover through Spind secure?',
        a: 'A drawer only opens with the QR code or PIN that LISSA Asset issues for that request, codes expire after the time you choose, and every fill, pickup and return is logged per locker.',
      },
      {
        q: 'Can employees return devices outside office hours?',
        a: 'Yes, Spind is available 24/7, so pickups and returns happen whenever the employee is on site.',
      },
      {
        q: 'Does Spind make sense for a smaller office?',
        a: 'Yes, you can start with one Spind at one site and add lockers when more sites or handovers need them.',
      },
    ],
  },

  contact: {
    title: 'Book a call',
    intro: 'See Spind and LISSA Asset in a short call and plan your first site.',
    form: {
      name: 'Name',
      company: 'Company',
      email: 'Work email',
      sites: 'Number of sites',
      message: 'Message',
      optional: 'optional',
      submit: 'Send request',
      // Example values shown in the empty fields, so visitors see what a good answer looks like.
      placeholders: {
        name: 'Anna Berger',
        company: 'Muster Logistik GmbH',
        email: 'anna.berger@muster-logistik.de',
        sites: '12',
        message: 'We run 12 branches in Germany and Austria and swap about 40 laptops a month. We would like to start with our Munich office.',
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
    rights: 'Cimet. All rights reserved. Spind and LISSA Asset are products of Cimet.',
    legalNav: 'Legal',
    pageNav: 'Sections',
    pricing: 'Pricing',
    checklist: 'Rollout checklist',
    faq: 'FAQ',
  },

  legal: {
    impressum: { title: 'Impressum', description: 'Legal notice for the Spind website by Cimet.' },
    privacy: { title: 'Privacy', description: 'Privacy policy for the Spind website by Cimet.' },
    back: 'Back to the homepage',
  },
};

export type SiteContent = typeof en;

const content: Record<string, SiteContent> = { en };

export function getContent(locale: string = 'en'): SiteContent {
  return content[locale] ?? en;
}
