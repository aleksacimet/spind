# Figma changes log

We design in Figma first (Branding file, page **Website**). Every change goes in this file, so the website can be built from it later in one go.

- **To build:** changed in Figma, not on the website yet.
- **Built:** already on the website.

When a batch is built, move it from To build to Built and note the date.

---

## To build

_Nothing waiting. Add new Figma changes here._

---

## Built

### Built on the website on 2026-11-24 (rounds 1–4)
Everything below was built. Website-only details:
- **Routes:** use case pages now live at `/use-cases/<slug>`. `public/_redirects` sends `/solutions/*` there with a 301.
- **Language selector:** shows the current language (English, with the UK flag). Deutsch is listed as "soon" until the German pages exist. Set `available: true` in `site.ts` `nav.languages` to switch it on.
- **Video:** paste the mp4 URL and a poster into `site.ts` `video.src` and `video.poster`. Until then the placeholder shows.
- **Hero headline:** now "Devices available 24/7 without bothering IT staff", as in Figma.

#### 2026-11-24 · Round 4: component library, button system, pricing note, language selector, font

**New Figma page: Components** (95:2). Every repeated element is a component with variants. Prototype interactions are wired: Default → Hover on hover, Hover → Pressed on press, FAQ click opens and closes. Use Present mode to try them.

| Component | Variants | Properties | Used on |
|---|---|---|---|
| **Button** (95:93) | Type: CTA / Primary / Secondary · Size: Large / Small · State: Default / Hover / Pressed / Focus / Disabled (30) | Label, Show arrow | Every button |
| **Nav item** (96:30) | Type: Dropdown / Link · Theme: Light / Dark · State: Default / Hover / Open | Label | Header |
| **Language selector** (96:77) | Theme: Light / Dark · State: Default / Hover / Open | none | Header, next to Pricing |
| **Header** (97:308) | Theme: Dark (over the home hero) / Light | none | All 6 page headers |
| **FAQ item** (96:96) | State: Closed / Hover / Open | Question, Answer | Home FAQ |
| **Input field** (96:121) | State: Default / Hover / Focus / Filled / Error | Label, Value | Contact form |
| **Title + body** (97:2) | none | Title, Body | Inside Tile and Use case card |
| **Tile** (97:25) | Style: Light / Dark · State: Default / Hover | Show label, Label, plus the nested Title + body | Problem tiles, Go live phases |
| **Use case card** (97:38) | State: Default / Hover | Nested Title + body | Home workflows grid, More use cases |
| **Menu link** (97:46) | State: Default / Hover | Title, Description | Mega menus |
| **Section head** (97:53) | Layout: Title + intro / Title only | Title, Intro | 14 section heads |
| **Footer** (97:541) | none | none | All 4 pages |
| **Contact section** (97:678) | none | none | All 4 pages (uses Input field and Button inside) |

**Button system**
- **Padding:**
  - Large: 16 / 20 (`Padding/Container/sm` / `md`), 52px tall.
  - Small: 12 / 16 (`xs` / `sm`), used in the header.
  - Gap between label and arrow: 8 (`Gap/Text/md`).
- **CTA:** yellow `Yellow/Default` #FFDA1F with black text.
  - Hover #F2C800, pressed #D9B300.
  - Used for: Book a call (hero, header, pricing band), Send request.
- **Primary:** indigo #5757F5 with white text.
  - Hover #4343D9, pressed #3333B8.
  - Used for other filled actions, e.g. "Check it with us".
- **Secondary:** white with a hairline `Neutral/200` border and dark text.
  - Hover and pressed: dark fill with white text, like the site's "drawer" fill.
- **Focus:** 2px outside ring in `Border/Focus` (blue).
- **Disabled:** `Surface/Disabled` with `Text/Colors/Disabled`.
- **New tokens:**
  - `Surface/CTA/{Default,Hover,Pressed}`, `Text/Colors/CTA/Default`
  - `Surface/Button Primary/{Default,Hover,Pressed}`, `Text/Colors/Button Primary/Default`
  - `Surface/Button Secondary/{…}`, `Text/Colors/Button Secondary/{Default,Hover}`, `Border/Button Secondary/{Default,Hover}`
  - `Surface/Disabled`, `Text/Colors/Disabled`, `Border/Disabled`, `Border/Focus`, `Border/Width/Focus`
  - `Border/Status/Error`, `Text/Colors/Status/Error`
  - Primitives `Yellow/*`, `Indigo/700`. Alias `Highlight/*` (yellow), `Accent/700`.
- **Website:**
  - One `.btn` with modifiers `--cta`, `--primary`, `--secondary` and `--sm`.
  - Hover, `:active` and `:focus-visible` follow the variants exactly.
  - `:disabled` uses the disabled tokens.

**Title + body pattern**
- Wherever a title sits on a body text, the two are grouped with a 4px gap (`Spacing/Gap/Text/sm`). This matches node 91:200.
- Applied through the Title + body component, plus 6 new groups and 15 existing pairs re-gapped.
- **Website:** a `.title-body { display: grid; gap: var(--spacing-gap-text-sm); }` utility, applied to tiles, cards, steps, menu links and the pricing band.

**Pricing**
- The pricing section (price, unit, included list) is removed.
- In its place is a small band: "Pricing that fits your setup" / "Every Spind is priced for your sites, devices and use cases, so we put together your offer after a short call." with a CTA "Book a call".
- The mega menu feature card now says "Pricing that fits your setup / Priced for your sites, devices and use cases. / Talk to us about pricing".
- **Business case calculator:** it now shows **IT time saved** instead of money.
  - The "IT cost per hour (EUR)" input is removed. The remaining inputs are lockers, handovers per locker per month, IT minutes today and IT minutes with Spind.
  - Results per month:
    - IT time today = lockers × handovers × minutes today ÷ 60 (20 h)
    - IT time with Spind = lockers × handovers × minutes with Spind ÷ 60 (2 h)
    - Handovers per month (40)
  - Big number: "IT time saved", 18 h, "back for real IT work every month".
  - Note: "Estimate from your inputs, your offer is tailored to your sites and devices after a short call."
  - The mega menu card now reads "See how much IT time Spind saves / Put in your own numbers and see the hours your IT team gets back."
  - **Website:** remove the fee and EUR maths from `src/scripts/calc.ts`. Show hours only, rounded to whole hours.
- **Website:** remove the price from `site.ts` and Pricing.astro. "Pricing" in the nav links to the new band.

**Language selector**
- German flag, "DE" and a chevron, right after Pricing in the header.
- **Website:** a small dropdown (DE / EN). The language menu itself still needs designing.

**Body font**
- IBM Plex Sans is replaced by **Hanken Grotesk**:
  - Body styles: Light
  - UI/Nav and labels: Regular
- **Website:** self-host Hanken Grotesk 300 and 400.

**Other changes you made in Figma (noted so we build them)**
- The FAQ title is now "FAQ".
- The Contact section background is now `Surface/Neutral/Darkest` instead of blue.

#### 2026-11-24 · Round 3: space hero band, page grain, copyright

**Hero band** (rectangle `band`, 31:4, at the top of the home hero)
- **Mesh shader:** the Mesh gradient shader fill stays as the base, with all 16 colour points set to `Ice/1100` #0D1015, so it's an even dark.
  - Strong colours inside the mesh render as visible steps and green-black blobs, so the glows live in separate layers on top.
- **Glows:** three radial gradient layers on top of the shader, Normal blend, soft falloff (alpha × (1 − t)^2.2):
  - Indigo #5757F5 (LISSA action) at 55%: centre 72% / 25%, radius 34% × 130% of the band.
  - `Blue/700` #0052AD at 60%: centre 22% / 95%, radius 30% × 120%.
  - `Blue/600` #0066D6 at 25%: centre 48% / 60%, radius 16% × 70%.
- **Effects:** two Noise effects (white, size 0.5):
  - Dither: 6% opacity, density 0.9. It hides banding in the dark gradient.
  - Stars: 50% opacity, density 0.03. Sparse star specks.
- **Website:** build it in CSS on `.hero::before`:
  ```css
  background:
    radial-gradient(34% 130% at 72% 25%, rgb(87 87 245 / .55), transparent 70%),
    radial-gradient(30% 120% at 22% 95%, color-mix(in srgb, var(--blue-700) 60%, transparent), transparent 70%),
    radial-gradient(16% 70% at 48% 60%, color-mix(in srgb, var(--blue-600) 25%, transparent), transparent 70%),
    var(--ice-1100);
  ```
  Add a small SVG noise overlay: white, 6% for the dither plus a sparse star layer.
- **CTA colour decided:** indigo #5757F5 with white text. This replaces the round 2 lime.
  - New primitives: `Indigo/Default` #5757F5 (`--indigo-500`) and `Indigo/600` #4343D9 (`--indigo-600`, hover).
  - Alias `Accent/default` → `Indigo/Default` and `Accent/600` → `Indigo/600`.
  - Mapped `Text/Colors/CTA/Default` and `Icon/CTA/Default` → `Neutral/white`.
  - White on #5757F5 has 5.1:1 contrast, which passes AA.
  - The hero "Book a call" button (14:2294) is linked to the CTA tokens again. It was a hand-set #9929EA.
  - The `Lime/*` primitives are unused now and can be deleted.

**Page grain**
- **Figma:** a locked rectangle `background grain` sits behind every page frame:
  - Fill: `Surface/Neutral/Page`.
  - Noise: monotone #161A21 (`Ice/1000`) at 7%, size 0.5, density 0.45. Small, fine dots.
  - It sits under the square grid. Contact and footer cover it.
- **Website:**
  - Replace the current `body::after` grain, which sits over everything at 4% with coarser dots, with a background-only grain under the grid lines.
  - Use small dots: an SVG feTurbulence `baseFrequency ≈ 1.2`, tile 120px, about 7% opacity.

**Copyright**
- The footer bottom line now reads: "© 2026 Cimet. All rights reserved. Spind and LISSA Asset are products of Cimet." This is on all 4 page footers.
- **Website:** `site.ts` footer copyright string, with the year from `new Date().getFullYear()`.

#### 2026-11-24 · Round 2: CTA colour, grid, nav, use case pages, body font

**CTA colour (new tokens)**
- **Primitive:** `Lime/Default` #F6FA70 and `Lime/600` #E6EB4F (hover).
- **Alias:** `Accent/default` and `Accent/600`.
- **Mapped:**
  - `Surface/CTA/Default` → `--surface-cta-default`
  - `Surface/CTA/Hover` → `--surface-cta-hover`
  - `Text/Colors/CTA/Default` → `--text-cta-default`, which is Neutral/black
  - `Icon/CTA/Default` → `--icon-cta-default`, also black
- **Applied to:** every "button primary", every "button header" (including the home header, previously white) and the video play button.
- **To change the CTA colour later:** change `Lime/Default` only.
- **Website:**
  - `.btn--primary`, `.btn--mark` and the header CTA all use the CTA tokens.
  - Hover uses `--surface-cta-hover`.
  - The arrow glyph is black too.
- Blue stays the brand colour for links, active states, the contact band and illustrations.

**Background square grid**
- **Token:** `Border/Neutral/Grid` → Alias `Neutral/grid` → Primitive `Ice/1000-10`, which is #161A21 at 10%.
- **Figma:**
  - A locked vector `background grid` sits behind every page frame: 100px squares, 0.5px lines, vertical lines at x = 20, 120 … 1420, horizontal lines every 100px from the top.
  - It's 20000px tall, pinned to the top and clipped by the frame, so it never stretches when sections change.
  - Only Contact and Footer have solid backgrounds that cover it. Tiles cover it as before.
- **Website:** in `body::before`, the line colour becomes `var(--border-neutral-grid)`, replacing the current `color-mix(--line 38%)`, which is nearly invisible now.

**FAQ pluses**
- All FAQ pluses are now 32px Geist Medium, 32px line height. The toggle box is 32 × 32 with no stroke.
- **Website:** `.pm` is 32px and `.pm::before` uses font-size 32px / line-height 32px.

**Video section moved**
- The `video` section now sits at the end of the home page, between FAQ and Contact.
- The hero "See how it works" button (14:2297) has a prototype link that scrolls to it.
- **Website:** "See how it works" links to `#video`, and the video section gets `id="video"`.

**Navigation**
- "Resources" is removed from the header nav on every page, and the "Mega menu / Resources" frame is deleted.
- "Solutions" is renamed "Use cases" in the header nav, the mega menu ("Mega menu / Use cases") and the footer column title.
- **Footer:**
  - The Resources column is removed from every footer.
  - The footer now has 3 link columns (Product, Use cases, Legal), each 200px, starting at column 7 (x = 720) so the last one ends on the right container edge.
  - The pages behind the old Resources links (rollout checklist, customer stories) stay live but aren't linked from the nav anymore.
- **Website:**
  - Rename the routes `/solutions/*` → `/use-cases/*`, with redirects from the old URLs.
  - Remove the Resources dropdown.
  - Rename the nav labels in `site.ts`.

**Use case page template**
- **Frame:** "Spind website / Use case template (example: Faulty device swap)" (58:8). It was the Solution page.
- **Sections now:** header, hero, What it looks like today, How it works with Spind, More use cases, contact, footer.
- **Removed as clutter:** "What changes" (benefits) and "Questions about this" (FAQ).
- "More solutions" is renamed "More use cases".
- **Website:** one template, with one page per use case from `site.ts`:
  - New device pickup
  - Faulty device swap
  - EOL rollout
  - Onboarding
  - Offboarding return
  - Multi-site IT
- **Content note:**
  - Spind's main promise is that a swap device is always there.
  - IT runs **Fill**, **Empty** and **Swap** in LISSA Asset.
  - Employees find the device they need in the drawer.
  - The company orders the devices itself.
  - Integrations with logistics and service partners are coming. Waiting for details from Pera.

**Body font**
- Niramit is replaced by **IBM Plex Sans**:
  - Body/Default and Body/Small → Light
  - UI/Nav, UI/Label and UI/Label Small → Regular
- Headings stay Geist.
- **Website:**
  - Self-host IBM Plex Sans 300 and 400 (woff2).
  - Set `--font-body: 'IBM Plex Sans', …`.
  - Remove the Niramit files.

#### 2026-11-24 · Video placeholder section (home)
- **Figma:** frame `video` (node 86:227). It moved to the end of the page in round 2, between FAQ and Contact.
- **Layout:** same as other sections, with the section head on top (title on the left, intro at column 9, 4 columns wide). Below it is a 16:9 player, 1200 × 675, using all 12 columns.
- **Player placeholder:**
  - Background: `Surface/Neutral/Dark`.
  - Round play button, 96px: `Surface/Action/Default` with a white play icon (`Icon/Neutral/OnSurface`).
  - Caption "Video placeholder · 16:9 · 1200 × 675" in UI/Label, colour `Text/Colors/Neutral/Decorative`.
- **Spacing:** section padding 0 / Margin / Padding-Section-xl, player gap `Spacing/Gap/General/Object/md`.
- **Copy:**
  - Title: See Spind in action
  - Intro: A short film shows how an employee picks up a device in a minute and how IT sees every step in LISSA Asset.
- **Website notes:**
  - Build it as a component that takes a video URL and a poster image.
  - Until the video exists, show the placeholder.
  - The play button needs an accessible label ("Play the Spind video").
  - Don't autoplay. Respect reduced motion.

#### 2026-11-24 · Go live in 12 weeks section (home)
- **Figma:** frame `go live` (node 86:180), between Pricing and FAQ.
- **Layout:** the section head, then one row of 4 tiles (3 columns each, 300 × 200), built the same way as the Problem tiles.
- **Each tile:**
  - Label (UI/Label, `Text/Colors/Action/Default`)
  - H4 title
  - Body (Body/Default)
  - Tile gap `Spacing/Gap/Text/lg`
- **Copy** (draft, needs your check):
  - Title: Go live in 12 weeks
  - Intro: From the first call to the first employee opening a drawer, we plan, connect and install everything together with your IT team in three months.
  - Weeks 1–2 · Plan · We map your sites, devices and handover flows in one workshop.
  - Weeks 3–6 · Connect · We link Spind to LISSA Asset, your sign-in and your service desk.
  - Weeks 7–10 · Prepare · We build your locker, set up the drawers and train your team.
  - Weeks 11–12 · Go live · Our field partner installs Spind and runs the first handovers with you.
- **Open question:** should "Go live in 12 weeks" also appear as a short line in the hero or next to the pricing CTA?


### 2026-11-24 · Tokens, palette, grid, CTA copy (built the same day)
- **Variables:**
  - Collections Primitive → Alias → Mapped, copied from the OLD Design System structure.
  - Each variable's Web code syntax is the CSS name used in `src/styles/tokens.css`.
- **Palette:**
  - Strong blue `#0079FF` is the primary.
  - The neutrals are "Ice" greys with a faint blue tint.
  - The yellow mark and yellow buttons are now blue.
  - LISSA mockup colours are left as their own paint styles.
- **Grid:**
  - Grid style "Grid/Desktop 12 col": 12 × 100px columns, 120px margin (`Spacing/Margin`), no gutter.
  - Applied to all page frames.
- **Alignment fixes:**
  - FAQ: gap is now one column.
  - Section intros start at column 9.
  - How it works: steps take 6 columns, the stage 5.
  - Contact: 500 / 700, with section padding 100.
  - Footer links: 4 × 200 starting at column 5.
  - Header: 84px.
  - Hero band: dark graphite.
- **Copy:** "Book a demo" is now "Book a call" everywhere, including the form email subject.
- **FAQ toggle:** plain plus, no box or stroke. When open, it rotates and turns blue.
- **Still to tidy in Figma:** the old paint styles (Brand/*, Neutral/*, Navy/*, Overlay/*) are unused and can be deleted. Keep LISSA/*.
