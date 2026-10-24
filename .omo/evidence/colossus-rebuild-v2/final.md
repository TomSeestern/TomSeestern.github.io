# COLOSSUS v2 — final verification evidence

Date: 2026-10-20
Branch: `feat/colossus-rework`
Base: `b2c0d69` (PR #10 head before rebuild)
Commit: `f26a97c`
PR: http://192.168.7.69:3002/TomSegbers/tomsegbers-de/pulls/10
Worktree: `/home/tom/Projects/tomsegbers-de`
Runner: local Nix dev shell; production Next.js server on 3030 for e2e/screenshots;
Lighthouse on 3055.

## 1. Production build

Command: `corepack pnpm build`
Result: exit 0. Static routes generated, including 21 project details and 86 tag routes.
First Load JS shared by all: 102 kB.

## 2. Fast gates

All commands run after the final code edits.

| Gate | Command | Result |
| --- | --- | --- |
| Types | `corepack pnpm typecheck` | pass, no output |
| Lint | `corepack pnpm lint` | pass, 0 errors / 67 pre-existing-style warnings |
| Format | `corepack pnpm prettier` | pass, “All matched files use Prettier code style!” |
| Contrast | `corepack pnpm contrast` | pass, 31/31 pairs |
| Design tokens | `corepack pnpm design-tokens` | pass, 129 files |
| Images | `corepack pnpm images` | pass, 102 images; largest 79.9 KB |
| Fonts | `corepack pnpm fonts` | pass, 2 families, 21.3 KiB first load |
| Unit/integration | `corepack pnpm test` | pass, 43 suites / 206 tests |
| Bundle | `node report-bundle-size.js && corepack pnpm budget:bundle` | pass, 18 entries; `__global` 102,247 B / 130 KB; no route >180 KB; max growth +1.7% (`/layout`) |

Font detail:
```
Instrument Serif  14.7 KiB
Silkscreen         6.6 KiB
First-load woff2: 21.3 KiB / 100.0 KiB
```

## 3. Browser / Storybook

Production server: `nix develop -c env E2E_CONTACT_FORM_SUCCESS=true pnpm exec next start -p 3030`.

Command: `nix develop -c corepack pnpm exec playwright test --project=chromium`
Result: **98 passed (14.0s)**.

Coverage includes:
- axe serious/critical allowlist on 12 route/scheme combinations;
- post-hydration DOM and metadata;
- 375/768/1280 responsive checks with no horizontal overflow;
- touch targets (44px primary, 24px WCAG 2.5.8 floor);
- keyboard skip link, CTA focus, mobile header disclosure, contact form success;
- visual-language contract (Instrument Serif, canvas shell, deterministic sigil);
- home DOM budget and ticker reduced-motion;
- project/blog detail discovery and breadcrumbs.

Storybook:
```
corepack pnpm build-storybook --quiet  -> exit 0
npx concurrently ... pnpm test-storybook
Test Suites: 13 passed, 13 total
Tests:       16 passed, 16 total
```

Screenshots regenerated from the production build:
```
nix develop -c env PORT=3030 corepack pnpm screenshots:update
Captured home.webp (46.7 KB) from /
Captured projects.webp (38.1 KB) from /projects
Captured blog.webp (29.8 KB) from /blog
Captured contact.webp (31.3 KB) from /contact
```

## 4. Visual inspection

Reviewed production captures at 1280×800 and full-page 1280/375 for `/`, `/projects`,
`/blog`, `/about`, `/contact`, project detail, blog detail, and 404. Confirmed:
- home first viewport contains the portrait, name, positioning, CTAs, counts, ticker;
- listings expose real rows inside the first 800px;
- project covers are distinct and legible;
- article rows are editorial, not boxed clones;
- mobile keeps the wordmark, menu, type hierarchy, and cards without overflow.

## 5. Lighthouse note

Command: `PORT=3055 nix develop -c pnpm lighthouse`

The host was under heavy concurrent load from unrelated Forgejo CI Gradle/Kotlin jobs
(`load average 21–27`, multiple Java processes at 100–290% CPU). First full run:
- `/about`: LCP median 2628.9 ms (budget 2500), TBT median 201 ms (budget 200)
- `/blog`: TBT median 249 ms
- blog detail: LCP 2595.9 ms, TBT 257.5 ms
- `/projects`: TBT median 255 ms
- project detail: LCP 2556.7 ms, TBT 859.7 ms (individual runs 777–926)
- `/` and `/contact`: passed.

This local attempt is not treated as a code signal while the host is at load 21–27.
The authoritative CI run on `f26a97c` passed the Lighthouse mobile budgets with no
threshold changes.

## 5a. CI on `f26a97c`

All three PR workflows succeeded:

- Check — success
- Playwright Tests — success
- Lighthouse mobile budgets — success

PR: http://192.168.7.69:3002/TomSegbers/tomsegbers-de/pulls/10

## 6. Residual state

- No merge, deploy, force-push, or dependency change.
- `.omo/` is git-ignored; source, docs, screenshots, and tests are committed.
- Token usage: not exposed by this runtime; no estimate recorded.
