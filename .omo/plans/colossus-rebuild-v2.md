# COLOSSUS v2 — Editorial case-file rebuild

## TL;DR

The rejected poster-style COLOSSUS was rebuilt as an editorial case-file portfolio:
Instrument Serif display type, a portrait-led home hero, project-specific SVG covers,
compact listing headers, one lead case file, editorial article rows, and Roman/pixel
marks reduced to precise archival accents. Routes, content facts, the contact server
action, legal copy, metadata, privacy posture, and all gates are preserved.

## Status

Complete locally on branch `feat/colossus-rework`; ready to update PR #10. No merge or
deployment performed.

## Success criteria and proof

- Home H1 is the person and the first viewport contains portrait, positioning copy,
  actions, archive counts, and the ticker. Proven by `public/img/screenshots/home.webp`
  and 1280/375 Playwright captures.
- Listing pages are content-first. `/projects` shows the subject index and the first
  selected case file within 800px; `/blog` shows the first dispatch within 800px.
- Featured cards carry project-specific covers (payment rails, drone scan, skin
  marketplace, refund ticket) and real project copy. Proven by `ProjectCover.test.tsx`
  and the projects e2e.
- Home practice band is a four-column capability index plus a recurring-tools ledger;
  the old icon grid is gone.
- Display type is sentence-case Instrument Serif; Silkscreen is metadata only. The font
  gate reports 2 families / 21.3 KiB first load.
- Home DOM budget: 573 dev nodes against 594; no horizontal overflow at 375.
- Local gates: typecheck, lint (0 errors), Prettier, contrast, design tokens, images,
  fonts, Jest, build, Storybook build + smoke, full Chromium Playwright (98/98), and
  bundle budget all pass. Lighthouse was re-run on a host at load average 21–27 with
  concurrent Gradle jobs; results are recorded in evidence and are not treated as a
  code signal until re-read on a quiet host.

## Slices completed

1. Typography, tokens, font gate, visual-language contract.
2. Shared primitives: Card, Button (including night secondary), Header, Footer,
   PageHero compact mode, SectionHeading rhythm.
3. ProjectCover and MonumentCard redesign, lead variant, archive rows.
4. HomeHero + home page hierarchy + CapabilityIndex.
5. Projects/Blog content-first indexes; ArticleCard editorial variants.
6. Project detail, About, Contact, Tags, 404 type and surface pass.
7. Tests, screenshots, docs, ADR amendment, evidence, commit/push/CI.

## Not touched

Content facts, routes, metadata URLs/canonical URLs, Resend server action, legal copy,
privacy posture, dependency set, single light mode.
