# Spind website

Marketing site for **Spind**, the smart locker for enterprise IT. Built with [Astro](https://astro.build) as a fully static site, plain CSS and a small amount of TypeScript. Fonts are self-hosted, there are no trackers and no cookies.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev       # local dev server on http://localhost:4321
npm run build     # static build into dist/
npm run preview   # serve the built dist/ folder
```

## Edit the copy

All text, flags and contact data live in one file: `src/content/site.ts`.

- Change only the text between the quotes and keep the quotes and commas.
- House style from the deck: titles have no full stop, body copy is one sentence with one full stop, no em dashes.
- Contact person, email and phone are in the `contact` object at the top of the file.

Components in `src/components/` only read from this file, so you never need to touch them to change wording.

## Turn on the clients section

The "Already running at enterprise clients" section (BVG, Wiener Stadtwerke) is hidden until permission to name the clients is confirmed. To show it, open `src/content/site.ts` and set:

```ts
export const flags = {
  showClients: true,
};
```

## Contact form endpoint

The form posts to the URL in `PUBLIC_FORM_ENDPOINT`. Copy `.env.example` to `.env` and fill it in, or set it as an environment variable in Cloudflare Pages.

```bash
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

- Works with Formspree out of the box (the form sends `FormData` with `Accept: application/json`, and has a `_gotcha` spam trap).
- A Cloudflare Pages Function also works: create `functions/api/contact.ts` and set `PUBLIC_FORM_ENDPOINT=/api/contact`.
- If the variable is empty, submitting the form opens the visitor's email app with the request filled in, addressed to the contact person.

The value is baked in at build time, so rebuild after changing it.

## Deploy to Cloudflare Pages

1. Push this folder to a Git repository and connect it in Cloudflare Pages (Workers and Pages, Create, Pages, Connect to Git).
2. Build settings: framework preset **Astro**, build command `npm run build`, output directory `dist`.
3. Environment variables: `PUBLIC_FORM_ENDPOINT` (see above) and `SITE_URL` (the final domain, used for canonical links, Open Graph and the sitemap). Set `NODE_VERSION=20` or newer if the default is older.
4. Add the custom domain under the project's Custom domains tab.

`public/_headers` sets long caching for hashed assets and basic security headers.

### Analytics

A commented slot for Cloudflare Web Analytics (cookieless) is in `src/layouts/Base.astro`. Add the token and uncomment it once the domain is live.

## German version

Routing is prepared for `/de/` with Astro i18n (`astro.config.mjs`). To add German:

1. In `src/content/site.ts`, copy the `en` object to a `de` object, translate it and register it in `content`.
2. Add `'de'` to `locales` in `astro.config.mjs`.
3. Create `src/pages/de/index.astro`, `impressum.astro` and `privacy.astro` that pass `locale="de"` (copy the English pages and change the locale).

## The grid

Every container, tile, line height and padding sits on one square grid (the faint lines in the background).

- `--cell` is the grid cell: the container is exactly 12 cells wide on desktop, 8 on tablet and 4 on phones (`src/styles/tokens.css`). Background lines are drawn from the page centre, so container edges are always grid lines.
- `--u` is a quarter cell. All line heights, paddings and gaps are multiples of it.
- Cards are `.tile` elements inside a `.tiles` group. They span whole columns and whole rows (`--rows`).
- A small script in `src/layouts/Base.astro` runs before first paint. It gives tile groups marked `data-fit` enough whole rows for their text, and rounds blocks marked `data-snap` up to whole cells. It runs again on resize and when the fonts have loaded.

When you add a section, use `Section.astro`, put cards in a `.tiles` group with `data-fit`, and mark any free-height block with `data-snap`.

## Project structure

```
src/
  content/site.ts        all copy, flags, contact data
  styles/tokens.css      colours, type, spacing, motion tokens from the deck
  styles/global.css      base styles, grid, grain, buttons, cards, reveal
  components/            Header, Hero, LockerDrawing, LissaMock, Section, ContactForm, Footer, Logo
  components/sections/   Problem, HowItWorks, Modules, Workflows, Platform, Service, Clients, Pricing, Faq, Contact
  assets/                spind-logo-source.svg (original logo file, converted into components/logo-path.ts)
  layouts/Base.astro     head, meta, fonts, Open Graph
  scripts/               header, menu, active nav, reveal, progress, counters, parallax, form
  pages/                 index, impressum, privacy, robots.txt
public/
  favicon.svg            the open drawer cell
  og.png                 1200 x 630 Open Graph image of the hero
```

## The LISSA Asset mockup

`src/components/LissaMock.astro` is an HTML/CSS replica of the Smart Locker screens in the OLD Design System Figma file (node 4346:1788), using its tokens (#5757F5 action colour, Inter body text). Everett, the heading font in that file, is not licensed for the web here, so Geist is used in its place. The data in it is the sample data from the Figma file.

## Open items (TODO)

- Final domain: set `SITE_URL` (placeholder is `https://example.com`).
- Form endpoint: Formspree or a Cloudflare Pages Function.
- Impressum and privacy text: pages exist with placeholders marked `TODO: legal text`.
- Permission to show BVG and Wiener Stadtwerke (`showClients`).
- Real photos: none yet, the site uses the locker drawing and CSS illustrations only.
- Content that competitors show and Spind could add once the facts are confirmed: security and hosting (EU hosting, ISO 27001, GDPR/DPA), named integrations (for example ServiceNow, Intune, Entra ID), behaviour during a power or network outage, installation requirements and lead time, contract term, and client proof with verified figures.

## Menus, solution pages and the business case

- **Header menus** (`nav.groups` in `src/content/site.ts`): Product, Solutions and Resources open a full-width panel with link columns and a featured card. `href` is `#section` for a home page section or `/path` for a page. The footer link groups are built from the same data.
- **Solution pages** (`solutions.items`): each item becomes `/solutions/<slug>` with today, steps, benefits, related FAQ (indexes into `faq.items`), more solutions and the demo form. The Workflows tiles on the home page link to them by `slug`.
- **Business case calculator** (`businessCase`, home page `#business-case`): visitors set their own numbers; the formula is in `src/scripts/calc.ts` and repeated in `BusinessCase.astro` for the no-JS render. It uses `pricing.price`.
- **Customer stories** (`/customers`): built and linked in Resources and the footer only when `flags.showClients` is true. TODO: client permission, story text and quotes.

## Pilot, checklist and roles

- **Pilot** (`pilot` in `site.ts`, home page `#pilot`): one Spind at one site. "Plan a pilot" fills the demo form message with `pilot.prefill`.
- **Rollout checklist** (`checklist`, `/resources/rollout-checklist`): open and printable (print or save as PDF). TODO: put it behind a short email form once `PUBLIC_FORM_ENDPOINT` exists, if you want to collect leads with it.
- **Who does what** (`roles`): shown on every solution page.
- **Icons** for solutions live in `src/content/icons.ts` and are used in the Solutions menu, Workflows tiles and solution pages.

## Social proof (EXAMPLE content)

`flags.exampleProof` is **on**: the home page logo strip, "What IT teams say" quotes, `/customers` and `/customers/<slug>` show **fictional** companies, people, quotes, numbers and mock logos (`src/components/MockLogo.astro`), each tagged "Example".

TODO before launch: replace `proof.logos` and `proof.stories` in `site.ts` with approved client stories and real logo SVGs, then remove the "Example" tags, or set `exampleProof: false`. With both `exampleProof` and `showClients` off, the story links disappear from the menu and footer and `/customers/<slug>` pages are not built; `/customers` itself still builds, so delete or redirect it if needed.
