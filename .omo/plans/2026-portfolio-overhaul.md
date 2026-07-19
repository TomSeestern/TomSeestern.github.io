# 2026-portfolio-overhaul - Work Plan

## TL;DR (For humans)
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** TomSegbers.de transformed from a boilerplate-derived personal site into a polished, Senior-Dev-hire portfolio. Every project description rewritten in Tom's real voice (no AI-speak), all technical issues fixed, reproducible builds via Nix, professional test coverage, and a design that looks intentional rather than templated.

**Why this approach:** Foundation first (rules + Nix + baseline measurement), then bug fixes with TDD as safety net, then the high-impact content rewrite that actually impresses hiring managers, then visual polish, then test backfill. Each phase builds on the last; no phase can regress a previous one. The plan acknowledges that content review is a human gate, not an automated check.

**What it will NOT do:** Add new projects or blog posts (deferred). Migrate to a different framework, hosting, or component library. Add analytics, tracking, or third-party integrations. Migrate from Jest to Vitest or from pre-commit to lefthook.

**Effort:** XL (~7 waves, 37 todos, ~5-8 days of agent work)
**Risk:** Medium — content rewrite is subjective (Tom must review); Nix on NixOS is straightforward; Flowbite + semantic token migration carries compatibility risk
**Decisions to sanity-check:** AGENTS.md scope (comprehensive 40-category, with ~30-40% marked N/A), content rewrite approach (agent does all), UI strategy (keep Flowbite, refine), testing (TDD with Jest), hook runner (keep pre-commit, adapt rules)

Your next move: review the plan, then say "start work" to begin execution. Full execution detail follows below.

---

> TL;DR (machine): XL effort, Medium risk. 7 waves, 37 todos. Baseline measurement first, then AGENTS.md adaptation (split into 3 batches), Nix/direnv migration, bug fixes (TDD), content rewrite (24 entries), Flowbite design refinement with compatibility audit, Jest-based test backfill, responsive audit, final polish. Content review is a human gate.

## Scope
### Must have
1. AGENTS.md with all 40 rule categories adapted from pr0gramm-downloader to this project; irrelevant categories explicitly marked N/A with one-line rationale (not deleted — user chose comprehensive)
2. Nix flake providing Node 22, pnpm, git, and system tools; direnv auto-activation
3. Package manager migration: yarn v1 → pnpm (pnpm-lock.yaml, updated scripts, updated CI workflows)
4. Baseline measurements before any changes: Lighthouse score on all routes, Flowbite App Router compatibility audit, current build status check
5. Critical bug fixes: ProjectTeaser `fs.accessSync` crash, Footer alt text errors, middleware boilerplate redirect, dead e2e test
6. Code deduplication: shared `lib/markdown.ts` extracting common logic from `blog.tsx` + `projects.tsx` (AFTER content is moved to `content/`)
7. Blog index page: use `lib/blog.tsx` instead of inline duplicate logic
8. Content directory: move markdown files from `app/blog/entry/` and `app/projects/entry/` → `content/blog/` and `content/projects/`
9. Content rewrite: all 21 project entries + 3 blog posts rewritten from AI-generic voice to personal, concrete, story-driven prose (HUMAN GATE — Tom must approve)
10. Content smoke check: after rewrite, validate all 24 files parse and render before proceeding to design
11. Design refinement: semantic color tokens with Flowbite backward-compat aliases, typography scale, spacing system, dark mode audit, hover micro-interactions
12. Tests (TDD with Jest — already configured): unit tests for `lib/`, component tests for all 8 components, Playwright e2e for all 7 routes, Storybook smoke tests
13. Responsive design audit: all routes at mobile (375px), tablet (768px), desktop (1280px) breakpoints
14. README.md rewritten for the actual project (not the boilerplate)
15. Footer copyright: © 2019-2024 → © 2019-2026
16. Metadata: proper OG images, meta descriptions, viewport config via Next.js 14 `viewport` export
17. Boilerplate copy replaced: blog page heading text, landing page placeholder text

### Must NOT have (guardrails, anti-slop, scope boundaries)
- New projects or blog posts (Layzr.gg, Hammer Robotics — deferred)
- CMS, database, or content API — stays filesystem markdown
- Hosting migration — stays on current deployment (assumed Vercel)
- Next.js 15/16 migration
- Biome migration — stays ESLint + Prettier
- Jest → Vitest migration — stays Jest (already configured)
- pre-commit → lefthook migration — stays pre-commit (already configured); AGENTS.md rules adapted to reference pre-commit
- Third-party analytics, SEO tooling, tracking scripts
- Animation framework or heavy JS effects (no framer-motion, GSAP)
- Contact form logic changes beyond basic validation
- Dark mode toggle — already works via `class` strategy
- Internationalization (i18n) or multi-language support
- Any file outside the project root (no system-level Nix config)
- Git history rewriting — boilerplate commits stay (Tom's actual work is the recent layer)

## Verification strategy
> Agent-executed verification for all technical todos (build, lint, test, structure). Content review (todos 13-15, 34) requires Tom's explicit human approval — these are gated, not automated.

- Test decision: TDD — write failing test, confirm red, implement, confirm green
- Framework: **Jest** (already configured — jest.config.js, @jest/globals, ts-jest) for unit/component tests. **Playwright** (already configured) for e2e. **Storybook test-runner** for smoke.
- Evidence: .omo/evidence/task-<N>-2026-portfolio-overhaul.txt
- Every todo includes: exact command to run, expected exit code, expected output pattern
- Content review (todos 13-15, 34): Tom gate — marked `[HUMAN_GATE]` in the dependency matrix; agent pauses and awaits approval

## Execution strategy
### Parallel execution waves
- **Wave 1 (Foundation):** AGENTS.md skeleton + Nix flake + pnpm migration + baseline measurements (todos 1-5, with 3a-3c)
- **Wave 2 (Cleanup):** Fix fs bug, footer, middleware, dead e2e test (todos 6-9)
- **Wave 3 (Content infrastructure):** Move content to content/ dir, shared lib/markdown.ts, blog index fix, boilerplate copy replacement (todos 10-12b)
- **Wave 4 (Content rewrite):** Rewrite 24 entries, content smoke check (todos 13-16) `[HUMAN_GATE]`
- **Wave 5 (Design):** Flowbite audit, semantic tokens, typography, spacing, dark mode, micro-interactions, component cleanup (todos 17-23)
- **Wave 6 (Tests):** Unit tests, component tests, e2e tests, Storybook smoke, responsive audit (todos 24-31)
- **Wave 7 (Polish):** README, metadata, final content review (todos 32-34)
- **Final verification wave:** Plan compliance, code quality, manual QA, scope fidelity

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1. AGENTS.md skeleton | — | 3a,3b,3c | 2,4,5 |
| 2. Nix flake | — | 4 | 1,5 |
| 3a. AGENTS.md batch 1 (R1-R13) | 1 | 17+ (rules define standards) | 3b,3c,4,5 |
| 3b. AGENTS.md batch 2 (R14-R26) | 1 | 17+ | 3a,3c,4,5 |
| 3c. AGENTS.md batch 3 (R27-R40) | 1 | 17+ | 3a,3b,4,5 |
| 4. pnpm migration | 2 | 6+ | 3a-3c,5 |
| 5. Baseline measurements | 2,4 (needs pnpm install) | 17 | 1,3a-3c |
| 6. ProjectTeaser fs fix (TDD) | — | 27 (component test) | 7,8,9 |
| 7. Footer alt text fix | — | — | 6,8,9 |
| 8. Middleware cleanup | — | — | 6,7,9 |
| 9. Dead e2e test fix | — | 28 | 6,7,8 |
| 10. Content directory move | — | 11,12,13-16,29 | 6-9 |
| 11. Shared lib/markdown.ts (TDD) | 10 (directories must exist) | 12 | — |
| 12. Blog index use lib function | 11 | 12b | — |
| 12b. Boilerplate copy replacement | 12 | — | 13-15 |
| 13. Blog posts rewrite `[HUMAN_GATE]` | 10 | 16,34 | 14,15 |
| 14. Projects rewrite batch 1 (2010-2017) `[HUMAN_GATE]` | 10 | 16,34 | 13,15 |
| 15. Projects rewrite batch 2 (2018-2021) `[HUMAN_GATE]` | 10 | 16,34 | 13,14 |
| 16. Content smoke check | 13,14,15 | 17+ (content must be valid before design) | — |
| 17. Flowbite App Router compat audit | 5,16 (needs baseline + valid content) | 18 | — |
| 18. Semantic color tokens + Flowbite backward-compat | 3a-3c,17 | — | 19,20 |
| 19. Typography scale | 3a-3c | — | 18,20 |
| 20. Spacing system | 3a-3c | — | 18,19 |
| 21. Dark mode audit | 3a-3c | — | 22,23 |
| 22. Micro-interactions | 3a-3c | — | 21,23 |
| 23. Component cleanup pass | 3a-3c,6,11 | 25,27,28 | 21,22 |
| 24. lib/ unit tests (TDD) | 11 | — | 25 |
| 25. Component tests (6 simple: Button, Footer, Header, PersonTeaser, TimelineEntry, Tooltip) | 23 | 30 (storybook) | 26,27 |
| 26. Component test — ArticleTeaser (deep) | 23 | — | 25,27 |
| 27. Component test — ProjectTeaser (deep) | 6,23 | — | 25,26 |
| 28. Playwright e2e — static pages | 9 | — | 29 |
| 29. Playwright e2e — dynamic pages | 10,9 | — | 28 |
| 30. Storybook smoke tests | 25 | — | — |
| 31. Responsive design audit | 18-22 | — | 30 |
| 32. README rewrite | 18-23 | — | 33 |
| 33. Metadata + OG images | — | — | 32 |
| 34. Final content review + copyright `[HUMAN_GATE]` | 13-15 | F1-F4 | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

### Wave 1: Foundation

- [x] 1. Create AGENTS.md skeleton — adapt existing 4000-line file, do NOT start from scratch
  What to do: The current AGENTS.md is the FULL pr0gramm-downloader file (all 40 categories, ~3957 lines, fully populated). This todo creates a SKELETON by replacing all body prose with `<TODO: adapt to this project>` placeholders while preserving every rule heading + enforcement tag + numbering. Keep all 40 categories and all sub-rule headings intact. This is a search-and-replace operation, not a from-scratch write. The actual prose adaptation happens in todos 3a/3b/3c.
  Must NOT do: Delete categories. Renumber rules. Fill in adapted prose (that's 3a-3c). Remove the file.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 3a,3b,3c
  References: AGENTS.md (root — the existing 3957-line pr0gramm file is the source).
  Acceptance criteria: `grep -c "^#### R" AGENTS.md` returns same count as before (≥100). Every heading matches `#### R\d+\.\d+\) .+ \[(manual|auto:.+)\]`. No body prose remains — only `<TODO: adapt>` placeholders. Rule numbering is sequential with no gaps.
  QA scenarios: Happy — heading count preserved, all placeholders inserted. Failure — a heading was accidentally deleted. Evidence .omo/evidence/task-1-2026-portfolio-overhaul.txt
  Commit: Y | docs(agents): skeleton AGENTS.md preserving 40 categories from pr0gramm source

- [x] 2. Create Nix flake with Node 22, pnpm, and dev tools
  What to do: Write `flake.nix` providing a devShell with nodejs_22, pnpm, git, and any other tools needed for `pnpm dev`, `pnpm build`, `pnpm test`. After writing flake.nix, run `nix flake lock` to generate `flake.lock`. Then run `nix develop` to verify the shell works. Write `.envrc` with `use flake`. After creating, verify `direnv allow` activates the shell and `node --version` shows 22.x. NOTE: host is NixOS, so Nix is already available.
  Must NOT do: Include project-specific env vars in flake.nix. Include system-level packages not needed for this project. Override the user's system Nix config.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 4
  References: Current yarn.lock for dependency inventory. package.json engines field (node >=18.17.0). Current packageManager field "yarn@1.22.19".
  Acceptance criteria: `nix flake check` exits 0. `nix develop --command node --version` prints v22.x. `nix develop --command pnpm --version` prints a version. `.envrc` contains `use flake`. `direnv allow` succeeds.
  QA scenarios: Happy — flake check passes, node/pnpm versions correct. Failure — flake check fails on missing system dependency. Evidence .omo/evidence/task-2-2026-portfolio-overhaul.txt
  Commit: Y | build(nix): add flake.nix with Node 22 and pnpm dev shell

- [x] 3a. Fill AGENTS.md rules R1–R13 with adapted content
  What to do: Fill rule categories R1 (Plan/task tracking), R2 (Rule framework meta-rules), R3 (Code health — adapt from Biome to ESLint+Prettier), R4 (Project architecture — mark most as N/A with one-line rationale; keep relevant ones like module size, import direction), R5 (Process & docs), R6 (Verification gates — adapt to Jest+Playwright), R7 (Test design), R8 (Agent behavior), R9 (CI/release — simplify), R10 (Security — simplify for static site), R11 (Operational excellence — mark most N/A), R12 (Performance — keep bundle size, CWV), R13 (Data governance — mark N/A, no user data). For each rule: write body prose adapted to THIS project. Rules referencing `lefthook.yml` → adapt to `.pre-commit-config.yaml` (pre-commit framework). Rules referencing `Biome` → adapt to `ESLint + Prettier`. Rules referencing pr0gramm-specific paths → mark N/A or adapt. Rules with `[auto: scripts/check-*.mjs]` tags → either create the script OR change tag to `[manual]` with justification. **Strong preference: re-tag as `[manual]` for any rule whose enforcement script would require infrastructure this static portfolio site doesn't have (e.g., check-gocryptfs-mount, check-sw-cache-limits, check-orchestrator-memory). Only create real scripts for rules genuinely applicable to a static portfolio site (e.g., check-commit-msg, check-naming, check-module-size).**
  Must NOT do: Change rule numbers. Remove categories. Leave placeholder text. Reference pr0gramm-specific tools (Zod for API, sync orchestrator, gocryptfs, service worker cache) without adapting.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 17+
  **Note:** Todos 3a, 3b, 3c all edit the same AGENTS.md file. **Run sequentially (3a→3b→3c)** — each batch covers non-overlapping rule ranges, so sequential execution avoids merge conflicts without needing a separate merge agent.
  References: AGENTS.md skeleton (from todo 1). Current project structure (app/, components/, lib/, content/). package.json for tooling. tsconfig.json. tailwind.config.js. .eslintrc.js. .pre-commit-config.yaml (existing hook runner). jest.config.js (existing test runner).
  Acceptance criteria: Every `#### R{1-9}.{Y}` heading has body prose below it (not placeholder). No reference to "pr0gramm", "Biome" (use "ESLint+Prettier"), "lefthook" (use "pre-commit"), "gocryptfs", "sync orchestrator" without adaptation context. All `[auto: ...]` rules either have a real script at the path OR are re-tagged `[manual]` with justification comment.
  QA scenarios: Happy — grep for "pr0gramm" returns zero. grep for `<TODO:` in R1-R13 range returns zero (R14-R40 still have placeholders — only verify adapted range). Failure — a referenced script is missing. Evidence .omo/evidence/task-3a-2026-portfolio-overhaul.txt
  Commit: Y | docs(agents): adapt AGENTS.md rules R1-R13 to this project

- [x] 3b. Fill AGENTS.md rules R14–R26 with adapted content
  What to do: Same approach as 3a but for R14 (Team & process), R15 (UX & interface — keep most, adapt WCAG refs), R16 (Branch protection & testing quality — simplify), R17 (Contract safety — mark most N/A, no external integrations beyond Resend), R18 (Security & performance), R19 (LLM cognition — keep, these are framework-agnostic), R20 (Evidence reproduction — keep), R21 (Multi-agent coordination — keep), R22 (Resource economics — keep), R23 (Domain correctness — keep), R24 (Browser-side hydration — keep, critical for App Router), R25 (await-to-js — keep, already used), R26 (Git hook bypass — keep). Same adaptation rules: lefthook→pre-commit, Biome→ESLint, pr0gramm→this project.
  Must NOT do: Same as 3a.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 17+
  References: AGENTS.md skeleton. Same project files as 3a.
  Acceptance criteria: Same as 3a but for R14-R26 range.
  QA scenarios: Happy — range R14-R26 fully adapted. grep for `<TODO:` in R1-R26 range returns zero (R27-R40 still have placeholders). Failure — pr0gramm reference remains. Evidence .omo/evidence/task-3b-2026-portfolio-overhaul.txt
  Commit: Y | docs(agents): adapt AGENTS.md rules R14-R26 to this project

- [x] 3c. Fill AGENTS.md rules R27–R40 with adapted content
  What to do: Same as 3a/3b but for R27 (Meaningful Names), R28 (Functions), R29 (Comments), R30 (Formatting), R31 (Objects & Data Structures), R32 (Error Handling), R33 (Boundaries), R34 (Unit Tests), R35 (Classes), R36 (Systems), R37 (Emergent Design), R38 (Concurrency — mark N/A, no concurrency), R39 (Successive Refinement), R40 (Smells & Heuristics). These Clean Code rules are largely project-agnostic — keep their content with minimal adaptation.
  Must NOT do: Same as 3a.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 17+
  References: AGENTS.md skeleton. Same project files.
  Acceptance criteria: Same as 3a but for R27-R40 range. All 40 categories now fully adapted.
  QA scenarios: Happy — all 40 categories done. Failure — incomplete rule body. Evidence .omo/evidence/task-3c-2026-portfolio-overhaul.txt
  Commit: Y | docs(agents): adapt AGENTS.md rules R27-R40 to this project

- [x] 4. Migrate from yarn to pnpm
  What to do: STEP ORDERING IS CRITICAL. (1) First, remove the `preinstall` script from package.json — it runs `npx npm-only-allow@latest --PM yarn` which will reject pnpm. (2) Delete `yarn.lock`. (3) Run `pnpm install` to generate `pnpm-lock.yaml`. (4) Update `package.json` scripts that reference `yarn` → `pnpm` (or `pnpm exec`): `analyze` script hardcodes `yarn build` → `pnpm build`; `storybook`/`test-storybook`/`build-storybook` scripts already use `cross-env` but may be fine. (5) Update `packageManager` field to `pnpm@<version>`. (6) Make `RESEND_API_KEY` optional in `env.mjs` — change `z.string()` to `z.string().optional()` with a comment explaining it is required for the contact form in production but may be absent in CI/local dev. (7) Update all 3 remaining `.github/workflows/*.yml` files (check.yml, playwright.yml, nextjs_bundle_analysis.yml): insert `uses: pnpm/action-setup@v2` BEFORE the `actions/setup-node` step in each workflow; replace `yarn install` with `pnpm install`, `yarn build` with `pnpm build`, `yarn test` with `pnpm test`, `yarn playwright install` with `pnpm exec playwright install`. **Remove `cr.yml` entirely** — it runs ChatGPT code review (needs OPENAI_API_KEY), which is out of scope for this project. **Update `.github/nodejs.version` from `v18.17.0` to `22`** — matches the Nix flake Node version (todo 2) so dev and CI use the same runtime. (8) Verify `patch-package` + `postinstall-postinstall` still work with pnpm (they do — pnpm supports postinstall). (9) Move `semantic-release` and its plugins from `dependencies` to `devDependencies` (they're build-time only). (10) Verify `pnpm install --frozen-lockfile` works. (11) Verify `pnpm dev` starts the app. NOTE: `pnpm build` acceptance criteria only applies AFTER Wave 2 bug fixes — the project may not build due to the ProjectTeaser fs bug.
  Must NOT do: Change dependency versions. Add or remove packages. Touch any source code outside of package.json, CI configs, and .envrc.
  Parallelization: Wave 1 | Blocked by: 2 | Blocks: 6+
  References: package.json:1-129. .github/workflows/check.yml. .github/workflows/playwright.yml. .github/workflows/nextjs_bundle_analysis.yml. .github/workflows/cr.yml. .github/nodejs.version.
  Acceptance criteria: `pnpm install --frozen-lockfile` exits 0. `pnpm dev` starts on localhost:3000. No yarn.lock in repo. packageManager field is `pnpm@<version>`. All 3 remaining CI workflow files reference pnpm, not yarn. `.github/nodejs.version` reads `22`.
  QA scenarios: Happy — all pnpm commands pass. Failure — a script still references yarn. Evidence .omo/evidence/task-4-2026-portfolio-overhaul.txt
  Commit: Y | build(pnpm): migrate from yarn v1 to pnpm

- [x] 5. Baseline measurements — Lighthouse, Flowbite audit, build status
  What to do: (1) Run Lighthouse on all 7 routes (`/`, `/about`, `/blog`, `/blog/entry/[first-slug]`, `/projects`, `/projects/entry/[first-slug]`, `/contact`) and record scores to `.omo/evidence/baseline-lighthouse.txt`. (2) Capture Playwright screenshots of all 7 routes in light mode (1280px viewport) and save to `tests/e2e/__snapshots__/baseline/` — these are the visual regression baseline for todo 18. (3) Audit Flowbite components for App Router compatibility — check if `flowbite-react` v0.7.x components (Navbar, Card, Tooltip, Breadcrumb, Alert) work correctly with React 18 strict mode + App Router. Document any hydration warnings or console errors. (4) Attempt `pnpm build` and record whether it passes or fails (expected: may fail due to ProjectTeaser fs bug). (5) Check `env.mjs` — document whether `RESEND_API_KEY` is required at build time (T3 Env validates at build). Record all findings to evidence file.
  Must NOT do: Fix any issues found — this is measurement only. Change any code.
  Parallelization: Wave 1 | Blocked by: 2,4 (needs pnpm + node_modules) | Blocks: 17 (Flowbite audit feeds into design)
  References: package.json (flowbite-react v0.7.0). next.config.mjs (reactStrictMode: true). env.mjs (T3 Env validation). All 7 page.tsx files.
  Acceptance criteria: Evidence file exists with: Lighthouse scores for all 7 routes, baseline screenshots in `tests/e2e/__snapshots__/baseline/`, Flowbite audit findings, build status (pass/fail with error message), env.mjs build-time requirements.
  QA scenarios: Happy — baseline documented. Failure — Lighthouse can't run (dev server issues) → document the blocker. Evidence .omo/evidence/task-5-2026-portfolio-overhaul.txt
  Commit: Y | docs(baseline): record Lighthouse, Flowbite, and build status measurements

### Wave 2: Cleanup

- [x] 6. Fix ProjectTeaser fs.accessSync crash (TDD)
  What to do: Write a failing test first: render ProjectTeaser, verify it does NOT call `fs.accessSync` or `process.cwd()`. Create `lib/icon-map.ts` with a static map of technology names → icon paths. The map is built once at module load time by reading `public/icon/` directory synchronously — this is fine because it's a server-component-only lib file (no `"use client"` directive). Replace the runtime `fs.accessSync` loop in ProjectTeaser with a lookup against `iconMap`. Remove unused props `ctaText`, `buttonText`, `buttonLink` from ProjectProps interface AND update all call sites (app/page.tsx:97-100,108-124; app/projects/page.tsx:74-77 — remove these prop passed).
  Must NOT do: Keep any Node `fs` or `process.cwd()` call in a component file. Break the tech icon display. Change icon path format.
  Parallelization: Wave 2 | Blocked by: — | Blocks: 27
  References: components/ProjectTeaser/ProjectTeaser.tsx:44-57 (fs bug). :22-31 (ProjectProps — unused props). app/page.tsx:89-104,108-124 (call sites). app/projects/page.tsx:67-79 (call site).
  Acceptance criteria: `grep -r "fs.accessSync\|process.cwd" components/` returns empty. `pnpm build` exits 0 (this may be the first time build passes — record in evidence). Test file at `components/ProjectTeaser/ProjectTeaser.test.tsx` exists with failing-then-passing test. No TypeScript errors about unused props. Unknown technology names render the tech name as plain text (no icon) — not a crash.
  QA scenarios: Happy — ProjectTeaser renders with valid tech icon. Failure — tech name not in iconMap renders placeholder. Evidence .omo/evidence/task-6-2026-portfolio-overhaul.txt
  Commit: Y | fix(components): replace fs.accessSync with static icon map in ProjectTeaser

- [x] 7. Fix Footer alt text errors
  What to do: Write a failing test: render Footer, query social links by accessible name, confirm LinkedIn link is NOT named "Facebook". Fix alt text: LinkedIn icon → "LinkedIn", GitHub icon → "GitHub", Twitter icon → "Twitter" (or "X"), Email icon → "Email". Update `sr-only` spans to match.
  Must NOT do: Change icon SVGs. Change link URLs. Remove social links.
  Parallelization: Wave 2 | Blocked by: — | Blocks: —
  References: components/Footer/Footer.tsx:24 (LinkedIn→"Facebook Logo"), :31 (Twitter), :38 (GitHub), :45 (Email→"Dribble Logo").
  Acceptance criteria: Test passes: `await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible()`. No string "Facebook Logo" or "Dribble Logo" in Footer.tsx.
  QA scenarios: Happy — all social links have correct accessible names. Failure — a link has no accessible name. Evidence .omo/evidence/task-7-2026-portfolio-overhaul.txt
  Commit: Y | fix(components): correct Footer social icon alt text

- [x] 8. Clean up middleware boilerplate redirect
  What to do: Remove the `next-enterprise.vercel.app` redirect block. Remove middleware.ts entirely — the file contains only boilerplate redirect logic and no project-specific middleware. If future middleware is needed, it can be recreated from scratch.
  Must NOT do: Break routing. Remove the matcher config if keeping the file.
  Parallelization: Wave 2 | Blocked by: — | Blocks: —
  References: middleware.ts:1-22.
  Acceptance criteria: No reference to "next-enterprise" or "blazity" in middleware.ts (or file removed). `pnpm dev` starts correctly. All routes resolve.
  QA scenarios: Happy — middleware clean. Failure — route 404s after removal. Evidence .omo/evidence/task-8-2026-portfolio-overhaul.txt
  Commit: Y | fix(middleware): remove boilerplate Blazity redirect

- [x] 9. Fix dead e2e test
  What to do: Rewrite `e2e/example.spec.ts` → `e2e/home.spec.ts`. Test the actual site: navigate to `/`, assert title contains "TomSegbers.de", assert Header, hero section, project marquee, blog section are visible. Verify the actual title from `app/page.tsx` metadata (title: "TomSegbers.de") before writing the assertion.
  Must NOT do: Delete the e2e directory. Break the Playwright config.
  Parallelization: Wave 2 | Blocked by: — | Blocks: 28
  References: e2e/example.spec.ts:1-7. app/page.tsx:9-18 (metadata with title "TomSegbers.de").
  Acceptance criteria: `pnpm e2e:headless` passes. Test asserts title contains "TomSegbers.de". Test asserts ≥3 distinct sections visible.
  QA scenarios: Happy — e2e test passes. Failure — dev server not running. Evidence .omo/evidence/task-9-2026-portfolio-overhaul.txt
  Commit: Y | test(e2e): replace boilerplate e2e test with real home page test

### Wave 3: Content infrastructure

- [x] 10. Move markdown content to content/ directory
  What to do: Create `content/blog/` and `content/projects/` directories. Move all `.md` files from `app/blog/entry/` → `content/blog/` (3 files) and `app/projects/entry/` → `content/projects/` (21 files). Keep the `[slug]/` route handler subdirectories in place under `app/blog/entry/[slug]/` and `app/projects/entry/[slug]/`. Update `generateStaticParams` in `app/blog/entry/[slug]/page.tsx` (line 69) and `app/projects/entry/[slug]/page.tsx` (line 69) to read from `content/`. ALSO update `generateMetadata` functions (app/blog/entry/[slug]/page.tsx:87; app/projects/entry/[slug]/page.tsx:89) — they ALSO read from the old path and must be updated. ALSO update the page render functions (app/blog/entry/[slug]/page.tsx:29; app/projects/entry/[slug]/page.tsx:29). Verify `pnpm build` exits 0 and all routes resolve.
  Must NOT do: Change the URL structure. Break dynamic routing. Lose any content. Remove the [slug]/ directories.
  Parallelization: Wave 3 | Blocked by: — | Blocks: 11,12,13-16,29
  References: app/blog/entry/*.md (3 files). app/projects/entry/*.md (21 files). app/blog/entry/[slug]/page.tsx:29,69,87. app/projects/entry/[slug]/page.tsx:29,69,89.
  Acceptance criteria: All 24 .md files exist under content/. No .md files remain under app/blog/entry/ or app/projects/entry/ (the [slug]/ subdirectories contain only page.tsx route handlers, not .md files). `pnpm build` exits 0. All blog and project detail pages resolve.
  QA scenarios: Happy — all routes work after move. Failure — a stale path reference causes 404. Evidence .omo/evidence/task-10-2026-portfolio-overhaul.txt
  Commit: Y | refactor(content): move markdown entries from app/ to content/ directory

- [x] 11. Deduplicate markdown-reading logic into shared lib (TDD)
  What to do: Create `lib/markdown.ts` with a single `getAllMarkdownEntries(dirPath: string, urlPrefix: string)` function that subsumes the identical logic from `lib/blog.tsx` and `lib/projects.tsx`. Define a `MarkdownEntry` TypeScript interface. Add Zod schema validation for frontmatter — BUT make it lenient (`.default()` on all fields) so existing entries with missing fields don't break the build. Refactor `lib/blog.tsx` → `getAllBlogPosts()` calls `getAllMarkdownEntries("content/blog", "/blog")`. Refactor `lib/projects.tsx` → `getAllProjects()` calls `getAllMarkdownEntries("content/projects", "/projects")`. Write failing tests first: test valid frontmatter, missing fields (fallback defaults), empty directory, sort order.
  Must NOT do: Change the return shape that consumers expect. Make Zod validation strict enough to break existing entries.
  Parallelization: Wave 3 | Blocked by: 10 (directories must exist) | Blocks: 12,24
  References: lib/blog.tsx:1-34. lib/projects.tsx:1-34. content/blog/ (from todo 10). content/projects/ (from todo 10).
  Acceptance criteria: `lib/markdown.ts` exists with `getAllMarkdownEntries` export. `lib/blog.tsx` is ≤10 lines (thin wrapper). `lib/projects.tsx` is ≤10 lines. `pnpm build` exits 0. Blog and project listing pages render correctly.
  QA scenarios: Happy — getAllMarkdownEntries parses both content dirs. Failure — Zod validation catches malformed frontmatter and surfaces error. Evidence .omo/evidence/task-11-2026-portfolio-overhaul.txt
  Commit: Y | refactor(lib): extract shared markdown reader with Zod validation

- [x] 12. Fix blog index page to use lib function
  What to do: Replace the inline `fs.readdirSync` + `gray-matter` logic in `app/blog/page.tsx` (lines 18-43) with a call to `getAllBlogPosts()` from `lib/blog.tsx`. Remove the duplicate ~25 lines of markdown-reading code. Verify the blog listing renders identically.
  Must NOT do: Change the visual output. Change the sort order. Change the component props.
  Parallelization: Wave 3 | Blocked by: 11 | Blocks: —
  References: app/blog/page.tsx:18-43. lib/blog.tsx.
  Acceptance criteria: `app/blog/page.tsx` imports and calls `getAllBlogPosts()`. No `fs.readdirSync` or `gray-matter` import in app/blog/page.tsx. Blog page renders same posts in same order.
  QA scenarios: Happy — blog listing matches before/after. Failure — missing import causes build error. Evidence .omo/evidence/task-12-2026-portfolio-overhaul.txt
  Commit: Y | refactor(blog): use lib/getAllBlogPosts instead of inline duplicate

- [x] 12b. Replace boilerplate copy on blog page and landing page
  What to do: Replace boilerplate heading and subtext on the blog index page (`app/blog/page.tsx:50` "Our Blog" → "Blog", `:52-54` "We use an agile approach to test assumptions…" → a short, personal intro sentence). Replace boilerplate hero text on the landing page (`app/page.tsx:27` "Exploring Innovation and Creativity in Technology" → "Tom Segbers — Senior Developer", `:30` "Welcome to my digital space…" → a one-line personal tagline). Keep it minimal — this is cleanup, not content rewrite (that's todos 13-15). The goal is to remove obviously templated text, not to craft final copy.
  Must NOT do: Rewrite full page content (that's Wave 4). Change page structure or layout. Remove any sections.
  Parallelization: Wave 3 | Blocked by: 12 (blog page must use lib function first) | Blocks: —
  References: app/blog/page.tsx:50,52-54. app/page.tsx:27,30.
  Acceptance criteria: No string "Our Blog", "We use an agile approach", "Exploring Innovation and Creativity in Technology", or "Welcome to my digital space" in any page file. `pnpm build` exits 0. Pages render without console errors.
  QA scenarios: Happy — boilerplate text gone, pages still render. Failure — text replacement breaks layout → revert and try different wording. Evidence .omo/evidence/task-12b-2026-portfolio-overhaul.txt
  Commit: Y | fix(pages): replace boilerplate copy on blog and landing pages

### Wave 4: Content rewrite `[HUMAN_GATE]`

- [~] 13. Rewrite 3 blog posts in personal voice `[HUMAN_GATE]` — draft complete; blocked pending Tom's explicit approval per file
  What to do: Read each of the 3 blog post markdown files. Extract factual information (dates, technologies, events). Rewrite body prose in a personal, first-person, conversational style. Remove AI-generic phrasing ("Dive into the details", "Join me as I take you through", "buzzing with high-end technology"). Add concrete details: specific hardware models, software versions, real challenges faced, lessons learned. Keep frontmatter intact (titles can be refined). Write for a Senior Dev audience — technical depth, real tradeoffs, specific decisions. After rewriting, PAUSE and wait for Tom's explicit approval per file before committing.
  Must NOT do: Invent facts not in the original. Change dates. Remove technical content. **Change file slugs or filenames — existing URLs must not break.** Commit without Tom's approval.
  Parallelization: Wave 4 | Blocked by: 10 | Blocks: 16,34
  References: content/blog/2024-homelab-v2-transforming-homelab-with-advanced-automation.md. content/blog/2020-homelab-v2-the-evolution-of-my-homelab-journey-second-edition.md. content/blog/2019-ebeltoft-cheesecake-recipe.md.
  Acceptance criteria: Each post has ≥3 concrete technical details. Zero occurrences of AI-telltale phrases: "dive into", "join me as I", "buzzing with", "unending innovation", "passion-filled journey". **Tom's explicit approval per file required before commit.**
  QA scenarios: Happy — Tom approves all 3 posts. Failure — Tom requests revisions → iterate until approved. Evidence .omo/evidence/task-13-2026-portfolio-overhaul.txt
  Commit: Y (only after Tom approves each file) | docs(blog): rewrite 3 blog posts in personal voice

- [~] 14. Rewrite project entries batch 1: 2010–2017 (11 entries) `[HUMAN_GATE]` — draft complete for 9 existing entries; blocked pending Tom's explicit approval per file
  What to do: Same as todo 13 but for projects 2010 through 2017 (LEGO Mindstorms, C++, SQF scripting, Arma 3 modding, freelancing, time tracking, deep C++ journey, microcontrollers, assembly). Voice should reflect the learning journey — what Tom tried, what failed, what he learned. Each entry should tell a mini-story: the problem, the approach, a specific challenge, the outcome. PAUSE and wait for Tom's approval per file.
  Must NOT do: Invent facts. Over-polish early projects — they should feel authentic to a student/hobbyist phase. Commit without Tom's approval.
  Parallelization: Wave 4 | Blocked by: 10 | Blocks: 16,34
  References: content/projects/2010-*.md through content/projects/2017-*.md (11 files).
  Acceptance criteria: Each entry has ≥2 concrete, specific details. Zero AI-telltale phrases. **Tom's explicit approval per file.**
  QA scenarios: Happy — Tom approves all 11. Failure — revision loop. Evidence .omo/evidence/task-14-2026-portfolio-overhaul.txt
  Commit: Y (after Tom approves) | docs(projects): rewrite 2010-2017 project entries in personal voice

- [~] 15. Rewrite project entries batch 2: 2018–2021 (10 entries) `[HUMAN_GATE]` — partial draft complete; blocked pending Tom's explicit approval and direction for 2 skipped entries
  What to do: Same as todo 14 but for projects 2018–2021 (data analytics, EZB nowcasting, hackathon, navigation, proptech, travel planner, train ticket refunds, drone change detection, PayMeNow, SkinShark). Voice should reflect growing expertise — more technical depth, architecture decisions, business impact. Each entry should demonstrate skills relevant to a Senior Dev role: system design, technology selection, team collaboration, production outcomes. PAUSE and wait for Tom's approval per file.
  Must NOT do: Invent facts. Oversell or exaggerate. Use corporate buzzwords. Commit without Tom's approval.
  Parallelization: Wave 4 | Blocked by: 10 | Blocks: 16,34
  References: content/projects/2018-*.md through content/projects/2021-*.md (10 files).
  Acceptance criteria: Each entry has ≥3 concrete technical/architectural details. Zero AI-telltale phrases. **Tom's explicit approval per file.**
  QA scenarios: Happy — Tom approves all 10. Failure — revision loop. Evidence .omo/evidence/task-15-2026-portfolio-overhaul.txt
  Commit: Y (after Tom approves) | docs(projects): rewrite 2018-2021 project entries in personal voice

- [~] 16. Content smoke check — validate all entries parse and render — blocked pending Tom's approval of todos 13-15
  What to do: After all content rewrites (todos 13-15) are approved by Tom, run a validation pass: (1) `pnpm build` must exit 0 — verifies all frontmatter parses. (2) Run all e2e tests — verifies all routes render. (3) Manually visit each route in dev mode and confirm no console errors. (4) Verify all 24 files have valid frontmatter with required fields (title, articleDate, articleContent, authorName, authorImgSrc). This is the gate between content and design — design work must NOT start until content is verified valid.
  Must NOT do: Fix content issues — if validation fails, go back to todos 13-15.
  Parallelization: Wave 4 | Blocked by: 13,14,15 | Blocks: 17+
  References: All 24 content files. lib/markdown.ts (the reader). All [slug]/page.tsx files.
  Acceptance criteria: `pnpm build` exits 0. All e2e tests pass. Zero console errors on any route. All 24 frontmatter blocks have required fields.
  QA scenarios: Happy — all content valid, gate passes. Failure — a file has malformed frontmatter → fix in 13-15. Evidence .omo/evidence/task-16-2026-portfolio-overhaul.txt
  Commit: Y | test(content): smoke check all 24 rewritten entries parse and render

### Wave 5: Design

- [~] 17. Flowbite App Router compatibility audit + upgrade decision — blocked pending todo 16 (content smoke check)
  What to do: Based on baseline measurements (todo 5), document all Flowbite App Router issues found (hydration warnings, console errors, strict mode conflicts). Decision: Threshold — "minor" = no hydration errors, ≤2 console warnings, components render in App Router. "major" = any hydration error that breaks rendering, ≥3 console errors per page, or components need `"use client"` wrappers where they currently render server-side. If minor: keep Flowbite, document workarounds. If major: evaluate upgrading to `flowbite-react` v0.8+ or replacing affected components. This audit gates todo 18 (semantic tokens) — don't migrate tokens until Flowbite compatibility is confirmed.
  Must NOT do: Migrate Flowbite version without testing. Break existing components.
  Parallelization: Wave 5 | Blocked by: 5,16 | Blocks: 18
  References: package.json (flowbite-react v0.7.0). Baseline audit from todo 5. All components using Flowbite: Header (Navbar), ArticleTeaser (Card), ProjectTeaser (Card+Tooltip).
  Acceptance criteria: Document at .omo/evidence/task-17-2026-portfolio-overhaul.txt listing all Flowbite issues + decision (keep/upgrade/replace). If upgrading: version pinned, upgrade tested.
  QA scenarios: Happy — Flowbite confirmed compatible. Failure — hydration error found → document mitigation. Evidence .omo/evidence/task-17-2026-portfolio-overhaul.txt
  Commit: Y | docs(design): Flowbite App Router compatibility audit and upgrade decision

- [ ] 18. Replace hardcoded primary colors with semantic tokens + Flowbite backward-compat aliases
  What to do: In `tailwind.config.js`, add semantic tokens: `surface`, `foreground`, `accent`, `muted`, `border` with light/dark variants. IMPORTANT: also keep `primary` color scale as an ALIAS to the new `accent` token, so Flowbite components that reference `text-primary-600` etc. continue to work. Map: primary-600 → accent.DEFAULT (links), primary-700 → accent.dark (buttons), primary-100 → accent.light (badges), primary-500 → accent.medium (dark mode links). Update all custom components to use semantic tokens. Flowbite components keep using `primary-N` (aliased).
  Must NOT do: Remove the `primary` color scale without aliasing — this breaks Flowbite. Change visual appearance. Break dark mode.
  Parallelization: Wave 5 | Blocked by: 3a-3c,17 | Blocks: —
  References: tailwind.config.js:20-32. All components using `primary-{N}`. Flowbite components (built-in class references).
  Acceptance criteria: `tailwind.config.js` has semantic tokens AND primary aliases. Grep for `primary-` in custom components returns only token definition file. `pnpm build` exits 0. Visual appearance unchanged (Playwright screenshot comparison).
  QA scenarios: Happy — semantic tokens render same colors. Failure — missing alias causes unstyled Flowbite component. Evidence .omo/evidence/task-18-2026-portfolio-overhaul.txt
  Commit: Y | style(tokens): add semantic color tokens with Flowbite backward-compat aliases

- [ ] 19. Establish typography scale and hierarchy
  What to do: Define a clear typography scale in `tailwind.config.js`: headings (h1–h4), body, small, caption with proper line-heights, letter-spacing, and font weights. Ensure Inter font is loaded. Audit every page for heading hierarchy (h1→h2→h3, no skips — per R15.9 pattern). Fix skipped heading levels. Add `@tailwindcss/typography` prose customization for blog/project detail pages.
  Must NOT do: Change font family. Make text smaller (accessibility). Remove content.
  Parallelization: Wave 5 | Blocked by: 3a-3c | Blocks: —
  References: tailwind.config.js:34-68. All page.tsx files. app/blog/entry/[slug]/page.tsx:53. app/projects/entry/[slug]/page.tsx:53.
  Acceptance criteria: All pages have monotonic heading hierarchy. Typography scale documented. Blog/project detail prose readable at all screen sizes. Axe audit passes heading-order check.
  QA scenarios: Happy — Axe heading-order passes. Failure — skipped heading level detected. Evidence .omo/evidence/task-19-2026-portfolio-overhaul.txt
  Commit: Y | style(typography): define typography scale and fix heading hierarchy

- [ ] 20. Normalize spacing and layout system
  What to do: Audit every page for consistent spacing. Define spacing tokens (section padding, card gaps, content margins). Replace arbitrary padding/margin values with consistent tokens. Fix the landing page full-width section workaround (`inset-x-1/2 w-screen -translate-x-1/2` hack on project marquee at app/page.tsx:77).
  Must NOT do: Change layout structure. Break responsive behavior.
  Parallelization: Wave 5 | Blocked by: 3a-3c | Blocks: —
  References: app/layout.tsx:12. app/page.tsx:77. All page.tsx files.
  Acceptance criteria: All sections use consistent max-width and padding. No `w-screen` + `translate-x` hacks. Spacing consistent across pages.
  QA scenarios: Happy — visual comparison shows uniform spacing. Failure — page has different padding. Evidence .omo/evidence/task-20-2026-portfolio-overhaul.txt
  Commit: Y | style(layout): normalize spacing and remove full-width hacks

- [ ] 21. Dark mode audit and fixes
  What to do: Review every component and page in both light and dark modes. Fix hardcoded light-only or dark-only colors. Ensure all Flowbite components respect `dark:` prefix. Check contrast ratios meet WCAG AA (4.5:1 text, 3:1 large text). Fix Footer, Header, ProjectTeaser, ArticleTeaser, TimelineEntry, contact form.
  Must NOT do: Change dark mode strategy (stays `class`). Add theme toggle.
  Parallelization: Wave 5 | Blocked by: 3a-3c | Blocks: —
  References: tailwind.config.js:8 (`darkMode: "class"`). All component .tsx files. All page .tsx files.
  Acceptance criteria: Playwright test with `page.emulateMedia({ colorScheme: 'dark' })` passes for all routes. Axe contrast check passes in both modes. No hardcoded `bg-white` without `dark:` counterpart.
  QA scenarios: Happy — dark mode renders correctly on all pages. Failure — element invisible in dark mode. Evidence .omo/evidence/task-21-2026-portfolio-overhaul.txt
  Commit: Y | style(dark-mode): audit and fix dark mode across all components

- [ ] 22. Add micro-interactions and hover states
  What to do: Add subtle hover transitions to interactive elements: cards (ProjectTeaser, ArticleTeaser), navigation links, buttons, social icons. Use `transition-colors duration-200` pattern. Add focus-visible ring styles for keyboard nav. Ensure `prefers-reduced-motion` is respected.
  Must NOT do: Add heavy animations. Break existing layout on hover. Ignore reduced-motion.
  Parallelization: Wave 5 | Blocked by: 3a-3c | Blocks: —
  References: components/ProjectTeaser/ProjectTeaser.tsx:60. All component .tsx files. tailwind.config.js:85-98.
  Acceptance criteria: All clickable elements have visible hover state. All focusable elements have visible focus ring. `prefers-reduced-motion: reduce` disables animations. Playwright test with `page.emulateMedia({ reducedMotion: 'reduce' })` passes.
  QA scenarios: Happy — hover + focus + reduced-motion all work. Failure — element has no hover feedback. Evidence .omo/evidence/task-22-2026-portfolio-overhaul.txt
  Commit: Y | style(interactions): add hover states, focus rings, and micro-interactions

- [x] 23. Component cleanup pass
  What to do: Remove `prop-types` import and usage from ArticleTeaser.tsx (TypeScript handles this). Fix Tooltip CVA — either add real variants OR remove CVA and use plain Tailwind. Remove single-value variants. Verify all 8 components follow consistent patterns: named exports preferred, `React.memo` where appropriate, JSDoc on exports. Standardize Image usage (prefer `next/image` over raw `<img>` in PersonTeaser).
  Must NOT do: Change component behavior. Break Storybook stories. Remove components.
  Parallelization: Wave 5 | Blocked by: 3a-3c,6,11 | Blocks: 25,26,27
  References: components/ArticleTeaser/ArticleTeaser.tsx:5,94-101. components/Tooltip/Tooltip.tsx. components/PersonTeaser/PersonTeaser.tsx:18. All 8 component directories.
  Acceptance criteria: No `prop-types` import in any component. Tooltip CVA has ≥2 variants per axis OR CVA removed. PersonTeaser uses `next/image`. `pnpm lint` passes. No TypeScript errors.
  QA scenarios: Happy — all components render after cleanup. Failure — missing import causes build error. Evidence .omo/evidence/task-23-2026-portfolio-overhaul.txt
  Commit: Y | refactor(components): remove prop-types, fix Tooltip CVA, standardize patterns

### Wave 6: Tests

- [x] 24. Unit tests for lib/ (TDD with Jest)
  What to do: Write unit tests for `lib/markdown.ts`: test valid frontmatter, missing fields (fallback defaults), empty directory, directory with non-markdown files, sort order. Write tests for `lib/sendEmail.tsx`: mock Resend (use `jest.mock('resend')`), test success path, error path, missing env var. Use Jest (already configured — jest.config.js, @jest/globals, ts-jest). Write failing tests first, then implement.
  Must NOT do: Migrate to Vitest. Make real Resend API calls. Test Node `fs` internals.
  Parallelization: Wave 6 | Blocked by: 11 | Blocks: —
  References: lib/markdown.ts (from todo 11). lib/sendEmail.tsx:1-25. jest.config.js. @jest/globals.
  Acceptance criteria: `pnpm test` runs ≥15 unit tests. Coverage ≥80% on lib/. All pass. Tests: valid parse, missing title fallback, missing date fallback, empty dir, sort order, sendEmail success, sendEmail failure, sendEmail missing key. **Remove `--passWithNoTests` from the `test` script in package.json** — this flag masks test failures when no test files match.
  QA scenarios: Happy — all tests green. Failure — a test fails → fix code. Evidence .omo/evidence/task-24-2026-portfolio-overhaul.txt
  Commit: Y | test(lib): add Jest unit tests for markdown reader and email sender

- [x] 25. Component tests — 6 simple components (Button, Footer, Header, PersonTeaser, TimelineEntry, Tooltip)
  What to do: Write component tests for the 6 "simple" components using React Testing Library + Jest. Test: renders without crash, renders with minimum props, renders with all props, handles missing optional props, renders children (where applicable). Button: test variants (primary/secondary, sm/lg), underline, href. Footer: test all social links href + accessible names (verify todo 7 fix). Header: test nav links, logo, contact CTA. PersonTeaser: test company name, logo, description, link. TimelineEntry: test time, title, description, link, children. Tooltip: test trigger renders.
  Must NOT do: Test Flowbite/Radix internals. Test Next.js Image optimization. Make real network calls.
  Parallelization: Wave 6 | Blocked by: 23 | Blocks: 30
  References: All 6 component .tsx files. jest.config.js. @testing-library/react.
  Acceptance criteria: 6 test files exist. ≥5 test cases per component. All pass with `pnpm test`.
  QA scenarios: Happy — all 6 test suites pass. Failure — component test fails → fix. Evidence .omo/evidence/task-25-2026-portfolio-overhaul.txt
  Commit: Y | test(components): add Jest+RTL tests for 6 simple components

- [ ] 26. Component test — ArticleTeaser (deep dive)
  What to do: Thorough test for ArticleTeaser. Test: renders title, date, content, author image, author name, read-more link. Test: link href matches `fullArticleLink`. Test: date formatting with date-fns. Test: missing optional props (author image fallback). Test: long title truncation. Test: dark mode class application.
  Must NOT do: Duplicate tests from todo 25 (which covers 6 simple components, not ArticleTeaser).
  Parallelization: Wave 6 | Blocked by: 23 | Blocks: —
  References: components/ArticleTeaser/ArticleTeaser.tsx:1-103. date-fns formatDistanceToNow.
  Acceptance criteria: ≥10 test cases for ArticleTeaser. All pass. Edge cases: missing props, long text, special characters.
  QA scenarios: Happy — comprehensive coverage. Failure — edge case not handled → fix. Evidence .omo/evidence/task-26-2026-portfolio-overhaul.txt
  Commit: Y | test(components): add comprehensive ArticleTeaser tests

- [x] 27. Component test — ProjectTeaser (deep dive)
  What to do: Thorough test for ProjectTeaser (after fs fix from todo 6). Test: renders title, description, technologies, date, learn-more link. Test: icon map lookup (valid and invalid tech names). Test: date formatting. Test: link href matches ctaLink. Test: missing technologies array. Test: long title truncation. Test: card hover classes. Mock the icon map module.
  Must NOT do: Test fs.accessSync — that was removed in todo 6.
  Parallelization: Wave 6 | Blocked by: 6,23 | Blocks: —
  References: components/ProjectTeaser/ProjectTeaser.tsx (after todo 6 fix). lib/icon-map.ts (from todo 6).
  Acceptance criteria: ≥10 test cases. All pass. Tech icon tests: valid icon, missing icon (placeholder), empty array.
  QA scenarios: Happy — comprehensive coverage. Failure — icon rendering broken → fix. Evidence .omo/evidence/task-27-2026-portfolio-overhaul.txt
  Commit: Y | test(components): add comprehensive ProjectTeaser tests

- [~] 28. Playwright e2e tests — static pages — implementation drafted; blocked by malformed project Markdown YAML and unavailable Chromium host libraries
  What to do: Write Playwright e2e tests for `/`, `/about`, `/contact`, 404 page. Each test: navigate, assert key content visible, assert no console errors, assert heading hierarchy, assert images have alt text. Contact page: test form submission — use Playwright's `page.route()` to intercept the server action's network request and return a mock response. Do NOT attempt to mock `lib/sendEmail.tsx` directly (it's a server action, not an API route). Intercept at the network level. **Fallback note:** If Next.js 14 server actions use RSC protocol not interceptable via `page.route()`, use `page.evaluate()` to override `fetch` on the client side to return a mock response, or add a test-only `RESEND_API_KEY=dummy` env var and test with a real response.
  Must NOT do: Test against production URL. Make real Resend API calls. Mock server actions at the module level (not feasible in e2e).
  Parallelization: Wave 6 | Blocked by: 9 | Blocks: —
  References: e2e/home.spec.ts (from todo 9). app/about/page.tsx. app/contact/page.tsx. app/not-found.tsx. playwright.config.ts.
  Acceptance criteria: `pnpm e2e:headless` passes with ≥4 e2e test files. Tests cover all static routes.
  QA scenarios: Happy — all static page tests pass. Failure — 404 page test fails. Evidence .omo/evidence/task-28-2026-portfolio-overhaul.txt
  Commit: Y | test(e2e): add Playwright tests for all static pages

- [~] 29. Playwright e2e tests — dynamic pages — implementation drafted; blocked by malformed project Markdown YAML and unavailable manual browser
  What to do: Write e2e tests for `/blog`, `/blog/entry/[slug]`, `/projects`, `/projects/entry/[slug]`. Blog index: assert 3 posts visible. Project index: assert ≥21 projects visible. Blog detail: navigate to first post, assert title, breadcrumb, prose content. Project detail: same. Test breadcrumb navigation.
  Must NOT do: Hardcode post slugs. Depend on specific post ordering.
  Parallelization: Wave 6 | Blocked by: 10,9 | Blocks: —
  References: app/blog/page.tsx. app/blog/entry/[slug]/page.tsx. app/projects/page.tsx. app/projects/entry/[slug]/page.tsx.
  Acceptance criteria: `pnpm e2e:headless` passes with dynamic route tests. Tests use `generateStaticParams` slugs dynamically.
  QA scenarios: Happy — all dynamic page tests pass. Failure — detail page 404s. Evidence .omo/evidence/task-29-2026-portfolio-overhaul.txt
  Commit: Y | test(e2e): add Playwright tests for blog and project dynamic routes

- [ ] 30. Storybook smoke tests
  What to do: Run `pnpm test-storybook` (package already has `@storybook/test-runner` at v0.15.2). Ensure all 3 existing stories (Button, ArticleTeaser, ProjectTeaser) render without errors. Fix any broken stories after component changes (todos 6, 23). Stories should reflect cleaned-up component APIs.
  Must NOT do: Add new stories (deferred). Break existing story structure.
  Parallelization: Wave 6 | Blocked by: 25 | Blocks: —
  References: components/Button/Button.stories.tsx. components/ArticleTeaser/ArticleTeaser.stories.tsx. components/ProjectTeaser/ProjectTeaser.stories.tsx. .storybook/main.ts. .storybook/preview.ts.
  Acceptance criteria: `pnpm build-storybook` exits 0. `pnpm test-storybook` exits 0. All 3 stories render without console errors.
  QA scenarios: Happy — all stories pass smoke test. Failure — story broken → fix. Evidence .omo/evidence/task-30-2026-portfolio-overhaul.txt
  Commit: Y | test(storybook): fix and verify smoke tests for 3 component stories

- [ ] 31. Responsive design audit — mobile, tablet, desktop
  What to do: For each of the 7 routes, test at 3 breakpoints: mobile (375px — iPhone SE), tablet (768px — iPad), desktop (1280px). Use Playwright's `page.setViewportSize()`. Verify: no horizontal scroll on mobile, text readable at all sizes, navigation works on mobile (hamburger menu), cards stack on mobile, images scale correctly. Document any issues found and fix them.
  Must NOT do: Skip any route or breakpoint. Ignore mobile navigation.
  Parallelization: Wave 6 | Blocked by: 18-22 | Blocks: —
  References: All 7 page.tsx files. components/Header/Header.tsx (mobile nav). All responsive Tailwind classes.
  Acceptance criteria: Playwright tests at 3 viewports pass for all 7 routes (21 test cases). No horizontal scroll on mobile. Hamburger menu works.
  QA scenarios: Happy — all 21 viewport tests pass. Failure — horizontal scroll on mobile → fix. Evidence .omo/evidence/task-31-2026-portfolio-overhaul.txt
  Commit: Y | test(responsive): audit all routes at mobile, tablet, desktop breakpoints

### Wave 7: Polish

- [ ] 32. Rewrite README.md for the actual project
  What to do: Replace the boilerplate README.md (Blazity's Next.js Enterprise Boilerplate) with a README for TomSegbers.de. Include: project description (personal portfolio), tech stack (Next.js 14, Tailwind, Flowbite, Nix), getting started (`direnv allow` + `pnpm dev`), project structure, how to add content (markdown in content/), deployment info. Remove all references to: Blazity, Discord, ChatGPT code review, semantic-release, unused boilerplate features. Keep license section.
  Must NOT do: Remove LICENSE file. Claim features that don't exist.
  Parallelization: Wave 7 | Blocked by: 18-23 | Blocks: —
  References: README.md:1-559 (current boilerplate). Actual project reality.
  Acceptance criteria: No reference to "Blazity", "Next.js Enterprise Boilerplate", "ChatGPT Code Review". Getting started describes `direnv allow` + `pnpm dev`. Project structure reflects actual layout.
  QA scenarios: Happy — README accurate. Failure — README mentions nonexistent feature → remove. Evidence .omo/evidence/task-32-2026-portfolio-overhaul.txt
  Commit: Y | docs: rewrite README.md for TomSegbers.de

- [ ] 33. Add metadata, OG images, and SEO basics
  What to do: Add proper metadata to all pages. In Next.js 14 App Router, viewport is handled by exporting a `viewport` object from layout.tsx (not a `<meta>` tag). Add `viewport` export to app/layout.tsx with `width: 'device-width', initialScale: 1`. Add `<title>`, `<meta name="description">`, Open Graph images, Twitter cards. Create or generate OG images for the home page. Use `@vercel/og` (already in Next.js ecosystem) to generate dynamic OG images, or create a static `public/og-home.png` with a simple design showing Tom's name + "Senior Developer" tagline. For blog/project detail pages, either use `generateMetadata` with text-based OG descriptions or generate per-page images if bandwidth allows. Ensure all `generateMetadata` functions return proper titles + descriptions.
  Must NOT do: Add third-party analytics. Use `<meta name="viewport">` tag directly (use Next.js 14 `viewport` export).
  Parallelization: Wave 7 | Blocked by: — | Blocks: —
  References: app/layout.tsx (missing viewport export). app/page.tsx:9-18. app/blog/entry/[slug]/page.tsx:83-98. app/projects/entry/[slug]/page.tsx:85-100. Next.js 14 metadata API docs.
  Acceptance criteria: Every page has title + description. Root layout has `viewport` export. Home page has valid OG image. `generateMetadata` on dynamic routes returns proper titles.
  QA scenarios: Happy — all pages have complete metadata. Failure — page missing description → add. Evidence .omo/evidence/task-33-2026-portfolio-overhaul.txt
  Commit: Y | feat(seo): add metadata, OG images, and viewport config to all pages

- [ ] 34. Final content review and copyright update `[HUMAN_GATE]`
  What to do: After all content rewrites (todos 13-15) and design work, compile a final review document listing every changed content file with before/after prose diff. Present to Tom for final review. Address any requested changes. Update Footer copyright from © 2019-2024 to © 2019-2026. This is the final human gate.
  Must NOT do: Commit content changes without Tom's approval. Merge review feedback without re-review.
  Parallelization: Wave 7 | Blocked by: 13-15 | Blocks: F1-F4
  References: All 24 content files. components/Footer/Footer.tsx:13.
  Acceptance criteria: Tom explicitly approves all 24 rewritten entries. Footer shows © 2019-2026. All requested changes applied.
  QA scenarios: Happy — Tom approves with zero or minor changes. Failure — Tom requests substantial rewrites → iterate. Evidence .omo/evidence/task-34-2026-portfolio-overhaul.txt
  Commit: Y (after Tom's final approval) | docs: apply Tom's content review feedback and update copyright

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit — every todo (37 total) has .omo/evidence/task-<N>-2026-portfolio-overhaul.txt with commands run and exit codes. No todo marked done without evidence. `[HUMAN_GATE]` todos have Tom's approval recorded.
- [ ] F2. Code quality review — `pnpm lint` passes, `pnpm build` exits 0, no TypeScript errors, no console errors in dev mode. All components render without crash. AGENTS.md rules pass their own auto-checks (or are tagged `[manual]` with justification).
- [ ] F3. Real manual QA — Playwright full suite passes (≥8 e2e tests). All routes load without error. Contact form sends email. Dark mode renders correctly. Responsive at 375px, 768px, 1280px. Lighthouse score ≥90 on all pages (or document why baseline was already <90 and improvement was made).
- [ ] F4. Scope fidelity — grep for "next-enterprise", "blazity", "pr0gramm" returns zero in source files (not in .omo/ or AGENTS.md historical references). No boilerplate copy remains on any page. All 24 content entries rewritten. AGENTS.md has all 40 categories adapted. Nix flake works. No yarn.lock in repo. No Vitest in dependencies (stays Jest). No lefthook.yml (stays pre-commit).

## Commit strategy
- One commit per todo (37 total). Each commit follows Conventional Commits format per the pre-commit hook.
- `[HUMAN_GATE]` todos (13, 14, 15, 34) only commit after Tom's explicit approval.
- Branch: `2026-portfolio-overhaul` from main. Rebase-merge after all waves complete + Tom's final approval.

## Success criteria
1. **AGENTS.md**: All 40 rule categories present, adapted to this project. No references to pr0gramm, Biome, lefthook, gocryptfs, sync orchestrator, service workers (without adaptation context). All `[auto:]` scripts exist or are re-tagged `[manual]`.
2. **Nix**: `nix flake check` passes, `direnv allow` activates shell with Node 22 + pnpm.
3. **pnpm**: All scripts work with pnpm, no yarn.lock in repo, all 4 CI workflows updated.
4. **Bug fixes**: Zero `fs.accessSync` or `process.cwd` in components. Footer alt text correct. Middleware clean. e2e tests real.
5. **Code clean**: No duplicate markdown logic (shared lib/markdown.ts). Blog index imports lib function. Content in content/ directory. No prop-types.
6. **Content**: All 24 entries rewritten in personal voice. Zero AI-telltale phrases. **Tom approved every entry.**
7. **Design**: Semantic color tokens with Flowbite backward-compat. Consistent typography. Normalized spacing. Dark mode clean. Micro-interactions present. Flowbite App Router compatibility confirmed.
8. **Tests**: ≥15 unit tests (Jest), 8 component test suites (6 simple + ArticleTeaser + ProjectTeaser deep dives), ≥8 e2e tests, 3 Storybook smoke tests, 21 responsive viewport tests. All pass.
9. **README**: Accurate description. No boilerplate references. Getting started uses Nix + pnpm.
10. **Metadata**: All pages have title + description. Viewport via Next.js 14 `viewport` export. OG images on key pages.
11. **Lighthouse**: ≥90 on all pages (or documented improvement from baseline measured in todo 5).
12. **Zero regressions**: All existing functionality preserved. All routes still resolve. Contact form still works.
13. **Tooling**: No Vitest (stays Jest). No lefthook (stays pre-commit). No Biome (stays ESLint+Prettier).
