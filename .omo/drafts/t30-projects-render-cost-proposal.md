# T30 proposal — `/projects` critical-render cost (pre-existing)

- **Date:** 2026-09-13
- **Status:** PROPOSAL — not applied (F5 decision forbids product change until a valid reading)
- **Owner:** unassigned (was T30, re-scoped from "fix LCP" to "reduce render cost")
- **Depends:** one VALID `/projects` Arm A reading (`bi ≥ 2510`)
- **Related:** `.omo/decisions/2026-09-13-f5-pre-existing-lcp-debt.md`

## The bottleneck, measured

`/projects` is the heaviest route in the build:

| prerendered HTML | bytes |
|---|---:|
| `/projects` | **215,750** |
| `/` (home) | 57,154 |
| `/blog` | 44,045 |

Element census of the prerendered `/projects` HTML:

```
226 <div>   116 <img>   79 <a>   33 <span>   24 <p>   21 <h3>
```

The `116 <img>` are the driver:

- **112 technology icons** — 21 project cards × 5.3 average icons (max 8), each
  a separate `<img className="h-8 w-auto object-contain">` wrapped in a
  `Tooltip` + hover `<div>` (`components/ProjectTeaser/ProjectTeaser.tsx:72-83`).
- 22 arrow-right icons (one per card's "Learn more", `:108`).
- 2 chrome images (brand mark, etc.).

Each icon is: an `<img>` → wrapper `<div>` → Radix `Tooltip` trigger (which adds
a button/element + handlers) → plus the Radix tooltip machinery per node. So
~112 icons expand into several hundred DOM nodes and a large tooltip surface.

**This is pre-existing.** `ProjectTeaser`'s icon grid and `getIconPath`
(`lib/icon-map.ts`) predate the restyle; T21 only swapped some Flowbite
primitives. The restyle added no icons to `/projects`.

## Why it matters for LCP

LCP on `/projects` is render-bound, not network-bound: `server-response-time`
is single-digit ms, FCP is ~910 ms, but LCP lands 2588–4300 ms. A large DOM with
many small images and per-icon tooltip handlers delays the largest paint. The
baseline (pre-restyle, valid host) already measured **2588 ms** — over the
2500 ms budget — so this debt is not a restyle regression, but it is real.

## Candidate fixes (ordered by expected impact / risk)

1. **Cap icons rendered per card** (e.g. show first 4, then "+2" chip).
   - Impact: ~112 → ~84 icons; smaller DOM, fewer tooltips.
   - Risk: LOW — presentation-only; a `technologies.slice(0, 4)` + overflow badge.
   - But changes visual content → needs Tom's call (content/UX).

2. **Inline the icons as a single SVG sprite / `<use>` references.**
   - Impact: replaces N `<img>` requests with one cached sprite; fewer nodes.
   - Risk: MEDIUM — touches `icon-map.ts` + `ProjectTeaser`; needs axe/e2e re-run.

3. **`content-visibility: auto` + `contain-intrinsic-size` on card containers.**
   - Impact: skips off-screen card render work (below-fold 21 cards).
   - Risk: LOW-MEDIUM — can affect scroll-anchoring / CLS; must verify CLS stays 0.
   - This was the earlier lead candidate.

4. **Render tech icons as text chips instead of images.**
   - Impact: removes ~112 `<img>` entirely.
   - Risk: HIGH — large visual change; contradicts the current design language.

5. **Defer/paginate the archive** (show N cards, "load more").
   - Impact: largest reduction (fewer cards in initial HTML).
   - Risk: LOW technically, but a product/IA decision → Tom.

## Recommendation

- **Do nothing until the valid reading exists.** If Arm A shows `/projects`
  LCP **< 2500 ms** at `bi ≥ 2510`, no fix is needed and this proposal is moot.
- If it shows **≥ 2500 ms**, prefer **#3** (`content-visibility`) first: it is
  the smallest diff, does not change visible content, and targets exactly the
  below-fold cost. Verify LCP **and** CLS (must stay 0.000) **and** axe/e2e after.
- **#1** and **#5** are content/UX decisions for Tom, not pure engineering.
- Any fix must be a **separate, atomic commit** with its own evidence, and must
  **not** weaken the 2500/0.1/200 budgets (R39.5: do not mix refactor with
  behaviour change; R6.3: add a regression check).

## Evidence

- `.next/server/app/{projects,index,blog}.html` byte sizes (measured 2026-09-13).
- Element census: `grep -oE '<(img|div|...)' .next/server/app/projects.html | sort | uniq -c`.
- Icon counts from `content/projects/*.md` frontmatter (112 total, 21 cards).
- Source: `components/ProjectTeaser/ProjectTeaser.tsx:72-83`, `lib/icon-map.ts`.
- Baseline overage: `.omo/evidence/baseline/lighthouse/projects.json` (2588 ms,
  bi 2762, LH 13.4.1).
