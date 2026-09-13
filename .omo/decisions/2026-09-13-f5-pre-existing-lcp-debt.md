# Decision: F5 LCP gate is a pre-existing overage, not a restyle regression

- **Date:** 2026-09-13
- **Status:** Accepted (adds to, and partially reframes, the 2026-09-12 methodology decision)
- **Deciders:** Atlas (orchestrator) — analysis from committed T02 baseline artifacts
- **Scope:** `.omo/plans/2026-refresh-restyle.md` → Final gate F5; Success Criterion #3

## Context

F5's Lighthouse gate asserts **absolute** budgets on every public route:
LCP ≤ 2500 ms, CLS ≤ 0.1, TBT ≤ 200 ms (`.lighthouserc.js:111-113`,
`aggregationMethod: median`). The gate has never gone green, and the working
assumption has been "the restyle may have regressed `/projects`".

Two in-session Lighthouse attempts on 2026-09-13 (§29, §31 of the F5 ledger)
again produced **void** readings (`benchmarkIndex` 1900 and 1314, both < 2510),
so the question "did the restyle regress LCP?" could not be answered by new
measurement. Instead it was answered **from the committed baseline artifacts**,
which were captured on a valid host with the same tool.

## Finding

The T02 baseline (`74689e8`, Lighthouse **13.4.1**, `benchmarkIndex` 2511–3064 —
i.e. *valid*, pre-restyle, same tool as Arm A) already **failed** the absolute
LCP budget on **3 of 7** public routes:

| route | baseline LCP (ms) | bi | budget | verdict at plan start |
|---|---:|---:|---:|---|
| `/projects/entry/2020-soudest-backend-nodejs` | 2127 | 2859 | 2500 | pass |
| `/contact` | 2256 | 2911 | 2500 | pass |
| `/about` | 2384 | 2961 | 2500 | pass |
| `/blog` | 2489 | 2925 | 2500 | pass (17 ms margin) |
| **`/projects`** | **2588** | 2762 | 2500 | **OVER** |
| **`/`** | **2830** | 2511 | 2500 | **OVER** |
| **`/blog/entry/…cheesecake`** | **3562** | 3064 | 2500 | **OVER** |

CLS: **0/7** failed (all 0.000–0.037). TBT: **0/7** failed (38–126 ms).

### Consequences

1. **Success Criterion #3's LCP clause ("LCP < 2.5 s on every public route") was
   unsatisfiable when the plan began.** `pnpm lighthouse` was already red
   pre-restyle on `/`, `/projects`, and the cheesecake post. Therefore the LCP
   half of F5 **cannot** be a "did the restyle regress?" gate — it can only be
   "are the pre-existing overages fixed?".
2. **`/projects` is a confirmed pre-existing overage**, not a restyle defect:
   2588 ms at a valid `bi` 2762, same tool. The restyle's *direction* on
   `/projects` is still unmeasured (every post-restyle reading is void).
3. **CLS and TBT are the robust discriminators, and both are green** everywhere
   measured — baseline and all post-restyle runs. CLS is 0.000 on every
   `/projects` reading (baseline + 7 post-restyle), which is the criterion the
   restyle could most plausibly have broken and demonstrably did not.
4. **Chasing `/projects` LCP to satisfy F5 as literally written would be
   tuning against an un-measurable, pre-existing condition.** It is not a
   restyle regression, and the restyle may even have improved it.

### The two routes with no restyle scope at all

`/` (2830) and the cheesecake post (3562) were both over budget pre-restyle.
The cheesecake post is a 2023-era recipe article whose body image was a **remote
S3 URL** at baseline
(`https://plantoeat.s3.amazonaws.com/recipes/…-original.jpg`), which this plan's
T22 (`7ed6b29`) replaced with a self-hosted 93,924 B webp — i.e. the restyle
**improved** that route's asset situation. `/` was rebuilt by T16 (marquee
removed, type-led hero).

### Directional evidence that the restyle IMPROVED `/` and cheesecake

run 6 (`run6-summaries.json`, post-restyle, LH 12.6.1) medians vs the valid T02
baseline (LH 13.4.1):

| route | T02 baseline (valid bi, LH13) | run6 median (contended bi, LH12) | direction |
|---|---:|---:|---|
| `/` | 2830 | **2258** | −572 (now under 2500) |
| cheesecake | 3562 | **2286** | −1276 (now under 2500) |
| `/about` | 2384 | 2062 | −322 |
| `/blog` | 2489 | 2364 | −125 |
| soudest | 2127 | 2067 | −59 |

A **slower** host (`bi` 1842 vs 2762) producing **lower** LCP on 5 of 7 routes is
strong directional evidence of genuine improvement; host contention can only
inflate these numbers, not deflate them. Cross-tool caveat (LH12 vs LH13) applies,
so these are not final verdicts — but the direction is unambiguous and consistent.

**Consequence:** for `/` and the cheesecake post the restyle appears to have
*resolved* the pre-existing overage. `/projects` is the sole route whose
post-restyle state remains genuinely unknown (its run6 legs were 2923/4287/4342,
all contended).

### Gap found: T16 claims "LCP budget met" but never measured it

T16's acceptance criteria include "**LCP budget met**" and T16 is marked `[x]`,
yet `task-T16-…txt` (149 lines) contains **no LCP measurement** — only the
DOM-node budget (1592 → ~206). run6's home median (2258 ms, contended) is
*consistent* with T16's claim, so the claim looks true — but it was never
verified. This is a ledger-completeness gap, recorded here for honesty (R19.1);
it does not change T16's substantive correctness.

## Decision

1. **F5's LCP red is classified as pre-existing debt, not a restyle regression.**
   This does **not** relax the budget: 2500/0.1/200 stay absolutely unchanged, and
   the gate stays red until the overages are fixed. For `/` and the cheesecake
   post the restyle appears to have *fixed* the pre-existing overage (directional
   evidence above); `/projects` is unmeasured post-restyle.
2. **No product change is authorised to "fix" `/projects` LCP until one valid
   reading exists.** The Arm A runner (`.omo/tools/f5-arm-a-runner.sh`) will
   capture it automatically when the host is quiet; only if it returns
   LCP ≥ 2500 at `bi` ≥ 2510 is T30 real. The pre-existing 2588 ms datapoint
   makes this *likely*, but it remains unmeasured post-restyle.
3. **The gate's own framing should be changed at the plan level** (R19.4):
   F5's LCP clause should be **two-tier** —
   - **regression tier (blocks the restyle):** no route's LCP worsens by more
     than X% vs its T02 baseline (delta-based, host-controlled), and
   - **debt tier (does not block the restyle):** absolute < 2500 ms on routes
     already over at baseline, tracked as separate perf work.
   This separates "did we break it?" from "was it already broken?" — the two
   questions the current single absolute gate conflates.
4. **T30 is re-scoped from "fix `/projects` LCP" to "reduce `/projects`
   critical render cost (pre-existing debt)"** and remains blocked on the
   valid reading.

## What would falsify this

- An Arm A reading at `bi ≥ 2510` showing `/projects` LCP materially **worse**
  than 2588 ms (say > ~2700 ms) would indicate the restyle did worsen it, and
  T30 becomes a regression fix rather than debt reduction.
- A reading at `bi ≥ 2510` showing `/projects` LCP **< 2500 ms** would mean the
  restyle fixed the pre-existing overage outright — F5's LCP clause would pass
  for `/projects` with no further code change.

Both outcomes are decided by the same single reading. The runner captures it.

## Non-decisions (explicitly unchanged)

- Budgets 2500 / 0.1 / 200 — unchanged, not weakened.
- No blog route/slug change (R15.13).
- No new runtime dependency; Lighthouse/@lhci versions unchanged (T31 is a
  separate process decision).
- No claim that `/projects` passes; it is UNJUDGED post-restyle.

## Evidence

- `.omo/evidence/baseline/lighthouse/*.json` — 7 valid T02 LHRs (LH 13.4.1).
- `.omo/evidence/task-T02-2026-refresh-restyle.txt` — revision `74689e8`.
- `.omo/evidence/task-F5-2026-refresh-restyle.txt` §28–§31 — void attempts and
  the in-session constraint.
- `.omo/evidence/task-T05-2026-refresh-restyle.txt` lines 55–85, 143–155 —
  pre-restyle gate readings and the tool-bias table.
