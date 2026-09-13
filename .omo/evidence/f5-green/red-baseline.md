# F5 Lighthouse — RED baseline (CI-equivalent, quiet host)

- Date: 2026-09-13, host loadavg ~4, external Stryker job ended
- Tool: `pnpm exec lhci autorun` → Lighthouse 12.6.1, mobile, simulate throttling,
  median of 3 runs per route
- Command: `nix develop -c bash -c 'unset PNPM_HOME npm_config_prefix; export
  PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright; pnpm exec lhci autorun'`
- Exit: 1 (assertion failed)

## Assertions: 3 total, 3 failed — all LCP

| route | LCP median | samples | over budget |
|---|---:|---|---:|
| `/about` | 2517 | 2105, 2517, 2547 | +17 |
| `/blog/entry/2019-ebeltoft-cheesecake-recipe` | 2748 | 2258, 2748, 2755 | +248 |
| `/projects` | 2740 | 2735, 2740, 2959 | +240 |

Passing: `/` 2330, `/blog` 2256, soudest 2180, `/contact` 2330.
CLS and TBT pass on all 7 routes.

## LCP element per failing route
- `/about` — `<p class="text-xl font-medium leading-tight text-muted">` (text)
- `/projects` — `<p class="mt-4 text-center text-body-lg font-light text-muted sm:text-xl">` (intro paragraph)
- cheesecake — `<img src="/img/cheesecake-ebeltoft.webp" alt="Cheesecake">` (93,924 B)

## Universal lever
`render-blocking-resources` score 0 on ALL routes:
`35b48f3d4359e208.css` 136,640 B + `c678465b2b451b26.css` 3,375 B, 302 ms wasted.

## Artifacts
- `.omo/evidence/f5-green/red-baseline-assertions.json` — raw assertion results
- `/tmp/opencode/lhci-red-baseline/` — full 21 LHR copy (transient)
