# Decision: F5 Lighthouse — methodology confound, not a confirmed code regression

- **Date:** 2026-09-12
- **Status:** Accepted (supersedes F5 evidence §11 and §12 conclusions)
- **Deciders:** Tom (budget/scope owner), Atlas (orchestrator) — findings verified
  against raw artifacts
- **Scope:** `.omo/plans/2026-refresh-restyle.md` → Final gate F5; `.lighthouserc.js`;
  T02 baseline; F5 evidence ledger

## Context

F5's Lighthouse regression gate (`pnpm lighthouse` → `lhci autorun`, mobile, 4×
simulated CPU/network, median of 3 runs, 7 public routes) asserts absolute budgets
LCP ≤ 2500 ms, CLS ≤ 0.1, TBT ≤ 200 ms. Across six attempts on 2026-09-11/12 the
gate never went green. Two independent causes were established, only one of which
is a capacity problem:

1. **External host contention.** An unrelated project
   (`/home/tom/Projects/ohmyroadmap`) ran `stryker` mutation testing for 12 h+,
   holding ~20–24 runner processes at ~95–100 % CPU on all 22 logical cores.
   Lighthouse's 4× CPU multiplier compounds the oversubscription. Run 5 entered a
   verified-quiet window that re-saturated ~1 s after launch; run 6 entered a truly
   idle window (CPU 19 %, Stryker idle) and captured the first clean-host subset
   before re-saturation.

2. **A methodology confound that invalidates the baseline comparison.** The T02
   baseline was captured with **Lighthouse 13.4.1** (`npx -y lighthouse`; T02
   ledger L60/L70). The gate runs **Lighthouse 12.6.1** via `@lhci/cli@0.15.1`
   (bundled dependency; `pnpm-lock.yaml` L6228). Every "restyle vs baseline" delta
   in F5 §11–§12 crosses a Lighthouse major-version boundary. Additionally the **LCP
   element switched**: baseline measured the `h1` (380×158), the restyle measures
   the intro `p` (380×189), because that paragraph grew from `text-base font-normal`
   (1rem/400) to `text-body-lg font-light` (1.125rem/300). Cross-run comparisons
   were therefore scoring different elements with different tools.

The decisive evidence that the restyle is **not** a rendering regression: in the
*real, unthrottled* trace the restyle paints LCP at **190 ms vs the baseline's
303 ms — 113 ms faster** (`metrics.observedLargestContentfulPaint`). The failing
2923 ms figure is Lantern model output (simulated TTFB constant 453.7 + modeled
render delay 2469.0 = 2922.75); the real `server-response-time` is 8 ms. Fonts are
preloaded and off the critical path (both faces complete ≈43–47 ms), and the LCP
element is Inter body text, not the Newsreader display face — so the earlier
"font-swap bound" conclusion is withdrawn.

## Decision

1. **F5's LCP red is not accepted as a confirmed code regression.** It is a
   combination of (a) external host contention and (b) a measurement-methodology
   confound. Budgets stay **absolutely unchanged** (2500 / 0.1 / 200); this decision
   does not relax, reinterpret, or excuse a failure.
2. **No product-code change is authorised on the basis of the current F5 data.**
   Spending code effort now would be tuning against a confounded measurement.
3. **The next F5 action is a measurement, not a fix.** The decisive experiment is
   defined in `.omo/notepads/2026-refresh-restyle/problems.md` BLOCKER 1:
   - **Arm A (parity):** measure the *current* build with `npx -y lighthouse@13.4.1`
     on `/projects` and compare to the stored baseline (2588 ms). ≈2588 ⇒ the delta
     is tooling; ≈2920 ⇒ it is real code.
   - **Arm B (element):** under the gate's LH 12.6.1, A/B the intro paragraph
     reverted to `text-base font-normal` (mobile) and read the LCP element identity
     plus `lcp-phases-insight`.
   - Every future baseline comparison must record the `lighthouseVersion`.
4. **F5 remains `[~]`** (blocked) until a clean-host run establishes a trustworthy
   verdict. If Arm A shows the overage is real, escalate to Tom with the Oracle fix
   menu (paragraph revert / `content-visibility` on cards / `display:optional` /
   archive pagination [Tom] / Lighthouse-version parity).

## Consequences

- **Positive:** avoids a wasted code chase against a confounded metric; makes the
  baseline-vs-gate tool mismatch explicit and testable; preserves the budget as a
  meaningful absolute bar.
- **Negative / cost:** F5 cannot be marked complete until a quiet host is available
  *and* the parity experiment is run. The gate is currently un-runnable on this
  machine because of the external Stryker job.
- **Follow-up:** the plan's established median-of-runs requirement now also has a
  documented shared-runner variance envelope (`task-T05` evidence §8,
  `.lighthouserc.js` header).

## Supersedes

- `.omo/evidence/task-F5-2026-refresh-restyle.txt` §11 premise "same Lighthouse
  version/method" (false) and its "font-swap bound, not paint bound" conclusion.
- The run-6 notepad framing "REAL CODE FINDING" in
  `.omo/notepads/2026-refresh-restyle/problems.md`.

## Non-decisions (explicitly NOT changed)

- The 2500/0.1/200 budgets are unchanged.
- No blog route/slug change (R15.13).
- No new runtime dependency.
- `@lhci/cli` is not upgraded/re-pinned by this decision — that is a separate,
  deliberate process choice to be made only if/when Arm A demonstrates the version
  confound materially affects the verdict.

---

## Addendum (2026-09-12): version confound quantified on identical product code

A stronger control exists inside the existing artifacts, and it **partially corrects
Decision §3 above**. T02 (LH **13.4.1**, revision `74689e8`) and T05 (LH **12.6.1**,
revision `1b1062e`) bracket a window in which **no product code changed**:
`git diff --name-only 74689e8..1b1062e` lists only `e2e/`, `.forgejo/`, `scripts/`,
`package.json`, `pnpm-lock.yaml`, `tests/`, `.omo/` — **no `app/`, `components/`,
`lib/`, `styles/`, `public/`**. So T02 is a same-page LH13 reading and T05 a same-page
LH12 reading of identical product code. T05−T02 is a direct tool-bias estimate.

| route | T02 LH13.4.1 | T05 LH12.6.1 | tool bias (T05−T02) |
|---|---:|---:|---:|
| `/` | 2830 | 2589 | −241 |
| `/about` | 2384 | 2362 | −22 |
| **`/projects`** | **2588** | **2632** | **+44** |
| `/blog` | 2489 | 2105 | −384 |
| `/contact` | 2256 | 2255 | −1 |
| cheesecake | 3562 | 3690 | +128 |
| soudest | 2127 | 2104 | −23 |

Two consequences:

1. **The version confound is real and route-dependent** (−384 … +128, median −22).
   This justifies the "record the `lighthouseVersion` in every comparison" rule.
2. **On `/projects` it is small (+44 ms).** The tool change therefore does **not**
   explain the `/projects` overage. Decision §3's "it may be a methodology artifact,
   not a regression" is **too strong and is corrected here.**

### Corrected `/projects` verdict

- **Pre-restyle, under the gate's own tool (LH 12.6.1), `/projects` was ALREADY over
  budget**: T05 median-of-3 = **2632 ms** (`task-T05` §4, revision `1b1062e`). It has
  never passed.
- **Post-restyle under the same tool**, the only remotely clean run reads **2923 ms**
  (run 6) — but that single run was collected ~19 s *after* host re-saturation began
  (08:32:36Z) and the other two `/projects` runs were 4342 / 4287. So the **+291 ms is
  suggestive, not proven**.
- The LCP **element** genuinely switched from `h1` (T02 *and* T05) to the intro
  `p` (run 6) — T05 vs run 6 are the *same* LH12, so this is a **product** change, not
  tooling: the paragraph grew from `text-base font-normal` to `text-body-lg font-light`.
- The real-trace paint is not slower (observed LCP 190 ms run 6 vs 303 ms T02), but
  those are different tools, so that comparison is also not like-for-like.

**Net:** `/projects` is a **pre-existing overage, plausibly worsened by the paragraph
change**; the version confound does not rescue it. The quiet-host A/B (BLOCKER 1)
remains the required next step before any code change — but the framing "probably just
a methodology artifact" is withdrawn. If Arm B shows the paragraph revert returns LCP
under 2500 ms under the gate's LH12, the fix is a real, cheap product fix.
