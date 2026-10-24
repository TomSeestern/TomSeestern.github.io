# COLOSSUS baseline — 2026-10-20

- Commit: 80e0a7d
- Node: v22.23.1 (nix develop); pnpm 10.15.1
- Worktree: main
- Production server: port 3055 (`PORT=3055 pnpm start`); port 3000 was occupied by an unrelated app, so it was not used.
- Evidence log: `.omo/evidence/colossus-rework/baseline-gates.log`
- A11y log: `.omo/evidence/colossus-rework/baseline-a11y.log`

## Route inventory (12 captured routes)

`/`, `/about`, `/projects`, `/projects/entry/2020-soudest-backend-nodejs`,
`/blog`, `/blog/entry/2019-ebeltoft-cheesecake-recipe`, `/tags`,
`/tags/c-plus-plus`, `/contact`, `/impressum`, `/datenschutz`, and
`/__e2e_missing_static_route__` (404). Each route was captured at 375×812 and
1280×800: 24 PNGs in `.omo/evidence/colossus-rework/before/`.

## Static gates — all passed

| Gate | Result |
| --- | --- |
| `pnpm typecheck` | pass (exit 0) |
| `pnpm lint` | pass (exit 0; 48 warnings, 0 errors) |
| `pnpm prettier` | pass |
| `pnpm contrast` | pass (24 pairs) |
| `pnpm ornaments` | pass (110 files; old gate still active at baseline) |
| `pnpm images` | pass (101 images) |
| `pnpm test` | pass (23 suites, 163 tests) |
| `pnpm build` | pass (127 static pages; all 21 projects, 3 posts, 86 tag routes) |
| `pnpm fonts` | pass (Inter 47.3 KiB + Newsreader 23.4 KiB = 70.7 KiB first-load) |
| `pnpm exec playwright test e2e/a11y.spec.ts --project=chromium` | pass (12 tests) |

## Bundle baseline

`node report-bundle-size.js`:

- `__global`: 102,248 B gzip
- `/page`: 8,744 B; `/projects/page`: 25,628 B; `/blog/page`: 8,744 B;
  `/contact/page`: 9,015 B; `/about/page`: 5,500 B; `/layout`: 34,572 B
- `node scripts/check-bundle-budget.mjs`: PASS, 18 entries within budget.

Home DOM node count at 1280×800: **110**.

## Lighthouse baseline — host-contention caveat

Run with `PORT=3055 pnpm lighthouse` (7 routes × 3 runs, mobile profile).
The run did **not** exit 0 on this host: load average was ~32 on 22 cores.
Recorded negatives (median):

- `/blog`: TBT 1084.9 ms (limit 200)
- `/blog/entry/2019-ebeltoft-cheesecake-recipe`: LCP 2708.4 ms (limit 2500), TBT 264.5 ms
- `/projects`: TBT 903.5 ms
- `/contact`: TBT 945.0 ms

The existing methodology decision (`.omo/decisions/2026-09-12-f5-lighthouse-methodology.md`)
says a contended-host red is not proof of regression. T22 re-runs Lighthouse as
the authoritative gate after the rework. This baseline is recorded for trend
context, not treated as a code failure.

## Legal text snapshots

Normalized `#main-content` text for `/impressum` and `/datenschutz` is stored in
`.omo/evidence/colossus-rework/before/legal.json`. T17 compares the after state
against this file.

## Design-system conflict

The current `DESIGN.md:109-111` and `scripts/check-ornaments.mjs` forbid the
requested Roman/pixel direction. **ornaments: superseded** by the COLOSSUS plan;
the old gate is removed in T3 and replaced by `check-design-tokens` in T21.

No source files were changed in T1.
