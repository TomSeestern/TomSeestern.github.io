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
