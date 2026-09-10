# Learnings — 2026-refresh-restyle

Conventions, patterns, and successful approaches discovered during work on this plan.

_Auto-scaffolded by /start-work. Append new entries below - never overwrite._

---

## T01 — react-hooks duplicate plugin (2026-09-10)

- Run every pnpm command as `nix develop -c bash -c 'unset PNPM_HOME npm_config_prefix; pnpm …'`.
  The devShell exports `PNPM_HOME`/`npm_config_prefix` as null and pnpm 10 crashes otherwise.
- Detect a duplicate plugin copy with `pnpm why eslint-plugin-react-hooks` — it lists
  every dependent and the version each resolves. Before T01: `eslint-config-next → 5.2.0`
  AND `eslint-config-react-app → 4.6.2`.
- `eslint-config-react-app` was in devDependencies but referenced by nothing; grep across the
  repo hit only `package.json` + `pnpm-lock.yaml`. `.eslintrc.js` extends `next`, not `react-app`.
- Removing the unused devDep + `pnpm install` prunes the whole orphaned subtree from
  `pnpm-lock.yaml` (554 lines: react-app, react-hooks@4.6.2, babel-preset-react-app).
- Fix style for "duplicate plugin" issues: delete the unreferenced config, never add
  `eslint-disable` and never downgrade a rule.


## T02 — 2026 refresh baseline (2026-09-10)

- Commands must run via `nix develop -c bash -c 'unset PNPM_HOME npm_config_prefix; …'`; host has no pnpm/node on PATH.
- `report-bundle-size.js` is the canonical bundle JSON writer → `.next/analyze/__bundle_analysis.json`. The `ANALYZE=true` flag only adds the treemap HTML; it does not emit a stable JSON. Global shared first-load JS: gzip 102,253 B.
- Lighthouse runs offline-of-browser via `npx -y lighthouse` with `CHROME_PATH=/etc/profiles/per-user/tom/bin/chromium`; no browser download needed.
- axe baseline: inject axe-core 4.10.3 (fetched to /tmp, NOT added to package.json) via Playwright with system chromium; drive theme with `localStorage["flowbite-theme-mode"]` in `context.addInitScript`.
- The root layout hardcodes `dark`, but the inline theme script (app/layout.tsx:48-69) removes it when the system prefers light and no stored pref exists → a fresh browser renders light. Scan both schemes explicitly.

## T04 — axe harness + Lighthouse devDeps (2026-09-10)

- `pnpm add -D @axe-core/playwright@4.13.0 @lhci/cli@0.15.1` (both dev-only; verified `git diff package.json` keeps them under `devDependencies`, nothing in `dependencies`). `pnpm install --frozen-lockfile` stays green.
- DevShell browsers: `@playwright/test@1.61.1` wants chromium revision **1228**, but `~/.cache/ms-playwright` only had 1200 (from another project's `playwright-core@1.57.0`). Fix: inside the devShell, `export PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright && pnpm exec playwright install chromium firefox webkit`. No `executablePath` needed afterwards.
- Only chromium is playable locally: `flake.nix` supplies `chromeRuntimeLibs` for chromium, so firefox/webkit launch fail with `Host system is missing dependencies`. This is pre-existing (an untouched `e2e/home.spec.ts` fails the same way). The canonical e2e command here is `--project=chromium` (same as `.forgejo/workflows/playwright.yml`).
- Parallel `next dev` + 11 workers is flaky for `page.goto` on cold routes (`dark-mode.spec.ts` times out). Removing the a11y spec still yields failures, so it is pre-existing. `CI=true` (workers=1, retries=2) is the reliable signal.
- axe color-contrast node counts on the home marquee are animation-phase dependent (9 vs 10) → flaky. Emit `page.emulateMedia({ reducedMotion: "reduce" })` before scanning; the marquee uses `motion-reduce:animate-none` (app/page.tsx:111), so layout freezes and counts become deterministic. Fold this into any future axe helper (T06).
- Theme scheme is set with `page.addInitScript(() => localStorage.setItem("flowbite-theme-mode", scheme))` in `beforeEach`; wait for the `<html>` `dark` class via `waitForFunction` (not the 5s default assertion) before scanning.
- Allowlist design that self-cleans: exact `(route, scheme, rule, nodeCount)` match, plus an integrity test that every allowlist route/scheme is in the scanned matrix. Removing a seeded entry makes the spec fail with "unallowlisted ... found"; when T07 drops dark mode, the dark entries fail the integrity test and must be deleted.

## T03 — bundle-byte budget gate (2026-09-10)

- The analyzer artifact `{ route: { raw, gzip }, …, __global }` already carries gzip bytes (computed by `report-bundle-size.js`), so the budget gate reads JSON only and needs **no** `gzip-size` import. `gzip-size@6`'s CJS export is `{ sync, stream, file, fileSync }` (default = function) — it has no `gzipSize` named export, so don't import that name.
- Resolve file paths from the script's own location (`resolve(dirname(fileURLToPath(import.meta.url)), "..")`) so the gate works from any cwd, not just the repo root.
- The repo Prettier glob is `"**/*.{js,jsx,ts,tsx}"` and ESLint is `eslint . --ext .ts,.tsx` — neither covers `.mjs`. `pnpm prettier`/`pnpm lint` stay green with the new file by construction, but still run `pnpm exec prettier --write/--check` on it directly to keep it formatted.
- Validate a workflow YAML without python3: `node -e 'require("./node_modules/.pnpm/js-yaml@4.3.0/node_modules/js-yaml").load(...)'`. Find the store path with `ls node_modules/.pnpm | grep yaml`. The devShell has node but not python3.
- Failure-demo hygiene: do NOT wrap the sequence in `set -e` — a deliberately failing `node script` aborts the script before the restore `cp`, leaving the mutation in place. Use `cmd; echo "EXIT=$?"` and restore on the next line, then `diff -q` against the backup to prove the restore.
- The binding budget rule today is the **+10% route-growth** gate, not the 130/180 KB absolute caps: measured routes sit at ~92–104 KB, so a 10% drift (~9–10 KB) trips long before the absolute caps. Keep both; the absolute caps are backstops.

## T05 — Lighthouse CI budgets (2026-09-10)

- LHCI's yargs config loader flattens `ci.collect.*` to top-level, so `chromePath`,
  `startServerCommand`, `numberOfRuns` all live at `ci.collect` but the separate
  `healthcheck` child process still sees them (`opts.chromePath`).
- `collect.settings.chromeFlags` is MERGED with LHCI's own `--headless=new` (node-runner
  appends headless unless `--headful`), so a value like `"--no-sandbox --disable-dev-shm-usage"`
  is safe and does not drop headless.
- LHCI's numeric assertion `aggregationMethod` defaults to **`optimistic`**, not median.
  To assert the median of `numberOfRuns`, set `aggregationMethod: "median"` per assertion.
  The saved `assertion-results.json` `actual` then equals the median.
- LHCI hardcodes its saved-reports dir to `./.lighthouseci` (constant in
  `@lhci/utils/src/saved-reports.js`) — `upload.outputDir` does NOT move it. So
  `.lighthouseci/` always appears in cwd; keep it untracked (CI uploads it as an artifact).
- `autorun` order is healthcheck -> collect -> assert -> upload; upload runs even when assert
  fails (`hasFailure` only gates the final exit). So CI artifacts are written on a red run.
- Chrome resolution that works both locally and in CI without extra env: prefer
  `$CHROME_PATH`, else `command -v chromium|chromium-browser|google-chrome`, else scan
  `$PLAYWRIGHT_BROWSERS_PATH` (default `~/.cache/ms-playwright`) for
  `chromium-*/chrome-linux64/chrome`. In the nix devShell `command -v chromium` finds the
  system Chromium; CI uses the Playwright-installed one.
- `onlyCategories: ["performance"]` keeps 21 audits (7 routes x 3 runs) affordable; the three
  metric audits still run and assert.
- This bash tool truncates/summarizes large command output. Redirect heavy runs to a file
  (`> log 2>&1; echo $? > exit`) and Read the file instead of relying on stdout.

## T05 — evidence path

- `.omo/evidence/task-T05-2026-refresh-restyle.txt`; raw run in `.omo/evidence/t05-lighthouse/`.
  Parse medians with `.omo/evidence/t05-lighthouse/parse-medians.mjs`.

## T06 — single-source e2e copy/count + harness extensions (2026-09-10)

- Copy/count single-sourcing: `e2e/fixtures/expectations.ts` holds `COPY`,
  `BLOG_POST_COUNT` (3), `MIN_PROJECT_COUNT` (21). `home.spec.ts` had to be
  refactored too — otherwise its h1/h2 literals kept the copy in two modules and
  the "one module" grep proof failed. Watch for literals hiding in **comments**
  (`// h2 "My Recent Posts"` also matched the grep; strip them).
- Grep to prove single-sourcing in one shot:
  `grep -rn -E "My Recent Projects|...|About me" e2e/` must hit only
  `e2e/fixtures/expectations.ts`; `grep -rn -E "toHaveCount\(3\)|toBeGreaterThanOrEqual\(21\)" e2e/`
  must be empty.
- Shared axe primitives live in `e2e/fixtures/axe.ts`
  (`freezeAnimations` = `emulateMedia({reducedMotion:"reduce"})`,
  `waitForStableRender` = fonts.ready + 2 frames, `scanSeriousViolations`).
  `e2e/fixtures/theme.ts` = `waitForScheme`. `a11y.spec.ts` stays untouched
  (T04 owns it) — the dark-mode contrast spec reuses the primitives without
  duplicating the route×scheme allowlist.
- Playwright's `webServer` injects `E2E_CONTACT_FORM_SUCCESS=true`. If you start
  `next dev --port 3030` by hand and run Playwright without `CI=true`, it is
  REUSED and lacks that env → `static-routes.spec.ts` contact test fails with
  "Success! Email sent successfully." not found. Let Playwright own the server
  (or export the env yourself) for iteration.
- Flowbite's `NavbarToggle` mobile menu does NOT close on `Escape` (verified).
  Don't add an Escape-to-close test; it is not implemented.
- `.focus()` on a link DOES match `:focus-visible` in Chromium here, so
  programmatic focus is a valid way to assert a visible focus ring (same trick
  T04/earlier specs use).
- `e2e/**/*.ts` is covered by `pnpm prettier` (`**/*.{js,jsx,ts,tsx}`) — run
  `pnpm exec prettier --write "e2e/**/*.ts"` after edits. `pnpm typecheck`
  (`node_modules/typescript/bin/tsc --noEmit`) covers `e2e/` too and is a cheap
  extra gate.
- T06 acceptance: 55 → 68 tests, both exit 0 with `CI=true ... --project=chromium
  --workers=1`. Raw: `.omo/evidence/t06-e2e/{before,after}.log`.

## T07 — single light mode, dark machinery removed (2026-09-10)

- D13 overrode the stale plan text: T07 is NOT "keep key / preserve dark fallback".
  Removed `DarkThemeToggle` + the inline resolver + the hardcoded `dark` class and
  `suppressHydrationWarning`. `suppressHydrationWarning` existed only because the
  inline script mutated `<html class>` pre-hydration; with no script it is dead.
- `tailwind.config.js` is `darkMode: "class"`, so once no code adds `.dark` the
  dormant `dark:*` utilities can never activate. Leaving them in place kept T07 a
  pure refactor — palette removal stays with T13/T15.
- TDD red was a single assertion: `[data-testid="dark-theme-toggle"]` count 1 → 0.
  The "no dark class under `prefers-color-scheme: dark`" assertion in the same test
  short-circuits behind it, so assert the toggle first and let the rest follow.
- Acceptance grep `flowbite-theme-mode|DarkThemeToggle` covers `e2e/` too, so a
  spec that *names* the key breaks it. Assert behavior instead: served HTML must
  not contain `localStorage`/`prefers-color-scheme`, and `localStorage.length === 0`
  after load. Both fail pre-change (script sets the key) and pass post-change.
- `SCHEMES = ["light"]`, `A11yScheme = "light"`, deleted `e2e/fixtures/theme.ts`
  (`waitForScheme` no longer applies). Allowlist dropped to one real light row:
  `/about` light ×2, re-verified by the exact-match axe run.
- Verify: build 0; lint 0 (55 pre-existing warnings); prettier 0; full chromium
  `--workers=1` 58 passed. Raw: `.omo/evidence/t07-e2e/`.



## T08 — token drift cleanup, zero visual change (2026-09-10)

- Every semantic `fontSize` token (`h1`..`caption`) bakes in a line-height that
  DIFFERS from Tailwind's raw `text-*` default. So `text-4xl font-extrabold
  tracking-tight` is NOT swappable for `text-h1-sm` (lh 40px vs 39.6px).
- The one exact swap: a raw heading that already carries `leading-none` can become
  the matching token IF the token's size/weight/letter-spacing match and `leading-none`
  is kept to override the token's line-height. Verified: `text-4xl font-extrabold
  leading-none tracking-tight` == `text-h1-sm leading-none` (36/36/-0.9/800), and
  `md:text-5xl` == `md:text-h1` (48/48). `lg:text-6xl` has no token → keep.
- Zero-visual-change proof method that works here: build → `pnpm exec next start -p 3055`
  → Playwright Chromium (`reducedMotion: reduce`), `getComputedStyle` over a fixed
  selector set at 375/768/1280, run on stashed (before) and changed tree, diff all
  props. This T08 run: 0 diffs / 615 elements / 14,760 comparisons.
  Script: `.omo/evidence/t08-styles/capture.mjs`.
- Do NOT `pkill -f "<pattern>"` when the pattern text appears in your own shell
  command line — pkill matches the shell itself and kills the command (silent 400s
  timeout, empty log). Kill by explicit PID from `ps -eo pid,args | grep …`.
- `sg` on this host is the setgroups binary (`/run/wrappers/bin/sg`), not ast-grep;
  no `ast-grep` binary exists and deps are frozen for T09. Class names are string
  content → use `grep`, which is the correct tool anyway.
- `git stash push -- <paths>` lets you rebuild+recapture the exact "before" state
  for a true before/after computed-style diff without reverting the working tree.
