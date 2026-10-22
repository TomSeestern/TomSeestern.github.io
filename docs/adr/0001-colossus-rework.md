# ADR-0001 — COLOSSUS full UX/UI rework

- Date: 2026-10-20
- Status: accepted
- Supersedes: the 2026 “engineered calm” single-skin direction, including its
  ban on classical/Roman ornament and precious-material tokens.

## Context

The portfolio was last restyled as a restrained, content-first parchment site.
That system explicitly forbade classical ornament and named
`scripts/check-ornaments.mjs` as the enforcement gate. The new brief asks for a
full UX/UI rework inspired by Rome, pixel art, and PEAK-style agency web design.
The old gate and the old `DESIGN.md` therefore cannot coexist with the requested
direction: they reject the words `gold` and `laurel` in shipped source before any
new page can be built.

The site is a statically generated Next.js App Router portfolio with no auth,
database, cookies, analytics, or tracking. It has 3 blog posts, 21 projects, 86
tag routes, 8 fixed public routes, and a contact form backed by Resend. The
existing gates are strict: contrast, font budget, image size, bundle budget,
Lighthouse, Jest, Storybook, and Playwright/axe.

## Decision

Adopt **COLOSSUS**: “a Roman forum rebuilt as an 8-bit arcade.”

- **Structure:** inscriptional capitals, arches, meander borders, laurel geometry,
  hard 12-column rules, asymmetric editorial grids.
- **Surface:** travertine `canvas`, `panel`, `night`, and one restrained `crimson`
  band per page. Single light mode; no theme toggle.
- **Type:** Cinzel for display, Silkscreen for pixel micro-labels, system sans for
  UI, system serif for long-form prose. Exactly two custom families.
- **Pixel layer:** deterministic mirrored 8×8 project/article sigils rendered as
  at most 3 SVG paths, CSS dither/grid fields, and stepped shadows.
- **Motion:** CSS-only mosaic entrances, a static-under-reduced-motion ticker, and
  hover state changes. No Framer Motion/GSAP/Three.js/Lottie, no scroll-jacking,
  no custom cursor, no layout animation.
- **Content:** no prose rewrite. Add `featured: true` to the four projects the
  existing recency fallback already selects, so “Selected Work” and the
  “Selected” badges become explicit rather than accidental.
- **Legal:** keep every German sentence, heading, and `TODO(Tom)` placeholder
  verbatim; only wrappers/classes may change.
- **No new runtime dependencies.** Visuals are inline SVG/CSS. The existing
  Header, ContactForm, and TooltipProvider remain the only client components.

The visual contract, palette values, typography, copy map, accessibility rules,
and performance budgets are recorded in `DESIGN.md`.

## Consequences

- The old ornament gate is retired in T3. It is replaced by
  `scripts/check-design-tokens.mjs` in T21, which prevents the old token names,
  `dark:` variants, and raw hex from returning.
- The palette and typography are intentionally different; all contrast pairs are
  revalidated in `tests/budgets/contrast.json`.
- The font gate is updated from Inter + Newsreader to Cinzel + Silkscreen.
- The home page no longer renders the empty `FounderArc` scaffold; the real
  background timeline stays on `/about`.
- Project cards gain deterministic sigils instead of unused image props.
- Flowbite plugin/dependencies and unused `react-icons`/`date-fns` are removed
  once no imports remain; the bundle and Jest config are updated in the same
  cleanup.
- The site is not deployed mid-migration. The old tokens remain until the final
  purge so every intermediate commit builds; the page rollout is serial because
  the e2e specs share fixtures.
- Rollback is a normal code revert or Vercel deployment rollback; there is no
  data migration, cookie, auth, or persistent state.

## Rejected alternatives

- **Layer Roman motifs on the old parchment skin:** the old gate rejects `gold`
  and `laurel`, and the result would be two competing identities.
- **Add a dark-mode toggle:** doubles visual QA and the axe matrix; the brief did
  not ask for it.
- **Use a motion library:** the bundle is already near its absolute budget; CSS
  and native behaviour cover the needed craft.
- **AI-generated project art:** the content has no approved imagery; deterministic
  inline SVG sigils are lighter, private, and reproducible.
- **Invent case-study metrics/testimonials:** forbidden by the no-fabrication
  rule. The project dossier uses only available frontmatter.

## Superseded files and rules

- `DESIGN.md` is rewritten as the COLOSSUS system.
- `scripts/check-ornaments.mjs` and the `pnpm ornaments` script/CI step are removed
  in T3.
- The “no classical ornament / no gold / no marble” rule and the 1px column-rule
  motif are superseded.
- The 2026 `featured` fallback remains only as a build-safety net; the four
  newest projects now set `featured: true` explicitly.

## Amendment — 2026-10-20: editorial case-file rebuild

The first COLOSSUS pass established the palette, content contract, and gate
infrastructure, but its poster-scale all-caps heroes, repeated arch/sigil card
headers, and decorative icon grid read as a themed template rather than a
portfolio. The product owner rejected that execution and authorized a full
rebuild.

The amended direction keeps the name and the Roman/pixel DNA but changes the
composition:

- **Type:** Instrument Serif 400 replaces Cinzel; H1–H3 are sentence case. The
  pixel face is restricted to archival metadata.
- **Hero:** the home page leads with the person, a portrait plate, positioning
  copy, actions, and archive counts. Listing heroes are compact and content-first.
- **Work:** project-specific inline SVG covers (payments, vision, marketplace,
  refund) replace repeated random sigil headers. The first home case file is a
  horizontal lead; the other three form a 3-up row.
- **Rhythm:** the practice icon grid becomes a four-column capability index; blog
  entries become editorial rows without boxes; hairline rules replace stepped
  card shadows. One meander survives at the footer edge.
- **Proof:** routes, metadata, legal copy, contact server action, privacy posture,
  accessibility, and performance gates are unchanged. The home DOM budget is
  measured at 573 dev nodes against the 594 ceiling.

This amendment supersedes only the visual execution above; the earlier content
and gate decisions remain in force.

## Amendment — 2026-10-21: terminal rebuild (v3)

The editorial case-file pass still read as a themed magazine: oversized serif
display, a portrait-led home page, parchment-adjacent surfaces, and decorative
arch/sigil repetition. The product owner rejected that execution and asked for a
Vercel-grade technical surface with pixel and Roman references that stay
structural, not costume.

The third pass supersedes the visual execution above:

- **Mode:** one dark mode (`#050505` canvas), no toggle and no OS-preference
  resolver. `night` panels and the single `crimson` accent carry the contrast.
- **Type:** Geist replaces Instrument Serif; Geist Mono replaces Silkscreen for
  every label, counter, and terminal artifact. Two families, no decorative face.
- **Home:** a terminal-led hero (proposition, real profile summary, real selected
  case file) replaces the portrait-led hero. Project cards become an equal 2×2
  grid; the practice band becomes four bordered capability cards; article cards
  lose the repeated sigil. The ticker is retired.
- **Roman/pixel:** the pixel column, Roman numeral section indices, arch monogram,
  and deterministic 16×16 glyphs carry the reference. No meander, laurel, or
  repeated arch chrome ships on a public route.
- **Surface:** 80rem frame, 1px rules, rounded cards/controls, one soft glow on
  the terminal window, and no stepped shadows.
- **Budgets:** critical font preload 28.6 KiB (Geist; Geist Mono deferred), home 106 kB
  first-load JS; detail routes ≤138 kB; home DOM measured 629 dev nodes against a
  650 ceiling.

Routes, factual claims, metadata, legal copy, the contact server action, privacy
posture, and all verification gates remain unchanged. This amendment supersedes
only the visual execution; the earlier content and gate decisions remain in
force.
