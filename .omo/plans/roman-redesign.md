# Plan: Roman-Inspired Visual Redesign

**Created**: 2026-07-21
**Status**: in_progress

## TL;DR

Transform the site's visual identity from modern blue/Inter to a warm Roman-inspired
palette (terracotta, marble, gold) with classical serif headings (Cinzel). The semantic
token architecture means most changes cascade from tailwind.config.js alone. Goal: a
professional, memorable portfolio that feels timeless and dignified — not themed.

## Scope

- **Colors**: Terracotta primary palette, warm marble surfaces, gold accents
- **Typography**: Cinzel for headings, Inter retained for body text
- **Design**: Subtle classical touches — no columns, togas, or laurel wreaths
- **Dark mode**: Full parity maintained
- **Professionalism**: Still a developer portfolio for hiring, not a Roman theme park

## Approach

The site uses semantic color tokens (`surface`, `foreground`, `accent`, `muted`,
`border`) defined in `tailwind.config.js`. Every component references these tokens
rather than raw Tailwind colors. Changing the token VALUES in the config cascades
the entire site. Similarly, font families and typography scale live in the config.

This means the bulk of the redesign is a single-file change + font loading update.
Remaining work is spot-checking pages for hardcoded values and visual tuning.

---

## TODOs

### Phase 1: Foundation

- [x] 1. Update `tailwind.config.js` with Roman color palette and typography
  - Replace `primary` color scale: blue → terracotta (warm earth tones)
  - Update semantic tokens: `surface` → warm marble, `accent` → terracotta/gold, `foreground` → warm charcoal
  - Update `fontFamily`: add `heading` (Cinzel), keep `body`/`sans` (Inter)
  - Update typography prose config for new colors
  - Update `fontSize` scale if needed for monumental feel
  - Preserve all existing animation keyframes, border widths, min-heights

- [x] 2. Update `app/layout.tsx` for new fonts
  - Load Cinzel from `next/font/google` for headings
  - Apply heading font to all `h1`-`h4` elements via CSS or className
  - Keep Inter for body text
  - Update dark mode script if needed

### Phase 2: Page & Component Review

- [x] 3. Review and adjust all page files for hardcoded color/style values
  - `app/page.tsx` — check hero section, marquee, links
  - `app/about/page.tsx` — check timeline entries
  - `app/contact/page.tsx` — check form styling
  - `app/blog/page.tsx` — check listing grid
  - `app/blog/entry/[slug]/page.tsx` — check prose rendering
  - `app/projects/page.tsx` — check project grid
  - `app/projects/entry/[slug]/page.tsx` — check prose rendering

- [x] 4. Review and adjust all components for hardcoded color/style values
  - `components/Header/Header.tsx` — Navbar, contact button
  - `components/Footer/Footer.tsx` — social links
  - `components/Button/Button.tsx` — CVA variants
  - `components/ArticleTeaser/ArticleTeaser.tsx` — card, tags, links
  - `components/ProjectTeaser/ProjectTeaser.tsx` — card, tech icons
  - `components/TimelineEntry/TimelineEntry.tsx` — timeline row
  - `components/PersonTeaser/PersonTeaser.tsx` — person card
  - `components/Tooltip/Tooltip.tsx` — tooltip colors

### Phase 3: Verification

- [x] 5. Build + lint + test verification
  - `pnpm build` must succeed
  - `pnpm lint` must pass
  - `pnpm test` must pass
  - `pnpm prettier` must pass

---

## Success Criteria

- `pnpm build` exits 0
- `pnpm lint` exits 0
- `pnpm test` exits 0 (no snapshot updates needed unless intentional)
- `pnpm prettier` exits 0
- Site renders with terracotta/warm palette, Cinzel headings, readable body text
- Dark mode parity maintained

## Notepad Path

`.omo/notepads/roman-redesign/`

---

## Final Verification Wave

- [x] F1. Oracle: Verify color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- [x] F2. Oracle: Verify all semantic tokens resolve correctly (no missing references)
- [x] F3. Unspecified-high: Hands-on QA — visual smoke test via Playwright screenshot comparison
- [x] F4. Unspecified-high: Verify dark mode parity — all pages render correctly in both themes
