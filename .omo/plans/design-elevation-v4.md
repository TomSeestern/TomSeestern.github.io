# COLOSSUS v4 — design elevation pass

## TL;DR

Use the `pbakaus/impeccable` v4.7.0 design skill (Apache-2.0) as an
identity-preserving *refinement* of COLOSSUS v3, not a redesign. The audit found
one broken navigation primitive (`#selected-work` does not exist), a tag index
that leaks raw frontmatter (camelCase labels, duplicate AI tag, 86 ungrouped
rows), section eyebrows that restate their headings, a generic four-card
capability grid, and 21 archive rows that each expose two links to the same URL.
This pass fixes those, sharpens the home composition, and closes the craft-floor
gaps (display tracking, caret/selection, anchor offsets) without touching
routes, factual copy, metadata, the contact action, legal text, or gates.

## Provenance of the skill

- Source: https://github.com/pbakaus/impeccable (`plugin/skills/impeccable`)
- Version: 4.7.0 · License: Apache-2.0 · MIT-compatible use.
- Loaded locally at `/tmp/opencode/impeccable`; `scripts/impeccable context`
  reported `SCOPED_EXISTING_ALLOWED` + `EXISTING_VISUAL_SYSTEM` because the repo
  ships `DESIGN.md` and an incumbent implementation. Mode: **Experience**
  (portfolio), with **Read** rules for article pages.
- References used: `SKILL.md`, `reference/craft-floor.md`,
  `reference/polish.md`, `reference/audit.md`.

## Audit evidence (before)

Captured 2026-10-21 against the production server on `:3100` (18 screenshots in
`/tmp/opencode/shots`) and measured with Chromium 1228 at 1440×900, 390×844 and
320×800.

| #   | Sev | Finding                                                                                                                                                                                                                                                         | Evidence                                                                                                                                  |
| --- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | P1  | `View selected work` on `/` and `Selected work` on `/projects` point at `#selected-work`, which no element owns. Clicking does nothing (scrollY stays 0).                                                                                                        | `components/HomeHero/HomeHero.tsx:48`, `app/projects/page.tsx:72`; `document.querySelector('#selected-work') === null`                     |
| F2  | P2  | In-page anchors have no sticky-header offset; `#archive` lands under the 65px header.                                                                                                                                                                            | no `scroll-mt`/`scroll-margin-top` in `app/`, `components/`, `styles/`                                                                     |
| F3  | P2  | Tag taxonomy leaks raw frontmatter: 20+ camelCase labels (`AndroidAppDevelopment`, `FullStackWebDevelopment`, `MultimodalTravelPlanner`), and one concept is split into two tags — `Artificial Intelligence` (2 entries) + `ArtificialIntelligence` (2 entries) | `lib/tags.ts:45-76`; `/tags` HTML `href="/tags/artificial-intelligence"` and `href="/tags/artificialintelligence"`                          |
| F4  | P2  | 86-tag index is sorted by count then label, ungrouped and single-column: unscannable as an index.                                                                                                                                                               | `app/tags/page.tsx:86-103`; 539 KB full-page screenshot                                                                                    |
| F5  | P2  | Section eyebrows restate the H2 (`I / Selected work` over `Selected work`; `II / Archive` over `The archive`; `Index / Tags` over `Tags`; `EXAMPLE` over `Illustrative examples`; `CORRESPONDENCE` twice on `/contact`).                                          | `app/page.tsx:56,76,91,111`; `app/projects/page.tsx:127,147`; `app/tags/page.tsx:58`; `components/Testimonials`; `app/contact/page.tsx:48,62` |
| F6  | P2  | Every archive row has two links to the same case file (title + `Case file`): 21 duplicate pairs, 84 focusables on `/projects`.                                                                                                                                  | `components/ArchiveRow/ArchiveRow.tsx:33,65`; measured `{rows:21, duplicateRows:21}`                                                       |
| F7  | P2  | Home "The practice" is four identical icon+heading+text cards — the generic card grid the craft floor refuses.                                                                                                                                                  | `components/CapabilityIndex/CapabilityIndex.tsx:41-58`                                                                                    |
| F8  | P2  | Home "Latest dispatches" is three equal cards after a 4-card grid: no lead, no hierarchy.                                                                                                                                                                       | `app/page.tsx:100-104`                                                                                                                     |
| F9  | P3  | Detail pages label their second section `III / Next` (page has two sections).                                                                                                                                                                                    | `app/projects/entry/[slug]/page.tsx:91`                                                                                                    |
| F10 | P3  | Display tracking is below the skill's -0.04em floor: `display-xl` -0.055em, `h1` -0.05em, base -0.045em.                                                                                                                                                          | `tailwind.config.js:6,69,80`                                                                                                               |
| F11 | P3  | Hero counter row is the "big number + small label" template.                                                                                                                                                                                                     | `components/HomeHero/HomeHero.tsx:57-74`                                                                                                   |
| F12 | P3  | Form caret and prose list markers keep browser defaults.                                                                                                                                                                                                         | `styles/tailwind.css` (only `::selection` + scrollbar themed)                                                                             |

Zero horizontal overflow at 320px on `/`, `/projects`, `/blog`, `/about`,
`/contact`, `/tags` (measured 0px).

## Approach

1. Fix the broken intent first (F1/F2) and pin it with a regression test.
2. Make the taxonomy legible (F3/F4): one label per concept, camelCase split for
   display, alphabetical grouped index, and a redirect for the retired slug.
3. Give the home page hierarchy (F5/F7/F8/F11): a data-bearing status bar in the
   terminal window, an index-style capability ledger, and one lead dispatch.
4. Remove duplicated affordances (F6) and duplicated labels (F5).
5. Close the craft-floor gaps (F9/F10/F12).

## Slices

- [x] S1 navigation: `id="selected-work"`, `scroll-mt-20`, regression e2e
      (`e2e/anchors.spec.ts`, 2/2 green).
- [x] S2 taxonomy: `formatTagLabel`, camel-aware keys, legacy-slug redirect,
      A–Z grouped two-column index, unit tests. Live: 86 → 85 tags, one
      `Artificial Intelligence`, `/tags/artificialintelligence` → 308.
- [x] S3 home composition: terminal status bar, capability ledger, lead
      dispatch, data-bearing eyebrows.
- [x] S4 archive rows: one affordance per row (archive + dispatch rows).
- [x] S5 craft: tracking floor, caret/markers, section numerals, contact label.
- [x] S6 docs + screenshots + full gate run. DESIGN.md, README screenshots,
      typecheck/lint/prettier/contrast/tokens/images/fonts/build/jest/Storybook
      and Playwright all green; committed 24d47f0, pushed to PR #10.

## Success criteria

- Clicking `View selected work` scrolls so the section rule is visible below the
  65px sticky header; `/projects` behaves identically.
- `/tags` renders one `Artificial Intelligence` tag, alphabetical sections, two
  columns at ≥1024px, no camelCase labels; `/tags/artificialintelligence`
  redirects permanently.
- Home: hero keeps real counts (21 case files, 03 dispatches, 2010—2021) in the
  terminal window; practice is a rule-separated ledger, not four cards; journal
  leads with one dispatch.
- Archive rows expose one link each; focusable count on `/projects` drops by 21.
- Gates: typecheck, lint 0 errors, prettier, contrast 36/36, design-tokens,
  images, fonts, Jest, build, Storybook, Chromium Playwright all pass.

## Non-goals

- No route, slug (except the one retired tag slug), metadata, canonical URL,
  legal copy, privacy posture, or contact-action change.
- No new dependency, font, raster asset, or animation.
- No merge or deployment of PR #10.
