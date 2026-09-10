# 2026 Refresh — Baseline (T02)

**Captured:** 2026-09-10 ~18:01–18:45 UTC
**Revision measured:** `74689e8` (working tree clean except `.omo/boulder.json`)
**Concurrent note:** HEAD moved to `e3e8de5` at 18:40:28Z (`fix(lint): resolve react-hooks plugin conflict from duplicate eslint config`) — touches only `package.json` + `pnpm-lock.yaml`; no runtime/route code. The served production build was produced at 18:01Z from `74689e8`, so all measurements reflect that revision.
**Purpose:** "Before" snapshot for restyle budget gates T03/T05.

---

## 1. Bundle baseline

Source: `node report-bundle-size.js` → `.next/analyze/__bundle_analysis.json`
Saved to: `tests/budgets/bundle-baseline.json` and `.omo/evidence/baseline/bundle-74689e8.json`

Global (shared first-load JS): **gzip 102,253 B (~102 kB)** / raw 350,080 B

| Route key | gzip (B) | raw (B) |
|---|---|---|
| `__global` | 102,253 | 350,080 |
| `/page` (home) | 103,734 | 381,728 |
| `/projects/page` | 103,736 | 381,730 |
| `/blog/page` | 94,550 | 355,427 |
| `/blog/entry/[slug]/page` | 92,496 | 349,757 |
| `/projects/entry/[slug]/page` | 92,495 | 349,756 |
| `/layout` | 44,105 | 219,765 |
| `/contact/page` | 18,056 | 67,573 |
| `/about/page` | 5,496 | 14,543 |
| `/not-found`, `/_not-found/page`, `/api/health/route`, `/robots.txt/route`, `/sitemap.xml/route` | 133 each | 146 each |

Note: `report-bundle-size.js` only emits a JSON summary (the `ANALYZE=true` bundle-analyzer treemap HTML/JSON is not written to a stable path in this setup); the JSON above is the canonical analyzer artifact.

## 2. Lighthouse baseline

Method: production build served via `pnpm start` (port 3000); mobile formFactor, `throttlingMethod=simulate` (**CPU 4x slowdown**), cold (fresh Chrome user-data dir per run); Lighthouse 13.4.1; Chromium 149. Single run per route (not a 3–5 run median — see Issues).

Raw JSON: `.omo/evidence/baseline/lighthouse/<name>.json`

| Route | LCP (ms) | CLS | TBT (ms) | Perf | A11y | Best-Practices | SEO |
|---|---|---|---|---|---|---|---|
| `/` (home) | 2830 | 0 | 126 | 0.94 | 1.00 | 1.00 | 0.92 |
| `/about` | 2384 | 0 | 38 | 0.98 | 0.96 | 0.96 | 1.00 |
| `/blog` | 2489 | 0 | 86 | 0.97 | 1.00 | 1.00 | 0.92 |
| `/blog/entry/2019-ebeltoft-cheesecake-recipe` | 3562 | 0.0375 | 113 | 0.89 | 1.00 | 0.96 | 1.00 |
| `/projects` | 2588 | 0 | 85 | 0.97 | 0.96 | 1.00 | 0.92 |
| `/projects/entry/2020-soudest-backend-nodejs` | 2127 | 0 | 124 | 0.98 | 1.00 | 1.00 | 1.00 |
| `/contact` | 2256 | 0 | 115 | 0.98 | 1.00 | 1.00 | 1.00 |

Worst LCP: blog detail (3562 ms) — contains the corpus's only remote image
(`plantoeat.s3.amazonaws.com`). Only non-zero CLS: blog detail (0.0375).

## 3. axe baseline

Method: axe-core 4.10.3 injected into the served production build via Playwright
(system Chromium), each route scanned twice — `localStorage["flowbite-theme-mode"]="dark"` and `="light"`.
Raw: `.omo/evidence/baseline/axe-baseline.json`

| Route | dark violations | light violations |
|---|---|---|
| `/` (home) | `color-contrast` ×9 | none |
| `/about` | none | `color-contrast` ×2 |
| `/blog` | `color-contrast` ×6 | none |
| `/blog/entry/2019-ebeltoft-cheesecake-recipe` | none | none |
| `/projects` | `color-contrast` ×21 | none |
| `/projects/entry/2020-soudest-backend-nodejs` | none | none |
| `/contact` | none | none |

Every current violation is `color-contrast`; no other axe rule fires.
Dark total = 36 nodes; light total = 2 nodes.

## 4. Current state notes

- **Theme default:** `app/layout.tsx:35` hardcodes `dark` on `<html>`, but the inline
  script at `app/layout.tsx:48-69` runs before paint and overrides it from
  `localStorage["flowbite-theme-mode"]`, falling back to `prefers-color-scheme`.
  In a fresh headless browser (system prefers light, no stored value) the hardcoded
  `dark` is **removed** → effective initial render is **light**. D13 (single light mode)
  will make this deterministic. Baseline records both schemes.
- **Marquee card count:** rendered DOM `animate-marquee` = 21 + `animate-marquee2` = 21
  → **42 cards** (21 projects ×2). Confirmed live, matches `app/page.tsx:110-141`.
- **Project count:** 21 (`content/projects/*.md`).
- **Blog post count:** 3 (`content/blog/*.md`).
- **Build route count:** `next build` reports `✓ Generating static pages (38/38)`;
  13 route patterns in the table (7 public routes + icon/robots/sitemap/not-found/api).
  The plan's expected "36" does **not** match the observed 38 — recorded as-is, see Issues.

## 5. Artifacts

| Artifact | Path |
|---|---|
| Bundle baseline (committed) | `tests/budgets/bundle-baseline.json` |
| Bundle evidence | `.omo/evidence/baseline/bundle-74689e8.json` |
| Bundle stdout | `.omo/evidence/baseline/bundle-stdout-74689e8.json` |
| Build log | `.omo/evidence/baseline/build-74689e8.log` |
| Lighthouse raw | `.omo/evidence/baseline/lighthouse/*.json` (7 files) |
| axe raw | `.omo/evidence/baseline/axe-baseline.json` |
| Evidence ledger | `.omo/evidence/task-T02-2026-refresh-restyle.txt` |
