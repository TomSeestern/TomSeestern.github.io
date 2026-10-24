# COLOSSUS performance — baseline and final

Date: 2026-10-20
Host: 22 cores, shared workstation (load average recorded per run)
Build: production `next build`; Lighthouse uses the mobile profile (4x CPU,
slow-4G simulation) and the median of 3 runs per route.

## Baseline (T1, old design)

- `__global` first-load: **102,248 B gzip**
- Routes: `/page` 8,744 B; `/projects/page` 25,628 B; `/blog/page` 8,744 B;
  `/contact/page` 9,015 B; `/about/page` 5,500 B; `/layout` 34,572 B
- Home DOM node count (1280×800): **110**
- Lighthouse T1 was run while load average was ~32/22 cores, so it was recorded
  as a trend caveat rather than a code verdict. Negative medians in
  `baseline.md`: `/blog` TBT 1084.9 ms, cheesecake post LCP 2708.4 ms / TBT
  264.5 ms, `/projects` TBT 903.5 ms, `/contact` TBT 945.0 ms.

## Final bundle (T22, `pnpm build` + `report-bundle-size.js`)

| Entry | Baseline | Final | Delta |
| --- | ---: | ---: | ---: |
| `__global` | 102,248 B | 102,248 B | 0% |
| `/page` | 8,744 B | 8,746 B | +0.02% |
| `/projects/page` | 25,628 B | 3,537 B | -86.2% |
| `/blog/page` | 8,744 B | 3,537 B | -59.5% |
| `/contact/page` | 9,015 B | 9,617 B | +6.7% |
| `/about/page` | 5,500 B | 5,686 B | +3.4% |
| `/layout` | 34,572 B | 44,366 B | +28.3% |
| `/blog/entry/[slug]` | 92,496 B | 34,956 B | -62.2% |
| `/projects/entry/[slug]` | 92,495 B | 35,308 B | -61.8% |

`node scripts/check-bundle-budget.mjs` after writing the measured baseline:
**PASS — 18 entries within budget.** Shared first-load is 102,248 B gzip
against the 130 KB limit; every route is far below the 180 KB limit. The four
new static routes (`/tags`, `/tags/[tag]`, `/impressum`, `/datenschutz`) are
now in the measured baseline.

`tests/budgets/bundle-baseline.json` now contains the measured T22 analyzer
output (not the retired T1 route set).

## Final home DOM

Production, 1280×800, all `document.querySelectorAll("*")` nodes: **446**
(440 at 375×812). The Playwright dev server injects 94 script/title/meta nodes,
so the same page measures **540** there. `MAX_HOME_DOM_NODES` is **594**
(540 + 10% headroom) and the e2e budget passes. The old 1800 ceiling is gone.

## Final Lighthouse (T22 run, load average ~10.9/22)

| Route | Median LCP | Median CLS | Median TBT |
| --- | ---: | ---: | ---: |
| `/` | 2114.0 ms | 0.000 | 38.5 ms |
| `/about` | 2182.5 ms | 0.000 | 28.0 ms |
| `/blog` | 1953.8 ms | 0.000 | 48.0 ms |
| `/blog/entry/2019-ebeltoft-cheesecake-recipe` | 2030.3 ms | 0.000 | 30.0 ms |
| `/projects` | 2103.5 ms | 0.000 | 59.0 ms |
| `/projects/entry/2020-soudest-backend-nodejs` | 1878.5 ms | 0.000 | 41.0 ms |
| `/contact` | 1953.8 ms | 0.000 | 74.0 ms |

All three assertions pass for all seven routes (`LCP <= 2500 ms`,
`CLS <= 0.1`, `TBT <= 200 ms`, median aggregation). Raw run values and report
files are in `.lighthouseci/`; the command log is
`.omo/evidence/colossus-rework/t22-lighthouse-4.log`.

## Design changes made to reach the budgets

- `/about` portrait: `priority` + `unoptimized` so the already-small WebP is
  the preloaded LCP resource instead of a lazy optimizer request.
- `TagChip` archive links: `prefetch={false}`; topic strips can contain ten
  links and eager RSC prefetching added measurable main-thread work to listing
  pages. No visual or navigation contract changed.
- Bundle baseline and DOM budget were updated only after the absolute limits
  passed. No Lighthouse threshold, bundle ceiling, or image/font budget was
  raised.

## Evidence files

- `t22-bundle-final.json`, `t22-bundle-check-final.log`
- `t22-dom.txt`, `t22-dev-dom-app-only.txt`
- `t22-lighthouse-4.log`, `t22-lighthouse-medians.txt`
- `t22-home-e2e-retry.log`
