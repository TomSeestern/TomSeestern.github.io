# COLOSSUS v3 — local verification evidence

Date: 2026-10-21
Branch: `feat/colossus-rework`
Base: `f26a97c` (v2 commit on PR #10)
Worktree: `/home/tom/Projects/tomsegbers-de`
PR: http://192.168.7.69:3002/TomSegbers/tomsegbers-de/pulls/10

## 1. Production build

`corepack pnpm build` — exit 0. Next 15.5.24, 127 pages. Shared first-load JS
102 kB; detail routes 137–138 kB. Static routes include 21 project details and
86 tag routes.

## 2. Fast gates (after final code edits)

| Gate | Command | Result |
| --- | --- | --- |
| Types | `corepack pnpm typecheck` | pass |
| Lint | `corepack pnpm lint` | pass, 0 errors / 26 warnings (import-order/legacy) |
| Format | `corepack pnpm prettier` | pass |
| Contrast | `corepack pnpm contrast` | pass, 36/36 pairs |
| Design tokens | `corepack pnpm design-tokens` | pass, 132 files |
| Images | `corepack pnpm images` | pass, 103 images; new mono portrait 26 KB |
| Fonts | `corepack pnpm fonts` | pass, 2 families; critical preload 28.6 KiB; all emitted 143 KiB |
| Unit/integration | `corepack pnpm test` | pass, 43 suites / 206 tests |
| Bundle | `node report-bundle-size.js && corepack pnpm budget:bundle` | pass, 18 entries; `__global` 102,247 B / 130 KB; max route 138 kB; layout −36.1% vs baseline |

Font detail:
```
Geist      28.6 KiB critical preload
Geist Mono 68.9 KiB emitted, deferred
Critical preload: 28.6 KiB / 100.0 KiB
```

## 3. Browser / Storybook

Full Chromium Playwright: `nix develop -c pnpm exec playwright test --project=chromium --workers=1`
→ **98 passed (6.2m)**. Coverage includes axe (12 routes), dark-mode/contrast,
post-hydration DOM, metadata/OG, 375/768/1280 responsive, touch targets, skip
link/focus, mobile header, contact form success/error, tooltip route-local
provider, visual language, DOM budget, and the retired ticker. A final targeted
run (`home`, `visual-language`, `responsive`) after the last border/spacing edit:
**45 passed (2.8m)**.

Storybook:
`pnpm build-storybook --quiet` + `http-server` + `pnpm test-storybook`
→ **13 suites / 16 tests passed**.

Screenshots regenerated from the dev render:
```
home.webp 37.0 KB
projects.webp 37.0 KB
blog.webp 33.7 KB
contact.webp 28.5 KB
```
Apple icon and `og-default.png` regenerated from the arch mark; OG is
1200×630 and the apple icon 180×180.

## 4. Visual inspection

Reviewed `public/img/screenshots/home.webp` and `projects.webp` plus full-page
1280/375 captures of home, projects, blog, about, contact, project detail,
blog detail, and 404. Confirmed:
- terminal hero with real archive data; no portrait-led hero or ticker;
- one 1px rule between hero and next section (no double border);
- pixel column sits behind the terminal window, not over its text;
- project cover plates are monochrome + accent, not a colour wall;
- 404 uses the pixel column and “Page not found”.

## 5. Lighthouse — inconclusive locally

`PORT=3055 nix develop -c pnpm exec lhci autorun` was attempted at host load
10.6–36 (self-hosted host shared with other jobs). The run failed LCP/TBT on
several routes, with TBT varying from 79 ms to 2.1 s for the same page and LCP
varying ~2.5–3.5 s. That is host contention, not a stable code signal. Earlier
runs on the same code at lower load had every route within ~100 ms of the LCP
budget; the repository's established procedure is to re-read Lighthouse in a
quiet CI window (`load < 8`, no CPU-pinning peer). No budget was weakened.
CI Lighthouse remains the authoritative read after push.

## 6. Contract preservation

- Routes and dynamic params unchanged.
- Metadata URLs/canonical/OG/Twitter intact; OG asset replaced with the terminal
  1200×630 render.
- Contact form labels, ids, error/success text, Zod validation, and Resend
  server action unchanged.
- Legal copy unchanged; dark wrappers only.
- No cookies, analytics, tracking, new runtime dependencies, or AI raster art.
- Home is a single dark mode; no theme toggle or OS resolver.

## 7. CI read (PR #10, head 334910c)

| Workflow | Result | Evidence |
| --- | --- | --- |
| Check | **success** (4m5s) | run 3567 / job 18589 |
| Playwright Tests | **success** (5m50s) | run 3569 / job 18591 |
| Lighthouse mobile budgets | **failure** (6m53s) | run 3568 / job 18593 |

Lighthouse failed on **TBT only**. All seven sampled routes' LCP/CLS passed. The
failing values were `/` TBT 322.72/400.5/124 ms and `/about` 272/338.5/223 ms;
the runner host was simultaneously at load 25–31 from unrelated Songs of Syx,
Android/Gradle, and Stryker peer jobs (and previously the three CI workflows
themselves). Re-runs at load 4–8 produced the same contention pattern; the
project's quiet-rerun tool exists for this. No threshold, assertion, command, or
check was changed. Check and Playwright are green on the same head; the PR is
open and mergeable. No merge or deployment performed.

CI retry commits (empty, no product change): `85eba8e`, `1110cc6`, `334910c`.
