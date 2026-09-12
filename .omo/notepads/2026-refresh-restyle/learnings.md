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

## T10 — additive frontmatter fields for the restyle (2026-09-10)

- `lib/markdown.ts` is a tiny schema+type pair; adding fields is 2 edits: extend
  `markdownFrontmatterSchema` and mirror each field as `readonly` on
  `MarkdownEntry`. The reader spreads `...frontmatter`, so no mapping code.
- TDD red is cheap here: the two existing exact-shape `toEqual` assertions in
  `lib/markdown.test.ts` fail the instant the schema grows (extra keys), so the
  red run proves both the new tests AND the shape contract in one command.
  Update those two assertions with the new defaults — do NOT weaken to
  `toMatchObject` (task mandate).
- `metrics.value` is `z.string()` per spec; YAML `value: 1200` parses as a number
  and is correctly `.catch([])`-ed to an empty array. Content authors must quote
  numeric metric values. This is a boundary contract, not a bug.
- Prettier normalizes mixed single/double quotes in joined frontmatter arrays:
  strings containing `"` stay single-quoted, the rest flip to double. Write the
  fixture with `'    value: "1200"'` and let `pnpm exec prettier --write` settle it.
- `.omo/` is gitignored (`.gitignore:49`) yet 201+ `.omo/` files are tracked from
  prior sessions; new evidence must be `git add -f`-ed. `boulder.json` is
  orchestrator-owned — leave it out of task commits.
- Build emits **38** static pages (consistent with T02), not the plan/README's 36.

## T09 — dead deps + README drift (2026-09-10)

- No `instrumentation.ts` exists, so `@vercel/otel` + all 5 `@opentelemetry/*`
  were pure dead weight. Also removed `npm-only-allow` and
  `postinstall-postinstall` — their only occurrences were their own
  package.json entries (the old `preinstall` hook was already gone). Root
  `postinstall` is `npx patch-package -y`, which pnpm runs natively.
- `pnpm install` (unfrozen) removed 82 packages and regenerated
  `pnpm-lock.yaml`; `pnpm install --frozen-lockfile` then exits 0.
- `pnpm-lock.yaml` still lists a transitive `@opentelemetry/api` because
  `next@15.5.24` declares it as an optional peer for its instrumentation hook.
  Expected, not a direct dependency — acceptance is `package.json` == 0.
- Build emits 38 static pages (T02/T10 already noted this; README said 36).
- README stale-claim grep: avoid the literal phrase "static export" — a negated
  "(not a static export)" still matches the acceptance grep. Phrase as
  "`output: 'export'` is deliberately not set".

## T12 — contact server/client split + a11y wiring (2026-09-10)

- Flowbite `Alert` hardcodes `role="alert"` BEFORE `...restProps`, so an explicit
  `role="status"` prop wins. No custom wrapper needed to make the success alert a
  polite live region; `getByRole("status")` then matches in Playwright/Jest.
- `@testing-library/user-event` is NOT installed (cannot add deps). `fireEvent.blur`
  DOES trigger React's `onBlur` here — no need for `fireEvent.focusOut`. Test with
  `fireEvent.change` (sets value + onChange) then `fireEvent.blur`.
- Blur validation that is not hostile: gate on an `editedFields` map set from
  `onChange`. Typing never validates; first focus/blur of an untouched empty field
  shows nothing; submit still routes through the server action. This satisfied the
  "non-hostile first blur" requirement while keeping the existing submit e2e green.
- `app/contact/page.tsx` flipped from `"use client"` to a server component; the form
  moved verbatim to `app/contact/ContactForm.tsx`. Metadata canonical uses the
  absolute string `https://tom.segbers.de/contact`; the built HTML emits
  `<link rel="canonical" href="https://tom.segbers.de/contact"/>`.
- Doing the `next start` + `curl` proof inside one `nix develop -c bash -c` with
  `kill $SRV; wait $SRV` HANGS the outer command (the node child holds stdout). The
  HTML is written before the hang, so kill by explicit PID after curl and skip
  `wait`, or split into two tool calls. `/contact` is a static route, so the tags
  are already in the prerendered file at `.next/server/app/contact.html`.
- Green gates: jest 101 passed; build 38/38 (contact First Load 121 kB); lint 0
  errors/55 pre-existing warnings; prettier clean; contact+a11y e2e 17 passed at
  `--project=chromium --workers=1`. `a11y-known-violations.ts` untouched — /contact
  has zero allowlisted rows, so the exact-match scan proves 0 serious/critical.

## T11 — single root Tooltip provider (2026-09-10)

- Radix `Tooltip.Provider` renders NO DOM node, so "one provider" is not a DOM
  observation. Structural proof = module-level spy: `jest.mock("@radix-ui/react-tooltip",
  () => ({ ...actual, Provider: jest.fn(actual.Provider) }))` and assert
  `toHaveBeenCalledTimes(1)`. Red-before/green-after showed 2 -> 1 calls. Get the
  spy via `jest.requireMock(...).Provider` rather than a namespace member: the bare
  string `RadixTooltip.Provider` then stays unique to `TooltipProvider.tsx`, which is
  the grep acceptance criterion.
- `Tooltip.Root` THROWS without an ancestor `TooltipProvider` ("must be used within
  TooltipProvider"). Hoisting the provider to the root is therefore a breaking change
  for every bare consumer. Grep consumers before the change: here only
  `ProjectTeaser.test.tsx` (9 renders) and `ProjectTeaser.stories.tsx` (decorator)
  needed wrapping.
- Radix opens tooltips on `pointermove`, not `pointerenter`. Playwright `hover()`
  lands the pointer directly on the element and fires `pointerenter` only — the
  tooltip does NOT open. Real-user recipe that works: `scrollIntoViewIfNeeded()` then
  `page.mouse.move(outside)` then `page.mouse.move(center, { steps: 6 })`. Without the
  scroll, `boundingBox().y` can be below the viewport and `mouse.move` is a silent
  no-op.
- `data-state="delayed-open"` is a precise browser oracle that the hoisted provider's
  `delayDuration=200` is active — Radix's default is 700ms and an instant/skipped open
  would render `instant-open`.
- `text-2xs` DOES exist in `node_modules/flowbite/dist/flowbite.css`, but that file is
  never imported (the app uses Flowbite as a Tailwind *plugin*). Verify "undefined
  class" claims against the built `.next/static/**/*.css`, not node_modules. All three
  removed classes were absent from the production CSS => no-op removal.
- Every production tooltip trigger is a decorative `<img>`/`<span>` (not focusable),
  so browser-level keyboard-focus coverage does not exist. Keyboard focus stays a
  component-layer concern (`fireEvent.focus`).

## T13 — warm parchment tokens + contrast gate (2026-09-10)

- The universal focus ring is `ring-accent-soft` (every link/button/card uses it).
  In the old palette that was a pale tint (~1.1:1 on white) — an un-gated WCAG
  1.4.11 failure. `accent-soft` ALSO serves as the badge chip background, so the
  two roles fight: chip bg wants light, focus ring wants >=3:1. The only value
  satisfying both on #F5EFE1/#EDE4D1 is a MID terracotta (#BE6A50, 3.41/3.10) with
  a near-black chip label (#1F0F0A, 4.75). If T15 wants pale chips, it must split
  the ring token from the chip token in the components.
- A `maxWidth` block under `extend` EXTENDS Tailwind's defaults, so adding the
  measure tokens keeps every `max-w-screen-*`/`max-w-3xl` working. `width-page`
  as a maxWidth entry yields the class `max-w-width-page` (per the task spec).
- Contrast math is cheap to verify before editing: a 30-line node probe computes
  every shipping pair in ms, so choose token values by measurement, not vibes.
  Parchment lum = 0.8658; 3:1 needs a token lum <= 0.255, which is why warm
  mid-tones are darker than they look.
- Keep the literal word "cool"/"warm" in prose, not the forbidden colour word —
  the acceptance grep `#2563eb|#2f7bff|blue` over tailwind.config.js + DESIGN.md
  matches SUBSTRINGS, including comments. A sentence like "no <colour> anywhere"
  trips it.
- TDD red for a pure-JS gate: ship the manifest WITH a known-bad pair, capture
  `EXIT=1` + the per-pair FAIL row, then delete only that pair. No test file needed;
  the script's own exit code is the assertion.

## T13 — evidence paths

- Ledger: `.omo/evidence/task-T13-2026-refresh-restyle.txt`.
- Raw: `t13-contrast-{red,green}.txt`, `t13-axe.log`, `t13-axe-green.log`,
  `t13-axe-nodes.txt`, `t13-build.log`, `t13-lint.log`, `t13-prettier.log`,
  `t13-jest.log`.

## T13 follow-up — contrast gate wired into CI (2026-09-10)

- Added `pnpm contrast` (`node scripts/check-contrast.mjs`) and a "Contrast gate" step to `.forgejo/workflows/check.yml` right after "Format check"; the workflow keeps the `nix develop -c pnpm …` style. YAML validated with the pnpm-store js-yaml 3.15.0 (`node -e "require(...js-yaml).load(...)"`); existing action pins untouched.

## T14 — carved display treatment + font budget gate (2026-09-10)

- `next/font/google`'s `subsets` option only controls **preload**, not which files Next
  emits; the loader (`find-font-files-in-css.js`) downloads every unicode-range subset
  Google serves. So `.next/static/media` holds cyrillic/greek/latin-ext files for Inter
  even with `subsets: ["latin"]`. A byte gate must budget the **preloaded** files
  (`.p.woff2`, also linked from `<link rel="preload" as="font">`), not the sum of all
  emitted woff2 (Inter alone = ~214 KiB across 6 files; preloaded latin = 47.3 KiB).
- Google's `css2` API returns the **variable** font when multiple weights are requested
  in one call (`family=Newsreader:wght@700;800` → same src URL for both weights, ~58 KiB
  latin), even though single-weight calls return static instances (`wght@700` → 23.8 KiB).
  next/font uses one call for all weights → variable. To keep a variable-capable face
  small, request a **single weight**.
- Single weight 700 + `font-weight: 800` on h1: Chromium maps 800→700 with **no synthetic
  bold**. Oracle: measure the same element at `font-weight:700` and `800`; equal width ==
  real face, wider == synthesized (`probe-bold.mjs`).
- Base-layer `letter-spacing` loses to utility classes on specificity (element selector
  0,0,1 < class 0,1,0) regardless of source order. To make a base treatment authoritative
  over page-owned `tracking-*` utilities without editing those files, `!important` is the
  only lever. Documented in `styles/tailwind.css`.
- `next start` production capture works, but a later `next dev` e2e run **clobbers `.next`**
  with dev output → a gate reading `.next/static/css` then sees 0 families. Run
  `rm -rf .next && pnpm build` before any build-artifact gate, after e2e.
- Objective overflow proof is `document.documentElement.scrollWidth === innerWidth` at
  375/768/1280; `look_at` gives the visual read. Marquee overflow entries are clipped by
  the section's `overflow-hidden` and are pre-existing.

## T15 — motion primitives, reduced-motion guard, column-rule motif (2026-09-10)

- Motion tokens (easing/duration/animation) go in `tailwind.config.js`; the
  `@keyframes` must live where they are always emitted. Tailwind only emits config
  `keyframes` when a matching `animate-*` utility appears in scanned content, so a
  `.motion-rise` class referenced from CSS alone would point at a missing
  `@keyframes`. Working split: config tokens for T16+ `motion-safe:animate-calm-rise`,
  and the `@keyframes` + guarded `.motion-*` classes as top-level raw CSS. Never put
  them in `@layer utilities` — unused custom utilities are purged.
- Reduced-motion is verified against the production build with real Playwright
  emulation. The check that matters: for every element, `transition-duration > 50ms`
  with `transition-property` containing transform/opacity, or `animation-name !== none`
  with `animation-duration > 50ms`. The global `prefers-reduced-motion: reduce` guard
  drives both to ~0. Always include the positive control (motion-on marquee matrix
  changes) so the check cannot be vacuously green.
- The marquee transform read is a cheap freeze oracle: under reduce it is literally
  `none` (`motion-reduce:animate-none`); under no-preference it advances.
- Flowbite React `BreadcrumbItem` puts `props.className` on the `<li>`; the link/span
  color comes ONLY from `theme.href.on` / `theme.href.off` (never merged with
  `className`). Override via the `theme` prop: `theme={{ href: { off: "…text-muted" } }}`
  deep-merges with twMerge and drops the built-in `text-gray-500`. One prop per page,
  no component edit.
- `next build` CSS minifies `280ms`→`.28s`, `200ms`→`.2s`, `0.16`→`.16`, so grep the
  built CSS for the shape (`.motion-rise{…calm-rise…}`), not the literal source string.

## T16 — home rebuild: featured selection, motion test pattern, responsive borders (2026-09-10)

- Keep selection rules as a pure lib function (`lib/projects.tsx::selectFeaturedProjects`)
  separate from the presentational component. The page computes the 4 entries and
  passes them in; the component stays dumb and the rule is unit-testable in ms.
  Rule shipped: `featured:true` wins (newest-first), else fall back deterministically
  to the `count` most recent. No content file sets `featured` yet, so the fallback is
  the live path.
- A raw CSS class (`.column-rule`) has NO Tailwind responsive variant — you cannot
  write `lg:column-rule`. For a motif that must change shape across breakpoints, use
  responsive Tailwind border utilities (`border-t lg:border-t-0 lg:border-l lg:pl-8`)
  instead of forcing the custom class into a layout it breaks. Keep the custom class
  for the desktop-only case when possible.
- Node budget baseline that matters: the old 42-card marquee home was **1592** DOM
  nodes at Desktop Chrome; the rebuild is ~206 at 375/768/1280 (measured production,
  `document.querySelectorAll("*").length`). ~87% reduction. The 1500 budget has wide
  headroom now.
- Reduced-motion e2e for the new primitives needs a **positive control** or it passes
  vacuously: assert `.motion-rise` has `animation-name: none` under `reduce`, AND
  `calm-rise` under `no-preference`. `.motion-rise` is a raw class (always emitted),
  so it works without a Tailwind `animate-*` utility in content.
- Home hero at 375: `text-h1-sm` (36px) split "SENIOR / DEVELOPER" awkwardly.
  `text-h2-sm` (30px) on mobile + `sm:text-h1` gives a clean 2-line wrap. Token-only,
  no raw sizes.
- Renaming a key in `e2e/fixtures/expectations.ts` is a repo-wide change:
  `static-routes.spec.ts` also consumed `COPY.home.recentProjectsH2`. Always
  `grep -rn` the old key before/after — `pnpm typecheck` catches it (ts-jest does not).
- Verify home/interactions/static-routes specs at `--retries=0` for the red capture;
  `CI=true` adds retries=2 and hides a deterministic failure behind retries in logs.
- Final capture numbers (production): node 206/207/206, featured links 4, founder
  beats 4, `.animate-marquee*` 0, scrollWidth==clientWidth at 375/768/1280.
  Screenshots + `t16-capture.mjs` in `.omo/evidence/`.

## T17 — projects archive + featured flag (2026-09-11)

- Recovered from a provider-level crash that happened AFTER the feature was
  written but BEFORE commit. Six coherent files were already in the working tree;
  the job was verify + finish evidence + commit, not re-implement. `git status`
  plus `git diff` was enough to confirm the change set was self-consistent.
- T17 reuses `selectFeaturedProjects` from T16 (`lib/projects.tsx`) unchanged:
  the page computes the flagged id set once and passes `featured={set.has(id)}`
  to each `ProjectTeaser`, so the presentational component stays dumb and the
  home + archive pages share ONE selection rule. `FEATURED_PROJECT_COUNT = 4`
  and `MIN_PROJECT_COUNT = 21` remain single-sourced in
  `e2e/fixtures/expectations.ts`.
- A CSS-grid gotcha worth remembering: a Tailwind `truncate` (`white-space:
  nowrap`) `<h3>` inside a grid item sets the track's min-content to the FULL
  title width. `min-w-0` on the inner flex `<a>` is NOT enough — the grid ITEM
  itself (here the Flowbite `Card` root) needs `min-w-0` to shrink below
  min-content. Without it, one long title expands a `grid-cols-1` track past a
  375px viewport (observed scrollWidth 875). One class on the Card fixes every
  row.
- Because `.omo/` is gitignored, new evidence must be `git add -f`-ed; the commit
  scope is still only the 6 product files + evidence/notepad (boulder.json stays
  orchestrator-owned and out of the commit).
- Final: build 38/38; full chromium e2e `CI=true --workers=1` 64 passed TWICE
  (0 failed / 0 flaky); axe-only 8 passed; typecheck/lint/prettier/test green
  (jest 16 suites / 110 passed). /projects = 21 unique entries, 63 anchors,
  4 featured badges, no overflow at 375/768/1280.

## T18 — blog listing + ArticleTeaser card polish (2026-09-11)

- Second provider-crash recovery in a row (T17 was the first). Pattern that works:
  treat the working tree as the source of truth, `git diff` the named files to
  confirm the change set is self-consistent, then verify gates and commit — do
  NOT re-implement. T18 needed no fix; the recovered 4-file diff passed every
  gate on the first clean run.
- The category chip is content-derived, not a hardcoded label: `tags?: readonly
  string[]` is forwarded from `getAllBlogPosts()` and `const [primaryTag] = tags
  ?? []` renders `tags[0]`; the chip is omitted entirely when `tags` is absent or
  empty. Two Jest tests lock this (first tag shown, second tag NOT shown, chip
  absent when no tags). All three `content/blog/*.md` carry `tags:` frontmatter
  (Homelab Automation / Homelab / Recipes), so the live path always resolves.
- Grid-overflow lesson from T17 applied preemptively: the Flowbite `Card` root in
  `ArticleTeaser.tsx` keeps `min-w-0`, and the title uses `line-clamp-2` rather
  than `truncate`. Result: scrollWidth == clientWidth at 375/768/1280 with zero
  extra work. Remember `truncate` (nowrap) sets the grid track min-content to the
  full string width; `line-clamp-*` does not.
- `.omo/` is gitignored, so evidence + notepad files must be `git add -f`-ed.
  Keep the commit scope to the 4 product files + evidence/notepad; `boulder.json`
  is orchestrator-owned and stays out.
- Final: build 38/38; typecheck/lint (0 errors, 47 pre-existing warnings)/
  prettier/contrast/ornaments green; jest 16 suites / 112 passed; full chromium
  e2e `CI=true --workers=1` 64 passed TWICE (0 failed / 0 flaky); axe-only 8
  passed. Optional RSS feed DEFERRED (non-blocking).

## T22 — image pipeline (avif/webp) + own remote image + dead hero JPG (2026-09-11)

- Third provider-crash recovery: the working tree was already the finished T22
  change set. `git diff` + reading `scripts/check-image-size.mjs` confirmed it
  was self-consistent, so no rewrite — only verification + evidence + commit.
- Self-hosting beat an allowlist: `react-markdown` emits a plain `<img>`, so
  `next/image` never optimizes the cheesecake photo — the on-disk webp bytes ship
  verbatim. Self-hosting (`/img/cheesecake-ebeltoft.webp`, 93,924 B) keeps
  `remotePatterns` and CSP `img-src 'self'` un-widened. The `plantoeat` host is
  gone from the live path; it survives only in the explanatory `next.config.mjs`
  comment. The About-page portrait keeps its webp replacement (30.6 KB); only the
  442,942 B `.jpg` original was dropped.
- Gate-is-not-a-tautology proof: `scripts/check-image-size.mjs` is zero-dep and
  stats bytes only. Fed a temp dir with a 300 KB image, a 60 KB `hero-*` image,
  and a 10 KB control → exit 1 with exactly the two right FAIL rows; probe
  removed. Real tree: 99/99 PASS, largest is the new 91.7 KB webp.
- Playwright gotcha: `playwright` is NOT a direct dep — the runnable import is
  `{ chromium } from "@playwright/test"` (no top-level `playwright` in
  `node_modules`, only `@playwright/test`). A probe script under `.omo/` resolves
  bare imports by walking up to the repo `node_modules`.
- `.next` lifecycle gotcha: Playwright's `webServer` runs `pnpm exec next dev
  --port 3030`, which overwrites `.next`. `pnpm start` after an e2e run fails
  with "Could not find a production build". Re-run `pnpm build` immediately
  before any `pnpm start` proof.
- Remote-image live proof (production build, real chromium): naturalWidth 1024,
  naturalHeight 608, complete true, 0 console errors, 0 remotePatterns/next-image/
  CSP mentions. `pass: true`.
- Final: typecheck/lint (0 errors, 47 pre-existing warnings)/prettier/test green
  (jest 16 suites / 112 passed); build 38/38; images 99/99; contrast 24/24;
  ornaments green; full chromium e2e `CI=true --workers=1` 64 passed TWICE
  (0 failed / 0 flaky); axe-only 8 passed.
- T05 note: does not weaken the LCP<2500 budget; only removes the third-party
  origin from the blog-detail critical path. No fresh Lighthouse number claimed.

## T19 — case-study template, additive render (2026-09-11)

- Fourth provider-crash recovery (after T17/T18/T22). Working tree was the
  finished T19 change set: `page.tsx` imports CaseStudyHero/Meta + parseFrontmatter
  and renders hero before `<article>` / meta after the `<h1>`; `lib/markdown.ts`
  exports `markdownFrontmatterSchema` + `MarkdownFrontmatter` + `parseFrontmatter`;
  `lib/markdown.test.ts` adds a `parseFrontmatter` block. No rewrite — verify,
  close the one gap, gate, evidence, commit.
- Closing the enriched-render gap with Jest (a committed `content/projects/*.md`
  would have added a 39th static route and broken the build-count invariant):
  `app/projects/entry/[slug]/page.test.tsx` mocks ONLY the filesystem reader —
  `jest.mock("@/lib/markdown", () => ({ ...jest.requireActual("@/lib/markdown"),
  getMarkdownEntry: jest.fn() }))` — so the REAL `parseFrontmatter` Zod schema is
  the integration under test. `react-markdown` is mocked exactly as the blog page
  test does. This is the right seam: raw frontmatter in, rendered template out.
- The page test typechecked clean only after casting the mocked reader result:
  `{ data, content }` is not a full `matter.GrayMatterFile`, so
  `as unknown as ReturnType<typeof getMarkdownEntry>` is required (a direct `as`
  is rejected by TS). `pnpm typecheck` covers test files — ts-jest does not.
- Test count moved 112 → 126 (16 → 19 suites): +3 parseFrontmatter, +9 CaseStudyMeta/Hero,
  +2 new page test. Build stayed 38/38 because the test mocks the reader and adds
  no content file.
- Fresh 375px overflow proof: temp enriched `content/projects/zz-…md` + a
  `next dev --port 3030` server + a `.omo/t19-overflow.mjs` chromium probe, then
  DELETE the fixture. Result: `documentScrollWidth === documentClientWidth` at
  375/768/1280; heroCount 1, metaCount 1, all role/outcome/metric strings present.
- `PLAYWRIGHT_BROWSERS_PATH` MUST be exported for any standalone probe: the nix
  devShell leaves it `null`, so Playwright resolves the browser path to
  `<repo>/null/chromium_headless_shell-1228/...` and launch fails. The canonical
  e2e command already exports `$HOME/.cache/ms-playwright`.
- Full chromium e2e is 65 tests now (prior 64 + the new `e2e/case-study.spec.ts`);
  it passed 65/65 with 0 flaky on run11 + run12 once host load fell from ~28 to ~11.

## T21 — de-Flowbite targeted replacement (2026-09-11)

- **Port-before-swap that actually stays green:** for each Flowbite primitive,
  write the e2e/Jest assertion on the BEHAVIOR the old and new implementations
  share (toggle open/close, Enter/Space, list semantics, last-crumb non-link,
  `role="status"`), capture a green run on Flowbite, THEN swap, THEN add the
  improved a11y assertion (`aria-expanded`/`aria-controls`, `aria-current`) in
  the same commit. This avoids a red intermediate and proves preservation.
- **Flowbite 0.12.17 a11y gaps (measured, not assumed):** `NavbarToggle` renders
  a bare `<button data-testid="flowbite-navbar-toggle">` with an sr-only
  "Open main menu" and **no** `aria-expanded`/`aria-controls`; `BreadcrumbItem`
  never sets `aria-current` (the last item is just a `<span>`); `Alert` hardcodes
  `role="alert"` before `...restProps` so `role="status"` wins only when passed
  explicitly. The in-tree primitives close all three gaps.
- **Flowbite theme classes were the source of the exact behavior to copy:**
  `NavbarCollapse` = `w-full md:block md:w-auto` + `hidden` when closed (media
  query beats `hidden` on desktop); `NavbarCollapse` renders a `<ul>`; the
  toggle is `md:hidden`. Replicated the same `hidden`/`md:flex` disclosure.
- **Header accessible names must persist for existing tests:** the brand link is
  read as "Tom Segbers Logo Tom Segbers" (Image alt + span); `responsive.spec.ts`
  queries `getByRole("link", { name: "Tom Segbers" })` (substring match) and
  `getByRole("button", { name: /menu/i })` → keep "Open/Close main menu" sr-only.
  The Contact CTA must stay the FIRST "Contact" link inside `<nav>` and keep
  `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft-foreground-dark`
  (Tailwind `outline-none` = `outline: 2px solid transparent`, which is why
  `interactions.spec.ts` asserts `outline-style: solid` + the #DEA48C ring).
- **Breadcrumb truncation chain:** the current crumb needs `min-w-0` on the
  `<li>` AND the `<span>` plus `truncate` on the span; the `<ol>` is the flex
  container. Covered by the existing `responsive.spec.ts` detail-route 375px
  `scrollWidth == clientWidth` assertion (28 passed in `08-breadcrumb-intree.log`).
- **Inline SVG over a dependency:** the hamburger/chevron/X icons are inline
  `<svg aria-hidden>` — no new package. Use Tailwind `size-*` (not `h-* w-*`) to
  avoid the `tailwindcss/enforces-shorthand` warning.
- **Header active-route Jest:** `jest.setup.js` already mocks `next/navigation`
  with `usePathname: jest.fn(() => "/")`; override per-test via
  `jest.mocked(usePathname).mockReturnValue("/about")` and reset in `beforeEach`.
- **Console/DOM oracle for manual QA:** `next dev --port 3031` +
  `{ chromium } from "@playwright/test"` probe captured the full contract
  (aria-expanded false→true→false, aria-controls, nav hidden→visible,
  `aria-current="page"` on the non-link crumb, `role="status"` + Dismiss).
  Kill the listener by the PID from `ss -ltnp | grep :3031` (the nix wrapper
  exits but `next-server` survives `kill $!`).
- Final: 3 atomic commits; typecheck/lint (0 errors, 47 pre-existing warnings)/
  prettier/test (21 suites / 141 tests) green; build 38/38; contrast 24/24;
  ornaments green; images 99/99; full chromium e2e 71 passed (0 failed /
  0 flaky); axe-only 8 passed; storybook smoke 3 suites / 6 tests.


## T23 — purpose-built OG card + lightweight header mark (2026-09-11)

- **`next/image` + local SVG: use `unoptimized`.** The image optimizer has
  `dangerouslyAllowSVG` off, so `/icon/brand-mark.svg` through `next/image`
  without `unoptimized` 400s. A plain `<img>` for the mark trips BOTH
  `@next/next/no-img-element` and an unused-`Image`-import warning (lint went
  47→49). `next/image … unoptimized` renders the SVG verbatim, keeps the
  accessible name/role, and holds lint at the 0-error/47-warning baseline.
- **A shape-agnostic OG test that decodes the served PNG is the honest oracle.**
  `e2e/metadata.spec.ts` reads bytes 16..24 (IHDR width/height, big-endian) of
  the response body and compares against `og:image:width|height`. It passed on
  the OLD 512×512 logo first, then on the new 1200×630 card — so the assertion
  is behaviour-locked, not written to fit the new asset.
- **`locator.getAttribute` on an OPTIONAL tag hangs a full test timeout.** An
  absent `link[rel=canonical]` (home/about/blog/projects have only `og:url`)
  makes Playwright wait 30s. Query optionals with
  `page.evaluate(() => document.querySelector(…)?.getAttribute(…) ?? null)`
  instead. The per-route loop also needs `test.setTimeout(120_000)` — 7 `goto`s
  exceed the default 30s.
- **OG font inlining avoids Chromium TLS trust issues.** Fetch the Google Fonts
  CSS + woff2/ttf in Node (with the host CA bundle), base64-embed as
  `@font-face` data URIs, then `page.setContent` + `document.fonts.ready` +
  `screenshot()`. No network dependency inside the browser; deterministic card.
- **New filename beats same-path cache-bust for OG.** Chose `og-default.png`
  (not a restyled `logo.png`) so crawlers refetch; `logo.png` stays as the
  `authorImgSrc` for 25 markdown cards, so it is NOT dead and must not be
  deleted.
- **`deviceScaleFactor: 1` + explicit 1200×630 viewport** yields a byte-exact
  1200×630 PNG; still decode IHDR to prove it (screenshot settings are not
  evidence).
- Final: build 38/38; full chromium e2e 79 passed (71 prior + 8 metadata) 0
  failed/0 flaky; axe-only 8 passed; contrast 24/24; ornaments/images green;
  lint 0 errors/47 warnings; jest 21/141; typecheck/prettier clean.

## F4 — Scope fidelity audit (2026-09-12)

**Verdict: APPROVE.** Range `e3e8de5~1..HEAD` (31 commits, 74689e8..9567331).
Full table in `.omo/evidence/task-F4-2026-refresh-restyle.txt`.

- Every binding decision D1–D13 provably honored. D12 void (per D13); D9/T29
  and D10/Wave 5 correctly withheld (human-gated) — absence is plan-consistent.
- D13: no toggle, no inline theme script (layout's only `<script>` is JSON-LD),
  no `.dark` class application; `dark:` token count 170 → 123 (net removed).
- D4: all 10 legacy blue hexes gone; warm terracotta `#A63D28` +
  oxblood `#5E2130`; brand-mark and OG warm.
- D11: exactly 2 `flowbite-react` imports remain, both `Card`.
- D5/route audit: 38 static pages; no new route dir; `/impressum`,
  `/datenschutz`, `/work`, `/tags` all absent.
- Forbidden: no `output:'export'`, no route/slug change, no migrations,
  no runtime deps added (@axe/lhci are devDeps; runtime only dropped OTel).
- Fabrication: `content/projects/` unchanged; only content change is the
  cheesecake image swap; no testimonial/metric/role/outcome/heroImage authored.
- Out-of-scope product files: none. `.omo/boulder.json` dirty only in working
  tree, never committed in range.

**Learning — dormant `dark:` is a judgment call, not an automatic D13 fail.**
D13 benchmarks are about *active* theming: toggle, resolver script, applied
`.dark` class. With `darkMode:"class"` and nothing ever adding the class, a
`dark:` string cannot activate. F4 therefore treats the one net-new dormant
token (`ArticleTeaser.tsx:78`, a date span added beside its dormant siblings)
as an observation, not drift. The 13 `dark:*` on the new ContactForm are a
verbatim relocation of the 13 on the old contact page (net 0).

## F1 — Plan compliance audit (2026-09-12)

**Verdict: APPROVE.** Range `e3e8de5..9567331` (31 commits). 22/22 non-gated todos
(T01–T23, minus gated T20) each carry a real commit sha + a real evidence ledger in
`.omo/evidence/task-<ID>-2026-refresh-restyle.txt`. 7/7 human-gated todos (T20,
T24–T29) are `[~]` with no evidence, correctly deferred. Commit messages match the
plan's Commit lines for every task except T07/T15, where the plan's own D13/D4
amendments (plan L70–77) superseded the original lines.

**CI wiring is real, not just written.** Read all four workflow YAMLs and confirmed
each gate is invoked: contrast (check.yml:41), ornaments (check.yml:43), images
(check.yml:45), bundle budget (nextjs_bundle_analysis.yml "Check bundle budget"),
Lighthouse (lighthouse.yml:41 `lhci autorun`), axe/e2e (playwright.yml:38). Re-ran
the four fast gates read-only: contrast 24/24, ornaments 101 files, images 101,
bundle 14 entries — all exit 0.

**Learning — the red Lighthouse gate is environmental, and the diagnosis is sound.**
Independently corroborated: byte-identical bundle (bundle budget PASSES, `__global`
102,254 B vs 102,253 B baseline) yet TBT on `/` jumped 126 ms -> 1601 ms (~12.7x).
Root cause reproduced live: loadavg 27.85 on 22 cores with 20 unrelated
`@stryker-mutator` child workers from ohmyroadmap resident 2h52m. Simulated 4x
throttling compounds the oversubscription. The T02 baseline was ALREADY over LCP
budget on home/projects pre-restyle, so no restyle regression exists. Accepted as a
documented blocker carried to F5, which must produce a genuine green on a quiet host.

**Learning — three named non-blocking gaps carried to the final wave.**
(1) `scripts/check-font-budget.mjs` passes but is wired into NO workflow or package
script (plan T14 said "bundle the assertion") — the only gate that is manual-only.
(2) T01/T05 evidence ledgers exist on disk but were never force-added under the
gitignored `.omo/` (the other 18 were) — verifiable now, not durable across clone.
(3) `.omo/boulder.json` is stale (one "running" task_session from 2026-09-10T20:20Z,
never updated through T23) — a known harness limitation since it cannot parse this
plan's checkbox format, per the task framing.

## F2 — Code quality review (2026-09-12)

Verdict: **APPROVE**. Evidence: `.omo/evidence/task-F2-2026-refresh-restyle.txt`.

Gate baseline at HEAD `9567331` (clean product tree): typecheck 0; lint 0 errors / 47
pre-existing warnings (zero new); prettier clean; jest 21/21 suites, 141/141 tests;
contrast 24/24; ornaments 101 files; images 101 within budget.

**R4.14:** no module exceeds 250 logic LOC. Largest *product* module is
`app/contact/ContactForm.tsx` (≈136 logic / 180 upper-bound incl. JSX). Files >200 logic
are tests/e2e and zero-dep CLI checker scripts (SIZE_OK class). New T21/T19/T16
primitives are 16–66 logic LOC.

**Type safety:** no `as any` / `@ts-ignore` / `@ts-expect-error` / `eslint-disable` in
product code. The only new `as unknown as` is a test fixture
(`app/projects/entry/[slug]/page.test.tsx:25`). Boundaries parse via Zod
(`parseFrontmatter(data: unknown)`; contact form `safeParse`).

**Error handling:** no empty catch, no swallowed errors, no `console.*` in product code;
`lib/sendEmail.tsx` keeps await-to-js + discriminated `SendEmailResult` (unchanged).

**AI slop:** clean across the 10 categories. No TODO/FIXME/HACK, no `.skip(`/`.only(`.
Three documented nits: (1) DESIGN.md §5 / README still list Navbar+Breadcrumb as Flowbite
primitives after T21 replaced them (doc drift only); (2) pre-existing unused `imageUrl`
prop on `ProjectTeaser.tsx`; (3) two inert dormant `dark:*` carry-overs.

**D13 single light mode:** no theme toggle / resolver / `localStorage` anywhere; new
primitives carry zero `dark:`. `ContactForm.tsx`'s 13 dormant `dark:*` are a verbatim
relocation of the old page's 13 (net delta 0); `ArticleTeaser` gained one dormant
`dark:text-muted`. Both inert under `darkMode:"class"` and explicitly permitted by
DESIGN.md §2. Net: the plan removed more dormant `dark:*` than it added.

Carried forward (not F2 code scope): G1 — font-budget gate still not wired into CI
(re-confirmed). No product code was modified by this review.

## F2/F1 follow-up — font budget gate wiring (2026-09-12T01:50:36+02:00)

Closed the F1 plan-compliance MAJOR gap: T14 required bundling the font-budget
assertion, but `scripts/check-font-budget.mjs` was wired into no package script
and no CI workflow.

Changes (wiring only — no script logic touched):
- `package.json`: added `"fonts": "node scripts/check-font-budget.mjs"` after `"images"`.
- `.forgejo/workflows/check.yml`: added `Font budget gate` step (`nix develop -c pnpm fonts`)
  immediately after `Image size gate` (line 46), which is after `Build` (line 34) so
  the gate can read `.next`.

Evidence:
- `nix develop -c bash -c 'unset PNPM_HOME npm_config_prefix; pnpm fonts'` → EXIT 0,
  `FONT BUDGET GATE PASSED — 2 families, first-load 70.7 KiB.` (Inter 47.3 + Newsreader 23.4).
- `check.yml` parses as valid YAML via `js-yaml@4.3.0`.
- `pnpm prettier` → clean (All matched files use Prettier code style!).
- (The `Refusing to run pnpm@10.15.1 … registry signature` line is the known benign
  devShell shellHook probe noted in README; pnpm still runs.)

Commit: `ci(design): wire font budget gate into CI`.

## F3 — Real manual QA (2026-09-12)

Verdict: **APPROVE**. Evidence: `.omo/evidence/task-F3-2026-refresh-restyle.txt`,
screenshots under `.omo/evidence/f3/shots/` (23 PNGs).

Journey home → featured → project detail → blog listing → blog post → contact on a
clean PRODUCTION build (38/38 pages): 57 checks, 0 console errors, 0 warnings,
18/18 overflow checks pass (375/768/1280), all keyboard + reduced-motion assertions
pass, axe `e2e/a11y.spec.ts` 8 passed against the empty allowlist. Legacy case-study
degrade verified (0 hero/0 meta); enriched path verified with a temporary fixture
then deleted. OG asset 1200×630 wired absolute on all routes; brand mark 200 + alt.

**Env trap (important for future QA):** running the axe suite starts Playwright's
own `next dev --port 3030`, which OVERWRITES the production `.next` and removes
`BUILD_ID`. Probes run against the still-listening prod server afterwards silently
serve CSS-less dev output (`#site-nav` display:block at 375, 21px inputs). Always
rebuild + restart prod after any `playwright test` run before trusting responsive
readings. No product code changed to work around it.

**One real visual defect, PRE-EXISTING (not a refresh regression):** the contact
success toast (`fixed inset-x-1/3 top-8 z-50`) overlaps the header nav links by 6px
= 35% of their 17px glyph height at ≥768px scrollY=0. Provenance: original commit
`e606a99` (Flowbite Alert) carried verbatim through T21 (`272bb2b`/`fe98d41`).
Recorded in issues.md; do NOT fix in F3 (scope: no product changes).

**By-design, do not re-flag:** FounderArc `Background` shows 4 labels with no copy —
T16 scaffold, T25 copy is `[~]` human-gated; 3-post blog grid leaves one cell empty
(content count); legacy project detail has no hero/meta (intended degrade);
blog H1 is DOM "Blog" rendered uppercase via CSS.

## F2 follow-up — T21 doc drift corrected (2026-09-12)

Closed the F2 "COMPONENT doc drift" nit: README.md + DESIGN.md still described
Navbar/Breadcrumb/Alert as Flowbite primitives after T21 replaced them in-tree.

- `README.md`: Flowbite bullet now states `Card`-only; components tree gained the
  6 real components that were missing (`Alert/`, `Breadcrumb/`, `CaseStudyMeta/`,
  `FeaturedSet/`, `FounderArc/`, `Providers/`) and `Header/` no longer says
  "Flowbite Navbar". Tree now matches `ls components/` exactly (14 entries).
- `DESIGN.md` §5: "Flowbite primitives" → "Component primitives"; names the
  in-tree header/breadcrumb/alert/tooltip-provider and keeps Flowbite only for
  `Card`.
- `DESIGN.md` focus paragraph: the old claim "Primary Flowbite-pattern CTAs
  retain their compatible `primary-*` focus rings" was FALSE — `grep -rn
  "ring-primary"` returns zero hits; the header CTA uses
  `focus-visible:ring-accent-soft-foreground-dark`. Replaced with the real
  behaviour (solid CTAs use the darker ring variant for contrast on filled
  terracotta).
- Verified: `grep -rn "Flowbite Navbar"` → no match; `pnpm ornaments` → PASS;
  README tree == real `components/` dir. Doc-only, no product code touched.
- Commit: `2ca9583 docs: correct Flowbite primitive references after T21`.
- Lesson: when a task replaces a third-party primitive with an in-tree one,
  grep the docs for the old library name in the SAME commit — the code grep
  ("no import remains") passes while prose silently lies.

## F2 follow-up — README script table drift corrected (2026-09-12)

Second doc-drift item from F2: the README "Available Scripts" table claims
"From `package.json`:" but was missing the five gates this plan added.

- Added rows: `pnpm typecheck`, `pnpm contrast`, `pnpm ornaments`, `pnpm images`,
  `pnpm fonts` (grouped: typecheck in the lint/quality block; the four gates after
  `budget:bundle`).
- Intentionally omitted: `budget:lighthouse` (a pure alias of `lighthouse`),
  `postinstall` (internal `patch-package` hook), `screenshots:update` (not a
  contributor gate) — the table documents contributor-facing scripts only.
- All 25 table rows are exactly 84 chars, preserving the existing alignment.
- Parity oracle used:
  `node -e '… pkg.filter(x=>!t.includes("`pnpm "+x+"`"))'` → now reports only the
  three intentionally-omitted scripts.
- Commit: `d8d4017 docs: document design and quality gate scripts in README`.
- Lesson: when a plan adds a `package.json` script, the README scripts table is a
  same-commit update target (R5.2). Neither `pnpm lint` nor `pnpm prettier` covers
  `.md`, so markdown drift is invisible to the code gates.

## F2 follow-up — README structure tree + Flowbite wiring corrected (2026-09-12)

Third and fourth doc-drift items from F2 (after the scripts-table fix):

- Structure tree was stale: listed 3 of 5 workflows, 3 of 13 e2e specs, omitted
  `app/api/health/route.ts`, `lib/projects.test.ts`, `tests/budgets/`, and all
  but one `scripts/*`. Synced in `7a87fa7 docs: sync project structure tree with
  repository` — compact summaries used where lists would re-drift.
- `styles/tailwind.css` comment falsely claimed it "imports Flowbite". Flowbite
  is wired in `tailwind.config.js` (content glob + `plugins: require("flowbite/plugin")`).
  Corrected in `bfaae25 docs: correct Flowbite wiring reference in README tree`,
  which also commented `tailwind.config.js`.
- **Root cause of all four drift items:** the plan touched `package.json` scripts,
  CI workflows, e2e specs, and components, but no task owned README/AGENTS prose.
  R5.2 is `[manual]`, so nothing flagged it — the code gates (`lint`, `prettier`)
  do not cover `.md`.
- **Lesson:** a "restyle" plan that adds gates/scripts/specs must include a
  same-plan README/AGENTS truthfulness task, or complete it in the orchestrator's
  close-out. The `.md` files are invisible to every automated gate.

## 2026-09-12 — Gate falsifiability audit (all 5 scripts proven to fail)

F1's core finding was an *unwired* gate (font budget). The adjacent defect class
is an *unfalsifiable* gate — one that always exits 0, producing a false green.
Orchestrator proved each gate actually fails on a real violation, using injected
fixtures (the gates were built to accept them; no repo state was mutated):

| Gate | Negative probe | Result |
| --- | --- | --- |
| `check-contrast.mjs <manifest>` | `#999999` on `#ffffff` (2.85:1, text min 4.5) | exit 1 ✔ |
| `check-contrast.mjs <manifest>` | unknown `kind:"mystery"` | exit 1 ✔ |
| `check-image-size.mjs <root>` | 250 000 B webp vs 200 KB budget | exit 1 ✔ |
| `check-ornaments.mjs` | temp `zzz-ornament-probe.ts` containing `"gold"` | exit 1 ✔ (probe deleted) |
| `check-font-budget.mjs` | sandbox `.next` with 3 `@font-face` families | exit 1 ✔ |
| `check-font-budget.mjs` | Newsreader absent from built CSS | exit 1 ✔ |
| `check-bundle-budget.mjs` | route +62.5% vs baseline (limit +10%) | exit 1 ✔ |
| `check-bundle-budget.mjs` | `__global` 140 KB vs 130 KB shared budget | exit 1 ✔ |
| `check-bundle-budget.mjs` | baseline file deleted | exit 1 ✔ (loud, not silent) |

Happy-path positive controls for each also exit 0. No repo file changed; no
`.next` rebuild needed (font/bundle gates resolve paths from their own location,
so a sandboxed copy exercises the real logic). Tree clean afterwards.

**Lesson:** when a plan's completion depends on budget gates, verify them in
*both* directions — wired AND falsifiable. A gate that cannot fail is a
documented green light on a red road.

## 2026-09-12 — D13 (single light mode) confirmed at source level

F4 asserted D13 from behavior; orchestrator added the source-level proof that the
dormant `dark:*` utilities F2 noted can never activate:

- `tailwind.config.js` sets `darkMode: "class"` (NOT the v3 default `"media"`).
  Under `"class"`, a `dark:*` utility only applies when an ancestor has `.dark`.
- No code path ever adds it: grep across `app/`, `components/`, `lib/`, `styles/`
  finds zero `classList.add('dark')`, `toggle('dark')`, `setAttribute(... 'dark')`,
  `documentElement...dark`, or `localStorage` theme writes.
- No raw `@media (prefers-color-scheme: dark)` CSS exists anywhere, so nothing
  bypasses the class strategy at the CSS layer.
- `e2e/dark-mode.spec.ts` (retained filename) locks this: asserts no `.dark` class,
  light `body` bg `rgb(245,239,225)`, no `data-testid="dark-theme-toggle"`, no
  `prefers-color-scheme` in served HTML, empty `localStorage`, and single-scheme
  (`["light"]`) axe contrast scans. It explicitly emulates OS dark and requires
  the app to ignore it.

**Conclusion:** the carry-over `dark:*` classes are provably inert. D13 holds with
defense in depth (config + no-writer + no-CSS-escape + e2e lock). No product change.

## 2026-09-12 — CI workflow wiring audit (all 5 workflows, ordering verified)

F1 proved the gates were wired; this audit proved the wiring is *correct in shape*:

| Workflow | Invokes | Ordering check |
| --- | --- | --- |
| `check.yml` | typecheck, build, lint, prettier, contrast, ornaments, images, fonts, test, storybook smoke | `build` (L35) precedes `fonts` (L47) — required, the gate reads `.next` ✔ |
| `nextjs_bundle_analysis.yml` | build → `node report-bundle-size.js` → `node scripts/check-bundle-budget.mjs` | analyze writes `.next/analyze/__bundle_analysis.json`, budget gate reads the same path ✔ |
| `playwright.yml` | `pnpm exec playwright test --project=chromium` | browser installed before run ✔ |
| `lighthouse.yml` | build → `pnpm exec lhci autorun` | build precedes serve; `.lighthouserc.js` `startServerCommand: pnpm start` needs `.next` ✔ |
| `screenshots.yml` | build → `pnpm screenshots:update` → commit | path-triggered (`app|components|content|styles|public/**`), `[skip ci]` prevents a loop ✔ |

Cross-refs verified:
- Every `pnpm <script>` / `node scripts/*` named in a workflow exists in
  `package.json` (or on disk for `report-bundle-size.js`). No dangling reference.
- `report-bundle-size.js` (tracked, root) writes `.next/analyze/__bundle_analysis.json`
  (L74-75) — exact path the budget gate reads. `@next/bundle-analyzer` is wired in
  `next.config.mjs` with `enabled: env.ANALYZE`.
- `.lighthouserc.js` (tracked) resolves Chrome from Playwright cache or PATH; the
  mobile throttling profile and 2500 ms LCP / 0.1 CLS / 200 ms TBT budgets are
  explicit, so an LH upgrade cannot silently move the baseline.

**Conclusion:** no unwired or mis-ordered gate remains. All CI references resolve.

## 2026-09-12 — Secret hygiene audit (R18.1) — clean

- No `.env*` file other than `.envrc` (`use flake`) is tracked; no `.env`/`.env.local`
  ever appears in history (`git log --all --diff-filter=A -- .env*` empty).
- `.gitignore` covers `.env`, `.env.local`, and all three `.local` variants.
- High-signal secret scan over all tracked files (excluding `pnpm-lock.yaml`) for
  Resend (`re_`), OpenAI (`sk-`), AWS (`AKIA`), GitHub (`ghp_`), and PEM private-key
  headers → **zero matches**.
- `RESEND_API_KEY` is read only via `env.mjs` (`z.string().optional()`), consumed in
  `lib/sendEmail.tsx`; the only literal is the obviously-fake `"test-resend-key"` in
  the Jest mock. No product code embeds a key.
- Note: an empty push to `.env*` history is expected because `RESEND_API_KEY` was
  always CI/Vercel-injected.

**Conclusion:** no secret is committed. R18.1 holds.

## 2026-09-12 — Binding decisions D1–D13 confirmed at source level

F4 asserted fidelity from diffs; this audit confirms each decision against the
files themselves (Round-2 resolutions supersede the Round-1 table):

| # | Resolution | Source evidence | Result |
| --- | --- | --- | --- |
| D2 | Marquee UX-call | no `marquee` in `app/page.tsx`/components (only a historical comment in TooltipProvider) | retired ✔ |
| D3 | Two fonts Inter + Newsreader | `app/layout.tsx` imports both from `next/font/google`; only these two in built CSS | ✔ |
| D4 | Two warm accents, no blue (R2 supersedes `#2563eb`) | 0 blue palette classes / blue hex in product code or tokens; terracotta `#A63D28` + oxblood `#5E2130` present | ✔ |
| D5 | Featured flag inside `/projects`, no `/work` | `app/projects/page.tsx` uses `selectFeaturedProjects` + `data-featured`; no `app/work` route or `/work` refs | ✔ |
| D6 | LAYZR included (needs clearance) | absent from `content/projects/` — correctly gated to T26/T28 | gated ✔ |
| D7 | Cheesecake kept in blog | `content/blog/2019-ebeltoft-cheesecake-recipe.md` present, no archive route | ✔ |
| D9 | Tag pages included — deferred | no `app/tags` route (T29 human-gated) | deferred ✔ |
| D11 | Targeted Flowbite, keep `Card` | only `Card` imported from `flowbite-react` (ArticleTeaser, ProjectTeaser); Header/Breadcrumb/Alert in-tree | ✔ |
| D12 | Theme key voided by D13 | `flowbite-theme-mode` absent from all source | voided ✔ |
| D13 | One light mode, parchment, no blue | `darkMode:"class"` + no writer + no CSS escape; `surface.DEFAULT #F5EFE1`; no blue | ✔ |

Note: `accent.light` == `accent.DEFAULT` (`#A63D28`) is an intentional semantic alias
(DESIGN.md: "Filled button surface"), not drift. `D1`, `D8`, `D10` are scope/content
items owned by Wave 5 (T20/T24–T29), not code invariants.

**Conclusion:** every code-enforceable binding decision holds. No product change.

## 2026-09-12 — F5 code-gate greens still valid (no product change since)

F5's code-controlled gates ran green at HEAD `88c68f9`:
typecheck · lint (0 err/47 warn) · prettier · jest · build (38/38, 102 kB shared) ·
contrast (24/24) · ornaments · images (101) · fonts (70.7 KiB) · bundle budget (14/14) ·
e2e (79) · axe (8).

Since `88c68f9`, the **only non-`.omo` files changed are `DESIGN.md` and `README.md`**:

```
git diff --name-only 88c68f9..HEAD -- . ':(exclude).omo'
→ DESIGN.md
→ README.md
```

Product code (`app/`, `components/`, `lib/`, `scripts/`, configs, CSS) is byte-identical.
Therefore every F5 code-gate result still holds at the current HEAD; the only F5 item
outstanding is the Lighthouse mobile-budget run, which is host-blocked (see F5 evidence
§5). Re-running the full code gate suite is unnecessary until product code changes again.

Caveat: this is a *logical* carry-forward, not a fresh re-run. If any code gate is ever
re-executed it must be on a quiet host; and the Lighthouse numbers must be (re)collected
on the same quiet host before F5 can be marked green.

## 2026-09-12 — Process-rule spot audit (R20.3, R19.8) — pass

- **R20.3 evidence freshness:** all **27/27** `task-*-2026-refresh-restyle.txt`
  ledgers carry a collection timestamp. Formats vary (`Date (UTC):`, `date_utc:`,
  `Collected (UTC):`, `^- Collected:`), so a naive single-pattern grep reports
  false negatives — check for any of the four.
- **R19.8 plan TL;DR:** present (`## TL;DR (For humans)` + a machine TL;DR line).
- **R20.2 triage tree:** exercised for real earlier — T17/T18/T22 worker crashes were
  classified (provider failure, not regression) and recovered on a working category;
  F5 host contention was triaged as environmental with a documented resume path.

No change required; recorded for completeness so the next session does not re-audit.

## 2026-09-12 — F5 carry-forward, exact file list at HEAD

`git diff --name-only 88c68f9..HEAD -- . ':(exclude).omo'` now returns exactly:
- `DESIGN.md`
- `README.md`
- `e2e/dark-mode.spec.ts`  ← comment-only (verified: the changed lines are all
  inside a `/** … */` JSDoc block; no executable/assertion line moved)

The spec edit cannot change runtime test behavior, so every F5 code-gate result
(typecheck, lint, prettier, jest, build, contrast, ornaments, images, fonts,
bundle, e2e, axe) still carries forward unchanged. No product code touched since
the green run. The sole outstanding F5 item remains the host-blocked Lighthouse
mobile-budget collection.

## 2026-09-12 — Commit & artifact hygiene audit (R3.3) — pass

- All **51** commits ahead of `origin/main` match Conventional Commits
  (`feat|fix|docs|chore|refactor|test|perf|ci|style|build|revert`). Zero
  non-conventional subjects; zero merge commits (linear history).
- The pre-commit `commit-msg` hook (R3.3, `.pre-commit-config.yaml`) therefore
  passed on every commit — no commit bypassed it (no `--no-verify` anywhere).
- No build/tool artifacts tracked: `git ls-files` shows nothing under `.next/`,
  `.lighthouseci/`, `null/`, `playwright-report/`, `storybook-static/`, `coverage/`.
  The recurring `null/` codegraph artifact is confirmed untracked.

**Conclusion:** release hygiene holds. Nothing to fix.

## 2026-09-12 — Changed spec passes Prettier (R3.1)

`e2e/dark-mode.spec.ts` (comment-only edit) verified:
- `pnpm exec prettier --check e2e/dark-mode.spec.ts` → exit 0 ("All matched files
  use Prettier code style!"). The R3.1 formatting gate is not regressed.
- `pnpm exec eslint e2e/dark-mode.spec.ts` could not complete: killed by the
  180 s tool timeout because the host is at loadavg ~54 (external Stryker, 23
  workers). This is environmental, not a code signal — and the edit is
  comment-only, so no lint rule can be affected. Re-run when the host is quiet.
