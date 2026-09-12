# Problems — 2026-refresh-restyle

Unresolved blockers and technical debt discovered during work on this plan.

_Auto-scaffolded by /start-work. Append new entries below - never overwrite._

---

## BLOCKER 1 — F5 Lighthouse mobile budgets `[~]` (external host)

**Status:** blocked, not failed. Only open *executable* item in the plan.

**Symptom:** `pnpm lighthouse` (LHCI, mobile, 4× simulated CPU/network, median of
3 runs, 7 routes) fails LCP — and under heavy load also TBT — on a byte-identical
bundle. `autorun-exit.txt` = 1.

**Root cause (proven):** an UNRELATED project (`/home/tom/Projects/ohmyroadmap`)
runs `stryker` mutation testing, holding 23 `child-process-proxy-worker` processes
at ~95–100 % CPU across all 22 logical cores. Observed continuously for 7h+.
Lighthouse's 4× CPU multiplier compounds the ~10× oversubscription. Evidence:
`.omo/evidence/t05-lighthouse/environmental-diagnosis-2026-09-11.txt`.

**Why the red is NOT a code regression:**
- Load-insensitive gates all green on a fresh build: bundle budget 14/14
  (`__global` 102,254 B vs baseline 102,253 B), e2e 79/79, axe 8/8, contrast 24/24.
- T05's red numbers were captured at `1b1062e`, an ancestor of the fixes that
  target them: T22 (`7ed6b29`) self-hosted the blog-detail remote image (the LCP
  element there), and T16/T17 rebuilt `/` and `/projects` afterwards.
- Home/projects were ALREADY over 2500 ms in the pre-restyle T02 baseline
  (2830 / 2588), so a green run for those two has never been recorded.

**Resume (ONLY on a quiet host — `cat /proc/loadavg` ≈ ≤4, no `stryker` worker):**
```
export PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright
export SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.crt
export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-bundle.crt
rm -rf .next && nix develop -c bash -c 'unset PNPM_HOME npm_config_prefix; pnpm build && pnpm lighthouse'
```
Requires `rm -rf .next && pnpm build` first because Playwright's `webServer`
boots `next dev` and clobbers the production `.next` (documented T22 gotcha).

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
