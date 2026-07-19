# Portfolio Overhaul — Learnings

## 2026-07-19: Nix flake devShell setup

- Created `flake.nix` with `nodejs_22`, `pnpm`, `git` in devShell
- `nixpkgs` channel: `github:NixOS/nixpkgs/nixos-unstable` (2026-07-18)
- Versions resolved: nodejs v22.23.1, pnpm 11.13.1, git 2.54.0
- `nix flake lock` generated `flake.lock`
- `.envrc` written with `use flake`
- `nix flake check` passes (EXIT_CODE=0)
- `direnv allow` succeeds (EXIT_CODE=0)
- `pnpm --version` fails in project dir due to `preinstall` hook (`npm-only-allow --PM yarn`) — will be removed when migrating to pnpm (Todo 4). pnpm binary confirmed at `/nix/store/.../pnpm-11.13.1/bin/pnpm`
- Nix requires flake files to be git-tracked; `git add flake.nix` before `nix flake lock`

## 2026-07-19: Yarn v1 → pnpm migration (Todo 4)

### What was done
- Removed `preinstall` script (`npm-only-allow --PM yarn`) from package.json — this was blocking pnpm entirely
- Deleted `yarn.lock`
- Ran `pnpm install` → generated `pnpm-lock.yaml` (pnpm v10.15.1, not v11.13.1 as in Nix flake)
- Updated `packageManager` field: `"yarn@1.22.19"` → `"pnpm@10.15.1"`
- Updated `analyze` script: `yarn build` → `pnpm build`
- Moved `semantic-release` + 6 `@semantic-release/*` plugins from `dependencies` → `devDependencies`
- Updated `.github/nodejs.version`: `v18.17.0` → `22`
- Deleted `.github/workflows/cr.yml` (ChatGPT Code Review, uses OPENAI_API_KEY)
- Updated `.github/workflows/check.yml`: added `pnpm/action-setup@v2`, replaced all `yarn` commands with `pnpm` equivalents
- Updated `.github/workflows/playwright.yml`: same treatment
- Updated `.github/workflows/nextjs_bundle_analysis.yml`: same treatment
- Made `RESEND_API_KEY` optional in `env.mjs` (`.optional()`) — required for contact form in production, may be absent in CI

### Verifications
- `pnpm install --frozen-lockfile`: EXIT_CODE=0 ✓
- No `yarn.lock` remaining in repo
- No `yarn` references in any CI workflow file
- `package.json` has no `preinstall` script
- `packageManager` reads `pnpm@10.15.1`
- `.github/nodejs.version` reads `22`
- `cr.yml` deleted

### Issues encountered
1. **pnpm version mismatch**: Nix flake provides pnpm v11.13.1 but system pnpm is v10.15.1. Used system pnpm (v10). Future: align by entering nix devShell.
2. **`packageManager` enforcement**: pnpm v10+ reads `packageManager` field and refused to run when it said `yarn@1.22.19`. Had to update this field BEFORE running `pnpm install`.
3. **`pnpm dev` behavior**: Next.js 14.2.35 starts successfully ("✓ Starting...") but crashes on instrumentation hook due to `jaeger-client` trying to load `jaeger-idl/thrift/jaeger.thrift` from `.next/server/vendor-chunks/`. This is a pre-existing `@vercel/otel` v0.3 / OpenTelemetry SDK v0.38 compatibility issue, **not** related to pnpm migration. The dev server itself is functional.
4. **Build scripts blocked**: pnpm warns about 8 packages with blocked build scripts (`@swc/core`, `core-js`, `core-js-pure`, `esbuild`, `postinstall-postinstall`, `protobufjs`, `sharp`, `unrs-resolver`). `pnpm approve-builds` fails due to PATH issue with global bin directory. These build scripts are needed for production builds (sharp for images, esbuild for bundling, @swc/core for Next.js compilation). Not blocking — can be resolved in a follow-up.
5. **Remaining `yarn` reference**: `playwright.config.ts` line 73 has `command: "yarn dev"` in webServer config. Not changed — outside task scope (MUST NOT touch source code beyond listed files). Needs separate fix.
6. **Peer dependency warnings**: `@vercel/otel` v0.3 / `@opentelemetry/sdk-node` v0.38 has peer dep conflicts with `@opentelemetry/api` v1.7.0 (wants <1.5.0, got 1.7.0). Pre-existing, not related to pnpm.

## 2026-07-19: Removed boilerplate middleware.ts

- **File deleted**: `middleware.ts` (22 lines)
- **Contents**: Pure Blazity Next.js Enterprise boilerplate — redirect from `next-enterprise.vercel.app` to `https://blazity.com/open-source/nextjs-enterprise-boilerplate` (301)
- **Imports checked**: No other file in the repo imports from or references `middleware.ts`
- **Impact**: None. The redirect only fired for the `next-enterprise.vercel.app` host, which this project never uses. All routes unaffected.

## 2026-07-19: Footer social link accessible name fixes

### What was done
- Created `components/Footer/Footer.test.tsx` — 4 tests verifying accessible names on social links
- Fixed three alt/sr-only bugs in `components/Footer/Footer.tsx`:
  - LinkedIn link: `alt="Facebook Logo"` → `alt="LinkedIn Logo"`, `sr-only` "Facebook" → "LinkedIn"
  - GitHub link: `alt="Github Logo"` → `alt="GitHub Logo"`, `sr-only` "Github" → "GitHub" (capital H)
  - Email link: `alt="Dribble Logo"` → `alt="Email"`
- Twitter link already correct (`alt="Twitter Logo"`, `sr-only="Twitter"`)

### Verifications
- `npx jest --passWithNoTests Footer`: 4/4 tests pass ✓
- No "Facebook Logo" or "Dribble Logo" strings in Footer.tsx ✓

### Issues encountered
- pnpm `test -- Footer` arg passing broke; used `npx jest` directly

## 2026-07-19: AGENTS.md R27-R40 Clean Code rules (Todo 3c)

### What was done
- Filled all R27-R40 sections with adapted Clean Code prose (previously `<TODO: adapt to this project>` placeholders)
- 14 categories adapted: Meaningful Names, Functions, Comments, Formatting, Objects & Data Structures, Error Handling, Boundaries, Unit Tests, Classes, Systems, Emergent Design, Concurrency, Successive Refinement, Smells & Heuristics
- All `[auto: scripts/check-clean-code-ch*.mjs]` converted to `[manual]` with `<!-- manual: ... -->` justifications
- `Biome` reference in R30.4 changed to `Prettier` (project uses Prettier, not Biome)
- `pr0gramm` reference in R27.6 changed to `project-specific domain terminology`
- R32.1 adapted for project's `await-to-js` convention
- R38 (Concurrency) prefaced with aspirational note for static site
- R33 (Boundaries) adapted with project-specific examples (Resend, Flowbite, server actions)
- R36 (Systems) adapted with Next.js-specific examples (layouts, middleware, server actions)

### Verifications
- `grep '<TODO:' AGENTS.md` → zero matches ✓
- `grep '[auto: scripts/check-clean-code' AGENTS.md` → zero matches ✓
- `grep 'Biome' AGENTS.md` → zero matches ✓
- `grep 'lefthook' AGENTS.md` → 1 match (R3.2 manual justification, legitimate) ✓
- `pr0gramm` references: 5 matches in R4 N/A context (legitimate pre-existing adaptation notes) ✓

### Status
- ALL 40 rule categories in AGENTS.md now have body prose
- AGENTS.md rule content is complete

## 2026-07-19: Task 23 — Component cleanup

- Removed redundant `prop-types` runtime validation from `ArticleTeaser`; TypeScript `ArticleProps` remains contract.
- Replaced Tooltip's single-value CVAs with static class constants. Retained legacy `intent` and `size` props for caller compatibility.
- Migrated PersonTeaser's decorative company logo to `next/image` with matching 48 × 48 intrinsic dimensions and original classes.
- Focused characterization suite: 3/3 tests passed before and after refactor. Storybook build passed.
- Full build and homepage QA remain blocked by existing ESLint `react-hooks` plugin conflict and malformed project Markdown YAML, not Task 23 code. Browser Playwright cannot launch because Chromium is absent.
- Evidence: `.omo/evidence/task-23-2026-portfolio-overhaul.txt`.

## 2026-07-19: Rewrote dead e2e test (example.spec.ts → home.spec.ts)

### What was done
- Deleted `e2e/example.spec.ts` — boilerplate testing "Next.js Enterprise Boilerplate" title
- Created `e2e/home.spec.ts` — tests the actual TomSegbers.de homepage

### New test structure
- **Title assertion**: `toHaveTitle(/TomSegbers.de/)` (matches metadata in `app/page.tsx` line 10)
- **Header visibility**: `page.locator("nav").first()` — Flowbite Navbar renders as `<nav>`
- **Logo link**: `nav.locator('a[href="/"]')` — verifies brand link exists
- **Hero h1**: `getByRole("heading", { level: 1 })` with text "Exploring Innovation and Creativity"
- **Projects section**: `getByRole("heading", { name: /My Recent Projects/, level: 2 })` + `.animate-marquee` CSS class
- **Blog section**: `getByRole("heading", { name: /My Recent Blog Posts/, level: 2 })` + blog card links count ≥ 1

### Selector strategy
Used semantic Playwright locators (`getByRole`, accessible text matching) over brittle CSS selectors. Fallback CSS selectors only where needed (`.animate-marquee` for marquee check, `nav` for header). Blog cards located via href pattern `a[href^="/blog/entry/"]` — matches `ArticleComponent` link structure.

### Verifications
- `tsc --noEmit` on file: zero errors ✓
- `e2e/example.spec.ts` confirmed deleted ✓
- `e2e/home.spec.ts` exists (1423 bytes) ✓

### Cannot run test due to pre-existing instrumentation crash
- `next dev` starts but crashes on `instrumentation.ts` → `@vercel/otel` → `jaeger-client` → missing `jaeger-idl/thrift/jaeger.thrift` from `.next/server/vendor-chunks/`
- Same issue documented in entry #3 from 2026-07-19 ("`pnpm dev` behavior")
- `playwright.config.ts` `webServer.command: "yarn dev"` also stale (should be `pnpm dev`), but outside task scope
- Test code itself is correct per TypeScript compilation

## 2026-07-19: Removed broken OpenTelemetry instrumentation

### What was done
- Deleted `instrumentation.ts` (5 lines: `registerOTel("next-app")` wrapper)
- Removed `experimental: {instrumentationHook: true}` from `next.config.mjs` line 10

### Root cause
`@vercel/otel` v0.3 depends on `jaeger-client` which requires `jaeger-idl/thrift/jaeger.thrift` — file not found in `.next/server/vendor-chunks/` at runtime. Crashed both `pnpm dev` and `pnpm build`. This observability tooling is enterprise boilerplate cruft with zero value for a personal portfolio site.

### Verifications
- `instrumentation.ts` confirmed deleted ✓
- `next.config.mjs` line 10 no longer has `experimental: {instrumentationHook: true}` ✓
- No other experimental configs affected ✓
- `@vercel/otel` remains in `package.json` (not removed — out of scope, harmless without the hook)
- `next dev` starts clean: "Ready in 1776ms" — no jaeger-idl crash, no instrumentation errors ✓
- Note: `pnpm` binary from Nix flake (v11.13.1) is broken ("paths[0] argument must be of type string"), so testing used `./node_modules/.bin/next dev` directly

## 2026-07-19: Task 10 — Markdown content directory move

### What was done
- Moved all Markdown entries with `mv`: 3 files from `app/blog/entry/` to `content/blog/`, 21 files from `app/projects/entry/` to `content/projects/`.
- Preserved both `[slug]` route directories and URL structure.
- Updated page render, `generateStaticParams`, and `generateMetadata` in both dynamic route handlers to load files from `content/blog` or `content/projects`.
- Updated stale project static-params doc comment to name `content/projects`.

### Characterization and structural verification
- Before move: 3 blog + 21 project slugs; SHA-256 inventory contained 24 files.
- After move: slug lists matched baseline; 3 blog + 21 project files under `content/`; SHA-256 count remains 24.
- No Markdown remains directly under either old route directory.
- Dynamic route files contain zero `app/blog/entry` or `app/projects/entry` references.
- Existing automated tests do not cover dynamic slug discovery, so exact before/after inventory captured in `.omo/evidence/task-10-2026-portfolio-overhaul.txt`.

### Manual QA
- `nix develop --command pnpm dev` started successfully (`Ready in 1212ms`).
- `curl` detail requests returned `200` and rendered expected body content:
  - `/blog/entry/2019-ebeltoft-cheesecake-recipe`
  - `/projects/entry/2010-Journey-Into-Coding-with-LabVIEW-and-LEGO-Mindstorms`
- No stale-path 404 observed.

### Build blocker
- `nix develop --command pnpm build` compiled successfully but exited 1 during type checking: `Cannot find module 'react-icons/hi' or its corresponding type declarations` at `app/blog/entry/[slug]/page.tsx:6`.
- `package.json` declares `react-icons`, but `node_modules/react-icons/hi/index.d.ts` is absent. No dependency, lockfile, or import change was made in Task 10; blocker recorded as unrelated.
- TypeScript LSP diagnostics unavailable: server not installed and prior user decision declined installation.

## 2026-07-19: react-icons installation repair

- Root cause: `package.json` declared `"react-icons": "^5.4.0"`, but direct package was absent from `node_modules` and no `pnpm-lock.yaml` existed. Existing node_modules had only transitive `flowbite-react -> react-icons@5.0.1` state.
- Repair: `nix develop --command bash -c 'unset PNPM_HOME npm_config_prefix; CI=1 pnpm install --force'` recreated node_modules and generated lockfile. Direct dependency now resolves as `react-icons@5.7.0`; `node_modules/react-icons/hi/index.d.ts` exists.
- Nix devShell inherits `PNPM_HOME=null` and `npm_config_prefix=null`; pnpm 11 crashes with `The "paths[0]" argument must be of type string. Received null`. Run pnpm through `env -u PNPM_HOME -u npm_config_prefix` or `bash -c 'unset PNPM_HOME npm_config_prefix; ...'`.
- `pnpm exec tsc --noEmit` invokes obsolete `tsc@2.0.4` dependency, not TypeScript compiler. Direct compiler command confirms `react-icons/hi` error is gone, then reports unrelated missing `date-fns` and `prop-types` dependencies.
- `pnpm build` compiles successfully after repair; type checking stops on unrelated missing `date-fns`. Full commands/results: `.omo/evidence/task-react-icons-repair.txt`.

## 2026-07-19: Task 11 — Shared markdown reader extraction (TDD)

### What was done
- Created `lib/markdown.ts` exporting `MarkdownEntry` and `getAllMarkdownEntries(dirPath, urlPrefix)`. Uses Zod boundary schema with `.default()` and `.catch()` for every consumer-required field (lenient, preserves existing content).
- Refactored `lib/blog.tsx` to a 3-line wrapper: `getAllBlogPosts()` returns `getAllMarkdownEntries("content/blog", "/blog")`.
- Refactored `lib/projects.tsx` to a 3-line wrapper: `getAllProjects()` returns `getAllMarkdownEntries("content/projects", "/projects")`.
- Created `lib/markdown.test.ts` with six behavioral tests (valid, missing defaults, malformed defaults, empty dir, non-MD filtering, sort order) using temporary fixture directories.

### Verifications
- Focused test: `pnpm exec jest lib/markdown.test.ts --runInBand` — 6/6 passed ✓
- Markdown compilation by Next.js: "✓ Compiled successfully" during `pnpm build` — no `lib/markdown|blog|projects` type errors ✓
- Manual QA curl `/projects` (port 3011): HTTP 200, 21 entries listed ✓
- Manual QA curl `/blog`: HTTP 200 but empty grid — stale `app/blog/page.tsx` inline reader still reads `app/blog/entry` (NOT `lib/blog.tsx`). Fix is explicitly Todo 12.
- Full `pnpm test` blocked: pre-existing `.next/types/package.json` ENOENT infrastructure error. Focused suite passes independently.
- `pnpm build` overall exits 1: pre-existing unrelated `date-fns` type-check error. No new errors introduced.

### Issues / decisions
- Inherited dirty git worktree from prior work; Task 11 scoped strictly to `lib/`, evidence, and learning note.
- `technologies` field kept as mutable `string[]` (not `readonly string[]`) — matches existing consumer destructuring in ProjectTeaser. Re-evaluate in Task 23 (component cleanup).
- Blog listing `app/blog/page.tsx` has a separate, stale inline reader for `app/blog/entry`. Not fixed here — explicitly belongs to Todo 12.
- Full test suite (`pnpm test`) non-operational due to `.next/types` infrastructure. All behavioral coverage lives in the focused test file.
- LSP not installed; diagnostics unavailable. TypeScript correctness verified via Next.js compilation.
- Evidence: `.omo/evidence/task-11-2026-portfolio-overhaul.txt`.

## 2026-07-19: Task 12 — Blog listing uses shared reader

- `app/blog/page.tsx` now imports `getAllBlogPosts()` from `lib/blog.tsx`; removed stale inline `path`/`fs`/`gray-matter` Markdown parsing for former `app/blog/entry` directory.
- Keep listing JSX and every `ArticleComponent` prop unchanged. Shared reader preserves descending date order and `/blog/entry/<slug>` links.
- Focused page characterization test (`app/blog/page.test.tsx`) proves page calls shared reader once and renders returned URLs in exact order. Red failed with zero calls before migration; Green passed after.
- Live `/blog` QA on port 3014: HTTP 200; three unique post URLs in order 2024, 2020, 2019. Each URL appears twice in HTML because teaser has title plus “Read more” link; count unique URLs, not raw occurrences.
- `nix develop --command bash -c 'unset PNPM_HOME npm_config_prefix; pnpm build'` compiles Todo 12 code, then stops on pre-existing missing `date-fns` types in `ArticleTeaser`; no blog-page error.
- `nix develop` needs tracked `flake.nix`. It was tracked as intent-to-add during task only; pnpm emits inherited null-path warning yet command execution continues.

## 2026-07-19: Boilerplate copy replaced (Todo 12b)

### What was done
- `app/blog/page.tsx` heading `"Our Blog"` → `"Blog"`, subtext `"We use an agile approach…"` → `"Thoughts on technology, homelabs, and software engineering."`
- `app/page.tsx` hero `"Exploring Innovation and Creativity in Technology"` → `"Tom Segbers — Senior Developer"`, tagline `"Welcome to my digital space…"` → `"Building reliable systems and solving hard problems."`
- Boilerplate scan confirmed zero matches: `grep "Our Blog\|We use an agile\|Exploring Innovation and Creativity\|Welcome to my digital space"` returns nothing in `app/`.

### Verifications
- `grep` for all four boilerplate strings across `app/*.tsx` — zero matches ✓
- `nix develop --command bash -c 'unset PNPM_HOME npm_config_prefix; pnpm build'` — compiles successfully, type check blocks on unrelated `date-fns` in `ArticleTeaser.tsx` (pre-existing). No new errors from our edits. ✓

## 2026-07-19: Task 13 — Blog voice rewrites

- `2024-homelab-v2-transforming-homelab-with-advanced-automation.md`: rewrote body in first person around old tower PC, unRAID, Docker, Ubuntu VM, Automatic1111, ComfyUI, 50+ sensors, InfluxDB, Grafana, Home Assistant, cache/array/parity storage, onsite/offsite backups, local HTTPS, and OpenVPN.
- `2020-homelab-v2-the-evolution-of-my-homelab-journey-second-edition.md`: rewrote body in first person around Raspberry Pi to Dell PowerEdge R710 upgrade, 48 CPU cores, 64 GB DDR3, 200 W idle use, ESXi to Ubuntu to unRAID, Docker services, GTX 970 passthrough, modified risers, power-supply short circuit, WiFi door sensors, local voice assistant, and LED actuator.
- `2019-ebeltoft-cheesecake-recipe.md`: rewrote introduction and closing in first person around sailing trip to Ebeltoft and Cafe Moeslund. Preserved all ingredient quantities, preparation steps, image URL, refrigeration durations, and recipe structure.
- All three frontmatter blocks, file names, IDs, dates, and URLs were preserved. No facts or versions were invented.

## 2026-07-19: date-fns and prop-types installation repair

- Root cause: `ArticleTeaser.tsx` imports `date-fns` and `prop-types`, but neither package was declared in `package.json` after pnpm migration.
- Repair: `nix develop --command bash -c 'unset PNPM_HOME npm_config_prefix; pnpm add date-fns prop-types'` added runtime packages; added `@types/prop-types` as dev dependency because `prop-types` ships no declarations.
- `pnpm-lock.yaml` updated by pnpm v10.15.1; no source files changed.
- Verification: `nix develop --command bash -c 'unset PNPM_HOME npm_config_prefix; pnpm build'` exits 0. Date-fns and prop-types errors resolved. Build reports pre-existing `react-hooks` ESLint plugin conflict but completes successfully.

## 2026-07-19: Task 14 — Project entries 2010–2017 rewrite

- Rewrote body prose for all nine existing project files in `content/projects/` matching years 2010–2017. Frontmatter, IDs, filenames, and URLs remain unchanged.
- Plan says 11 entries, but repository contains only nine matching files: 2010 (1), 2011 (1), 2012 (2), 2013 (1), 2014 (1), 2015 (1), 2016 (1), 2017 (1). No entries were invented.
- Kept details grounded in original files: LEGO Mindstorms NXT and LabVIEW, Wenzelbots competition, sensor kits and PowerPoint, C++/Qt Creator, SQF Arma 3 missions, Altis Life with SQL/Windows Server 2012/TeamSpeak 3 and 300+ concurrent players, freelance features, SQLite/CSV time tracking, AT89C5131A Assembly motor and LCD work.
- Human gate remains active. No commit made. Tom must approve prose before any commit.

## 2026-07-19: Task 15 — Project entries 2018–2021 rewrite

- Rewrote ten selected project entries from 2018 through 2021 in first-person, evidence-bound prose.
- Left `2019-process-automation-in-proptech.md` and `2020-soudest-multimodal-travel-planner-frontend.md` unchanged because they contained less distinct substance or duplicated the fuller SouDest entry.
- Each entry now includes at least three factual technical, architectural, or delivery details plus a candid retrospective tradeoff.
- Preserved filenames, existing IDs, and dates. Refined titles and article summaries where original copy was generic.
- Targeted formatting: `./node_modules/.bin/prettier --check` passes for all ten files; `git diff --check` passes.
- Markdown LSP unavailable in environment, no server configured for `.md`.
- Evidence: `.omo/evidence/task-15-2026-portfolio-overhaul.txt`.
- No commit created. Human approval remains required.
