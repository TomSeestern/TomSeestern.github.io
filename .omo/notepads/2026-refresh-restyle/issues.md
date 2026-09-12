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

## T05 — Lighthouse CI budgets (2026-09-10)

- The T05 gate is RED at revision 1b1062e on the LCP budget only (2500 ms), 3 of 7 routes:
  `/` ~2589 ms, `/projects` ~2586–2632 ms, `/blog/entry/2019-ebeltoft-cheesecake-recipe`
  ~3645–3690 ms. Low variance across two full runs and verified `formFactor=mobile`,
  `cpuSlowdownMultiplier=4`, `throttlingMethod=simulate` — not host noise. Budgets were NOT
  weakened (task MUST NOT). CLS (<=0.0375) and TBT (29–82 ms) pass on every route.
- `/` and `/projects` already exceeded 2500 in the T02 single-run baseline (2830 / 2588), so
  the LCP overage is pre-existing, not introduced by T05. Expected to clear with the restyle
  (D-series); the blog-detail overage is the remote `plantoeat.s3.amazonaws.com` LCP image,
  fixed in T22.
- The blog-detail route LCP element is the only remote image in the corpus; both the T02
  baseline and T05 agree it dominates LCP. Keep it as a tracked follow-up (T22), do not relax
  the 2500 ms budget.
- Local `.lighthouseci/` (LHCI saves reports there unconditionally) is left untracked and is
  intentionally NOT committed; it was out of the T05 commit scope. CI captures it via
  `upload-artifact`. Adding `.lighthouseci/` to `.gitignore` is a clean follow-up if desired.
- `npx -y @lhci/cli autorun` (acceptance form) resolved the local devDep `@lhci/cli@0.15.1`;
  exit 1 is the assertion result, not an npx/install failure (healthcheck printed "passed").
- T05 cleanup: `.lighthouseci/` added to `.gitignore` ("# testing" section) and the generated directory removed; commit `4c24843`. Regenerable via `lhci autorun`.

## T06 — e2e harness extensions (2026-09-10)

- **Touch targets do not meet 44px today.** Measured at 375px: header Contact CTA
  87×40, dark toggle 40×40, hamburger 40×40, home CTAs 40–42, mobile-menu links
  359×41, blog "Read more" 107×24, footer social 32×32, contact inputs 42 tall.
  Only the contact submit (145×44), the message textarea, and the project-card
  description links are ≥44. Product code MUST NOT change in T06, so the responsive
  harness asserts the 44px target only where it is met (contact submit + textarea)
  and adds a WCAG 2.2 AA 24px floor audit for everything else. This is NOT a
  weakened assertion — it is a new gate plus a recorded gap. Follow-up for the
  restyle waves: raise header/CTA targets to 44 and tighten the floor.
- Dark-mode contrast debt is real (`/` dark ×9, `/blog` dark ×6, `/projects` dark
  ×21, `/about` light ×2) and stays parked in the a11y allowlist. To avoid
  duplicating that allowlist in `dark-mode.spec.ts`, the new contrast tests scan
  only routes that are clean in both schemes (`/contact`, one blog detail, one
  project detail). The full scan stays in `a11y.spec.ts`.
- `4c24843` (ignore lhci artifacts) landed concurrently at 21:32 +0200; it touches
  `.gitignore` only, so the T06 before/after e2e comparison is unaffected.
- Pre-existing, not T06: firefox/webkit cannot launch (no system libs) and the
  default-worker chromium run flakes on `next dev`. The reliable command remains
  `CI=true ... --project=chromium --workers=1` (T04 issues §).

## T07 — single light mode (2026-09-10)

- **The acceptance grep and the spec conflict if the spec names the key.** The
  first draft asserted `localStorage.getItem("flowbite-theme-mode")`/HTML
  `.not.toContain(...)`, which makes `grep -ri "flowbite-theme-mode" ... e2e`
  non-empty. Replaced with behavior-only assertions (no literal). Watch this for
  any future "prove X is gone" test where the grep is itself the gate.
- Capturing the red run with `CI=true` also enables `retries=2`, so the failing
  test executes up to 3× (and `next dev` cold compiles each time). Used
  `--retries=0` for the red capture; the canonical acceptance run keeps `CI=true`.
- `--project=firefox`/`webkit` still cannot launch (pre-existing, no system libs).
  Do not chase them in T07; the required command is chromium-only.



## T08 — plan's grep acceptance conflicts with its zero-visual-change mandate (2026-09-10)

- T08 acceptance says "grep for raw heading utilities in `app/` returns none", but its
  own MUST-DO rule says "only replace raw utilities with tokens that resolve to the
  SAME value; if unsure, leave it" and MUST-NOT says "do not change any visual value".
  These are mutually exclusive: NO raw heading utility in `app/` has an exact token
  equivalent (all token line-heights differ). Applying the plan's example
  (`app/page.tsx:44 text-4xl…` → `text-h1-sm`) WITHOUT keeping `leading-none` changes
  line-height 36px→39.6px; the section h2s would change 40px→39.6px. Measured.
- Resolution taken: exact swaps only (hero h1, keeping `leading-none` + `md:text-h1`),
  everything else left with per-case measured diffs recorded in the evidence file.
  `grep` therefore still reports `lg:text-6xl` (no token exists), the two section h2s,
  and `app/not-found.tsx` `md:text-4xl`. This is a deliberate refuse-to-drift call;
  T14/T16 own the visual normalization of `/`.
- Spurious "accidental key" note: `rounded-0.5md` / `font-open-sans` / `text-2xs` are
  NOT in `tailwind.config.js` at all — they are undefined utility classes local to
  Tooltip.tsx (T11). There was nothing to delete from config; deferred to T11.
- `pkill -f` self-match killed the build shell (see learnings). Use explicit PIDs.

## T10 — additive frontmatter fields (2026-09-10)

- `metrics.value` is typed `z.string()` by spec, but YAML numbers are common in
  hand-authored metrics. `value: 1200` (unquoted) parses as number 1200, fails
  the string schema, and silently `.catch([])`-es the WHOLE metrics array to `[]`
  — no per-item fallback. Content must quote numeric values (`value: "1200"`).
  Flag for T19 authoring.
- `pnpm prettier` failed on the new test file after the first edit (mixed quote
  styles in the joined frontmatter fixture); `pnpm exec prettier --write
  lib/markdown.test.ts` fixed it and the test stayed green. Always re-run the
  focused test after formatting before committing.
- No new risk to existing content: `git diff --stat content/` empty, build 38/38,
  validator COUNT 21.

## T10 regression — tsc --noEmit missed by Jest/build (2026-09-10)

- Adding fields to `MarkdownEntry` broke `app/blog/page.test.tsx` (3 mocks) and
  `app/projects/page.test.tsx` (3 mocks) with TS2740 — `pnpm test` stayed green
  (ts-jest transpiles without type-checking) and `pnpm build` only type-checks
  the production graph, so neither caught it. `pnpm typecheck` (tsc --noEmit)
  did. **Rule: every additive `MarkdownEntry`/schema task MUST run `pnpm
  typecheck`, alongside test+build.**
- Fixed with a local `makeBlogPost` / `makeProject` factory (defaults for all 13
  fields incl. the 6 new ones, `id` + `Partial<MarkdownEntry>` overrides) so a
  future additive field fails to compile in ONE place per file, not 6 literals.
  Production code and schema untouched. Verify: typecheck 0, test 0 (15 suites,
  102 passed), lint 0, prettier 0.

## T09 — dead deps + README drift (2026-09-10)

- `task_update` for T-69efb5b1 returned `task_lock_unavailable` once (todo sync
  race); retried and completed. Harness issue, not a code issue.
- No blockers. Pure removal + doc truthing; build/install/lint/prettier all green.

## T12 — contact a11y split (2026-09-10)

- `tsc --noEmit` (`pnpm typecheck`) is RED with 6 errors in `app/blog/page.test.tsx`
  and `app/projects/page.test.tsx`: their `MarkdownEntry` fixtures predate T10's
  additive frontmatter fields (tags/featured/role/outcome/…). Pre-existing, outside
  T12 scope, not fixed. `pnpm build` (which type-checks) stays green because the
  Next build excludes/ignores these test files. Follow-up needed if `typecheck` is
  ever made a gate.
- The `next start -p 3060` + curl + `kill $SRV; wait $SRV` one-liner hung the shell
  for the full tool timeout even though curl had already returned HTTP 200 and
  written the HTML. Use explicit PID kill without `wait`, or read the prerendered
  `.next/server/app/contact.html` directly. No product impact.

## T11 — tooltip provider hoist (2026-09-10)

- The brief's "Commit ONLY" list (TooltipProvider.tsx, Tooltip.tsx, Tooltip.test.tsx,
  app/layout.tsx) omitted consumers that the hoist NECESSARILY breaks, because
  `Tooltip.Root` throws with no ancestor provider. Included, with justification:
  `components/ProjectTeaser/ProjectTeaser.test.tsx` (wrap renders) and
  `components/ProjectTeaser/ProjectTeaser.stories.tsx` (wrap decorator) — without
  them Jest and Storybook smoke go red. R19.4: the plan's scope was wrong.
- Browser-level keyboard-focus coverage for tooltips is impossible: every production
  trigger is a decorative `<img>`/`<span>` with no tabindex, and adding one would
  change interaction semantics (forbidden). Playwright covers hover + delayed-open +
  Escape; Jest covers focus. No code change made.
- `grep -rn "RadixTooltip.Provider" components/` returns exactly one location
  (TooltipProvider.tsx:18). `grep -o | wc -l` reports 2 because the open and close tag
  of that one element share the same line — not two providers.
- A single shared provider also shares Radix's `skipDelayDuration` (default 300ms), so
  moving between two icons within 300ms now opens the second instantly; previously
  each icon had its own provider. Accepted as the intended benefit of the hoist; the
  200ms delayed-open path is asserted in e2e.

## T13 — palette change shifted Flowbite breadcrumb contrast (2026-09-10)

- The parchment surface (#F5EFE1) is darker than white, so Flowbite React
  BreadcrumbItem's built-in `text-gray-500` (#6b7280) dropped from >4.5:1 on white
  to **4.22:1** on parchment. It fires `color-contrast` ×1 on each detail page
  (`/blog/entry/2019-...`, `/projects/entry/2020-...`). The class is Flowbite
  COMPONENT theming, not a semantic token; T13 must not touch component files, so
  both nodes are allowlisted with **T15** as owner. T15 must recolor the breadcrumb
  to a warm token (`text-muted` #5C5548 = 6.43:1) and delete the rows.
- The 2 former `/about` light entries are GONE (the /about badge + supporting text
  now pass), so the stale rows were removed as required — the allowlist went from
  1 row (/about ×2) to 2 rows (detail pages ×1 each), still self-cleaning.
- `accent-soft` semantic collision (see learnings): using it for both the focus
  ring and the chip background forced a mid-terracotta value. T15 should decide
  whether to keep filled chips (#BE6A50 + #1F0F0A) or split the ring/chip tokens.
- Not yet wired into CI: `scripts/check-contrast.mjs` is the token-change gate but
  no workflow step runs it. Candidate follow-up for the CI task.

## T13 — no blockers

- Build 38/38, lint 0 errors (55 pre-existing warnings), prettier clean, jest 102
  passed, axe 8 passed, contrast gate 24/24. Scope stayed inside the token layer.

## T14 — font budget forced a design tradeoff (2026-09-10)

- The task budget (total ≤100 KiB, Newsreader ≤60 KiB) is only satisfiable by reading
  "shipped" as the **preloaded latin** payload. Summing every emitted
  `.next/static/media/*.woff2` is impossible for the google path: Inter alone emits 6
  unicode-range subsets totalling ~214 KiB. The gate asserts the preloaded set and prints
  the all-subset total for visibility. If the all-file sum was intended, only
  `next/font/local` with hand-subset latin files could reach 100 KiB for two families.
- Newsreader's variable latin face is 58 KiB. Multi-weight `next/font` requests returned
  the variable face and blew the budget; shipped config uses a single static weight (700).
  H1 (token weight 800) renders the 700 face with no synthesis (verified), so h1/h2 now
  share one weight and hierarchy is size-only. T15/T16 may revisit if a 2nd weight
  (+23 KiB) is worth it.
- Heading tracking uses `!important` in `styles/tailwind.css` to beat the legacy
  `tracking-tight` utilities on four page-owned headings (`app/page.tsx` ×2,
  `app/not-found.tsx` ×2). Clean up when T15/T16 normalise those files.
- e2e `next dev` rebuilt `.next` as a dev build and made `check-font-budget.mjs` report
  0 families until a production rebuild — gate/capture ordering matters.

## T15 — pre-existing e2e failures exposed, not caused (2026-09-10)

- The full chromium e2e suite is RED at 4 tests both before and after T15, and the set
  shrank: stashed HEAD (pre-T15) = 6 failed / 5 passed; post-T15 = 4 failed / 58 passed.
  T15's breadcrumb recolor fixed the 2 detail-route `color-contrast` failures and
  introduced none.
- Remaining 4 are stale expectations created by T13's palette remap, both outside T15's
  commit scope:
  - `e2e/dark-mode.spec.ts:17` pins `lightSurface = "rgb(255, 255, 255)"`; the real
    surface is now parchment `#F5EFE1` (rgb(245,239,225)). Last touched in T07
    (`d792fff`), never updated by T13.
  - `e2e/interactions.spec.ts:54,87` pin the old blue focus ring `rgb(147,197,253)`;
    T13 remapped the ring to the warm `accent-soft` family (`#DEA48C` renders). Last
    touched in T06 (`6cb97a6`).
  `interactions.spec.ts` is explicitly owned by T16; `dark-mode.spec.ts` needs a
  T13-follow-up to tokenize its surface assertion.
- Proof method that settled pre-existing-vs-regression: `git stash push -- <T15 paths>`,
  run the two specs, then `git stash pop`. Establish it with a stashed-HEAD run, not
  git-log reasoning alone.
- `task_update` returned `task_lock_unavailable` once (same harness race as T09);
  retried and completed.
- **Rule:** a palette/token change MUST update any hardcoded colour assertion in
  `e2e/` in the SAME commit. T13 remapped `surface` and the focus rings but left
  `e2e/dark-mode.spec.ts` (white surface) and `e2e/interactions.spec.ts` (blue
  ring) asserting the old values, so the suite stayed red across two tasks. Fix
  (`test(e2e): update stale palette assertions after token remap`) measured the
  computed values from the production build: body = `rgb(245,239,225)`
  (`surface.DEFAULT` #F5EFE1), CTA ring = `rgb(222,164,140)`
  (`accent.soft-foreground-dark` #DEA48C). Note the CTA ring is the
  `-soft-foreground-dark` token, NOT `accent.soft`; general links/cards use
  `ring-accent-soft` = `rgb(190,106,80)` (#BE6A50). Full chromium suite 62/62.

## T16 — orphaned `next-server` produced a mixed `.next` and a false overflow (2026-09-10)

- `pnpm exec next start -p 3099 & kill $!` kills the pnpm/node wrapper but the
  `next-server` child survives and keeps serving. Two such servers were left over
  (3055 pid 337465 from an earlier task, 3099 pid 1146266 from my own capture).
  A later `pnpm build` then wrote `.next` while the old server was live, leaving a
  mixed tree: the served `index.html` referenced CSS chunk `066ba86eea0123d4.css`
  that was absent from `.next/static/css` → `net::ERR_ABORTED`, so the main
  stylesheet never loaded and every `h-*`/`w-*` utility silently failed. Images
  rendered at intrinsic 512px and `document.scrollWidth` read 520 at a 375 viewport
  — a **false** horizontal-overflow signal, not a real layout bug.
- Fix: kill by the PID actually listening on the port
  (`ss -ltnp | grep :3099 | grep -o 'pid=[0-9]*'`), then `rm -rf .next && pnpm build`
  and confirm `grep -o '/_next/static/css/[a-z0-9]*\.css' .next/server/app/index.html`
  matches `ls .next/static/css/`. Capture returned to scrollWidth==clientWidth.
- Cheap integrity check before any production screenshot/node-count capture:
  every CSS `href` in the prerendered HTML must exist on disk. An `ERR_ABORTED`
  stylesheet chunk is otherwise invisible in the screenshot until images blow up.
- Reduced-motion e2e for the compact "View all Projects" link: the responsive
  `target-size floor` (24px) caught `text-small` (line-height 21px). Switching to
  `text-base` (24px, `text-base`'s default line-height 1.5rem) clears it — the same
  choice the retained "View all Blog Posts" link already used.
- Scope note: `.omo/boulder.json` is orchestrator-owned and was already modified
  before T16; it is intentionally excluded from the T16 commit.
- No blockers. Final: build 38/38, typecheck/lint/prettier/contrast/ornaments green,
  jest 107 passed, full chromium e2e 63 passed.

## T11 follow-up — tooltip e2e flakiness stabilized (2026-09-10)

- `e2e/tooltip.spec.ts` was flaky under `--retries=0`: observed 2/3 fail, then
  3/3 fail, then 5/5 pass across separate invocations. Root cause: a cold
  `next dev` hydrates after first paint, and the *first* synthetic `pointermove`
  can be dropped by React's event delegation. Probe evidence on failing runs:
  the trigger's `__reactProps$` already had a function `onPointerMove`, native
  `pointermove`/`pointerenter` fired (moves=3, enters=1, leaves=0), yet
  `data-state` stayed `closed`. A second identical gesture on the same page always
  opened it (`delayed-open`); a fixed 1500ms pre-wait made it deterministic.
  `networkidle`, `document.fonts.ready`, and a fibre-child hydration probe did
  NOT fix it — there is no stable public hydration signal, and `next dev` compiles
  `/projects` on demand for each fresh webServer.
- Stabilization (no product change, no `--retries` reliance): enter the trigger
  from *outside* (Radix opens on `pointermove`; `locator.hover()` only fires
  `pointerenter`) and wrap the real gesture + `data-state` assertion in
  `expect(...).toPass()` so the spec waits on the app's observable state instead
  of sleeping. Verified 5/5 single-spec runs at `--retries=0` and two consecutive
  full chromium suites (63 passed, 0 failed, 0 flaky). `pnpm typecheck` and
  `pnpm prettier` exit 0.
- Rule for future specs: any hover/pointer-driven Radix assertion on a cold dev
  server must wait on `data-state` or content visibility, never a fixed delay.

## T17 — flex header row caused a real mobile grid overflow (2026-09-11)

- The previous worker crashed at the LLM-provider level before committing. Its
  last e2e log (`.omo/evidence/t17/e2e-chromium.log`) showed 1 failed / 63 passed:
  `responsive.spec.ts:104` "projects remains usable at mobile", scrollWidth 875
  at a 375 viewport. This was a genuine regression from T17, NOT pre-existing.
- Proof method reused from T15/T16: `git stash push -- <T17 files>`, run the
  single spec at `--retries=0` against HEAD -> EXIT=0 / 3 passed, then
  `git stash pop`. Cheap and conclusive.
- Root cause: the new `flex items-start justify-between` header row (title link
  + `Selected` badge) left the Flowbite `Card` (the CSS-grid item) with
  `min-width: auto`; the nowrap `truncate` `<h3>` therefore set the grid track's
  min-content to the widest title, expanding the `grid-cols-1` track past the
  viewport. `min-w-0` on the inner `<Link>` did not help because the grid ITEM is
  the Card. Fix = `min-w-0` on the Card root className; no markup/behavior change,
  and the pre-existing `responsive.spec.ts` already guards it (R6.3 satisfied by
  an existing check, so no spec edit was in scope).
- Recovery hygiene: write evidence + notepad appends, then one atomic commit of
  the 6 product files + evidence/notepads. `boulder.json` is orchestrator-owned
  and must stay out of the commit.
- No blockers. Final: build 38/38; full chromium e2e 64 passed TWICE (0 failed /
  0 flaky); axe 8 passed; typecheck/lint/prettier/test green.

## T18 — blog listing + card polish: no blockers (2026-09-11)

- No gate failures, no regression, no fix required. The recovered 4-file diff was
  byte-identical to what produced `.omo/evidence/t18-blog-{375,768,1280}.png`;
  capture.json already recorded scrollWidth == clientWidth at all three widths.
- The prior crash-session's full e2e run 1 logged 1 FLAKY
  (`responsive.spec.ts:104`, `page.goto("/projects")` timeout). It did NOT
  reproduce in either isolated verification run (64 passed, 0 flaky, twice). Most
  likely dev-server on-demand `/projects` compile under concurrent load from the
  crashed worker; this is environmental, not a product regression. If it recurs
  in isolation, apply the T11 pattern (wait on observable state, not a fixed
  delay) to the responsive spec.
- Scope note: `.omo/boulder.json` is orchestrator-owned and intentionally excluded
  from the T18 commit; it remains the only modified file after committing.
- Optional RSS feed DEFERRED (non-blocking); no route or dependency added.

## T22 — image pipeline: no blockers (2026-09-11)

- No gate failed; no fix required. The recovered 6-file product diff (next.config
  images block, markdown src, new webp, deleted jpg, `images` script + CI step,
  check-image-size.mjs) passed every gate on the first clean run.
- Environmental notes, not product defects:
  - Playwright `webServer` (`next dev`) clobbers the production `.next`; rebuild
    before `pnpm start`. Cost one wasted start attempt.
  - `playwright` package absent (only `@playwright/test`) → probe import fixed.
  - The `paths[0] ... Received null` line from every `nix develop` call is the
    flake shellHook's version probe (benign); it does not affect exit codes.
- `.omo/t22-remote-load.mjs` is a throwaway probe under gitignored `.omo/`; the
  committed evidence is `.omo/evidence/task-T22-2026-refresh-restyle.txt`.
- Scope note: `.omo/boulder.json` is orchestrator-owned and intentionally excluded
  from the T22 commit; it remains the only modified file after committing.
- No blockers.

## T19 — case-study template: environmental e2e flake, not a regression (2026-09-11)

- The recovered T19 product diff needed NO fix; it passed typecheck/lint/prettier/
  test/build/contrast/ornaments/images on the first clean run. The only friction
  was e2e.
- **Pre-existing e2e flake under host contention.** During this session the host
  (22 cores) was oversubscribed by unrelated projects — load average 28–35
  (ohmyroadmap Stryker mutation runs, a SongsOfTheOuterRim KVM harness, another
  pytest job). Under that load the PRE-T19 test `e2e/dark-mode.spec.ts:40`
  ("public routes render a single light semantic surface") intermittently exceeds
  its default 30s timeout on the first attempt (8 sequential `page.goto`s; one
  project-detail route is cold-compiled by `next dev` on demand), then passes on
  retry. Over 12 full runs the CLEAN ones were run1, run9, run11, run12 (65
  passed, 0 flaky each); the others had only this one test flake/fail and
  reported 64 passed; every run exited 0 except run10.
- T15/T17 stash-control applied: `git stash push` of the 3 recovered tracked
  product files → full suite on the PRE-T19 tree ran `65 passed (3.1m)`, 0 flaky.
  When load later fell to ~11, run11/run12 were 65 passed / 0 flaky in 3.6–3.7m.
  Conclusion: timing sensitivity of that pre-existing spec, external-load-driven,
  not caused by T19. No source/spec/config workaround was applied (out of scope).
- The new T19 spec `e2e/case-study.spec.ts` passed in every run.
- **`dark:prose-invert` flag (separate cleanup).** `app/projects/entry/[slug]/page.tsx`
  `<article>` keeps `prose prose-lg max-w-none dark:prose-invert`. It is
  pre-existing and inert: `tailwind.config.js` is `darkMode: "class"` and D13/T07
  removed the machinery that ever set `.dark`, so the variant never activates.
  Left untouched per task scope; belongs to a later dead-utility cleanup.
- **`null/` directory.** A pre-existing untracked `null/store/v11/...` (plus
  `null/chromium_headless_shell-1228/...` once Playwright resolved the null
  browsers path) exists from the devShell's `PNPM_HOME`/`PLAYWRIGHT_BROWSERS_PATH`=null
  quirk. It is NOT staged and NOT committed.
- Harness: one `task_update` returned `task_lock_unavailable` (same todo-sync race
  as T09/T11); retried and completed.
- No product blockers. Final: typecheck/lint (0 errors, 47 pre-existing warnings)/
  prettier/test (19 suites / 126 tests)/contrast (24/24)/ornaments/images (99/99)
  green; build 38/38; full chromium e2e 65 passed twice (0 failed / 0 flaky);
  axe-only 8 passed; enriched 375px `scrollWidth == clientWidth`.

## T21 — cert-env null poisoning blocked `next build`; pre-existing e2e flake (2026-09-11)

- **`NIX_SSL_CERT_FILE=null` / `SYSTEM_CERTIFICATE_PATH=null` break `next/font`.**
  The devShell already nulls `PNPM_HOME`/`npm_config_prefix`; it ALSO nulls the
  TLS trust env. First `pnpm build` after `rm -rf .next` failed:
  `next/font error: Failed to fetch Inter|Newsreader from Google Fonts`
  (`curl` → `SSL verification result: unable to get local issuer certificate (20)`).
  Removing `.next` had also discarded the cached font files. Fix (env, not
  product): `unset NIX_SSL_CERT_FILE SYSTEM_CERTIFICATE_PATH; export
  SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.crt` → fonts.googleapis.com HTTP 200,
  build 38/38. Apply this to build/e2e/storybook/manual-QA when fonts are cold.
- **Pre-existing e2e flake under host load, stash-controlled.** Host load
  averaged 27–34. `interactions.spec.ts:80` (a home CTA keyboard navigation)
  failed once in isolation with `Received string: ""` while the error-context
  snapshot showed the page HAD reached `/projects` — a >5s `toHaveURL`
  observation. `git stash push` of the two Header files → SAME failure on
  unmodified HEAD (`04c-interactions-HEAD.log`). Not a T21 regression; the
  canonical `CI=true … --workers=1` run was clean (71 passed, 0 failed, 0 flaky).
- **Manual-QA probe needs `load`/`networkidle`, not `domcontentloaded`.** Filling
  the contact form right after `domcontentloaded` raced React hydration and the
  submit produced no alert. Switching to `{ waitUntil: "load" }` +
  `waitForLoadState("networkidle")` made the result deterministic.
- **Next.js dev overlay adds a `role="alert"` node** to the DOM (empty text), so a
  `getByRole("alert")` count on `/contact` in DEV is 1 even on the success path.
  Not a product issue; production e2e asserts `role="status"` explicitly and the
  failure alert is covered by Jest against a mocked `sendEmail`.
- **Ordering:** `next dev` (Playwright webServer) clobbers the production `.next`,
  so `pnpm build` (38/38) was captured BEFORE the e2e runs; no build-artifact gate
  ran after e2e except the manual-QA dev probe (dev-mode DOM, which is the point).
- Scope: `.omo/boulder.json` is orchestrator-owned and excluded; `null/` is the
  pre-existing untracked env artifact and excluded. No new dependency, no
  `--no-verify`/`SKIP=`, no `.skip()`. Final: build 38/38; full chromium e2e 71
  passed (0 failed / 0 flaky); axe 8 passed; storybook smoke 6 passed.


## T23 — OG asset + header mark (2026-09-11)

- **No blockers.** One self-inflicted lint detour: a plain `<img>` for the brand
  mark raised 2 warnings (unused `Image`, `no-img-element`) → reverted to
  `next/image unoptimized`; lint back to baseline 47 warnings / 0 errors.
- **`logo.png` is NOT orphaned by this task.** Repo-wide grep (excl
  node_modules/.next/.omo) shows 25 `content/**` markdown files still use it as
  `authorImgSrc`; it also matches `layzrgr_logo.png` in `about/page.tsx`. Left in
  place per MUST DO ("if still referenced anywhere, leave it"). The OG swap only
  removed the `metadata.openGraph/twitter` references.
- **`null/` untracked artifact + `.omo/boulder.json`** excluded from staging as
  before (orchestrator-owned / env artifact).
- Scope: no route/slug/canonical change; build 38/38; no runtime dep; no new
  `dark:`; no `--no-verify`/`SKIP=`/`.skip()`.

## F1 — plan compliance audit gaps (2026-09-12) — APPROVE with named gaps

Audit verdict is APPROVE (see task-F1-2026-refresh-restyle.txt). Three non-blocking
items are carried to the final wave:

- **G1 MAJOR — font-budget gate not wired into CI.** `scripts/check-font-budget.mjs`
  exists and passes (exit 0, 2 families / 70.7 KiB), but `grep -rn check-font-budget
  package.json .forgejo/` finds nothing outside the script itself. Plan T14 said
  "Bundle the font-budget assertion". Fix: add a `pnpm font:budget`/check.yml step,
  or amend the plan to accept manual enforcement.
- **G2 MODERATE — T01/T05 evidence ledgers untracked.** Both files exist on disk
  (5459 B / 7029 B, complete and timestamped) but `git log --all` for their paths is
  empty; the other 18 refresh-restyle ledgers were `git add -f`-ed. Fix: force-add both.
- **G3 MODERATE — boulder state stale.** `.omo/boulder.json` still lists only the T09
  dep-removal prompt as a "running" task_session (updated 2026-09-10T20:20Z) and is
  uncommitted. Known harness limitation (cannot parse this plan's checkboxes); the plan
  file is the ground truth. Roll up before the wave closes (R1.2/R1.4/R19.3).

Minor: plan T02/T10 still say "36 routes" (build emits 38); plan Commit lines for
T07/T15 predate their D13/D4 amendments; a11y spec runs light-only (moot under D13).

### F3 — visual defect found during manual QA (2026-09-12)

- **V1 MINOR (pre-existing, non-blocking for this plan) — contact success toast
  overlaps header nav.** At viewport ≥768 and scrollY=0, the success alert
  (`fixed inset-x-1/3 top-8 z-50`, rect 427..853 × 32..86) covers the bottom 6px
  of the nav link glyphs (17px tall, 35%), hiding descenders of About/Projects/
  Blog/Contact. Repro: 1280×900 → `/contact` → fill + submit with
  `E2E_CONTACT_FORM_SUCCESS=true`. Provenance: introduced in the ORIGINAL contact
  page commit `e606a99` (Flowbite `<Alert className="fixed inset-x-1/3 top-8 z-50">`),
  carried verbatim through T21's in-tree Alert (`272bb2b` added the same className,
  `fe98d41` swapped the component). Not introduced by the refresh restyle; T21's
  scope was Flowbite removal, not toast placement. Proof:
  `.omo/evidence/f3/shots/contact-success-{topcrop,navzoom,glyphzoom}.png`.
  Fix (backlog, NOT applied): move below header (`top-20`) or render inline.
  F3 verdict remains APPROVE (pre-existing, outside plan scope).

## F5 — Lighthouse gate blocked by external host contention (2026-09-12)

- **Status: `[~]` blocked, not failed.** All load-insensitive regression gates
  PASS on a fresh production build (typecheck/lint/prettier/test 21×141;
  build 38/38; contrast 24/24; ornaments; images 101; fonts 70.7 KiB; bundle
  **14/14** with `__global` 102,254 B vs baseline 102,253 B; full chromium e2e
  **79 passed** 0 flaky; axe **8 passed**). Only the Lighthouse mobile
  LCP/TBT budgets are red.
- **Root cause is the host, not the code.** An unrelated project's
  `@stryker-mutator` run held **23 workers at ~93–102 % CPU across all 22 cores
  for 5h43m** (loadavg 46–58; `cat /proc/loadavg`). Lighthouse's
  `throttlingMethod:"simulate"` multiplies 4× CPU on top of an already ~2.5×
  oversubscribed host → ~10× compounding.
- **Falsifier that rules out a code regression:** every current LCP element is
  server-rendered *text* (an `<h1>`/`<p>`) or an already-in-DOM small image, and
  observed unthrottled FCP is 5–14× the T02 baseline on a byte-identical bundle
  (e.g. home 180 ms → 2326 ms). Text that is already in the SSR HTML cannot
  genuinely take 3–4 s.
- **Pre-existing:** the T02 baseline (captured BEFORE T13/T14 palette+font and
  all page rebuilds) was already over the 2500 ms LCP budget on home (2830) and
  projects (2588). A fully-green Lighthouse run has never been observed on this
  host, so F5's red is not introduced by this plan.
- **Resume:** on a quiet host (loadavg ≤4, no `stryker`/`child-process-proxy-worker`):
  `rm -rf .next && pnpm build && pnpm lighthouse` with
  `SSL_CERT_FILE` + `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-bundle.crt` and
  `PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright`. Full procedure in
  `.omo/evidence/task-F5-2026-refresh-restyle.txt` §5.
- **Operational gotcha worth keeping:** Lighthouse's `startServerCommand: pnpm
  start` fails with "Could not find a production build in '.next'" if an e2e run
  (whose Playwright `webServer` boots `next dev`) ran afterwards and clobbered
  `.next`. Always `rm -rf .next && pnpm build` immediately before
  `pnpm lighthouse`. (CI is unaffected — `lighthouse.yml` builds first.)

## 2026-09-12 — FLAGGED (pre-existing, out of plan scope): AGENTS.md `no scripts/` claims

AGENTS.md carries two now-false blanket claims:

- L66 (R1.7 justification): `no \`scripts/\` directory exists in this project`
- L88 (R2.3 rationale prose): `no \`scripts/\` infrastructure exists`

Reality: `scripts/` holds 7 files (`check-bundle-budget.mjs`,
`check-contrast.mjs`, `check-font-budget.mjs`, `check-image-size.mjs`,
`check-ornaments.mjs`, `check-project-frontmatter.js`,
`update-readme-screenshots.ts`), and `.forgejo/workflows/check.yml` runs five of
them as required gates.

**Provenance (why this is NOT this plan's debt):**
- `git merge-base --is-ancestor 14b2ac8 74689e8` → true: `scripts/` (first file
  `check-project-frontmatter.js`) existed at the plan's baseline commit `74689e8`.
- The claim text was committed `9c6dc6f` on 2026-07-20; the first script landed
  2026-07-19 — the claim was already false when written, a month before this plan.
- This plan did add 5 gate scripts (03c8d6c, 1b1062e, ed20097, 7e6e254, 7ed6b29),
  making the claim *more* false, but did not originate it.

**Disposition:** NOT fixed here. AGENTS.md is rule metadata (`[manual]`
justification comments), and the doc's own Superseded-rules section defers
AGENTS.md doc updates to a later docs task (T40/T41 per ADR-0007 notes). Editing
rule justifications without an owning task would be unowned scope creep (R1.3).
Owner of the fix = whatever task executes the AGENTS.md refresh (T41).

**Action for that owner:** replace both blanket claims with a pointer to the real
`scripts/` gates, and re-evaluate whether any `[manual]` rule can now be promoted
to `[auto:]` given the scripts + CI steps that exist (R2.3).

## 2026-09-12 — FLAGGED (pre-existing, out of scope): AGENTS.md R5.3 ToC claim

R5.3 body reads: "AGENTS.md and README.md **each have a table of contents**."
Reality: README.md has one (`## Table of Contents`, 11 valid anchors, verified in
sync with its 11 h2 sections); **AGENTS.md has none** (`grep -nE '^#+ (Table of
Contents|Contents)' AGENTS.md` → no match). The two real h2 sections in AGENTS.md
are `## Project rules` and `## Superseded rules`.

Provenance (not this plan's debt): the claim was added in
`9c6dc6f docs: rewrite content, README, and AGENTS.md` (pre-plan; AGENTS.md's
`-S"Table of Contents"` history is that single commit). This restyle plan never
owned AGENTS.md prose.

Disposition: NOT edited. Same class as the L66/L88 `no scripts/` flag above — it is
AGENTS.md **rule content**, and AGENTS.md's own Superseded-rules section defers
AGENTS.md doc updates to a later docs task (T40/T41 per ADR-0007). Unowned rule-prose
edits would be scope creep (R1.3). Two valid fixes for T41's owner — pick per intent:
(a) add a real ToC to AGENTS.md, or (b) amend R5.3 to name only README.md (and
note AGENTS.md is index-free because its rules are numbered).

Contrast: the orphaned `## Unreleased` / `## Resource usage` headings (commit
`6c23756`) WERE fixed because they carried no rule, tag, or prose — deleting them
changed no rule's meaning. Rule-content drift is left to T41; structural dead
headings are safe to reap.

## 2026-09-12 — FLAGGED (real defect, pre-existing, out of scope): /about placeholder image never loads

`app/about/page.tsx:113` renders `PersonTeaser` with
`companyLogoSrc="https://placehold.co/512x512?text=Various"` — **no file
extension**. Verified empirically:

```
curl -sS --cacert /etc/ssl/certs/ca-bundle.crt -o /dev/null -w "%{content_type}" "https://placehold.co/512x512?text=Various"
  → image/svg+xml          (SVG)
"https://placehold.co/512x512.png?text=Various"
  → image/png              (PNG)
```

`next.config.mjs` does NOT set `dangerouslyAllowSVG` (default false), so
`next/image`'s optimizer refuses the SVG and the request fails — confirmed in the
e2e WebServer log: `⨯ The requested resource "https://placehold.co/512x512?text=Various"
has type "image/svg+xml" but dangerouslyAllowSVG is disabled.`

**Severity: low but real.** `PersonTeaser` renders it `alt=""` at 48×48, so the
failure is a silently empty circle rather than a broken-image glyph. The story
fixtures already use the correct `.png` form (`placehold.co/400x400.png`), so the
fix pattern exists.

**Provenance / why NOT fixed here:** pre-existing since `9d951b4 Add first
iteration of About Page` (2023-12-16); this plan never edited that line (its only
`app/about/page.tsx` commit, `1e86f79`, was T23 metadata). `/about` is owned by
the HUMAN-GATED T20/T25 — agents must not alter it unowned (R1.3), and a bug fix
would also require a regression test (R6.3). Flagged as debt for whoever executes
T20/T25 (or a follow-up): change the URL to `https://placehold.co/512x512.png?text=Various`
(or self-host a neutral placeholder, as T22 did for the cheesecake image).
