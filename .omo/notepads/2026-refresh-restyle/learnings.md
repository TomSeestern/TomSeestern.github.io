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
