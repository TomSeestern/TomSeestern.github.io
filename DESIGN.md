# TomSegbers.de Design System — COLOSSUS

> Status: active. The third COLOSSUS pass is a terminal-first rebuild: a
> monochrome technical surface, one warm accent, and pixel/Roman details used as
> structure rather than costume. The tracked decision record is
> [`docs/adr/0001-colossus-rework.md`](docs/adr/0001-colossus-rework.md).

## 1. Atmosphere & identity

**COLOSSUS — a working archive with Roman bones and pixel artifacts.** The
surface is near-black and technical: 1px rules, a strict grid, compact mono
labels, and a case-file window that reads like a product surface. The Roman idea
survives as a pixel column, Roman numeral section indices, and the arch monogram.
The 8-bit idea survives as deterministic pixel glyphs and a small archive seal.
Neither is repeated on every card.

The voice stays direct, technical, and understated. The work is the monument. The
site ships one dark mode. There is no theme toggle and no OS-preference resolver.

## 2. Palette

All values live in `tailwind.config.js`; components use semantic tokens and never
embed raw hex.

| Token            | Value     | Role / constraint                                |
| ---------------- | --------- | ------------------------------------------------ |
| `canvas`         | `#050505` | Page surface, terminal black                     |
| `canvas-deep`    | `#0A0A0A` | Recessed bands and feature cards                 |
| `panel`          | `#0F0F0F` | Cards, forms, terminal window                    |
| `ink`            | `#FAFAFA` | Primary text, light CTA fill, hard rules         |
| `ink-muted`      | `#A1A1AA` | Supporting text and mono labels                  |
| `night`          | `#000000` | Footer, closing bands, project-cover plates      |
| `night-soft`     | `#141414` | Raised panels inside night bands                 |
| `night-ink`      | `#FAFAFA` | Primary text on night                            |
| `night-muted`    | `#A1A1AA` | Supporting text on night                         |
| `crimson`        | `#FF5C35` | Single warm accent: links, prompts, focus accent |
| `crimson-hover`  | `#FF7A57` | Accent hover                                     |
| `gold`           | `#F5F5F5` | Light pixel-button fill                          |
| `gold-ink`       | `#FAFAFA` | Light text on night-only labels                  |
| `verdigris`      | `#4ADE80` | Status dot only                                  |
| `rule`           | `#1F1F1F` | Decorative rules and card borders                |
| `rule-strong`    | `#333333` | Stronger decorative rules and control borders    |
| `focus`          | `#FAFAFA` | Focus outline on dark surfaces                   |
| `focus-inverse`  | `#FAFAFA` | Focus outline on night surfaces                  |
| `danger`         | `#FF6B6B` | Form error text                                  |
| `danger-surface` | `#2A0F0F` | Error alert surface                              |

### Colour rules

- `crimson` is the only saturated hue. It is never a large fill; use it for
  links, terminal prompts, section indices, and the focus accent.
- `gold` is a light fill with `canvas` text; it is not a yellow accent. The
  `pixel` button uses it as a high-contrast light surface.
- `verdigris` is a status dot only. It is not body text or a decorative fill.
- `rule` and `rule-strong` are decorative and exempt from WCAG 1.4.11.
  Interactive boundaries use `rule-strong`, `ink`, or the accent with at least
  3:1.
- Focus outlines are 3px with a 2px offset. Use `focus` on dark surfaces,
  `focus-inverse` on night, and `focus-ring-accent` around light buttons.
- Every shipping foreground/background pair is listed in
  `tests/budgets/contrast.json` and enforced by `pnpm contrast`.

## 3. Typography

| Role       | Family                                                                  | Usage                                                   |
| ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------- |
| Interface  | **Geist** variable, latin, `next/font/google`, `--font-geist-sans`      | H1–H4, navigation, body, prose, buttons, card titles    |
| Mono/pixel | **Geist Mono** variable, latin, `next/font/google`, `--font-geist-mono` | Eyebrows, counters, dates, stack chips, terminal window |

- Display type is sentence case with tight tracking and a **-0.04em floor**;
  never tighter, because tighter closes the counters at display sizes. H1/H2/H3
  never use `text-transform: uppercase`.
- H1: `clamp(3.25rem, 6.8vw, 5.75rem)`, line-height 0.98. H2:
  `clamp(2rem, 3.2vw, 2.75rem)`, line-height 1.08. H3: 1.25rem, line-height 1.3.
- Mono labels are 10–12px, uppercase, tracking 0.12–0.14em. They carry metadata
  only, never prose or navigation. **Section eyebrows must carry information the
  H2 does not** (an ordinal, a count, a range, a category) — never a restatement
  of the heading.
- Large display statements use `text-wrap: balance`; body copy uses a 46–68ch
  measure.
- Font budget: exactly two custom families; critical preload woff2 ≤100 KiB.
  Current preload is 28.6 KiB (Geist). Both families use `display: "optional"`;
  Geist Mono is deferred (`preload: false`) because it carries labels below the
  LCP path. All 11 emitted subsets total 143 KiB, but only the latin subset is
  downloaded.

## 4. Layout, measure, and motifs

- Page wrapper `max-w-width-page` = 80rem; gutters 16/24/40px.
- Sections carry a top `1px rule`. Section rhythm is `py-14 sm:py-16 lg:py-24`
  on the home page and `py-10 sm:py-14 lg:py-16` on listing/detail pages.
- Tones: `canvas`, `canvas-deep`, `panel`, `night`. Use at most one `night` band
  before the footer.
- Reading measures: `measure-article` 68ch, `measure-lead` 46ch,
  `measure-card` 38ch, `measure-display` 20ch.
- Motifs:
  - **Terminal window** — the home hero's case-file surface: window chrome,
    mono prompt, a real profile summary, a real selected case file, and a status
    line carrying the archive counts (case files, dispatches, span). The counts
    live on the instrument, not in a detached hero-metric row.
  - **Pixel column** — a 24×48 pixel-grid column used once per page as a
    low-contrast watermark (hero, footer, 404). It is the explicit Roman motif.
  - **Pixel glyph** — 16×16 block icons for Systems, Interfaces, Delivery, and
    Product. Semantic, mono, and never illustrative.
  - **Pixel sigil** — deterministic mirrored 8×8 archive seal. Used in the hero
    window and index panels, not repeated on every article card.
  - **Project cover** — one of 28 hand-built SVG plates on `night`, keyed by
    project: maze, robot, economy loop, data pipeline, payment rail, glyph grid,
    and so on. Every project gets its own diagram and label; `archive` is only a
    fallback. One accent colour, monochrome line work, and a scanline overlay.
  - **Grid / hero glow / scanlines** — low-opacity technical texture. Never
    behind body copy without a solid panel.
- Cards use `rounded-lg`; controls use `rounded-md`. The terminal window is the
  only surface with a soft `shadow-glow`; ordinary cards use hairlines.

## 5. Components

- **Header** — sticky `canvas` surface with a backdrop blur, 1px rule, monogram
  - lowercase `tomsegbers` wordmark, four sans nav items, and a light `Contact`
    CTA. Active route: ink text + 1px accent rule. Mobile disclosure keeps
    `aria-controls="site-nav"` and `aria-expanded`.
- **Footer** — `night` band, pixel-column watermark, four columns: brand,
  Navigate, Index, Elsewhere. Keep the exact social destinations and “No
  cookies. No tracking.”
- **Buttons** — sentence-case Geist medium labels, 44px minimum height,
  `rounded-md`. `primary` is light fill/canvas text; `secondary` is transparent
  with a `rule-strong` border; `ghost` is underlined; `pixel` is a light
  `gold` fill. Primary/pixel use the accent focus ring.
- **Cards** — `panel`, 1px `rule` border, `rounded-lg`, hover to
  `rule-strong`, no shadow. One primary title link and one secondary action; no
  nested-link overlay.
- **Project cards** — equal 2×2 cards on home, each with a 16:10 `ProjectCover`,
  index/year, title, excerpt, stack, and action. `Selected` is a small mono
  marker, not a badge box.
- **Article cards/rows** — `panel` cards with a date, first tag, title, excerpt,
  and one read action. The blog listing leads with a feature card and follows
  with rule-separated rows.
- **Archive and dispatch rows** — one entry, one link. The title link stretches
  across the row (`after:absolute after:inset-0`) so the pointer target is the
  whole row and the keyboard gets a single stop; the trailing arrow is
  decorative (`aria-hidden`). Never render a second link to the same entry.
- **Capability index** — a rule-separated ledger (Systems, Interfaces, Delivery,
  Product): ordinal, pixel glyph, term, definition. Two columns at `sm`, no
  bordered card per item. A recurring-tools line follows as evidence. No logo
  grid.
- **Tag index** — alphabetical sections with letter rules, two columns at `lg`,
  and a count per entry. Labels are humanised at render time: camel-case
  compounds split into words, separator variants merged, one label per concept.
  Retired camel-case slugs redirect permanently to the canonical slug.
- **Contact form** — labels, ids, error strings, success string, and the
  `role="status"` success contract are unchanged. Inputs use `canvas`, 1px
  `rule-strong` borders, ink text, focus outlines; submit is disabled while
  sending.
- **Case-study hero** — real screenshots stay evidence inside a `night` plate:
  an `Evidence / Case file` strip, the year, an `object-contain` image, and
  a caption with the project title and figure number. Missing screenshots fall
  back to the project-specific cover plate.
- **Project dossier** — sticky facts panel with year, stack, subjects, optional
  role/outcome/metrics. 1px rules; no shadow.
- **404** — night surface, pixel-column plate, `Page not found` H2, and the
  same recovery links.

## 6. Copy contract

Keep page H1s and factual copy; keep all form labels/errors, nav labels, social
accessible names, and legal text. The approved labels:

| Route                    | H1                     | Labels                                                                                    |
| ------------------------ | ---------------------- | ----------------------------------------------------------------------------------------- |
| `/`                      | `Systems that hold.`   | `Selected work`, `The practice`, `Latest dispatches`, `Let's build something that lasts.` |
| `/projects`              | `The work`             | `Archive`, `Browse by subject`, `Selected case files`, `The archive`                      |
| `/projects/entry/[slug]` | project title          | `Case file · <YEAR>`, `Stack`, `Subjects`, `Next project`, `Back to the archive`          |
| `/blog`                  | `Blog`                 | `Journal`, `Latest entries`                                                               |
| `/blog/entry/[slug]`     | post title             | `Dispatch · <DATE>`, `More dispatches`                                                    |
| `/about`                 | `About me`             | `Profile`, `Formal positions`, `Tools of the trade`, `Illustrative examples`              |
| `/tags`                  | `Tags`                 | `Index`                                                                                   |
| `/tags/[tag]`            | tag label              | `Filed under`                                                                             |
| `/contact`               | `Get in touch`         | `Correspondence`                                                                          |
| `/impressum`             | `Impressum`            | no copy changes                                                                           |
| `/datenschutz`           | `Datenschutzerklärung` | no copy changes                                                                           |
| 404                      | `404`                  | H2 `Page not found`                                                                       |

Microcopy: “Read dispatch”; “View case file”; “All dispatches”. Update
`e2e/fixtures/expectations.ts` and every page/component/e2e assertion in the same
change that edits a string.

## 7. Motion

- Content is visible by default. There is no entrance animation and no
  scroll-driven reveal; motion never gates visibility or navigation.
- Hover: 160–200ms colour/border shift. No translate lift on cards.
- The retired ticker is not rendered. There is no marquee on any public route.
- Reduced motion is absolute: no loops, no transform, no ticker. Colour and
  underline changes remain.
- Never animate layout properties, filters, clip-path, or backdrop-filter.

## 8. Depth and surface

Use tonal surface shifts and hairlines. Ordinary cards have no shadow. The home
terminal window may use `shadow-glow` to separate the one product-like surface.
No glassmorphism and no decorative gradient fields. The only texture layers are
the CSS grid, scanlines, and low-opacity accents described in §4. Text always
sits on a solid surface.

Browser surfaces are part of the surface: `::selection` paints the accent,
`scrollbar-color` uses `rule-strong` on `canvas`, form carets use the accent, and
prose list markers use the accent. None of these may fall back to UA defaults.

## 9. Gates

### Contrast

`pnpm contrast` reads `tests/budgets/contrast.json`, computes WCAG 2.x ratios, and
fails below 4.5:1 for text or 3:1 for UI/non-text pairs. Any token change or new
foreground/background combination must update the manifest and pass the gate.
The current manifest has 36 shipping pairs.

### Design tokens

`pnpm design-tokens` enforces the migration:

- no legacy token names (`surface*`, `foreground*`, `accent*`, `primary*`,
  `dark:` utilities);
- no raw hex in `.ts`/`.tsx`/`.css` outside `tailwind.config.js`,
  `tests/budgets`, and `lib/design-tokens.ts`;
- no `Newsreader`, `Inter`, `Instrument Serif`, `Silkscreen`, or retired-palette
  references in shipped source.

### Accessibility

- WCAG 2.2 AA; axe serious/critical allowlist stays empty.
- One H1 per page; no skipped heading levels; cards use H3 under section H2.
- Every ornament is `aria-hidden`; no decorative text in the accessibility tree.
- Skip link, keyboard navigation, Escape for tooltip/menu, visible focus on every
  interactive surface, 44px primary touch targets, 24px minimum elsewhere.
- No motion-only state and no hover-only content.

### Performance

- LCP ≤2.5s, CLS ≤0.1, TBT ≤200ms on the existing Lighthouse mobile profile.
- Global first-load JS ≤130 KiB gzip; each route ≤180 KiB. Current build: home
  106 kB, detail routes 137–138 kB.
- Home DOM ≤650 nodes in the Playwright dev budget (measured 629 after the
  terminal rebuild; the dev server injects tooling nodes).
- Shipped raster images ≤200 KB; hero-named assets ≤50 KB; decorative art is
  inline SVG/CSS.
- Font critical preload ≤100 KiB; current 28.6 KiB (Geist). Geist Mono is
  deferred; the latin subset is the only one a page requests.

## 10. Content and legal constraints

- Do not invent metrics, clients, testimonials, availability, or biography.
- The only permitted content edit is the `featured: true` metadata added to the
  four current newest projects so “Selected work” is truthful.
- The illustrative testimonial examples stay on `/about` with their visible
  “Example” labelling.
- Legal copy is untouchable. Legal pages may change wrappers and classes only; the
  normalized `#main-content` text must match the baseline snapshot.
