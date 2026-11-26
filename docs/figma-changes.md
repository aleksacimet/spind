# Figma changes log

We design in Figma first (Branding file, page **Website**). Every change goes in this file, so the website can be built from it later in one go.

- **To build:** changed in Figma, not on the website yet.
- **Built:** already on the website.

When a batch is built, move it from To build to Built and note the date.

---

## To build

_Nothing waiting. Add new Figma changes here._

## Built in code only, Figma still to update (2026-11-25, round 8)

- How it works ("From request to device in 4 steps"):
  - One locker instead of three: a compact Otto with the screen and the two reader circles on top, the return slot, the small grey logo, and 8 drawers below (two rows of 3 small, two wide). Every drawer opens while the mouse is over it (tap on touch); the locker turns toward the mouse.
  - Darker grey stage behind it: Ice/200 #C3CCD7 (was Ice/75). Stage 560 px tall from 1280, 460 from 960, 16:9 from 640, 4:3 on phones.
  - Steps play on their own again: 5 s per step, looping. The open tab's bottom line is the progress bar (pale blue track, blue fill running left to right); when it is full the next step opens. A click opens a step and plays on from there. It runs only while the section is on screen, pauses while a tab has keyboard focus, and with reduced motion the tabs are click only (line full).
  - The screen follows the step as before; in the Open step drawer 08 (the bottom wide drawer) has the blue glow around it.

## Built in code only, Figma still to update (2026-11-25, round 7)

- Modules and sizes is off the home page. New page **/locker** ("Locker") describes the product technically: template hero with the 3D locker (label LOCKER, title "Four modules, one locker for every device", intro "Otto, Lotte, Bruno and Greta are 850 mm high and combine into one locker for phones, laptops and accessories."), the full Modules and sizes section (module labels, 850 mm drawing, drawer size examples) and a closing CTA band ("Plan the locker for your site"). The Product menu item "Modules and sizes" and the footer link now go to /locker.
- Home order now: hero, logos, Problem, How it works, Integrations, stories, Pricing, Go live, FAQ, Video.

## Built in code only, Figma still to update (2026-11-25, round 6)

- Yellow accents follow the same rule as the CTA (one "signal colour": Signal blue on light, yellow on dark). Changed on light: the Go live end point (now Blue/600 on the white timeline panel), selected text (Blue/600 with white text on light surfaces, yellow with black on dark ones) and the text cursor in input fields. Unchanged, because they sit on dark surfaces: the Spind column marker and icon in the Workflows comparison (dark column), the contact form number buttons, the calculator values and slider, the video play button, the security band icons, the Integrations orbit dots, the drawer size drawing and the template hero labels.
- CTA button follows its surface: yellow (Yellow/500, black label) on dark surfaces, Signal blue on light ones. New tokens: Surface/CTA/OnLight/Default = Blue/600 #0066D6, Hover = Blue/700, Pressed = Blue/800, Text and Icon/CTA/OnLight = white. Reason: yellow on the light page is 1.2:1 (a button edge needs 3:1); blue is 4.8:1 against the page and the white label 5.4:1 (AA). Blue is already Spind's signal colour (drawer light, bullets, focus). Dark surfaces: dark heroes, glow bands (CTA band, Integrations, Pricing, calculator, contact), footer, the dark feature card in the menus, and the header while it is transparent over a dark hero. Light: home hero buttons, the header once it turns light (scrolled, menu or dropdown open), the mobile menu, light pages like the rollout checklist. The CTA focus ring now sits 2px off the button so it shows around the blue. In Figma: give the Button component a Surface property (Dark / Light) for the CTA type.
- Footer: the "Sound: On/Off" switch is gone. Interface sounds are always on and even quieter (about half as loud, softer low-pass, slightly lower and shorter tones). A previously saved "off" is cleared.

## Built in code only, Figma still to update (2026-11-25, round 5)

- 3D lockers (home hero, template heroes, How it works) restyled as a modern clay render: one matte light material (Ice-tinted white, fronts a touch lighter), softer light and shadows, bigger rounded edges. No dark outlines: drawer gaps are 2.5 mm soft grey grooves with soft shading toward each gap, fronts stand 4 mm proud (was 8). Pulls replaced by fine light strips (grey, blue when the drawer is open). Vents and the return slot are shallow grooves, the plinth is a soft grey. Techno accents: blue ring around the badge reader, blue compartment light, the screen.
- Drawers open only while the mouse is over them (no more drawers opening by themselves). On touch screens a tap opens a drawer, a second tap closes it. They pop out 20 cm (small) / 22 cm (wide), was 13 / 15, with a small spring overshoot. The screen names the open drawer.
- How it works ("From request to device in 4 steps"): the text column is gone. Four step tabs on top, the same 3D locker as the home hero (Otto, Lotte, Bruno) full width below on the grey surface (520 px tall from 1280, 420 from 960, 2.45:1 / 2.5:1 below). It turns toward the mouse like the hero. The screen follows the step: New request, QR code + PIN dots, Drawer 08 open, Logged with a green check. In the Open step the gaps around drawer 08 glow blue and its strip is blue; it slides out when the mouse is over it. The step text stays for screen readers only.

## Built in code only, Figma still to update (2026-11-25, round 4)

- Home hero locker is real 3D (three.js, `src/scripts/hero-locker.ts`), white powder-coated steel lit like a product shot: bevelled edges, drawer fronts 8 mm proud with dark gaps and soft edge shading, recessed dark plinth, soft floor and contact shadows, black glass touch screen with a reflection, badge reader and camera, return slot, service panel with vents and a key lock. Same three modules and drawer counts as before (Otto, Lotte 3 x 8, Bruno 8 wide), 600 x 910 x 500 mm each, 60 mm apart.
- Bigger: about 880 px wide on a 1440 x 900 screen (was 640). Height follows the screen height (400 to 520 px stage) so the buttons stay in view on short laptops. The dark band still ends 3/4 down the locker.
- Spind logo on Otto's service panel: small (78 mm on a 600 mm module, about 35 px) and light grey, top left. The flat SVG locker (use case heroes, How it works, Modules, no-JS fallback) got the same small light grey logo (Text/Neutral/Decorative).
- Hover: the locker turns toward the mouse (up to ~10 degrees sideways, ~3 up/down) and springs back when the mouse leaves. This is the one exception to "nothing moves on hover", asked for by the user. Touch screens get a slow sway instead; reduced motion shows one still frame.
- Every few seconds a drawer in the lower two thirds pops out about 13 cm (push latch, small overshoot), its compartment lights blue, its pull turns blue and the screen reads "Drawer NN is open" with a progress bar, then it closes. Screen text lives in `site.ts` (hero.screen) for translation.
- Performance: three.js loads only on pages with a 3D locker, after the rest of the page (143 KB gzipped, own file). It renders only while something moves and pauses off screen. Without WebGL or JS the SVG drawing shows in the same place.
- Template page heroes (all six use cases, Platform, Workflows) use the same 3D locker: Otto + Lotte, turning toward the mouse, drawers popping. The visual is 512 px wide from 1280 (was 384), 384 below, in a 7:5 box. On these dark heroes a faint blue-white pool of light on the floor grounds the locker (a shadow can't show on dark). One shared component: `Locker3D.astro` (modules, label, surface light/dark).

## Built in code only, Figma still to update (2026-11-25, round 3)

- Home: no line under the logo marquee either; the Problem section's top line closes it.
- Touchpoints for one faulty device: each card has a 48px washed-indigo icon tile with a blue 2px line icon (Talent waste: hourglass, Hybrid work: house, Many sites: map pins, Off-hours: moon). The cards are information only: no hover fill, no spotlight.
- What IT teams say: the whole card is a link to the story. Hovering anywhere on the card fills it (washed indigo; the blue first card goes a shade darker) and shows "Read full" next to the arrow. On touch screens "Read full" is always shown.
- Icons: every line icon is 2px (token Icon stroke, non-scaling) — menus, cards, arrows, form steppers. Grid lines and borders stay 0.5px.
- Navigation menu icons: blue (Icon/Action/Default) on the washed tile, white on the blue tile on hover. They were white at rest by mistake.
- Customer stories: three lorem ipsum paragraphs under The challenge, What they did and The results, to show a long story (only while example content is on).
- No double lines (checked on every page at 375, 640, 960, 1280 and 1440 px): legal pages drew their panel lines twice; the header drew its own rail lines over the page rails while transparent over the hero (and its 92% fill let the page rails show through when scrolled, now opaque); the Workflows comparison's last row drew a bottom line on the section line; the customer story filter chips sat on the label strip line (now 32px below it).

## Built in code only, Figma still to update (2026-11-25, round 2)

- Home hero: the full-width line under the buttons is gone and the bottom padding is smaller (32px desktop, 32px below). The hero runs straight into the logo marquee.
- Home logo strip: no "Trusted by IT teams in enterprises" label strip and no lines above and below it (only on home, right under the hero). The customers page logo wall keeps its label.
- "Touchpoints for one faulty device" (Problem) title is left aligned like every other section.
- Shared section components: use case pages and the Integrations page now use the same hero component as Platform and Workflows (TemplateHero; Integrations has no visual). New components: SecurityBand, CtaBand (closing CTA) and Features (platform features). Change a section once and every page that shows it follows.
- Integrations, LISSA Asset card: logomark only (no wordmark), inverted: white mark on an indigo 48px tile. The whole card is a link (to /integrations). Hover: tile turns washed indigo, mark indigo and its three parts redraw in place one after another; title turns blue; "Read full" (underlined, blue) fades in under the text, its space reserved so nothing moves. On touch screens "Read full" is always shown.
- Interface sounds (Web Audio, very quiet, no files): tap on buttons/links/cards, select on steps/modules/filters, open/close on FAQ, menus and dropdowns, a soft tick on sliders, a three-note chime when the contact form is sent. Footer has a "Sound: On/Off" switch, remembered per browser.
- One stroke width everywhere: 0.5px (token Border width/Hair). Grid lines, borders, dividers, icon strokes (non-scaling), illustration lines, timeline track, slider thumb, tab underline all use it. Only the 2px keyboard focus ring stays thicker (accessibility).
- Video: the cursor is a pointer over the whole player, even while the video is a placeholder.

## Built in code only, Figma still to update (2026-11-25)

- Grid lines quieter: line colour Ice/400 at 18% (was 30%), on dark white at 9% (was 15%). Border/Neutral/Default now uses the same line colour, so cards and grid lines are one colour.
- No double lines anywhere: card grids, comparisons, the How it works box, quotes, the calculator and the story metrics drop their own outer lines where they meet a rail or a panel line. Pricing band and LISSA mockup lost their own frame for the same reason.
- 4px baseline everywhere: grid cells and the quarter unit snap down to 4px, every line height is a multiple of 4 (H4 18/24, H3 22/32 below 1280, menu labels 18/24, nav 15/16), off-grid gaps fixed (header nav, burger, labels, hero title).
- Padding system: `--inset` 24 mobile / 40 desktop is the only horizontal distance from a rail or card edge to text (section text, tiles, panels, bands, FAQ rows, steps, map); `--pad-block` 24 / 32 vertical padding in cards; `--head-pad` 32 / 48 above and below section titles; `--hero-top` header + 64 and `--hero-bottom` 64 / 80 on every page hero.
- Every section has a label strip: added to the logo strip (CUSTOMERS), Integrations security band (SECURITY) and the closing CTA (NEXT STEP). The Problem label now sits on the section's top line.
- Closing CTA band title is H3 size (24/32), not H2.
- Hover glow on dark surfaces stronger (Blue/700 at 58% centre, Blue/800 at 30%).
- "EOL rollout" renamed to "EOU rollout" (end of use), URL /use-cases/eou-rollout.
- Modules renamed with DACH first names: Master → Otto (screen module), Nikola → Lotte (24 small drawers), Viktor → Bruno (8 wide drawers), Larry → Greta (mixed). Module labels are centred over their module, and the whole locker figure is centred in the section.
- Device fit: hovering the iPhone 17 Pro Max card fills one small drawer in Lotte blue, the MacBook Pro 16″ card one wide drawer in Bruno. The dark "Drawer size examples" tile then shows a front-view drawing in mm: drawer opening (white lines that draw in), the device lying in it (CTA yellow) and dimension lines (175 × 90 / 163 × 9, 500 × 90 / 356 × 17), both at the same scale. Before hover it shows a short hint.
- Pricing is the one section without a label strip: the band sits in its panel with 48px (32px mobile) above and below.
- Go live is a 12-week timeline: week ruler 01–12, one bar per phase as long as the phase, square marker at each phase start (Go live's is CTA yellow). Bars fill week by week when it comes into view. Titles only; hover or focus shows the phase text (its space is reserved, nothing moves). On touch screens and mobile the text is always shown, as a vertical timeline.
- FAQ label strip reads "Frequently asked questions".
- New page headlines and bodies (one sentence each) on every page hero; home hero got a body line. Business case calculator works in money: new slider "IT desk cost per hour (€)" (20–150, default 60), results in €, hours saved shown under the total.
- LISSA Asset is named only as a connected system (Integrations on home, Platform and /integrations), with its logo (public/images/lissa-asset-logo.svg; a text wordmark stands in until the file is added). Elsewhere the back end is "our application", "the application" or "online".
- Integrations: "Logistics and service partners" split into Logistics partners and Service partners; home list is now LISSA Asset, sign-in, service desk, HR systems, logistics partners, service partners; /integrations systems are 8 tiles, 4 per row, with one-line texts.
- No subtitles next to section titles anywhere (the title carries the section).
- Calculator page: title "See how much money Spind saves", no subtitle, slider values and the big saving in CTA yellow, the dark band runs straight into the footer (no white strip; same on the contact page).
- Go live timeline v2: 2px track, 12px square points at each phase start (open, then filled as the run passes), yellow end point, week numbers without tick lines that turn dark as the run passes. Hover: the phase's stretch of track turns blue, its point fills with a soft halo, label and title turn blue and the text appears.
- Navigation: new "Case studies" menu after Use cases, built from the stories and split by industry (Logistics, Energy, Healthcare, Insurance), each with an industry icon, the company and the use cases it runs. Same layout as the other menus: two link columns (two industries stacked per column) and a dark feature card linking to all stories. The mobile menu and the footer list it too (footer now 4 columns from 1024px).
- Customer story template: title is Heading/H2 (40/48, was Display/Page 48/56), metric numbers use the stat style (40/48, were 72/72). The hero and the metric cards are one dark surface, so the hover glow runs across both and stops in the middle of the cards (fixes the hard glow edge). No line under the metric cards. The quote in the story has a round photo (initials until a photo is set) left of the name and role.
- Cimet logo added (public/images/cimet-logo-dark.svg for light surfaces, -light.svg for dark ones, component CimetLogo). Used in the footer: "All rights reserved. Spind is a product of [Cimet logo]".
- Customer story template, round 2: hero has the title and summary on the left and the company logo (40px) on the right, both centred vertically. Metric cards are 132px tall (24px padding, number and label centred). Facts list the exact cities under Sites (e.g. 12 branches: Hamburg, Bremen, …, Wien, Linz). "All customer stories" is a small secondary button on the right of the "More stories" title instead of a text link under the cards (Section component has an optional link).

---

## Built

### 2026-11-24 · Round 8: content review against Figma, nav cleanup, glows on hover only
- **Navigation**
  - Removed: the Pricing nav link, "Product overview →", "All use cases →", and the Service and Device lifecycle menu items. Service and Device lifecycle are also gone from the footer.
  - The Product feature card now promotes the video ("See Spind in action", "Watch the video" → `#video`) instead of pricing.
  - Menu items: the icon tile is vertically centred (middle left).
- **Removed sections**
  - The Platform feature tiles (Live status … Maps) on the website. They weren't in Figma.
  - "You never touch the locker" (the lifecycle tiles), in both Figma and on the website.
- **Glows**
  - Dark surfaces rest without any glow: the hero band, template heroes and mega menu feature cards.
  - The blue glow fades in only while the mouse is over the section, and follows the pointer.
  - Figma shows the resting state: the radial layers are removed, and the shader base plus grain stay.
- **Buttons**
  - Hover and Pressed add a very light outer glow: 16px blur in the button colour (CTA yellow 35%, primary indigo 30%, secondary ink 12%).
  - "Check it with us" is a yellow CTA. It had been deleted from the Figma result tile; it's back as a CTA.
- **Text cursor:** the caret in inputs is CTA yellow (`caret-color`).
- **Pricing band:** dark (`Surface/Neutral/Dark`) with white title and text, as in Figma.
- **Testimonials:** 48px profile circles next to each person. They show initials until a photo is set (`quote.photo` in site.ts). The first card's circle is darker blue; the others are washed blue.
- **Contact (Figma 33:133 / 33:136):**
  - Title and intro sit at the top, the person card at the bottom.
  - Person card: dark card with a hairline border, Pera's round photo (`public/images/pera-jovicki.png`, exported from Figma at 3×), name, email and phone.
- **Footer:** "© 2026 Cimet" on the left, "All rights reserved. Spind and LISSA Asset are products of Cimet." on the right. Both "Cimet" words link to https://cimet.rs/.
- **Content now matching Figma:**
  - No intro on "Go live in 12 weeks" or on the video section.
  - No "Video coming soon" caption.
  - No "All customer stories" link under the home testimonials. It stays on customer story pages, where Figma has it.

### 2026-11-24 · Round 7: dark template heroes, drawers on hover only, blue active step
- **Template pages** (use case pages, Customer stories, a single customer story):
  - The whole first section is the dark "space" surface (Ice/1100, blue glows, fine grain and stars), with a blue glow that follows the mouse.
  - The header sits on it transparent with white text (Header Theme=Dark) and turns white once the page scrolls.
  - **Figma:** a locked `hero space` rectangle sits behind the header bar and hero on each template frame. The header bar has no fill and uses the Dark header. Hero text is OnSurface or OnDark.
  - **Website:** a shared `.space` / `.space-glow` style in global.css, used by the home band and the template heroes. `Base` has a `darkHero` prop that starts the header transparent. One script handles every `[data-hero]`.
- **Drawers:** no drawer is highlighted by default (home hero, Modules, use case heroes). On the website, a drawer opens only while the mouse is over it, or within 6px of it. The How it works story locker still shows its target drawer, because it's part of the story.
- **Active step** in "From request to device in four steps": default blue (`Surface/Action/Default`) with white text.
- **Use case pages:** "How it works with Spind" no longer has the grey shade, the same as the home page.
- **Website fix:** made the title line-splitting animation safe; it could throw a console error.

### 2026-11-24 · Round 6: hero from Figma (31:3), yellow text selection
- **Hero, following your Figma change:**
  - The locker is 800 × 382 and its three modules stand apart. Gap 22px at 252px module width, which is 17.5 viewBox units; the `gap` prop on `LockerDrawing`.
  - Band height 415px.
  - 64px between the locker and the headline, 32px between the headline and the buttons.
  - The headline uses Display/Page (48/56) at max width 776px, with normal line breaks: "Devices available 24/7 without / bothering IT staff".
  - Smaller screens scale the same way: the locker is 4 / 6 / 7 cells wide, and the band ends about three quarters down the locker.
- **Text selection (website only):** CTA yellow `--surface-cta-default` with black `--text-cta-default`, like the CTA buttons.

### 2026-11-24 · Round 5: navigation redesign, hero interaction, type, form (Figma and website together)

**Navigation**
- **New Figma components:** `Mega menu` (Menu=Product / Use cases), `Menu item` (Default / Hover, with an Icon swap property) and 12 `Icon/*` components. The icons are the same paths as `src/content/icons.ts`.
- **Panel layout:**
  - Two link columns on columns 1–8 (400px each). Each column has an uppercase label, a hairline, then Menu items: a 40px icon tile on washed blue, plus title and description with a 4px gap.
  - The first column ends with an overview link: "Product overview →" or "All use cases →".
  - A grey panel (`Surface/Neutral/Page-Shade`) starts at column 9 and holds a dark feature card (the hero's space look) with an eyebrow, title, text and a small CTA button.
- **Hover:** the row fills with page colour, the icon tile turns blue with a white icon, and the title turns blue.
- **Overlay:** while a menu is open, the page under it gets `Surface/Overlay` (Ice/1000 at 60%). Clicking the overlay closes the menu.
- **Nav spacing:** 40px between nav items (`Spacing/Gap/General/Section/sm`).
- **Figma:** the Mega menus frames now use the new component, with the overlay drawn under the panel.

**Hero**
- The purple glow is now the drawer blue, `Blue/500`.
- **Website:** the main glow follows the mouse inside the band, and the drawer closest to the pointer opens. The random drawer cycle is gone. This only runs for mouse users who allow motion.
- The facts row (Access, Availability, Managed in) is removed.

**Type and labels**
- **Smaller titles:**
  - Display/Hero 56/64
  - Display/Page 48/56
  - Heading/H2 40/48
  - Heading/H3 24/32
  - Heading/H4 18/26
  - Display/Stat 64
  - The website scales down by the same amount at smaller widths.
- **Eyebrow labels:** UI/Label and UI/Label Small are now Geist SemiBold 12/16, 4% tracking, uppercase.

**Background and sections**
- The square grid is 5% now: `Ice/1000-5`, renamed from `Ice/1000-10`.
- "From request to device in four steps" no longer has the shaded background.

**FAQ**
- Only one answer can be open at a time. The website uses the `name` attribute on `<details>`, with a small script as fallback.
- 6 questions, as in Figma.

**Contact form**
- The form card uses `Surface/Neutral/Dark`, matching your Figma change on 33:140.
- `Input field` has a new Theme property, Light or Dark (10 variants). The contact form uses Dark:
  - Labels: `Text/Colors/Neutral/OnSurface`
  - Fields: `Surface/Neutral/Input OnDark` (Neutral/1000)
  - Borders: `Border/Neutral/OnDark`
  - Typed text: `Text/Colors/Neutral/OnDark`
  - Placeholder: `Text/Colors/Neutral/Placeholder OnDark` (Neutral/400)
  - Focus: blue `Border/Focus`. Error: `Border/Status/Error`.

**Your Figma changes, now on the website**
- **Module names:** Master, **Nikola, Viktor, Larry**. They also appear in the menu text "Master, Nikola, Viktor and Larry" and in the rollout checklist.
- **No intro text** on "You never touch the locker" or on "Calculate your business case".
- **FAQ:** the 6 questions from Figma. The 3 extra website-only questions are removed.

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

## 2026-11-24 — code-only changes (not yet in Figma)
- Template pages: removed the "What it looks like today" section.
- Contact form: "Number of sites" counter with down/up steppers (Figma 105:1452); blue glow behind the form section.
- Calculator and form moved to their own pages: /business-case and /contact. Calculator uses the same dark glow band as the form; "Check it with us" is the yellow CTA.
- Today vs With Spind: redesigned as paired rows with hover/focus state (strike-through, yellow accent bar, arrow badge).
- FAQ plus drawn with thin 1.5px lines. Video play button 128px, new poster image (Figma 86:227).
- Footer matched to Figma 97:541: big S at 124px from the top (34px left of the container, cut by the bottom edge), light 300 bottom line, Cimet links open in a new tab.
- Glows: no glow at rest on any dark background. On hover a bigger mouse-following blue glow (min 1000px circle) appears on the home hero, template heroes, contact and business case pages, and the footer.
- Customer story page: the dark hero now runs behind the top half of the three metric cards; the facts widget (Industry, Sites, Lockers, Solutions) is a white card on the page background.
- Today vs With Spind: the "With Spind" side is black (Surface/Neutral/Darkest) instead of indigo; hover lifts it to Surface/Neutral/Dark.
- "Built to save time and increase efficiency": each use case card has its own nav icon (same Icon/* set as the mega menu) in a 48px washed square. Hover: card lifts 4px, washed fill + blue frame, icon box turns blue, tilts and the icon redraws, title turns blue, arrow slides in, blue line runs along the bottom.
- Motion across the site: reveals rise with a blur-in, line icons draw themselves in, hover cards get a faint cursor-following grey spotlight and a bigger lift, yellow CTAs get a light sweep, mega menu icons tilt and redraw on hover. All off with reduced motion.
- "More use cases" on use case pages now uses the same Use case card as the home page (own icon, same hover and animations): one shared component, `UseCaseCard.astro`.
- Locker drawing (all lockers on the site): master module redesigned after Figma 105:1457 — one central touch screen (rounded, dark bezel, soft screen glow, sheen) with a round badge reader on the left and a QR / camera scanner on the right. Bodies get a lit top-to-bottom gradient and a light crown strip, no feet or plinth (removed), soft floor shadow under the locker, "SPIND" mark on the service panel. Ideas taken from Cora's deck: front view with real hardware details and depth.
- New home section "Connected to the tools you already run" (#integrations, after Platform) + "Integrations" in the Product menu and footer: dark hub (Spind + LISSA Asset, animated rings) and four cards — LISSA Asset, your sign-in, your service desk, logistics and service partners. Copy stays generic until Pera confirms partners and systems.
- Glows: darker navy (Blue/800 → Blue/900) instead of bright Blue/500, closer to the dark backgrounds. Pricing band now also gets the hover glow.
- Secondary buttons are outlined (transparent fill, dark outline on light, white outline on dark), fill slides in on hover.
- How it works (Figma 31:222): title "From request to device in 4 steps"; 600px steps list on the left (122px rows, number Geist 31/44 light, bold white on the active blue row), locker centred in the remaining space, no progress bar. Steps advance every 3.2s while in view; hover, focus or click shows a step.
- Hover rule for the whole site: fill only. No borders/frames, no lifting, no rotating or scaling icons, no sliding arrows. Applies to tiles, use case cards, integration cards, story cards, mega menu icons, button arrows, video play button.
- Today vs With Spind: arrows on the seam are always yellow with a dark arrow, step numbers removed, header reads "With" + the Spind logo (same SVG as the header).
- Locker floor shadow reduced to a thin contact shadow; the big drop shadows under the hero, module and use case lockers are removed.
- Favicon: yellow S (#FFD369 with dark mark).
- New page /integrations for enterprise buyers: hero, landscape map (your systems → LISSA Asset → Spind lockers), systems we connect (ERP, ITSM, identity, HR, endpoint, partners, with example products), how we connect (REST API, events/webhooks, SSO, file import), security band, Go live, integration FAQ, CTA. Product menu "Integrations" and the home section's "See all integrations" button link to it. All system names and security claims need Pera's confirmation.
- Typography: every font weight on the website is one step bolder (body Hanken Grotesk 300→400, 400→500; titles and UI Geist 500→600, 600→700, 700→800). Fonts loaded: Geist 600/700/800, Hanken Grotesk 400/500. The LISSA Asset mockup (Inter) is unchanged, since it mirrors the product UI.
- Header: menu items get no underline on hover or when their dropdown is open (colour change only; the current-section indicator stays). The language selector is a light filled box (flag, code, chevron), 36px tall, its dropdown opens below it.
- Lockers: no hover effect anywhere (no drawer opens near the cursor, modules no longer dim when hovering the locker or its labels; labels still work on click/focus). Every locker is drawn 20% smaller: hero 640px instead of 800 (dark band shortened to match), Modules locker and labels 80% width, use case heroes 384px, How it works stage 400px.
- Layout system (whole site, after the Chainlink reference): the square background grid is gone. The site now reads as one cabinet of drawers: two hairline rails run the full page height on the container edges (on-dark lines through dark heroes, bands and footer, and around the header). Every section starts with a drawer label strip — 48px, hairlines above and below, 6px blue square + Geist Mono caps (13px, 8% tracking) — then the title. Section heads and dark-surface content are inset 24px from the rails. Labels live in `site.ts` → `sectionLabels`.
- Mega menu, drawer style: white panel exactly the container width, three equal columns split by hairlines, each with the same mono label strip (Spind locker / LISSA Asset / Video, Device lifecycle / People and sites / Business case). Items: plain line icon, 18px title, description; hover = light blue fill, title and icon turn blue. The feature card sits in the third column. The open menu item is boxed between two hairlines (no underline).
- New font: Geist Mono 500 (labels only).
- Drawer frame refinements: all frame lines (rails, label strips, header edges, mega menu columns and edges, open menu item box) are Ice/1000 at 15% (white at 15% on dark) — tokens `--line` / `--line-ondark`. Rails are now drawn on the page body, so they land exactly on the container edges (were half a pixel off next to the header and menu). One shared vertical alignment line 24px inside the left rail: logo, label squares, section titles, mega menu icons and the feature card all start on it. Header menu items (Product, Use cases) are Hanken Grotesk 600; label strips Geist Mono 600. The customer logo strip now scrolls inside the rails.
- Open menu item: light blue fill instead of side lines (the side lines could not line up with the menu columns). Label strips (FAQ, ROLLOUT, …) and menu column labels are black (Text/Neutral/Headings). Tile padding is 24px at every width, so section titles, label squares and tile text share the same left line on smaller screens too (they drifted to ~18px below 1280).
- Grid relationships (after the second Chainlink reference): the page outside the rails is white; every section is a light panel (Surface/Neutral/Page) between the rails, closed top and bottom by hairlines that run the full screen width, so they cross the rails. Between two panels is a white spacer strip (40px mobile / 64px desktop) — the "gap between drawers". One inset token `--inset` (20px mobile / 40px desktop) sets the distance from the rails to the content: logo, header items, label text, section titles, tiles, mega menu labels and icons all start on it. Label strips still run rail to rail. Tile grids use fractional columns so they fit the inset panel.
- Grid on every block of every page: each top-level block (heroes, dark bands, panels, footer edge) now closes with a full-width hairline, so every section has rails left and right and lines top and bottom. Blocks that were outside the system now use it: the customer logo strip (a panel; logos scroll rail to rail), the customer stories list, the customer story body and the legal pages (each with its own label strip). The checklist resource page (not linked in the nav) is unchanged.
- Header: open menu item is blue text only (no fill box, whose edges did not sit on the grid lines). Language box and Book a call are both exactly 44px tall with an 8px gap.
- Platform and Workflows moved off the home page to their own template pages: /platform (hero, LISSA Asset mockup, features, integrations, go live, FAQ) and /workflows (hero, use case cards + Today vs With Spind, how it works, go live, FAQ). Shared hero component `TemplateHero.astro` (same layout as the use case pages). Menu items Platform and Workflows link to the pages.
- Grid rules, final: (1) the two rails are drawn above every section, so they are always visible, also over dark bands; line colour Ice/400 at 30% reads on white and on dark. (2) Every block has two full-width lines: where it starts and where its content ends; the white spacer (40/64px) sits between that line and the next block's start line. Dark/hero blocks follow the same rule. (3) Content sits on the grid lines: card grids, comparison, story, integrations, video player, pricing band, mockup and locker figure run rail to rail and stand on the bottom line; text stays on the 40px inset.
- Mega menu icons use the same tile as the use case cards: 48px washed square with a 24px blue line icon; on hover the square turns blue and the icon redraws in white. The tile starts on the 40px inset line, like the label squares.
- How it works: the locker now sits in its own white box right next to the 4 steps (same height, same hairline frame as the step rows), instead of floating on the panel.
- How it works: the locker box uses the dark hero surface (Ice/1100 with grain and stars) and the same mouse-following blue glow on hover as the hero sections.
- Every horizontal grid line spans the whole screen: label strip lines, the header bottom line and the line above the Cimet copyright in the footer (was container width) now run edge to edge in the grid line colour.
- Buttons: every yellow CTA ends with an arrow on the right (header "Book a call" and the mobile menu CTA got one). On hover only the arrow animates — it slides out to the right and back in from the left (600ms); the label and the button stay still. Off with reduced motion.
- Title font trial: new "Fonts" dropdown in the header (2 columns of 5 + a feature card, not in the footer) with 10 hero-only pages at /fonts/<slug> (noindex). Each shows the home hero copy with one monospace title font: IBM Plex Mono, JetBrains Mono, Roboto Mono, Source Code Pro, Fira Code, Space Mono, DM Mono, Red Hat Mono, Martian Mono, Geist Mono (500, Space Mono 400). Body text stays Hanken Grotesk. List in site.ts → fontTrials.
- Title font decision: keep Geist. The Fonts menu and the 10 trial pages were removed, and the extra font packages uninstalled (Geist Mono stays for the label strips).
- Title font trial, round 2 (sans-serif, bold 700): Fonts dropdown again (not in the footer) with 10 hero-only pages at /fonts/<slug> (noindex): IBM Plex Sans, Inter, Archivo, Work Sans, Instrument Sans, Space Grotesk, Manrope, DM Sans, Plus Jakarta Sans, Sora. Only the hero title changes; body stays Hanken Grotesk.
- Title font decision: IBM Plex Sans. It replaces Geist everywhere Geist was used (titles, buttons, numbers, menu labels, locker screen text). Titles h1–h4 are Bold 700; UI text keeps its weights (Plex has no 800, so 800 → 700). Font trial menu and pages removed, other trial fonts and Geist uninstalled. Label strips stay Geist Mono, body stays Hanken Grotesk. Figma text styles still need the same switch.
- 2026-11-25 · Modules ("Built with respect to industry standards"): tile renamed "Drawer size example", hint "Hover a drawer to see what fits in it". Hovering any drawer on the locker draws a device in a drawer of that size in the dark tile and gives the matching device card its washed fill (the hovered drawer gets the blue fill). Results read "x mm spare left". Spacing is one value (--head-pad, 48px desktop): label strip line → title, title → module names, locker → tiles.
- 2026-11-25 · Sections no longer have their own fill: the light panel (Surface/Neutral/Page) and the shaded variant are gone, every section sits on the same white page. Lines and rails unchanged.
- 2026-11-25 · Integrations: cards are compact on desktop (≥1280px: icon beside the text, ~145px instead of 200px); subtitles 16px at 1.6 line height, 4px under the title; "See all integrations" is the yellow CTA.
- 2026-11-25 · "What IT teams say": cards rebuilt after Figma 122:1061 — logo top left, ↗ arrow top right, quote below (32px gaps), person (48px initials circle, name + role 16/28) at the bottom. Hovering the arrow fades in "Read full" next to it (nothing moves). First card blue, the other two white.
- 2026-11-25 · Customer logo strip: label strip reads "Trusted by IT teams in enterprises"; the "Trusted by IT teams in every industry" title is removed (also on /customers).
- 2026-11-25 · How it works, redesigned as timed tabs (no longer tied to scrolling or hover): four tabs in one row (Geist Mono number + IBM Plex title), a 2px blue line fills along the bottom of the active tab over 5s, then the next tab opens and it loops. Clicking a tab (or arrow keys) opens it and restarts its 5s. Below the tabs: the step's role (overline, blue), a 32px title and the text on the left; the locker on the dark surface on the right (5/7 split). Reduced motion: no auto-advance.
- 2026-11-25 · Integrations: cards smaller (20px padding, 40px icon, 18px title, 15px text). The green live dots are now "Available" pills in the overline type (Geist Mono caps, 11px, 8% tracking) on a light green fill, gently blinking. "Our application" and its subtitle sit right next to the Spind mark and its rings. LISSA card's "Read full" sits in the bottom-right corner.
- 2026-11-25 · Footer bottom line: left "Copyright © 2026 Cimet. All rights reserved.", right the sound toggle and "Spind is a product of [Cimet logo]", spread to both ends.
- 2026-11-25 · Platform "Features" cards now have icons (48px washed square, blue line icon; on hover the square turns blue): Live status (pulse), Capacity (grid), Requests (checklist), Code expiry (timer), Activity log (list), Maps (map). All other visible cards on the site already had icons (use case steps keep their numbers).
- 2026-11-25 · LISSA Asset mark uses the colours as supplied: indigo #5757F5 mark on a #EEEEFE tile. LISSA card hover: lavender fill #EEEEFE, title and "Read full" indigo; the tile turns indigo with a white mark.
- 2026-11-25 · Workflows page: "Today vs Spind" is its own section (label strip "Today vs Spind", title "What changes with Spind") instead of running straight on from "Built to save time and increase efficiency".
- 2026-11-25 · Mega menu items show only the name; the subtitle opens under it on hover/focus (always shown on touch screens).
- 2026-11-25 · All hover animations are faster: --dur-fast 300→120ms, --dur 500→180ms, icon redraw 700→300ms, CTA arrow 600→300ms, CTA sweep 700→350ms, LISSA mark wipe 520→260ms, drawer fill 400→150ms, comparison strike 450→200ms. Scroll reveals unchanged.
- 2026-11-25 · How it works: no auto-advance. Hovering a tab only fills it; clicking opens it, and only the clicked tab changes the text and the locker screen. The locker visual sits on a grey surface (Surface/Neutral/Page shade, Ice/75) instead of the dark space surface.
- 2026-11-25 · Locker drawing (every locker, incl. Modules): Otto, the first module, carries the real Spind logo (same as the header) on its service panel instead of the "SPIND" text.
- 2026-11-25 · Integrations: "Available" pills made clearer: 13px Geist Mono caps (exact overline size), green fill #DDF3E8 with a hairline #9FD8BC, text #17663F, 8px dot blinking on/off every second.
- 2026-11-25 · Page background trial: white with 5% less lightness, #EEF2F6 (hsl 213 30% 95%, token --surface-neutral-canvas), under the grain. Cards and tiles stay white; header uses the same grey, the language box is white.
- 2026-11-26 · Built straight in code (round with Pera's "Integration proposal and four use cases" document); Figma still needs the same changes:
  - **German translation**: whole site in English (/) and German (/de/). Copy in `src/content/site.ts` (EN) and `site.de.ts` (DE); pages read the language from the URL. hreflang links, German share cover.
  - **Language selector**: flags removed. Geist Mono code (EN/DE) in a 44px hairline box with chevron; menu is a white hairline panel, current language blue with the square bullet. Mobile: two-cell EN | DE switch under a "Language" label.
  - **Anonymized customers**: logo ribbon and mock logos removed everywhere. Stories are Pera's four sample cases (logistics network 12 sites, hospital network 3 shifts, mid-sized company 600 employees, campus with 10 companies), each shown with an industry icon tile + description. Quotes signed by role only. Lorem ipsum removed. App mockup uses neutral locker names and "IT Admin".
  - **Self-service at the locker**: How it works is Request (app, Teams or walk up) → Identify (RFID badge, QR or PIN) → Open (take the new device, leave the old one) → Tracked. Same in hero, FAQ and the swap use case.
  - **Use cases**: New device pickup removed (redirects to Faulty device swap). New: Temporary devices (loan for a project) and Lost device (block via MDM, replacement same day).
  - **Mega menu**: every item 72px tall with icon and text centred, at rest and on hover; subtitle 2px under the title; all menus share one height (room for 4 items), so nothing grows on hover.
  - **Go live in 8 weeks**: Plan week 1, Connect week 2, Prepare weeks 3–6, Go live weeks 7–8.
  - **Calculator**: "IT minutes with Spind" slider removed, fixed 10 min per handover (shown under "IT cost with Spind"); hourly cost starts at 45 €.
  - **Integrations**: status pills from Pera's table (Available / On request / Pilot) under each card's text (shared `StatusPill` component). Integrations page: LISSA Asset removed from the "Your systems" list, equal 56px boxes, connection lines 3px dashed in full blue, new "Roll it out in three stages" section, Locker access and Filling model tiles.
  - **Security**: ISO 27001 certified by TÜV Austria, tenant separation (Security band and FAQ).
  - **Modular**: Locker page "Build your own Spind, one module at a time"; FAQ "start with one module, grow".
  - **Metadata**: home title "Spind"; new 1200×630 share covers (EN/DE), Twitter tags, apple-touch icon, web manifest, structured data; canonical domain spind-8ty.pages.dev until SITE_URL is set.
  - **Forms**: placeholder text at 50% opacity site-wide; neutral placeholders (no names).
