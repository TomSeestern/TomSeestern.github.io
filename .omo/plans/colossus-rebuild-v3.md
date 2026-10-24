# COLOSSUS v3 — terminal rebuild

## TL;DR

The v2 editorial pass read as a themed magazine. v3 is a decisive terminal-first
rebuild: near-black surfaces, Geist/Geist Mono, one warm accent, a real case-file
window in the home hero, equal project cards, a capability grid, and no ticker.
Pixel/Roman references survive as a pixel column, deterministic glyphs, Roman
numeral section indices, and the arch monogram. Routes, content facts, metadata,
the contact server action, legal copy, privacy posture, and gates are preserved.

## Status

Complete locally on `feat/colossus-rework`, ready to update PR #10. No merge or
deployment. Local Lighthouse is noisy because the self-hosted runner host is
contended (load 10–36); all other gates are green. CI is the authoritative
Lighthouse read.

## Success criteria and proof

- Home H1 is the proposition (`Systems that hold.`), followed by the terminal
  window with real profile/archive data and a real selected case file.
- Home renders four equal project cards, four capability cards with pixel glyphs,
  and three dispatch cards. The retired ticker/portrait-led hero is gone.
- `/projects` has a compact hero, 12-tag subject strip, 2×2 selected cards, and
  the complete year-grouped archive.
- `/blog` has a featured dispatch card and rule-separated rows.
- `/about` keeps the compact portrait (pre-grayscaled WebP), timeline, stack,
  labelled illustrative examples, and closing CTA.
- `/contact` keeps every label/error/success contract and the Resend server
  action; the submit button is disabled while sending.
- 404 uses the pixel column and `Page not found`.
- Two families only: Geist interface/display + Geist Mono labels. Both are
  `display: optional`; Geist is the only critical preload (28.6 KiB); Mono is
  deferred. All emitted subsets total 143 KiB.
- Home DOM measured 629 dev nodes against a 650 ceiling.
- All non-Lighthouse gates pass locally; full Chromium Playwright 98/98.

## Slices completed

1. Dark tokens/type scale, Geist fonts, dark shell, terminal textures/focus.
2. Shared primitives: Button, Card, Section, Header, Footer, PageHero.
3. PixelArt primitives (PixelColumn, PixelGlyph) and arch brand mark.
4. HomeHero + home page; projects/blog/about/contact/tags/detail/404 restyle.
5. ProjectCover monochrome/recoloured plates; archive rows and dossiers.
6. Tests/e2e copy updates, contrast manifest, font gate, brand assets,
   screenshots, DESIGN/README/ADR/AGENTS updates.
7. Evidence, commit/push, PR #10 update, CI read.

## Not touched

Routes, factual content, metadata URLs/canonical URLs, contact server action,
legal copy, privacy posture, dependency set. No merge or deploy.
