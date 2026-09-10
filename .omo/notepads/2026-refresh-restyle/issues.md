# Issues — 2026-refresh-restyle

Problems and gotchas encountered during work on this plan.

_Auto-scaffolded by /start-work. Append new entries below - never overwrite._

---

## T01 — plan premise did not reproduce (2026-09-10)

- Plan T01 (line 210) says `pnpm lint` "currently fails" loading both react-hooks plugins.
  It does NOT fail: at base commit 74689e8 `pnpm lint` exits 0 (0 errors, 55 warnings).
  `.eslintrc.js` never extends `react-app`, so the v4.6.2 copy was dormant, not loaded.
- Real condition: a latent duplicate `eslint-plugin-react-hooks` in the install tree
  (5.2.0 from next, 4.6.2 from the unreferenced `eslint-config-react-app`). Fixed by
  removing the unused devDep — the intended structural fix, just not a red-to-green flip.
- Consequence for downstream tasks: do not assume the pipeline was ever red; T01's
  deliverable is "lint stays green + duplicate plugin tree gone", verified by before/after
  `pnpm why eslint-plugin-react-hooks`.


## T02 — 2026 refresh baseline (2026-09-10)

- Build route count: README.md + plan say 36 static routes; `next build` observed `✓ Generating static pages (38/38)` and 13 route patterns. Recorded as-is (38). The "36" in README.md appears stale and needs reconciliation in a later task.
- Lighthouse baseline is ONE run per route (not the 3–5 run median the perfection skill recommends). Variance unquantified; budget gates should allow margin or re-measure with `playwright-lighthouse` in T04.
- Playwright's bundled browser is absent (`chromium_headless_shell-1228` missing). Scans used `executablePath=/etc/profiles/per-user/tom/bin/chromium`.
- HEAD moved to `e3e8de5` (eslint config; package.json + pnpm-lock only) at 18:40:28Z while measurement ran. The measured build is from `74689e8`. No runtime impact; re-measure at exact HEAD if budget gates need parity.
- axe fires only `color-contrast` (dark: home 9 / blog 6 / projects 21; light: about 2). These are the contrast targets for the restyle.

## T04 — axe harness + Lighthouse devDeps (2026-09-10)

- The T04 acceptance command `pnpm e2e:headless` (unqualified) is **not** green in this devShell and never was: firefox/webkit cannot launch (`flake.nix` provides chromium libs only). Verified pre-existing on `e2e/home.spec.ts --project=firefox`. Use `--project=chromium` (the CI project); the CI-equivalent run is `CI=true pnpm e2e:headless --project=chromium` → 55 passed, exit 0.
- Unqualified chromium at default 11 workers has a pre-existing dev-server flake: `dark-mode.spec.ts:25` `page.goto` timeout. Reproduced with the a11y spec excluded (4 failed / 33 passed), so it is not introduced by T04. Candidate root cause for T06/F5: dev-mode on-demand compilation under parallel load; consider a warmed/prebuilt server for e2e.
- `.forgejo/workflows/playwright.yml` already installed chromium since `5b9c22d`; T04 only updated the explanatory comment. No functional CI change was needed. Flagging because the task listed "wire browser install" as a deliverable when it already existed.
- `@axe-core/playwright@4.13.0` bundles axe-core ~4.13.0 vs the T02 baseline's 4.10.3; with reduced motion the seeded counts still match exactly (9/6/21/2), so no version drift in detected nodes.
- The committed allowlist is intentionally non-empty and MUST reach empty by Wave 6 (F5). Four entries: `/` dark 9, `/blog` dark 6, `/projects` dark 21, `/about` light 2.

## T03 — bundle-byte budget gate (2026-09-10)

- `.next/analyze/__bundle_analysis.json` did not survive from T02 (no `analyze/` dir in the existing `.next/`), so the gate's happy path needed `pnpm build && node report-bundle-size.js` first. In CI the workflow runs both before the gate, so this is only a local prerequisite; the script emits an actionable "run pnpm build && node report-bundle-size.js" error when the file is missing.
- "130 KB" / "180 KB" is ambiguous (1000 vs 1024). Chosen: binary `KIB = 1024`, so 130 KB = 133,120 B and 180 KB = 184,320 B. Constants are named at the top of the script; flag if the plan intended decimal KB.
- The absolute caps have wide headroom (global 102,253 B vs 130 KB; largest route 103,736 B vs 180 KB). A regression only trips the growth gate at ~+10% (~9–10 KB per route). This is intended, but means a modest global regression below +10% would pass — the shared cap is a coarse backstop.
- Regenerated analyzer artifact matched the committed baseline with 0 gzip diffs on all 14 keys (base 759efd6); no product code touched, so no budget drift expected pre-restyle.
