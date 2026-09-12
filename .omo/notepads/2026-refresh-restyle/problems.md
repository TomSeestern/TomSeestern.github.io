# Problems — 2026-refresh-restyle

Unresolved blockers and technical debt discovered during work on this plan.

_Auto-scaffolded by /start-work. Append new entries below - never overwrite._

---

## BLOCKER 1 — F5 Lighthouse mobile budgets `[~]` (external host)

**Status:** blocked, not failed. Only open *executable* item in the plan.

**Symptom:** `pnpm lighthouse` (LHCI, mobile, 4× simulated CPU/network, median of
3 runs, 7 routes) fails LCP — and under heavy load also TBT — on a byte-identical
bundle. `autorun-exit.txt` = 1.

**Root cause — TWO independent factors (both proven):**

1. **External host contention.** An UNRELATED project
   (`/home/tom/Projects/ohmyroadmap`) runs `stryker` mutation testing, holding
   ~20–24 runner processes at ~95–100 % CPU across all 22 logical cores, observed
   continuously for 12h+. Lighthouse's 4× CPU multiplier compounds the ~10×
   oversubscription. Evidence:
   `.omo/evidence/t05-lighthouse/environmental-diagnosis-2026-09-11.txt`.
2. **Methodology confound in the comparison itself (found 2026-09-12, F5 §15).**
   The T02 baseline was measured with **Lighthouse 13.4.1** (`npx -y lighthouse`,
   T02 ledger L60/L70) while the gate runs **Lighthouse 12.6.1** via
   `@lhci/cli@0.15.1`. Every "restyle vs baseline" delta in F5 §11–§12 therefore
   crosses a major tool version — and the LCP **element** differs too (baseline h1
   → restyle intro paragraph, which grew). In the *real* trace the restyle is
   FASTER (observed LCP 190 ms vs baseline 303 ms). §11's "font-swap bound"
   conclusion is retracted; see F5 ledger §15.

**Why the red is NOT a code regression:**
- Load-insensitive gates all green on a fresh build: bundle budget 14/14
  (`__global` 102,254 B vs baseline 102,253 B), e2e 79/79, axe 8/8, contrast 24/24.
- T05's red numbers were captured at `1b1062e`, an ancestor of the fixes that
  target them: T22 (`7ed6b29`) self-hosted the blog-detail remote image (the LCP
  element there), and T16/T17 rebuilt `/` and `/projects` afterwards.
- Home/projects were ALREADY over 2500 ms in the pre-restyle T02 baseline
  (2830 / 2588), so a green run for those two has never been recorded.

**Resume (ONLY on a quiet host):**

> **Detection warning (learned 2026-09-12).** Counting
> `child-process-proxy-worker` is **unreliable** — those pool processes sit idle
> between batches (measured ~0 CPU-s over 30 s) while the machine still runs at
> 96 % busy. The actual burners are Stryker's **short-lived `tap-runner` test
> processes** (`node -r …/@stryker-mutator/tap-runner/… --test-reporter=tap
> test/*.mjs`), each pinning ~100 % CPU; 45 `ohmyroadmap` processes were live.
> Use `ps -eo pcpu,etime,args --sort=-pcpu | head` and `/proc/loadavg` — **not**
> a worker count. Require loadavg ≈ ≤4 AND no `ohmyroadmap` runner in top CPU,
> sampled over 3×15 s, immediately before launch.

```
export PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright
export SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.crt
export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-bundle.crt
rm -rf .next && nix develop -c bash -c 'unset PNPM_HOME npm_config_prefix; pnpm build && pnpm lighthouse'
```
Requires `rm -rf .next && pnpm build` first because Playwright's `webServer`
boots `next dev` and clobbers the production `.next` (documented T22 gotcha).

**DECISIVE EXPERIMENT (run this before spending any code effort) — version parity
+ element A/B, `/projects` only, one quiet window:**

1. **Arm A — parity:** measure the CURRENT build with the baseline's own tool
   (`npx -y lighthouse@13.4.1`) on `http://127.0.0.1:3000/projects` (the exact T02
   method: `--output=json`, fresh Chrome profile, mobile 4× simulate). Compare to
   the stored baseline **2588 ms**.
   - ≈2588 → the restyle↔baseline delta is **tooling**, not code.
   - ≈2920 → the overage is real product code.
2. **Arm B — element switch:** under the gate's LH12.6.1 (lhci), A/B the `/projects`
   intro paragraph `text-body-lg font-light` → `text-base font-normal` (mobile).
   Read `largest-contentful-paint`, the LCP **element** identity, and
   `lcp-phases-insight` (TTFB + element render delay) plus
   `metrics.observedLargestContentfulPaint`.
   - LCP drops <2500 and element returns to `h1` → paragraph attribution confirmed.
   - LCP stays ≈2900 with `p` still the element → main-thread/DOM cost is the lever.
3. Always record the **lighthouseVersion** of every LHR used in a comparison.

**Do NOT cite §11's "same Lighthouse version/method" premise** — it is false
(retracted in F5 ledger §15).

**Disposition rules:** do NOT weaken the 2500 ms budget to force green. If home or
projects still exceed it on a quiet host, that is a genuine finding needing a real
fix (font/LCP-path work) and must be escalated to Tom. Blog-detail is expected to
pass now that its remote image is self-hosted.

**UPDATE 2026-09-12 07:45Z — run 5 (quiet-window attempt).** Verified quiet at
launch (CPU 23.8/26.0/24.3 %, workers=3, loadavg 10.67). But the external Stryker
job restarted at 07:45:25Z — **~1 s after launch** — and ramped 3→24 workers during
the 6-min sweep. Run 5 collected cleanly (21/21 LHRs, 0 runtime errors, TTFB 4–7 ms,
FCP matching baseline) but has within-route LCP jitter from the ramp. Result: 4
assertion failures (LCP `/projects` 2898 best, LCP cheesecake 2781 best, TBT `/blog`
209 best, TBT `/contact` 178 best — the TBT minima straddle the 200 ms line).

Against the host-independent T02 baseline, **LCP improved on 5/7 routes**:
`/` −542, `/about` −278, `/blog` −118, cheesecake −645, soudest −54. `cheesecake`
was *already* over budget at baseline (3562) and improved. The TBT bumps on `/blog`
and `/contact` track the Stryker ramp, not a product change. Full data: F5 ledger §12.

**CORRECTION (F5 ledger §13) — `/projects` is an UNRESOLVED MEASUREMENT, not a proven
regression.** Two earlier claims were wrong and are retracted:
1. The LCP element on `/projects` is the **intro paragraph, which uses Inter** — *not*
   the Newsreader H1. No element uses a `font-display`/`font-serif` utility; Newsreader
   is applied only to `h1,h2` via the `styles/tailwind.css` base layer. So the LCP text
   is the same face the baseline already used. "Font-swap bound" is **not** supported.
2. The phase-table `TTFB=453 ms` is a Lighthouse simulated-throttling constant, not a
   real server delay (identical 453 in all three sub-runs while the real
   `server-response-time` audit is 7/9/18 ms). Do not cite it.

What *is* supported: `Load Delay 0 / Load Time 0` ⇒ everything is in
**Render Delay (2445/3504/3525 ms)** — main-thread-bound, exactly the phase the
oversubscribed CPU inflates. `/projects` was **already over budget at baseline
(2588 > 2500)**, so it has never passed; the restyle best (2898) cannot be separated
from contention on this host. **No code change is justified.** A single clean-host
re-read decides it.

**No further runs until the host is genuinely idle for the full sweep** (the windows
are too short to catch — an external job can resume mid-run, as happened at 07:45:25Z).
Do NOT re-run in a loop. If `/projects` still exceeds 2500 ms on a clean host, escalate
to Tom with a real LCP-path fix (and the D3 font decision); if it reads ≤2500, the
restyle improved 6/7 routes and only the pre-existing baseline failure remains.

**Auto-run watcher is NOT a viable unattended strategy (learned 2026-09-12).** An
in-session monitor cannot outlive the **30-minute monitor platform cap**, while the
external job has held the box for 10 h+ (loadavg 25–64 observed). A watcher armed at
08:10Z was guaranteed to die at ~08:40Z, long before any quiet window. Do not arm
another in-session watcher unless the host is *already* quiet and only needs a short
confirmation streak. The correct trigger is a human/operator signal that the
`ohmyroadmap` Stryker run has finished — then run F5 once, immediately.

**UPDATE 2026-09-12 08:29Z — run 6, FIRST GENUINELY CLEAN-HOST SUBSET.** The
corrected CPU-delta detector (tap-runner processes burned **0 CPU-seconds over 20 s**)
caught a true idle window at CPU 19 %/loadavg 5. The host re-saturated at 08:32:36Z,
but the first four routes + one `/projects` run + two soudest runs were collected
cleanly (FCP at the ~906 ms baseline envelope). Results:

- **6/7 routes PASS** on clean readings. `/` 2258, `/about` 2062, `/blog` 2364
  (TBT 212 marginal; 3rd run TBT 617 was contamination), cheesecake **2286** (was
  3562 baseline — T22 confirmed fixed), soudest 2067.
- **`/projects` reads LCP 2923 ms** on its one clean run (FCP 1057, srt 8 ms, TBT 162).
- **`/contact`** has no fully clean run (lowest LCP 2380 inside budget but
  TBT-contaminated); one more clean sweep would close it.

> **CORRECTED (F5 ledger §15 + decision addendum 2026-09-12).** The run-6
> "REAL CODE FINDING / genuinely FAILS" framing was premature — but so was the
> follow-up "probably a methodology artifact" framing. The measured truth:
>
> - T02 baseline = **Lighthouse 13.4.1**; the gate = **12.6.1**. The tool bias can be
>   estimated directly because T02 (`74689e8`) and T05 (`1b1062e`) measured
>   **identical product code** (no `app/`, `components/`, `lib/`, `styles/` change
>   between them). T05−T02 ranges **−384 … +128 ms** across routes (median −22) —
>   real and route-dependent, so always record `lighthouseVersion`.
> - **On `/projects` the tool bias is only +44 ms** (2588 → 2632). It does **not**
>   explain the overage.
> - **Pre-restyle, under the gate's own LH12, `/projects` was ALREADY red**:
>   T05 median-of-3 = **2632 ms**. It has never passed.
> - The LCP **element** switched `h1`→`p` — T02 *and* T05 both saw the `h1`, so this
>   is a **product** change (the intro paragraph grew `text-base font-normal` →
>   `text-body-lg font-light`), not tooling.
> - The real trace is faster (observed LCP 190 ms vs 303 ms) but those are different
>   tools, so it is not like-for-like either.
>
> **Disposition:** `/projects` is a **pre-existing overage, plausibly worsened by the
> paragraph change**. The version confound does not rescue it. Required next step is
> still the quiet-host A/B (BLOCKER 1 above): Arm A = current build under
> `lighthouse@13.4.1` vs the 2588 baseline; Arm B = paragraph-revert A/B under the
> gate's LH12.6.1. If Arm B returns LCP <2500 under LH12, the fix is real and cheap.
> Budgets stay 2500/0.1/200. See F5 ledger §15 and
> `.omo/decisions/2026-09-12-f5-lighthouse-methodology.md`.

**Consequence:** F5's "all budgets met on every public route" is not satisfiable by
measurement as-is. `/projects` is a genuine pre-existing overage that the restyle
plausibly worsened; it needs the version-controlled A/B on a quiet host before any
code change. Do not spend code effort until that experiment runs.
See F5 ledger §14–§15 and run-6 artifacts under `.omo/evidence/f5-lighthouse/run6/`.

---

## BLOCKER 2 — Wave 5 content `[~]` (human gate, R19.1)

**Status:** blocked on Tom. T20, T24, T25, T26, T27, T28, T29.

Agents may not author content as fact (R19.1: no claim without verifiable
citation). Specifically:
- **T24 legal pages (P0)** — Impressum + Datenschutz; needs Tom's real legal
  entity/contact details. (T20 declares `Depends: T14,T15,T24`, so T24 also gates
  T20's structural work.)
- **T25 positioning + founder-arc copy** — Tom's own voice.
- **T26 three case studies** — needs cleared metrics (UWG §5 risk).
- **T27 two posts** — Tom's writing.
- **T28 cheesecake/LAYZR/testimonial** — **D8 BLOCKED**: the user's selected
  "unlabelled placeholder quotes" conflicts with R19.1 and German UWG §5 (false
  endorsement). Recommended: visibly labelled example quotes, or defer until real
  consented quotes exist.
- **T29 tag pages** — deferred by decision.

Full context: `.omo/decisions/2026-09-10-refresh-scope-decisions.md`.

---

## DEBT (flagged, out of this plan's scope)

- **AGENTS.md L66/L88** claim "no `scripts/` directory/infrastructure exists";
  false — `scripts/` has 7 files, 5 CI-wired. Pre-existing (claim written
  2026-07-20, one day after the first script landed; `scripts/` predates the plan
  baseline `74689e8`). AGENTS.md's own Superseded-rules section defers doc updates
  to T41. Owner: the AGENTS.md refresh task. Do not edit rule metadata unowned.
- **Contact success toast overlaps header nav** at ≥768 px, scrollY=0 (pre-existing
  `e606a99`, 2023). `ContactForm.tsx` renders the success `Alert` as
  `fixed inset-x-1/3 top-8 z-50` while `<header>` is in normal flow. F3 quantified
  328–456 px² per nav link. Out of scope (this plan's contact work was server
  metadata + a11y, not toast placement). Real, small, user-visible.
- **`app/not-found.tsx` h2** has an exact token candidate (`text-h2-sm
  tracking-tight`) deferred from T08 (file was outside that task's named scope).

---

## BLOCKER 3 — T31 Lighthouse version parity needs network `[~]` (verified)

**Verified 2026-09-12:** this environment cannot reach the npm registry.
`curl -s -o /dev/null -w "%{http_code}" https://registry.npmjs.org/lighthouse`
returns **000** (timeout). `npm view @lhci/cli@latest` inside `nix develop`
produces no output. Only the installed versions are available locally:
`node_modules/.pnpm/lighthouse@12.6.1`, `node_modules/.pnpm/@lhci+cli@0.15.1`.

**Consequence:** T31 (align the gate's Lighthouse major with the baseline's 13.4.1)
cannot be implemented or verified on this machine even after Tom decides — it needs a
networked environment to fetch a different `@lhci/cli`/`lighthouse`. Any such change
must also re-capture the T02 baseline with the SAME version.

**Do not** attempt `pnpm add`/`npx -y lighthouse@13.4.1` here: it will hang/fail on
the registry, and `npx -y lighthouse@13.4.1` (the parity Arm A) also requires the
registry unless the exact version is already cached. Check for a local cache first:
`ls ~/.npm/_npx/*/node_modules/lighthouse`.

### UPDATE: F5 Arm A is OFFLINE-RUNNABLE (cached Lighthouse 13.4.1 verified)

Correction to BLOCKER 3 and to the "F5 needs network" inference: a complete
**Lighthouse 13.4.1** (the exact baseline version) is in the npx cache and runs
offline — `node ~/.npm/_npx/0f94ee7615faf582/node_modules/lighthouse/cli/index.js
--version` → `13.4.1`, exit 0. Chrome is present at
`~/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`.

**Therefore F5's Arm A parity experiment is blocked ONLY by host contention, not by
network.** Resume command is in F5 ledger §17. This finally enables a like-for-like
`/projects` comparison against the 2588 ms baseline — the measurement no F5 run has
yet achieved.

### CORRECTION to the Arm A resume command: use the nix Chromium

Arm A must use **`CHROME_PATH=/etc/profiles/per-user/tom/bin/chromium`**
(Chromium 149.0.7827.200 — the exact T02 baseline browser) inside `nix develop`, NOT
the Playwright Chromium in `~/.cache/ms-playwright` — that one is a different build
and fails with `libglib-2.0.so.0: cannot open shared object file` outside the dev
shell. Full corrected command in F5 ledger §18.
