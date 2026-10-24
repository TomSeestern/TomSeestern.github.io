# COLOSSUS final verification — 2026-10-20

Commit: `b2c0d69` (rebased branch head; design commit `67a133b`)\
PR: [`TomSegbers/tomsegbers-de#10`](http://192.168.7.69:3002/TomSegbers/tomsegbers-de/pulls/10)\
Branch: `feat/colossus-rework` (rebased onto `main` `1fc34bb`)\
Runtime: Node v22.23.1, pnpm 10.15.1 (`nix develop`)\
Production server: port 3055 (port 3000 is occupied by an unrelated app)

## Gate summary — every CI command exits 0

| Gate | Command | Result |
| --- | --- | --- |
| TypeScript | `pnpm typecheck` | PASS (exit 0) |
| ESLint | `pnpm lint` | PASS (0 errors, 107 warnings; warnings only) |
| Prettier | `pnpm prettier` | PASS — all matched files formatted |
| Contrast | `pnpm contrast` | PASS — 31 token pairs |
| Design tokens | `pnpm design-tokens` | PASS — 126 files, no legacy token/dark/raw-hex/retired face |
| Design-token self-test | `node scripts/check-design-tokens.mjs --self-test` | PASS — bad fixture rejected, clean fixture accepted |
| Images | `pnpm images` | PASS — 102 images within the 200 KB / 50 KB budgets |
| Fonts | `pnpm fonts` | PASS — exactly Cinzel + Silkscreen, 31.9 KiB first-load / 100 KiB |
| Unit + component | `pnpm test` | PASS — 42 suites, 201 tests |
| Production build | `pnpm build` | PASS — 127 static pages, all 21 projects / 3 posts / 86 tag paths |
| Storybook build | `pnpm build-storybook --quiet` | PASS |
| Storybook smoke | exact CI `concurrently` + `test-storybook` step | PASS — 13 suites, 16 tests |
| Browser e2e | `pnpm exec playwright test --project=chromium` | PASS — 98/98, zero failures |
| Lighthouse | `PORT=3055 pnpm lighthouse` | PASS — all 7 routes, all 3 assertions |
| Bundle | `node report-bundle-size.js` + `node scripts/check-bundle-budget.mjs` | PASS — 18 entries, shared 102,248 B gzip |

### Axe / accessibility

- `e2e/a11y.spec.ts`: 12/12 tests pass (allowlist guard + 11 route scans).
- Serious/critical allowlist is empty (`e2e/fixtures/a11y-known-violations.ts`).
- `e2e/dark-mode.spec.ts` adds three axe color-contrast scans; all pass.
- Keyboard, focus-ring, touch-target, reduced-motion, heading, and legal-copy checks are covered by the 98-test browser suite.

### PR CI on `b2c0d69`

The branch was rebased onto `main` `1fc34bb` after main gained a screenshot-only
commit, then force-pushed with lease. PR #10 is `mergeable: true` and all three
required workflows are green:

- Check — success in 3m53s (`actions/runs/99`)
- Playwright Tests — success in 3m23s (`actions/runs/101`)
- Lighthouse CI — success in 7m36s (`actions/runs/100`)

The first Lighthouse run on the pre-rebase head failed because the shared runner
had an unrelated service on port 3000; `/` was measured from that service and
`/about` returned 404. `lighthouse.yml` now sets `PORT=3055`, so `next start` and
the configured `PUBLIC_ROUTES` use the dedicated port.

### Bundle numbers

Shared first-load: **102,248 B gzip** (limit 130 KB). Home route: **8,746 B**;
projects archive: **3,537 B**; blog index: **3,537 B**; contact: **9,617 B**;
about: **5,686 B**; project detail: **35,308 B**; blog detail: **34,956 B**;
layout chunk: **44,370 B**. Baseline file:
`tests/budgets/bundle-baseline.json`; log:
`.omo/evidence/colossus-rework/t24-bundle-check-final.log`.

### Lighthouse medians — 3 runs per route

| Route | LCP | CLS | TBT |
| --- | ---: | ---: | ---: |
| `/` | 2108.2 ms | 0.000 | 80.0 ms |
| `/about` | 2181.2 ms | 0.000 | 32.0 ms |
| `/blog` | 1952.4 ms | 0.000 | 57.0 ms |
| `/blog/entry/2019-ebeltoft-cheesecake-recipe` | 2030.7 ms | 0.000 | 30.5 ms |
| `/projects` | 2104.2 ms | 0.000 | 63.0 ms |
| `/projects/entry/2020-soudest-backend-nodejs` | 2213.4 ms | 0.000 | 29.5 ms |
| `/contact` | 1954.4 ms | 0.000 | 54.0 ms |

All budgets hold: LCP ≤ 2500 ms, CLS ≤ 0.1, TBT ≤ 200 ms. Log:
`.omo/evidence/colossus-rework/t24-lighthouse-final-2.log`; medians:
`t24-lighthouse-medians.txt`.

Host-variance note: the first T24 Lighthouse attempt (load average 14.97)
reported `/about` TBT values 43.5 / 989.5 / 1117.0 ms, a median failure caused by
shared-host scheduling. The retry at load average 2.11 passed all seven routes.
No Lighthouse threshold or budget was changed. The earlier T22 pass and this
final pass are the authoritative runs.

## Manual QA — PASS

Log: `.omo/evidence/colossus-rework/t24-manual-qa.log`.

- Keyboard-only journey: `/` → `/projects` → project detail → `/blog` → post
  detail → `/contact`; all navigation completed with Tab/Enter.
- Contact submit with `E2E_CONTACT_FORM_SUCCESS=true`: success Alert
  “Email sent successfully.” and `Done` button visible.
- Mobile menu: opens with Enter, closes with Escape.
- `prefers-reduced-motion: reduce`: ticker `animationName` is `none`.
- No horizontal overflow at 375 / 768 / 1280 across `/`, `/projects`, `/blog`,
  `/contact`, `/about`, `/tags`, `/impressum`, `/datenschutz`.
- 404 route returns HTTP 404 with H1 `404` and H2 `Lost in the Forum`.
- Legal pages render their `#main-content` copy and H1.
- Canonical/`og:url` and the 1200×630 OG image resolve on `/`, `/about`,
  `/projects`, `/blog`, `/contact`.
- No browser console errors or page errors during manual QA (the expected 404
  resource error on the 404 route is filtered as the assertion itself).

### Bug found and fixed during T24

`/datenschutz` overflowed at 375 px: the single German H1 (“Datenschutzerklärung”)
rendered 562 px wide, and one H2 also exceeded the 343 px prose column.
Fix: legal pages now declare `lang="de"`, use the mobile `text-h2-sm` display
size, enable `hyphens-auto`/`break-words` on the prose wrapper and heading, and
the responsive e2e route table now includes `/datenschutz` and `/impressum` as a
regression check. Final 375 px document widths are exactly 375 px.

## Screenshots

- README showcase (1280): `public/img/screenshots/home.webp`,
  `projects.webp`, `blog.webp`, `contact.webp`.
- Visual QA (375 and 768 full-page):
  `.omo/evidence/colossus-rework/t23-home-{375,768}.png`,
  `t23-projects-{375,768}.png`, `t23-blog-{375,768}.png`,
  `t23-contact-{375,768}.png`.
- No Next.js dev indicator appears in the showcase captures.

## Evidence index

Primary logs in `.omo/evidence/colossus-rework/`:

- `t24-typecheck-final.log`, `t24-lint-final.log`, `t24-prettier-final.log`
- `t24-contrast-final.log`, `t24-design-tokens-final.log`, `t24-images-final.log`
- `t24-fonts-final.log`, `t24-jest-final.log`, `t24-build-final.log`
- `t24-storybook-build-final.log`, `t24-storybook-smoke-final.log`
- `t24-e2e-final.log`, `t24-lighthouse-final-2.log`, `t24-lighthouse-medians.txt`
- `t24-bundle-final.json`, `t24-bundle-check-final.log`
- `t24-manual-qa.log`, `t24-legal-overflow-fix.txt`
- `performance.md` (T22 baseline/final comparison)
