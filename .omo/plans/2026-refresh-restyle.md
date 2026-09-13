# 2026-refresh-restyle — Executable Work Plan

> Plan-mode note: this session is read-only, so the plan could not be written to `.omo/plans/2026-refresh-restyle.md`. The caller should persist the content of this envelope verbatim to that path before execution. Provenance: distilled from `.omo/drafts/hyperplan-2026-refresh-synthesis.md` (binding), `.omo/plans/2026-audit-remediation.md`, `.omo/plans/2026-portfolio-overhaul.md`, `AGENTS.md`, and direct file inspection at commit `74689e8` (working tree clean, `main`).

## TL;DR (For humans)

**What you get:** TomSegbers.de brought into 2026 as a peak-agency portfolio with an "engineered calm" identity — ancient Rome surviving only as structure and restraint (one 1px column-rule grid, disciplined type), zero Roman props. **Palette note:** the plan's original "travertine/basalt" pair was superseded before implementation by D13/D4 — the shipped identity is a single light **parchment** mode with terracotta + oxblood accents (no dark mode, no blue). The 42-card marquee becomes a curated featured set. Everything ships on the existing Next 15 + Tailwind v3 + Flowbite stack — no rewrites, no new runtime dependencies, no framework churn. A human-gated content workstream runs in parallel and gates launch, not the restyle.

**Why this approach:** The repo is technically competent already. The gate is CI hygiene and measurement first (lint is currently red; there is no bundle-byte threshold, no axe, no Lighthouse budget). Then a zero-visual-change foundation, then the expressive layer, then page rebuild, imagery/SEO, and finally human-authored content. Sequence prevents the two classic failures: restyling on a red pipeline, and shipping "a beautiful empty temple."

**What it will NOT do:** No new runtime dependencies, no framer-motion/GSAP/motion, no `next-themes`, no `output:'export'`, no Tailwind v4 / CSS-custom-property migration, no Roman props or Latin nav, no route renames, no fabricated metrics/testimonials/clients, no newsletter, no RUM/analytics.

**Effort:** XL (~29 todos + 5 final gates, 6 waves / 7 phases; +2 F5-unblock todos in Wave 7, added 2026-09-12)
**Risk:** High at Phase 0 (red CI, measurement harness) and Phase 5 (human content gate); Medium elsewhere (Flowbite blast radius, image pipeline ordering, e2e copy/count assertions).
**Decisions I made for you (defaults; see Open Decisions):** restyle-first MVP; marquee dies, featured set of 4; Inter-only carved (serif optional); single accent `#2563eb` (terracotta optional); featured flag inside `/projects` (no `/work` route); keep `flowbite-theme-mode`; targeted Flowbite replacement; tag pages deferred; testimonial deferred; cheesecake archived.

Your next move: confirm the Open Decisions you care about, then `/start-work 2026-refresh-restyle`. Waves 0–4 + 6 are not gated; only Wave 5 (content) and the two design sub-decisions block launch, not execution start.

---

> TL;DR (machine): XL effort, HIGH risk at W0 (CI red + harness) and W5 (human gate). 29 todos + 5 final gates, 6 waves (+ Wave 7 F5-unblock, 2026-09-12). W0 fix lint + baseline + bundle-budget/axe/Lighthouse harness. W1 zero-visual-change foundation (theme-init/FOUC, token drift, dead OTel, additive markdown schema, single Tooltip provider, contact a11y). W2 tokens/type/motif (contrast-gated). W3 page rebuild. W4 image pipeline + OG. W5 human-gated content. W6 full verification. W7 `/projects` LCP fix + Lighthouse version parity. No new runtime deps. TDD for behavior changes; baseline+tests-after for config/docs. Evidence per todo in `.omo/evidence/`. Restyle-first MVP decoupled from content gate.

## Context

Refresh/restyle of an existing, competent Next.js portfolio. Verified ground truth from the bundle + inspection:
- Next `15.5.24`, React `18.2`, TS strict, Tailwind `3.3.5`, Flowbite React `0.12.17`, pnpm `10.15.1`. Not `output:'export'` (has `"use server"` in `lib/sendEmail.tsx:1` and `app/api/health/route.ts`).
- 3 blog posts + 21 projects = 24 markdown files; newest project 2021-12-31.
- Home marquee renders `projects.map` twice (`app/page.tsx:110-141`) = 42 cards; `components/Tooltip/Tooltip.tsx:29` creates a `RadixTooltip.Provider` per icon → ~168 providers.
- `app/layout.tsx:35` hardcodes `dark`; inline theme script sits in `<body>` (lines 48-69).
- `app/contact/page.tsx:1` is `"use client"` → cannot export metadata; inputs have `id` but no `aria-describedby`/`aria-invalid`; error `<p>`s unreferenced; success Alert not a live region; validation is submit-only.
- `next.config.mjs:23` CSP is Report-Only; `remotePatterns` lacks `plantoeat.s3.amazonaws.com` (the only remote image in the corpus, cheesecake post).
- Dead deps: `@vercel/otel` + `@opentelemetry/*`, no `instrumentation.ts`.
- `lib/markdown.ts:6-13` schema drops `tags`.
- e2e asserts exact copy (`e2e/static-routes.spec.ts:44-46`) and exact counts (`e2e/dynamic-content.spec.ts:27,49` = 3 blog; `:62,86` ≥21 projects).
- CI: `check.yml` (typecheck/build/lint/prettier/jest/storybook-smoke), `playwright.yml` (chromium), `nextjs_bundle_analysis.yml` (uploads JSON, no threshold), `screenshots.yml`.
- `@axe-core/playwright` named as acceptance in the audit plan but not installed. `pnpm`/`node_modules` are absent in this planning environment; all commands run via `nix develop -c pnpm …`.

Binding constraints carried forward: the bundle's SETTLED CONSENSUS and DEBUNKED CLAIMS (sections 2 and 5) are treated as invariants; the hard repo guardrails in the two prior plans (`No new runtime dependencies…`, `no framer-motion, GSAP`, no CMS/DB, no hosting migration, no i18n) are non-negotiable.

## Decisions — RESOLVED (2026-09-10)

User resolved all 13 open decisions (see `.omo/decisions/2026-09-10-refresh-scope-decisions.md`).
Full scope confirmed; content workstream (Wave 5) is included.

| # | Decision | Resolution | Feeds |
|---|---|---|---|
| D1 | Scope tier | **Full scope** — all waves incl. Wave 5 content | all |
| D2 | Marquee survives? featured count? | **UX-designer's call** — keeping or removing both acceptable | T16 |
| D3 | Second serif (Newsreader) vs Inter-only carved | **Two fonts** — add Newsreader (self-hosted, ≤60KB) | T14 |
| D4 | Accent colors | **Two warm accents, no blue** — terracotta + deep oxblood/wine (final pair contrast-gated in T13) | T13, T15 |
| D5 | `/work` route vs featured flag | **Featured flag inside `/projects`** (no new route) | T17 |
| D6 | LAYZR case study + cleared metrics | **Included** — requires cleared metrics + consent | T26 |
| D7 | Cheesecake archive vs delete | **Keep as part of the blog** (no archive/delete) | T28 |
| D8 | Testimonial at launch vs deferred slot | **RESOLVED — labelled examples only (2026-09-12).** Tom approved alternative (a): the section may ship with placeholder quotes explicitly labelled as illustrative examples in the visible UI, naming no real company or person. Satisfies R19.1 and UWG §5. | T28 |
| D9 | Tag pages `/tags/[tag]` vs query filter | **Include** — server-rendered tag pages | T29 |
| D10 | Content authoring commitment + timeline | **Included** (full) | Wave 5 |
| D11 | Flowbite targeted vs full removal | **Targeted** (keep Card) | T21 |
| D12 | Theme key keep vs rename | **Void** — single mode removes the key, toggle, and theme script | T07 |
| D13 | Default color scheme | **Light only, parchment palette, no blue** — remove `DarkThemeToggle` + theme script; warm surface; warm accents | T07, T15 |

### Outstanding clarifications

- **D8 (RESOLVED 2026-09-12)** — originally blocked: user selected unlabelled placeholder quotes,
  which violates AGENTS R19.1 and German UWG §5 (misleading commercial practices). Tom approved
  alternative (a): **visibly labelled example quotes** that name no real company or person. T28
  implements this; the visible label is mandatory, not decorative. See
  `.omo/decisions/2026-09-10-refresh-scope-decisions.md` (Round 3).

### Design-direction amendments from D13/D4

- **Single mode, no toggle.** Remove `DarkThemeToggle` (`components/Header/Header.tsx`), the
  inline theme script (`app/layout.tsx:48-69`), and the `flowbite-theme-mode` key. T07 changes
  from "FOUC fix" to "remove dark-mode machinery; ship one light mode".
- **Parchment palette, no blue.** Replace the `primary-*`/`accent` blue scale with a warm
  parchment base (candidate `#F5EFE1`–`#EFE7D3`) and a two-warm-accent pair (terracotta +
  oxblood/wine). Every fg/bg pair must pass the T13 contrast gate. Flowbite `primary-*` aliases
  must be remapped away from blue or the Flowbite blue removed with the targeted replacement (D11).
- **OG/header assets** must be re-produced without blue.

## Scope

### Must have
- Phase 0 CI hygiene + measurement harness before any restyle: green `pnpm lint`; committed bundle baseline; bundle-byte threshold gate; axe (light+dark); Lighthouse CI (LCP/CLS/TBT); single-sourced e2e copy/count expectations.
- Phase 1 zero-visual-change foundation: FOUC-safe theme init (keep key, preserve dark fallback); token-drift + accidental-token cleanup; dead OTel/README drift removal; additive markdown schema (`tags` re-added + optional case-study fields); one root Tooltip provider; contact a11y wiring + server/client metadata split.
- Phase 2 "engineered calm" expressive layer: palette tokens + measure system + contrast CI gate + `DESIGN.md`; Inter-only carved type (serif optional); palette application + motion primitives + one 1px column-rule motif.
- Phase 3 page rebuild: type-led hero (no portrait), curated featured set replacing marquee, founder-arc scaffold, projects archive + featured flag, blog polish, case-study template, About portrait duotone; targeted de-Flowbite (Navbar/Alert/Breadcrumb) as design demands.
- Phase 4 imagery + SEO: image pipeline (`image/avif`,`image/webp`, explicit dims, own/allowlist remote first), dead 442KB JPG removal, 1200×630 OG asset, SVG/≤5KB header mark.
- Phase 5 human-gated content: legal pages (Impressum, Datenschutz; P0), positioning line, 3 case studies, founder arc, 2 posts, cheesecake disposition.
- Phase 6 verification: all gates green; axe zero serious/critical light+dark; contrast gate; reduced-motion; keyboard; bundle budget; full e2e.

### Must NOT have (guardrails)
- No new **runtime** dependencies. Test-only devDeps (`@axe-core/playwright`, `@lhci/cli`) are permitted and must be flagged dev-only.
- No `framer-motion`/`motion`/GSAP/LazyMotion; no `next-themes`. Motion = CSS + native only.
- No `output:'export'`; SSG on Node/Vercel stays; `generateStaticParams` stays.
- No Tailwind v4 / CSS-custom-property migration; tokens stay in `tailwind.config.js`.
- No Roman props/ornaments/Latin; no gold, marble, busts, laurel, SPQR, Colosseum, arches, papyrus, togas.
- No URL/sitemap/nav route renames; Rome is visual only.
- No fabricated metrics, testimonials, clients, outcomes (R19.1).
- No newsletter; no analytics/RUM/telemetry (R15.11).
- No new `/work` route (default); no content-authoring by an agent as fact.
- No commit bypassing hooks (`--no-verify`, `SKIP=`) — R26.1; no mixing refactor with behavior — R39.5.

## Verification strategy

> Zero human intervention for technical todos; Wave 5 content is a human gate.

- Test decision: TDD for behavior-change todos (T07, T10, T12, T16–T20, T23); baseline + tests-after for static config/content/docs/format todos (R6.1, R34.1).
- Runners: Jest (unit/component), Playwright (chromium e2e), `@axe-core/playwright` (a11y), Storybook test-runner (smoke), `pnpm analyze` + `scripts/check-bundle-budget.mjs` (bytes), `scripts/check-contrast.mjs` (pure-JS WCAG), Lighthouse CI (`@lhci/cli`, mobile 4× throttle), `scripts/check-project-frontmatter.js`, plus `pnpm typecheck|build|lint|prettier`.
- Commands run through `nix develop -c <pnpm …>` in CI/devShell.
- Evidence: `.omo/evidence/task-<ID>-2026-refresh-restyle.txt` per todo (exact command, exit code, output pattern, timestamp — R20.1/R20.3); boulder per todo in `.omo/boulders/` (R1.2/R1.5); ledger events in `.omo/start-work/ledger.jsonl`.
- Every content change updates `e2e/static-routes.spec.ts:44-46` and `e2e/dynamic-content.spec.ts:27,49,62,86` in the same PR (R8.2 single-source).

## Task Dependency Graph

| Task | Depends On | Blocks | Reason |
|---|---|---|---|
| T01 lint green | — | T04,T07,T08,T09,T12 | Green pipeline is prerequisite for trustworthy verification |
| T02 baseline capture | — | T03,T05 | Budget/thresholds need a starting measurement |
| T03 bundle budget gate | T02 | F1 | Threshold needs baseline bytes |
| T04 axe harness | T01 | T05,T06 | Adds devDeps/package.json; shares install with T05 |
| T05 Lighthouse CI | T02,T04 | F1 | Needs devDeps + baseline budgets |
| T06 e2e single-source harness | T04 | T07,T16,T17 | Copy/count + a11y helpers needed before theme/page specs change |
| T07 theme-init/FOUC | T06 | T11,T15 | Both edit `app/layout.tsx`; theme stability before palette default |
| T08 token drift cleanup | T01 | T13 | Tokens must be clean before semantic token additions |
| T09 dead OTel + README drift | T01 | — | package.json/lock hygiene independent |
| T10 markdown schema additive | — | T19,T25 | `tags` + optional fields consumed by template/tags |
| T11 single Tooltip provider | T07 | — | Same file as T07; removes hydration cost |
| T12 contact a11y + metadata split | T01,T04 | T20 | Needs axe harness; contact shell used by later page work |
| T13 design tokens + contrast gate | T08,T02 | T14,T15 | Tokens/measure before applying; contrast gate protects palette |
| T14 Inter-only carved type | T13 | T16–T21 | Type identity before page rebuild |
| T15 palette + motion + motif | T13,T07 | T16–T21 | Visual system before pages |
| T16 home rebuild | T14,T15,T06 | T21 | Removes marquee; updates home/interactions specs |
| T17 projects archive + featured | T14,T15,T06 | T19,T25 | Featured selection feeds case-study template |
| T18 blog listing polish | T14,T15 | — | Independent page |
| T19 case-study template | T10,T14,T15,T17 | T25 | Renders additive schema; needs featured flag |
| T20 About portrait/founder arc | T14,T15,T24 | — | Structural non-gated; content T24 human-gated |
| T21 de-Flowbite targeted | T14,T15 | — | One primitive per commit after visual system |
| T22 image pipeline | — | T19,T23,T25 | Must precede any card/case-study/Og imagery |
| T23 OG 1200×630 + header mark | T22 | — | Replaces 7-route 512 logo; consumes pipeline |
| T24 legal pages | D10 (human) | T20,T25–T29 | P0 content, factual, human-authored |
| T25 positioning + founder arc copy | T24 | T26–T28 | Message drives downstream content |
| T26 three case studies | T17,T19,T22,T24 | — | Needs template + imagery + human-approved metrics |
| T27 two new posts | T24 | — | Human-authored |
| T28 cheesecake + optional LAYZR + testimonial | T19,T22,T24 | — | Disposition affects e2e counts |
| T29 tag pages (deferred) | T10,T24 | — | Optional additive route |
| F1–F5 final gates | all | — | Full verification |

## Parallel Execution Graph

```
Wave 0.1 (start immediately):
├── T01 Fix red pnpm lint            (no deps)
└── T02 Capture baseline             (no deps, no package.json edit)

Wave 0.2 (after 0.1):
├── T04 Axe harness                  (dep: T01)
└── T03 Bundle budget gate           (dep: T02)

Wave 0.3 (after 0.2):
├── T05 Lighthouse CI                (dep: T02,T04)
└── T06 e2e single-source harness    (dep: T04)

Wave 1a (zero-visual-change foundation):
├── T07 Theme-init/FOUC              (dep: T06)
├── T08 Token drift cleanup          (dep: T01)
├── T09 Dead OTel + README drift     (dep: T01)
├── T10 Markdown schema additive     (no deps)
└── T12 Contact a11y + metadata split(dep: T01,T04)

Wave 1b:
└── T11 Single Tooltip provider      (dep: T07 — same app/layout.tsx)

Wave 2a:
└── T13 Design tokens + contrast gate(dep: T08,T02)

Wave 2b (parallel):
├── T14 Inter-only carved type       (dep: T13)
└── T15 Palette + motion + motif     (dep: T13,T07)

Wave 3 (parallel; after W2):
├── T16 Home rebuild                 (dep: T14,T15,T06)
├── T17 Projects + featured flag     (dep: T14,T15,T06)
├── T18 Blog polish                  (dep: T14,T15)
└── T21 De-Flowbite targeted         (dep: T14,T15)
   └── T19 Case-study template       (dep: T17,T10,T22)

Wave 4 (parallel with W3):
├── T22 Image pipeline               (no deps)
└── T23 OG 1200×630 + header mark    (dep: T22)

Wave 5 (HUMAN-GATED; after W3 structure + T22):
├── T24 Legal pages                  (P0)
├── T25 Positioning + founder arc    (dep: T24)
├── T26 Three case studies           (dep: T17,T19,T22,T24)
├── T27 Two posts                    (dep: T24)
├── T28 Cheesecake/LAY2R/testimonial (dep: T19,T22,T24)
└── T29 Tag pages (deferred)         (dep: T10,T24)

Wave 6: F1–F5 (parallel, all must approve)

Critical path: T01 → T04 → T06 → T07/T13 → T15 → T17 → T19 → T26 → F
Estimated parallel speedup: ~45% vs sequential (W0 3 phases, W1 2, W2 2, W3/W4 overlapped)
```

## Tasks

> Implementation + Test = ONE todo. Never separate. Every todo produces one evidence file and one atomic commit (except Wave 5, gated on Tom).

### Wave 0 — Hygiene & measurement (serialized phases)

#### T01. Fix red `pnpm lint` (react-hooks plugin conflict) — blocker
**Description:** Reproduce first: `nix develop -c pnpm lint` (currently fails loading both `eslint-config-react-app` and `eslint-config-next` react-hooks plugin). Remove the conflicting config (`eslint-config-react-app` from devDeps, which `.eslintrc.js:5` never references) or pin/override the `react-hooks` plugin resolution so a single copy loads. Do not silence rules; resolve the duplicate plugin. Confirm zero rule regressions.
**Files:** `.eslintrc.js`, `package.json`, `pnpm-lock.yaml`
**Delegation Recommendation**: Category `deep` — single hard goal (diagnose duplicate-plugin resolution), one deliverable (green lint).
**Skills Evaluation**: INCLUDED `debugging` (config-conflict root cause), `programming` (.ts/.js tooling), `git-master` (atomic dep-removal commit). OMITTED: none task-relevant.
**Depends On:** None
**Acceptance Criteria/Verification:** `nix develop -c pnpm lint` exits 0; `nix develop -c pnpm prettier` exits 0; no new lint-disable directives added; `git diff` shows no source-rule changes beyond config.
**Evidence:** `.omo/evidence/task-T01-2026-refresh-restyle.txt`
**Commit:** `fix(lint): resolve react-hooks plugin conflict from duplicate eslint config`

#### T02. Capture measurement baseline (bundle, Lighthouse, axe)
**Description:** Record current state before any restyle: `nix develop -c pnpm build`, then `node report-bundle-size.js`, save `.next/analyze/__bundle_analysis.json` to committed `.omo/evidence/baseline/bundle-<sha>.json` and `tests/budgets/bundle-baseline.json` (R18.10). Run Lighthouse mobile (4× throttle, cold) per public route via `npx lhci` or `lighthouse` CLI (if not yet installed, capture via the shell-less `npx` without adding to package.json — installation happens in T04); capture current axe violations by scanning routes in both schemes. Document current theme default (dark) and marquee counts (42).
**Files:** `.omo/evidence/baseline/`, `tests/budgets/bundle-baseline.json`, `.omo/notepads/2026-refresh-restyle/baseline.md`
**Delegation Recommendation**: Category `unspecified-high` — measurement breadth across build, browser, and a11y.
**Skills Evaluation**: INCLUDED `playwright` (route scanning), `programming` (bytes parsing), `frontend` (Lighthouse/CWV interpretation). OMITTED `visual-qa` (no visual verdict yet).
**Depends On:** None
**Acceptance Criteria/Verification:** Baseline JSON exists and parses; Lighthouse numbers recorded per route; axe baseline (light+dark) recorded; evidence timestamped (R20.3).
**Evidence:** `.omo/evidence/task-T02-2026-refresh-restyle.txt`
**Commit:** `test(budgets): capture 2026 refresh baseline (bundle, lighthouse, axe)`

#### T03. Bundle-byte budget gate in CI
**Description:** Add `scripts/check-bundle-budget.mjs` (pure Node, uses existing `gzip-size`) that reads `.next/analyze/__bundle_analysis.json`, compares against `tests/budgets/bundle-baseline.json`, and fails when shared first-load >130KB gz, any route >180KB gz, or any route grows >10% vs baseline. Add `budget:bundle` script. Wire into `.forgejo/workflows/nextjs_bundle_analysis.yml` after the analyze step (no new dep).
**Files:** `scripts/check-bundle-budget.mjs`, `package.json`, `.forgejo/workflows/nextjs_bundle_analysis.yml`
**Delegation Recommendation**: Category `deep` — correct baseline parsing/thresholding is logic-heavy.
**Skills Evaluation**: INCLUDED `programming` (Node script, strict types), `debugging` (analyzer output shape). OMITTED `frontend` (no UI).
**Depends On:** T02
**Acceptance Criteria/Verification:** `nix develop -c node scripts/check-bundle-budget.mjs` exits 0 on current baseline; deliberately lowering a threshold by 1 byte makes it exit non-zero (failure demonstration); `pnpm prettier` clean.
**Evidence:** `.omo/evidence/task-T03-2026-refresh-restyle.txt`
**Commit:** `test(ci): add bundle-byte budget gate against committed baseline`

#### T04. A11y harness — axe + Lighthouse devDeps and axe spec
**Description:** Add `@axe-core/playwright` and `@lhci/cli` as devDependencies only (never runtime). Add `e2e/a11y.spec.ts`: scan `/`, `/about`, `/blog`, a blog detail, `/projects`, a project detail, `/contact` in light and dark; fail on any `serious`/`critical` axe violation and on heading-order/landmark/contrast violations. Wire browser install into `.forgejo/workflows/playwright.yml`. Keep specs in `e2e/` (R8.2 — extend, do not fork suites).
**Files:** `package.json`, `pnpm-lock.yaml`, `e2e/a11y.spec.ts`, `.forgejo/workflows/playwright.yml`
**Delegation Recommendation**: Category `unspecified-high` — test-infra setup plus cross-route a11y.
**Skills Evaluation**: INCLUDED `playwright` (axe integration), `programming` (typed spec), `frontend` (WCAG knowledge). OMITTED `visual-qa` (no screenshots).
**Depends On:** T01
**Acceptance Criteria/Verification:** `nix develop -c pnpm e2e:headless` runs the new spec; baseline violations captured (fixes deferred to owning todos); devDep flag noted in evidence.
**Evidence:** `.omo/evidence/task-T04-2026-refresh-restyle.txt`
**Commit:** `test(a11y): add axe light/dark harness across public routes`

#### T05. Lighthouse CI with lab budgets
**Description:** Add `.lighthouserc.js` and `.forgejo/workflows/lighthouse.yml` running mobile (4× throttle, cold) against the built site for every public route; assert LCP < 2.5s, CLS < 0.1, TBT < 200ms (TBT is the INP lab proxy — never promise p75 field). Use median-of-runs and documented tolerances for shared runners.
**Files:** `.lighthouserc.js`, `.forgejo/workflows/lighthouse.yml`, `package.json`
**Delegation Recommendation**: Category `unspecified-high` — perf-harness configuration across routes.
**Skills Evaluation**: INCLUDED `frontend` (CWV/Lighthouse), `programming` (config), `playwright` (build/route knowledge). OMITTED `9router-*` (no AI gateway).
**Depends On:** T02, T04
**Acceptance Criteria/Verification:** Workflow validates locally with `npx lhci autorun` against `pnpm build && pnpm start`; all three budgets asserted; route list matches sitemap static routes.
**Evidence:** `.omo/evidence/task-T05-2026-refresh-restyle.txt`
**Commit:** `test(ci): add Lighthouse mobile budgets (LCP/CLS/TBT)`

#### T06. Single-source e2e expectations + regression harness extensions
**Description:** Extract exact-copy and count expectations into one fixture (`e2e/fixtures/expectations.ts`) consumed by `static-routes.spec.ts` and `dynamic-content.spec.ts`, documenting the required same-PR update when content changes. Extend (not duplicate) `interactions.spec.ts` (focus/keyboard/reduced-motion), `dark-mode.spec.ts` (contrast per scheme), `responsive.spec.ts` (overflow/touch targets ≥44px) as the harness later waves depend on. Do not yet change assertions.
**Files:** `e2e/fixtures/expectations.ts`, `e2e/static-routes.spec.ts`, `e2e/dynamic-content.spec.ts`, `e2e/interactions.spec.ts`, `e2e/dark-mode.spec.ts`, `e2e/responsive.spec.ts`
**Delegation Recommendation**: Category `deep` — refactoring test constants without changing behavior.
**Skills Evaluation**: INCLUDED `playwright`, `programming`, `refactor` (extract without behavior change), `git-master`. OMITTED `writing` (no prose).
**Depends On:** T04
**Acceptance Criteria/Verification:** `nix develop -c pnpm e2e:headless` passes with identical assertions; count/copy literals exist in exactly one module; `pnpm lint && pnpm prettier` clean.
**Evidence:** `.omo/evidence/task-T06-2026-refresh-restyle.txt`
**Commit:** `refactor(e2e): single-source copy/count expectations and extend a11y harness`

### Wave 1 — Zero-visual-change foundation

#### T07. Theme-init / FOUC fix (keep key, preserve dark fallback)
**Description:** Failing-first Playwright test: stored `light` preference must not flash dark; stored `dark` must not flash light; no-preference keeps current dark fallback (zero-visual-change for first visit). Remove hardcoded `dark` from `app/layout.tsx:35`, move the inline resolver to a blocking `<head>` script that applies the class before paint, keep the `flowbite-theme-mode` key (D12). Update `e2e/dark-mode.spec.ts` assertions in the same PR (SSR no longer hardcodes dark).
**Files:** `app/layout.tsx`, `e2e/dark-mode.spec.ts`
**Delegation Recommendation**: Category `deep` — hydration/paint-order subtlety.
**Skills Evaluation**: INCLUDED `debugging` (FOUC/hydration), `playwright`, `frontend`, `programming`. OMITTED `visual-qa` (no aesthetic change).
**Depends On:** T06
**Acceptance Criteria/Verification:** New spec fails before fix, passes after; `pnpm build && pnpm e2e:headless` green; no-preference first paint remains dark; axe still clean.
**Evidence:** `.omo/evidence/task-T07-2026-refresh-restyle.txt`
**Commit:** `refactor(theme): remove dark-mode machinery for a single light mode`
> **Note (G5, 2026-09-12):** the original plan line said `fix(theme): eliminate FOUC with
> blocking head theme resolver`, but D13 (single light mode) superseded that task — the
> FOUC fix became a *removal* of the theme machinery. Actual commit: `d792fff`.

#### T08. Token drift + accidental token key cleanup
**Description:** Replace raw utilities with semantic tokens where exactly equivalent (e.g. `app/page.tsx:44` raw `text-4xl…` → `text-h1` / `h1-sm`), and remove accidental/undefined tokens (`foreground.foreground-muted-dark` in `tailwind.config.js:47`, bogus `rounded-0.5md` / `font-open-sans` / `text-2xs` in Tooltip — coordinate with T11 which owns Tooltip.tsx). No visual change: snapshot/compare computed styles before/after.
**Files:** `tailwind.config.js`, `app/page.tsx`
**Delegation Recommendation**: Category `visual-engineering` — token discipline is design-system work.
**Skills Evaluation**: INCLUDED `frontend` (tokens/Tailwind), `ast-grep` (structural raw-utility matches), `programming`. OMITTED `writing`.
**Depends On:** T01
**Acceptance Criteria/Verification:** `pnpm build` 0; grep for raw heading utilities returns none in `app/`; computed-style diff shows no change; `pnpm lint && pnpm prettier` clean.
**Evidence:** `.omo/evidence/task-T08-2026-refresh-restyle.txt`
**Commit:** `style(tokens): remove drift and accidental token keys`

#### T09. Dead dependency + README drift cleanup
**Description:** Remove `@vercel/otel` and all `@opentelemetry/*` (no `instrumentation.ts` exists). Remove other proven-dead devDeps (`npm-only-allow`, `postinstall-postinstall`) only if `pnpm install --frozen-lockfile` and build remain green. Fix README drift: "Next.js 14" → `15.5.24`; correct "static export"/"statically exported" claims to SSG on the Node/Vercel runtime (critical — `output:'export'` is forbidden); record that `@axe-core/playwright`/`@lhci/cli` are dev-only.
**Files:** `package.json`, `pnpm-lock.yaml`, `README.md`
**Delegation Recommendation**: Category `quick` — mechanical removal + doc truthing.
**Skills Evaluation**: INCLUDED `programming`, `git-master`, `writing` (README). OMITTED `frontend` (no UI).
**Depends On:** T01
**Acceptance Criteria/Verification:** `nix develop -c pnpm install --frozen-lockfile` 0; `pnpm build` 0; `grep -ri "next.js 14\|static export" README.md` returns no stale claim; no `@opentelemetry` in package.json.
**Evidence:** `.omo/evidence/task-T09-2026-refresh-restyle.txt`
**Commit:** `chore(deps): drop dead otel deps and correct README stack drift`

#### T10. Markdown frontmatter schema additive fields
**Description:** TDD Jest. In `lib/markdown.ts`: re-add `tags: z.array(z.string()).default([]).catch([])` (currently dropped) and add optional case-study fields `role`, `outcome`, `metrics: z.array(z.object({label,value})).default([])`, `heroImage` — all `.default()`/`.catch()` so 24 existing files build unchanged. Export updated `MarkdownEntry`. No content edits.
**Files:** `lib/markdown.ts`, `lib/markdown.test.ts`
**Delegation Recommendation**: Category `quick` — small, well-bounded schema change with tests.
**Skills Evaluation**: INCLUDED `programming` (Zod/strict TS), `git-master`. OMITTED `frontend`, `writing` (no prose/content).
**Depends On:** None
**Acceptance Criteria/Verification:** Failing test first (tags parsed; defaults applied to legacy files); `nix develop -c pnpm test` green; `pnpm build` produces no route-count change (was 38 at T10 time; the site now pre-renders 127 pages after T24/T29 added legal + tag routes); `scripts/check-project-frontmatter.js` passes.
**Evidence:** `.omo/evidence/task-T10-2026-refresh-restyle.txt`
**Commit:** `feat(content): re-add tags and additive case-study frontmatter fields`

#### T11. Single root Tooltip Provider
**Description:** Failing-first test asserting tooltip count/provider behavior. Introduce `components/Providers/TooltipProvider.tsx` (`"use client"`) wrapping the app once in `app/layout.tsx`; change `components/Tooltip/Tooltip.tsx` to consume the context (remove per-instance `<RadixTooltip.Provider>` at line 29). Fix the accidental token classes here (T08 leaves Tooltip to this task). Removes ~168 providers; zero visual change.
**Files:** `components/Providers/TooltipProvider.tsx`, `components/Tooltip/Tooltip.tsx`, `app/layout.tsx`, `components/Tooltip/Tooltip.test.tsx`
**Delegation Recommendation**: Category `deep` — context/portal correctness with hydration implications.
**Skills Evaluation**: INCLUDED `frontend` (Radix), `programming`, `debugging` (hydration), `playwright` (hover/Escape). OMITTED `writing`.
**Depends On:** T07 (same `app/layout.tsx`)
**Acceptance Criteria/Verification:** Jest + Playwright hover/focus/Escape pass; DOM provider count for home materially reduced; `pnpm build` 0; axe unchanged.
**Evidence:** `.omo/evidence/task-T11-2026-refresh-restyle.txt`
**Commit:** `fix(tooltip): hoist to a single root provider`

#### T12. Contact a11y wiring + server/client metadata split
**Description:** Move the form UI into `app/contact/ContactForm.tsx` (`"use client"`); make `app/contact/page.tsx` a server component exporting `metadata` + canonical. Wire `aria-describedby`/`aria-invalid` to the existing `#…-error` ids, turn the success Alert into a live region (`role="status"`), validate on blur (not keypress), keep server-side Zod re-check (`lib/sendEmail.tsx`) before Resend. TDD via Jest + Playwright + axe.
**Files:** `app/contact/page.tsx`, `app/contact/ContactForm.tsx`, `lib/sendEmail.tsx` (only if needed), `e2e/contact.spec.ts`, `e2e/a11y.spec.ts`
**Delegation Recommendation**: Category `visual-engineering` — form UX + a11y, though logic-light.
**Skills Evaluation**: INCLUDED `frontend` (form/a11y), `playwright`, `programming`, `debugging`. OMITTED `writing` (microcopy unchanged).
**Depends On:** T01, T04
**Acceptance Criteria/Verification:** `curl`/build shows contact route exports `<title>`+canonical; axe contact light+dark zero serious/critical; existing contact e2e still green; `pnpm test` green.
**Evidence:** `.omo/evidence/task-T12-2026-refresh-restyle.txt`
**Commit:** `feat(contact): server metadata and aria-wired accessible form`

### Wave 2 — Expressive layer ("engineered calm")

#### T13. Design tokens + measure system + contrast CI gate + DESIGN.md
**Description:** Extend `tailwind.config.js` (keep `primary-*` aliases) with palette tokens: travertine `#F4F1EA`, basalt `#17181A`, ink `#1B1B1F`, accent `#2563eb` (keep), terracotta `#B4462F` (text-on-travertine only, gated D4), verdigris `#4E7A6B` + brass `#A8894F` (non-text only); drop Tyrian `#5B2A4A` and `#2F7BFF`. Add measure tokens as Tailwind **maxWidth** entries (not CSS vars): `measure-article: 66ch`, `measure-lead: 46ch`, `measure-card: 38ch`, `measure-display: 20ch`, `width-page: 78rem`. Add `scripts/check-contrast.mjs` (pure JS WCAG math, no deps) failing when text tokens <4.5:1 or UI tokens <3:1 in either scheme. Update `DESIGN.md` (R5.2/R15.8). TDD: write the contrast gate failing-first against a known-bad pair.
> **HISTORICAL SPEC (2026-09-12):** this description predates the D13/D4 round-2 amendments.
> The colours named here (travertine/basalt/blue `#2563eb`/verdigris/brass) were **superseded
> before implementation** — the shipped palette is a single light **parchment** mode with
> terracotta `#A63D28` + oxblood `#5E2130` and **no blue**. Do not implement from this text;
> see the amendments at plan lines 68–77 and `.omo/decisions/2026-09-10-refresh-scope-decisions.md`.
**Files:** `tailwind.config.js`, `scripts/check-contrast.mjs`, `DESIGN.md`, `tests/budgets/contrast.json`
**Delegation Recommendation**: Category `visual-engineering` — design-system foundation.
**Skills Evaluation**: INCLUDED `frontend` (palette/type/tokens), `programming` (WCAG script), `writing` (DESIGN.md). OMITTED `playwright` (no browser needed; pure math).
**Depends On:** T08, T02
**Acceptance Criteria/Verification:** Contrast gate passes all shipping token pairs both schemes; `pnpm build` 0; `DESIGN.md` documents every token; `pnpm lint && pnpm prettier` clean.
**Evidence:** `.omo/evidence/task-T13-2026-refresh-restyle.txt`
**Commit:** `feat(design): semantic tokens, measure system, and contrast gate`

#### T14. Inter-only carved type treatment (serif optional / D3)
**Description:** Non-gated path: keep Inter for UI/body and introduce a carved display treatment (uppercase + tracking) for H1/H2 via tokens; enforce exactly ≤2 font families and ≤100KB woff2 total. If D3 approves Newsreader: add it self-hosted variable, latin subset, 2 weights, `display:swap`, ≤60KB woff2, metric-compatible fallback, preload the LCP font only; reject paid GT Sectra and wonky Fraunces. Bundle the font-budget assertion (`scripts/check-font-budget` or extend T03).
**Files:** `tailwind.config.js`, `app/layout.tsx`, `styles/tailwind.css`, `public/fonts/` (if serif), `scripts/check-font-budget.mjs`
**Delegation Recommendation**: Category `visual-engineering` — typographic identity + polish.
**Skills Evaluation**: INCLUDED `frontend` (type systems), `programming` (budget script), `visual-qa` (type rendering). OMITTED `writing`.
**Depends On:** T13
**Acceptance Criteria/Verification:** Font families ≤2 and woff2 total ≤100KB asserted; LCP font preloaded only; `pnpm build` 0; heading visual check passes at 3 breakpoints.
**Evidence:** `.omo/evidence/task-T14-2026-refresh-restyle.txt`
**Commit:** `feat(type): carved display treatment with self-hosted font budget`

#### T15. Palette application + motion primitives + column-rule motif
**Description:** Apply travertine-light default (D13) and basalt/ink dark with accent `#2563eb`; terracotta only as text on travertine if D4 approves. Define motion primitives: opacity + `translateY` only, 200–320ms, `cubic-bezier(0.16,1,0.3,1)`, every instance behind `motion-safe:`. Add the single 1px vertical column-rule motif as pure CSS borders. Reject clip-path animation, 900ms, `backdrop-filter` (≤1 surface with opaque `@supports` fallback if any). Update contrast gate and DESIGN.md.
> **HISTORICAL SPEC (2026-09-12):** superseded by D13/D4 round-2 before implementation. There is
> **no dark mode** and **no blue**; the shipped palette is single light parchment + terracotta/
> oxblood. The motion primitives and the 1px column-rule motif described here *did* ship as
> specified. Actual commit `7e6e254`.
**Files:** `tailwind.config.js`, `styles/tailwind.css`, `app/layout.tsx`, `DESIGN.md`, `scripts/check-contrast.mjs`
**Delegation Recommendation**: Category `visual-engineering` — core identity application.
**Skills Evaluation**: INCLUDED `frontend`, `visual-qa`, `playwright` (reduced-motion/contrast), `programming`. OMITTED `writing`.
**Depends On:** T13, T07
**Acceptance Criteria/Verification:** Contrast gate green both schemes; axe zero serious/critical; reduced-motion disables all transitions; no banned ornament grep hits (`laurel|bust|spqr|gold|colosseum`); `pnpm build` 0.
**Evidence:** `.omo/evidence/task-T15-2026-refresh-restyle.txt`
**Commit:** `feat(theme): parchment palette, motion primitives, column-rule motif`
> **Note (G5, 2026-09-12):** the original plan line said `travertine/basalt`; D13/D4 replaced
> that Roman palette with the light **parchment** one before implementation. Actual commit
> `7e6e254` — the message says *parchment*.

### Wave 3 — Page rebuild (visual)

#### T16. Home rebuild — type-led hero, curated featured set, founder arc scaffold
**Description:** Remove the marquee entirely (SETTLED). Hero becomes type-led, no portrait (removes LCP surface). Replace 42-card marquee with a curated featured set of 4 "monuments" (D2) linking to `/projects/entry/*`, plus a founder-arc scaffold (4 static beats; copy human-gated in T25). Keep latest-posts teasers. DOM `/` ≤1500 nodes. Update `e2e/home.spec.ts`, `interactions.spec.ts` (remove `.animate-marquee` reduced-motion assertion), and `e2e/fixtures/expectations.ts` in the same PR.
**Files:** `app/page.tsx`, `components/FeaturedSet/*`, `e2e/home.spec.ts`, `e2e/interactions.spec.ts`, `e2e/fixtures/expectations.ts`
**Delegation Recommendation**: Category `visual-engineering` — flagship layout work.
**Skills Evaluation**: INCLUDED `frontend`, `visual-qa`, `playwright`, `programming`. OMITTED `writing` (copy gated to T25).
**Depends On:** T14, T15, T06
**Acceptance Criteria/Verification:** No `.animate-marquee` in DOM; `/` node count ≤1500 (measured); e2e home/interactions green; axe light+dark zero serious/critical; LCP budget met.
**Evidence:** `.omo/evidence/task-T16-2026-refresh-restyle.txt`
**Commit:** `feat(home): type-led hero and curated featured set replacing marquee`

#### T17. Projects archive + featured flag (D5)
**Description:** Rework `/projects` into the full archive with a featured flag sourced from frontmatter (additive; default feature in T10 schema — `featured: boolean`). No new route (D5 default). Improve card hierarchy using tokens. Update project e2e expectations in the same PR.
**Files:** `app/projects/page.tsx`, `components/ProjectTeaser/ProjectTeaser.tsx`, `lib/markdown.ts` (featured field if not added in T10), `e2e/dynamic-content.spec.ts`, `e2e/fixtures/expectations.ts`
**Delegation Recommendation**: Category `visual-engineering`.
**Skills Evaluation**: INCLUDED `frontend`, `playwright`, `programming`, `visual-qa`. OMITTED `writing`.
**Depends On:** T14, T15, T06
**Acceptance Criteria/Verification:** Counts derive from content not literals; featured flag filters correctly; ≥21 project links remain; axe/contrast green.
**Evidence:** `.omo/evidence/task-T17-2026-refresh-restyle.txt`
**Commit:** `feat(projects): archive layout with featured flag`

#### T18. Blog listing polish
**Description:** Apply tokens/measure to `/blog` listing and cards; keep detail routes and `prose` rendering; optionally add server-rendered RSS (`app/feed.xml/route.ts`, no new runtime dep) — mark RSS as non-blocking. Update blog e2e expectations in same PR.
**Files:** `app/blog/page.tsx`, `components/ArticleTeaser/ArticleTeaser.tsx`, `app/feed.xml/route.ts` (optional), `e2e/dynamic-content.spec.ts`
**Delegation Recommendation**: Category `visual-engineering`.
**Skills Evaluation**: INCLUDED `frontend`, `playwright`, `programming`. OMITTED `writing`.
**Depends On:** T14, T15
**Acceptance Criteria/Verification:** Blog count source single; axe/contrast green; `pnpm build` 0.
**Evidence:** `.omo/evidence/task-T18-2026-refresh-restyle.txt`
**Commit:** `feat(blog): token-aligned listing and card polish`

#### T19. Case-study template (additive render)
**Description:** Render optional `role`/`outcome`/`metrics[]`/`heroImage` when present; empty slots render cleanly (no fabricated proof). Consumes T10 schema + T17 featured selection + T22 image pipeline. TDD: detail page shows fields when present, degrades when absent.
**Files:** `app/projects/entry/[slug]/page.tsx`, `components/CaseStudyMeta/*`
**Delegation Recommendation**: Category `visual-engineering`.
**Skills Evaluation**: INCLUDED `frontend`, `programming`, `playwright`. OMITTED `writing`.
**Depends On:** T10, T14, T15, T17, T22
**Acceptance Criteria/Verification:** Legacy files (no fields) render unchanged; enriched fixture renders metrics/hero; axe green; `pnpm build` 0.
**Evidence:** `.omo/evidence/task-T19-2026-refresh-restyle.txt`
**Commit:** `feat(projects): additive case-study template`

#### T20. About — portrait duotone + founder-arc reuse
**Description:** Move the portrait here (removed from hero), render as a plain 4:5 rectangle with explicit dimensions and `loading="lazy"`, reused founder-arc structure from T16. Structural work non-gated; portrait asset + copy are human-gated (T24/T25). **Note (2026-09-12):** the original wording said "duotone travertine/basalt" — that is stale Rome-concept language, superseded by D13 (single light parchment mode). Implemented **plain, untreated**; no duotone, no filter (see `.omo/evidence/task-T20-2026-refresh-restyle.txt`).
**Files:** `app/about/page.tsx`, `components/PersonTeaser/PersonTeaser.tsx`, `public/img/`
**Delegation Recommendation**: Category `visual-engineering`.
**Skills Evaluation**: INCLUDED `frontend`, `visual-qa`, `playwright`. OMITTED `writing` (copy gated).
**Depends On:** T14, T15, T24
**Acceptance Criteria/Verification:** Portrait lazy-loaded below fold, explicit dims, no CLS; axe green; `pnpm build` 0.
**Evidence:** `.omo/evidence/task-T20-2026-refresh-restyle.txt`
**Commit:** `feat(about): duotone portrait and founder-arc structure`

#### T21. De-Flowbite targeted replacement (D11)
**Description:** One primitive per commit, only where design demands: replace `Navbar`/`Alert`/`Breadcrumb` with in-tree Radix/semantic components. Keep `Card` (design fixes it). First port the relevant a11y e2e assertions, then swap. Preserve keyboard/aria behavior.
**Files:** `components/Header/Header.tsx`, `components/Footer/Footer.tsx`, detail-route breadcrumbs, one new primitive per commit
**Delegation Recommendation**: Category `deep` — ARIA/stateful primitives, high blast radius.
**Skills Evaluation**: INCLUDED `frontend`, `debugging`, `playwright`, `programming`, `refactor`. OMITTED `writing`.
**Depends On:** T14, T15
**Acceptance Criteria/Verification:** Per-primitive: existing e2e green, axe green, keyboard nav intact; `pnpm storybook`/`test-storybook` green; no Flowbite import remains for the replaced primitive.
**Evidence:** `.omo/evidence/task-T21-2026-refresh-restyle.txt`
**Commit:** `refactor(ui): replace <primitive> with in-tree implementation` (one per primitive)

### Wave 4 — Imagery + SEO

#### T22. Image pipeline + dead asset removal + own remote image
**Description:** Configure `next.config.mjs` `images.formats: ['image/avif','image/webp']`, explicit `deviceSizes`, `minimumCacheTTL`, and allowlist `plantoeat.s3.amazonaws.com` **or** self-host the cheesecake image under `public/`. Remove unused `public/img/Tom_Segbers_Frontal.jpg` (442KB). Assert shipped images ≤200KB, hero ≤50KB. Must land before any card/case-study/Og imagery.
**Files:** `next.config.mjs`, `public/img/`, `content/blog/2019-ebeltoft-cheesecake-recipe.md` (own image if chosen)
**Delegation Recommendation**: Category `deep` — pipeline correctness + CSP/remote interaction.
**Skills Evaluation**: INCLUDED `frontend` (next/image), `programming`, `debugging` (CSP/remote patterns). OMITTED `writing`.
**Depends On:** None
**Acceptance Criteria/Verification:** Build 0; remote markdown image loads (no CSP/remotePatterns error); asset-size check passes; dead JPG gone; axe (image alt) green.
**Evidence:** `.omo/evidence/task-T22-2026-refresh-restyle.txt`
**Commit:** `perf(images): avif/webp pipeline, own remote image, drop dead hero jpg`

#### T23. OG 1200×630 + header mark
**Description:** Replace the single 512×512 `logo.png` reused across 7 route files (`app/page.tsx`, `about`, `blog`, `projects`, both detail routes, layout) with one purpose-built 1200×630 OG asset; swap header mark to SVG or ≤5KB. Preserve OG/Twitter metadata correctness and canonicals.
**Files:** all 7 metadata blocks, `public/img/og-*.png|webp`, `public/icon/` mark, `app/layout.tsx`
**Delegation Recommendation**: Category `visual-engineering` — branded asset + metadata.
**Skills Evaluation**: INCLUDED `frontend`, `programming`, `playwright` (metadata assertions). OMITTED `writing`.
**Depends On:** T22
**Acceptance Criteria/Verification:** `curl`/build shows 1200×630 og:image + twitter card on all routes; header mark ≤5KB; axe/metadata checks green; `pnpm build` 0.
**Evidence:** `.omo/evidence/task-T23-2026-refresh-restyle.txt`
**Commit:** `feat(seo): purpose-built og asset and lightweight header mark`

### Wave 5 — Content (HUMAN-GATED — requires Tom)

> No agent may author these as fact (R19.1). Each todo pauses for explicit per-file approval before commit (R8.1).

#### T24. Legal pages — Impressum + Datenschutz (P0) `[HUMAN_GATE]`
**Description:** Add German `Impressum` and `Datenschutz` routes (plain, high-contrast, no Roman motifs); `Datenschutz` must disclose the Resend processor flow. Factual fields (name, address, contact) supplied by Tom. Add to sitemap + footer.
**Files:** `app/impressum/page.tsx`, `app/datenschutz/page.tsx`, `app/sitemap.ts`, `components/Footer/Footer.tsx`
**Delegation Recommendation**: Category `writing` — legal/compliance prose; structure only.
**Skills Evaluation**: INCLUDED `writing`, `programming` (route scaffolding), `frontend`. OMITTED `visual-qa` (minimal styling).
**Depends On:** D10 (human)
**Acceptance Criteria/Verification:** Tom approves text; routes render, high-contrast, axe green; sitemap includes both.
**Evidence:** `.omo/evidence/task-T24-2026-refresh-restyle.txt`
**Commit:** `docs(legal): add Impressum and Datenschutz` (after approval)

#### T25. Positioning line + founder arc copy `[HUMAN_GATE]`
**Description:** One positioning line; 4 founder-arc beats (reused on About). No invented metrics.
**Files:** `content/` (new copy module or frontmatter), `app/page.tsx`, `app/about/page.tsx`
**Delegation Recommendation**: Category `writing`.
**Skills Evaluation**: INCLUDED `writing`, `frontend` (integration). OMITTED `programming` (light).
**Depends On:** T24
**Acceptance Criteria/Verification:** Tom approves; copy integrates; e2e copy fixture updated same PR.
**Evidence:** `.omo/evidence/task-T25-2026-refresh-restyle.txt`
**Commit:** `docs(content): add positioning and founder arc` (after approval)

#### T26. Three case studies upgrade `[HUMAN_GATE]`
**Description:** Upgrade three existing project entries with `role`/`outcome`/`metrics[]` (cleared numbers only)/`heroImage`. Empty slots allowed; invented proof forbidden.
**Files:** three `content/projects/*.md`, `public/img/` assets
**Delegation Recommendation**: Category `writing`.
**Skills Evaluation**: INCLUDED `writing`, `frontend` (template fit). OMITTED `programming`.
**Depends On:** T17, T19, T22, T24
**Acceptance Criteria/Verification:** Tom approves each; schema validates; detail pages render enriched; axe green.
**Evidence:** `.omo/evidence/task-T26-2026-refresh-restyle.txt`
**Commit:** `docs(projects): upgrade three case studies` (after approval)

#### T27. Two new posts `[HUMAN_GATE]`
**Description:** Two human-authored posts tied to case studies; frontmatter valid.
**Files:** `content/blog/*.md`
**Delegation Recommendation**: Category `writing`.
**Skills Evaluation**: INCLUDED `writing`. OMITTED all others.
**Depends On:** T24
**Acceptance Criteria/Verification:** Tom approves; `pnpm build` 0; blog count assertion updated same PR.
**Evidence:** `.omo/evidence/task-T27-2026-refresh-restyle.txt`
**Commit:** `docs(blog): add two case-study posts` (after approval)

#### T28. Cheesecake disposition + optional LAYZR + testimonial `[HUMAN_GATE]`
**Description:** Decide cheesecake archive vs delete (D7; archive is default — updates post count); optional LAYZR case study with cleared metrics (D6); optional consented testimonial (D8). No fabrication.
**Files:** `content/blog/2019-ebeltoft-cheesecake-recipe.md`, `content/projects/*.md`, `app/about/page.tsx`
**Delegation Recommendation**: Category `writing`.
**Skills Evaluation**: INCLUDED `writing`, `frontend` (integration). OMITTED `programming` (light).
**Depends On:** T19, T22, T24
**Acceptance Criteria/Verification:** Tom approves; e2e counts updated same PR; `pnpm build` 0.
**Evidence:** `.omo/evidence/task-T28-2026-refresh-restyle.txt`
**Commit:** `docs(content): cheesecake disposition and optional proof` (after approval)

#### T29. Tag pages (deferred) `[HUMAN_GATE]`
**Description:** Optional server-rendered `/tags/[tag]` pages (D9). Non-blocking; defer unless approved.
**Files:** `app/tags/[tag]/page.tsx`, `app/sitemap.ts`
**Delegation Recommendation**: Category `quick`.
**Skills Evaluation**: INCLUDED `programming`, `frontend`. OMITTED `writing`.
**Depends On:** T10, T24
**Acceptance Criteria/Verification:** Build generates tag routes from schema; axe green.
**Evidence:** `.omo/evidence/task-T29-2026-refresh-restyle.txt`
**Commit:** `feat(tags): server-rendered tag pages` (after approval)

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner todo |
|---|---|---|---|---|
| CI currently red (`pnpm lint` react-hooks conflict) poisons all verification | High | High | Fix first (T01); reproduce before/after; do not silence rules | T01 |
| Human content gate stalls launch | High | High | Restyle-first MVP decoupled; Wave 5 gated; empty case-study slots ship cleanly | D10, T24–T28 |
| Flowbite removal blast radius (Navbar/Alert/Breadcrumb stateful/ARIA) | Medium | High | Targeted replacement, one primitive/commit, port a11y e2e first; keep Card | T21 |
| Image pipeline ordering — card/case-study imagery before pipeline breaks CSP/remotePatterns | Medium | High | T22 lands before any imagery; own remote image or allowlist; CSP verified | T22, T19, T26 |
| e2e copy/count assertions break on content/design changes | High | Medium | Single-source expectations (T06); same-PR update rule enforced | T06, T16, T17, T27, T28 |
| Default theme flip (dark→light) is a visual change | Medium | Medium | T07 preserves dark fallback (zero visual change); light default only in T15, gated D13 | T07, T15 |
| No local `pnpm`/`node_modules` in planning env | High | Low | All verification via `nix develop -c pnpm …`; evidence records env | all |
| Font budget breach (serif >60KB) | Medium | Medium | Fallback Inter-only carved (non-gated path); font-budget assertion | T14, D3 |
| axe/LHCI devDeps accidentally shipped as runtime | Low | High | Explicit dev-only flag; review `package.json` diff; no runtime imports | T04, T05 |
| Lighthouse CI noise on shared runners | Medium | Medium | Median-of-runs + documented tolerances; TBT lab proxy not field p75 | T05 |
| Marquee removal breaks reduced-motion e2e | High | Low | Update `interactions.spec.ts` in T16 same PR | T16 |
| Banned-ornament / Roman-prop creep | Low | Medium | `grep -E 'laurel|bust|spqr|gold|colosseum'` gate in T15 acceptance | T15 |

## Commit Strategy (atomic)

- One conventional commit per todo; hooks enforced (R3.3, R26.1); never `--no-verify`/`SKIP=`.
- Never mix refactor with behavior in one commit (R39.5): refactors (T06, T21) ship separately from features/behavior (T07, T16–T20).
- Dependency/action bumps isolated from feature work.
- TDD commits: the failing test and the fix may share one commit **only** when the todo is one unit; otherwise commit test-first then implementation.
- Expected sequence (sample): `fix(lint)…` → `test(budgets)…` → `test(ci)…` → `test(a11y)…` → `test(ci) lighthouse…` → `refactor(e2e)…` → `fix(theme)…` → `style(tokens)…` → `chore(deps)…` → `feat(content)…` → `fix(tooltip)…` → `feat(contact)…` → `feat(design)…` → `feat(type)…` → `feat(theme)…` → page rebuilds → `perf(images)…` → `feat(seo)…` → human-gated `docs(...)…` (per file approval) → verification.
- Legal/content commits only after Tom's explicit approval; evidence marks `completed_pending_human_approval` otherwise.
- `git-master` skill used for any history/search/rebase; no force-push (R26.1).

## Success Criteria

1. `nix develop -c pnpm typecheck && pnpm lint && pnpm prettier && pnpm build && pnpm test && pnpm e2e:headless && pnpm build-storybook && pnpm test-storybook` all exit 0.
2. Bundle budget gate green: shared ≤130KB gz, per-route ≤180KB gz, no route +>10%.
3. Lighthouse mobile: LCP <2.5s, CLS <0.1, TBT <200ms on every public route, **measured on an uncontended host**: every LHR must report `environment.benchmarkIndex` within ~10 % of the baseline's (T02 per-route 2511–3064). Readings taken at a lower `benchmarkIndex` are **incomparable** and must not be used to judge the budget (learned 2026-09-12 — the external Stryker job put every post-restyle run at `bi` 598–2416, producing false failures; F5 ledger §19–§21).
4. axe zero serious/critical in light **and** dark; contrast gate green (text ≥4.5, UI ≥3).
5. Reduced-motion disables all motion; keyboard nav complete; touch targets ≥44px.
6. DOM `/` ≤1500 nodes; one root Tooltip provider; no marquee.
7. Fonts ≤2 families, ≤100KB woff2; images ≤200KB (hero ≤50KB); 1200×630 OG on all routes.
8. No banned ornaments; no `output:'export'`; no new runtime deps; no route renames; no fabricated content.
9. Every todo has `.omo/evidence/task-<ID>-2026-refresh-restyle.txt` with reproducible commands + timestamp; ledger finalized.
10. Wave 5 content human-approved; legal pages live (P0).

## Final Verification Wave

> Runs in parallel after all todos. ALL must APPROVE before declaring complete.

- **F1. Plan compliance audit** — every todo done, evidence present, boulders synchronized, budgets/harness actually wired into CI (Category `deep`, skill `review-work`).
- **F2. Code quality review** — R3.x/R4.14/R15.x/R30.x, no AI slop, module ceilings (Category `unspecified-high`, skills `remove-ai-slops`, `programming`, `refactor`).
- **F3. Real manual QA** — browser journey homepage → featured → project → blog → contact, light+dark, mobile/tablet/desktop, reduced-motion, keyboard (Category `unspecified-high`, skills `playwright`, `visual-qa`, `frontend`).
- **F4. Scope fidelity** — confirm no debunked claim re-entered; no forbidden deps/migrations/routes; no fabricated content (Category `deep`, skills `review-work`, `git-master`).
- **F5. Regression gate** — full e2e + axe + contrast + bundle + Lighthouse on production build; all budgets met (Category `unspecified-high`, skills `playwright`, `frontend`, `debugging`).

## Category + Skills — Global Evaluation

| Skill | Use | Justification |
|---|---|---|
| `frontend` | ✅ | Core: tokens, type, palette, page rebuild, next/image |
| `visual-qa` | ✅ | Post-UI visual fidelity across waves |
| `playwright` | ✅ | e2e, axe, reduced-motion, keyboard, Lighthouse source |
| `programming` | ✅ | .ts/.tsx/.mjs scripts, Zod schema, strict types |
| `debugging` | ✅ | Lint conflict, FOUC/hydration, CSP/remote |
| `git-master` | ✅ | Atomic commits, history safety |
| `refactor` | ✅ | T06/T21 behavior-preserving changes |
| `ast-grep` | ✅ | Structural raw-utility/token sweeps (T08) |
| `writing` | ✅ | DESIGN.md, README, legal/content (Wave 5) |
| `review-work` | ✅ | Final verification wave |
| `remove-ai-slops` | ✅ | F2 code-quality gate |
| `9router`, `9router-chat/embeddings/image/stt/tts/web-fetch/web-search` | ❌ | No AI-gateway work in this plan |
| `caveman`, `caveman-commit`, `caveman-compress`, `caveman-help`, `caveman-review`, `compress` | ❌ | Communication style, not task domain |
| `coding-agent-sessions` | ❌ | No transcript archaeology |
| `customize-opencode` | ❌ | Not editing opencode config |
| `find-skills` | ❌ | No skill discovery |
| `init-deep` | ❌ | AGENTS.md already exists and is authoritative |
| `lsp-setup` | ❌ | Toolchain already configured |
| `security-research`, `security-review` | ❌ | No auth/data surface; prior audit covered headers |
| `start-work` | ❌ (caller) | Caller invokes to execute this plan |
| `team-mode`, `ulw-plan`, `ulw-research` | ❌ | This plan is the output; no re-planning |
| `ultimate-browsing` | ❌ | No blocked/WAF pages |

## TODO List (ADD THESE)

> CALLER: Add these TODOs using TodoWrite/TaskCreate and execute by wave. Every todo = one evidence file + one atomic commit. Run commands via `nix develop -c`.

### Wave 0 (Start Immediately — No Dependencies)

- [x] **T01. Fix red pnpm lint**
  - What: Reproduce duplicate react-hooks plugin (eslint-config-react-app + eslint-config-next); remove conflict; verify lint+prettier green.
  - Depends: None | Blocks: T04,T07,T08,T09,T12
  - Category: `deep` | Skills: [`debugging`, `programming`, `git-master`]
  - QA: `nix develop -c pnpm lint` and `pnpm prettier` exit 0; no rule-silencing.
- [x] **T02. Capture measurement baseline**
  - What: `pnpm build` + `node report-bundle-size.js`; commit baseline JSON; capture Lighthouse + axe light/dark per route.
  - Depends: None | Blocks: T03,T05
  - Category: `unspecified-high` | Skills: [`playwright`, `programming`, `frontend`]
  - QA: baseline artifacts parse; timestamped evidence.

### Wave 0.2 (After Wave 0)

- [x] **T04. Axe harness (devDeps + spec)**
  - What: Add `@axe-core/playwright`+`@lhci/cli` as devDeps; `e2e/a11y.spec.ts` light+dark all routes; wire playwright workflow.
  - Depends: T01 | Blocks: T05,T06
  - Category: `unspecified-high` | Skills: [`playwright`, `programming`, `frontend`]
  - QA: `pnpm e2e:headless` runs spec; devDeps flagged dev-only.
- [x] **T03. Bundle-byte budget gate**
  - What: `scripts/check-bundle-budget.mjs` + `budget:bundle`; wire into `nextjs_bundle_analysis.yml`.
  - Depends: T02 | Blocks: F1
  - Category: `deep` | Skills: [`programming`, `debugging`]
  - QA: passes baseline; deliberately-lowered threshold fails.

### Wave 0.3 (After Wave 0.2)

- [x] **T05. Lighthouse CI**
  - What: `.lighthouserc.js` + `lighthouse.yml`; mobile 4×; LCP<2.5s, CLS<0.1, TBT<200ms.
  - Depends: T02,T04 | Blocks: F1
  - Category: `unspecified-high` | Skills: [`frontend`, `programming`, `playwright`]
  - QA: `npx lhci autorun` asserts all three budgets.
- [x] **T06. Single-source e2e expectations + harness extensions**
  - What: extract copy/count to `e2e/fixtures/expectations.ts`; extend focus/contrast/overflow specs.
  - Depends: T04 | Blocks: T07,T16,T17
  - Category: `deep` | Skills: [`playwright`, `programming`, `refactor`, `git-master`]
  - QA: `pnpm e2e:headless` identical assertions; literals in one module.

### Wave 1 (Zero-visual-change foundation)

- [x] **T07. Theme-init / FOUC fix**
  - What: remove hardcoded dark; blocking `<head>` resolver; keep `flowbite-theme-mode`; dark fallback preserved; update dark-mode spec.
  - Depends: T06 | Blocks: T11,T15
  - Category: `deep` | Skills: [`debugging`, `playwright`, `frontend`, `programming`]
  - QA: failing-first spec passes; no-preference stays dark; axe green.
- [x] **T08. Token drift + accidental key cleanup**
  - What: raw utilities → semantic tokens; drop undefined tokens; computed-style diff zero.
  - Depends: T01 | Blocks: T13
  - Category: `visual-engineering` | Skills: [`frontend`, `ast-grep`, `programming`]
  - QA: grep clean; build 0; no visual diff.
- [x] **T09. Dead OTel + README drift**
  - What: remove `@vercel/otel`/`@opentelemetry/*`; correct README Next 14/export claims; mark test devDeps.
  - Depends: T01 | Blocks: —
  - Category: `quick` | Skills: [`programming`, `git-master`, `writing`]
  - QA: frozen install + build 0; no stale README claim.
- [x] **T10. Markdown schema additive**
  - What: re-add `tags`; add optional `role/outcome/metrics/heroImage/featured` with defaults; Jest tests.
  - Depends: None | Blocks: T19,T25
  - Category: `quick` | Skills: [`programming`, `git-master`]
  - QA: `pnpm test` green; no route-count change (38 at the time; 127 now, after T24/T29); frontmatter validator passes.
- [x] **T12. Contact a11y + metadata split**
  - What: split server page + client form; aria-describedby/aria-invalid; live region; blur validation.
  - Depends: T01,T04 | Blocks: T20
  - Category: `visual-engineering` | Skills: [`frontend`, `playwright`, `programming`]
  - QA: contact exports metadata+canonical; axe green; contact e2e green.

### Wave 1b

- [x] **T11. Single root Tooltip provider**
  - What: hoist provider to layout; remove per-icon providers; fix Tooltip token classes.
  - Depends: T07 | Blocks: —
  - Category: `deep` | Skills: [`frontend`, `programming`, `debugging`, `playwright`]
  - QA: provider count reduced; hover/Escape tests green.

### Wave 2 (Expressive layer)

- [x] **T13. Design tokens + measure + contrast gate**
  - What: palette/measure tokens in config; pure-JS contrast gate; DESIGN.md.
  - Depends: T08,T02 | Blocks: T14,T15
  - Category: `visual-engineering` | Skills: [`frontend`, `programming`, `writing`]
  - QA: contrast gate green both schemes; DESIGN.md complete.
- [x] **T14. Inter-only carved type**
  - What: carved display treatment; font budget ≤2 families/≤100KB; (optional gated Newsreader).
  - Depends: T13 | Blocks: T16–T21
  - Category: `visual-engineering` | Skills: [`frontend`, `programming`, `visual-qa`]
  - QA: font-budget assertion; LCP font preload only.
- [x] **T15. Palette + motion + motif**
  - What: parchment palette applies (D13/D4 superseded the Roman travertine/basalt pair); motion-safe opacity/translateY 200–320ms; 1px column rule; no banned ornaments.
  - Depends: T13,T07 | Blocks: T16–T21
  - Category: `visual-engineering` | Skills: [`frontend`, `visual-qa`, `playwright`]
  - QA: contrast+axe green; reduced-motion disables motion; ornament grep clean.

### Wave 3 (Page rebuild)

- [x] **T16. Home rebuild**
  - What: type-led hero (no portrait), curated featured set (4), founder-arc scaffold; remove marquee; update home/interactions specs.
  - Depends: T14,T15,T06 | Blocks: T21
  - Category: `visual-engineering` | Skills: [`frontend`, `visual-qa`, `playwright`]
  - QA: `/` ≤1500 nodes; no marquee; e2e+axe green.
  - **Evidence gap (2026-09-13):** T16's acceptance criteria include "LCP budget met",
    but `task-T16-…txt` contains no LCP measurement — only the DOM-node budget
    (1592 → ~206). run-6's home median (2258 ms, contended host) is consistent with
    the claim, but the criterion was never verified. Recorded per R19.1; no rework
    implied (see `.omo/decisions/2026-09-13-f5-pre-existing-lcp-debt.md`).
- [x] **T17. Projects archive + featured flag**
  - What: archive layout; featured flag filter; single-source counts.
  - Depends: T14,T15,T06 | Blocks: T19,T25
  - Category: `visual-engineering` | Skills: [`frontend`, `playwright`, `programming`]
  - QA: ≥21 links; axe/contrast green.
- [x] **T18. Blog listing polish**
  - What: token-aligned listing/cards; optional RSS.
  - Depends: T14,T15 | Blocks: —
  - Category: `visual-engineering` | Skills: [`frontend`, `playwright`, `programming`]
  - QA: count single-sourced; axe green.
- [x] **T21. De-Flowbite targeted**
  - What: replace Navbar/Alert/Breadcrumb one per commit; keep Card; port a11y e2e first.
  - Depends: T14,T15 | Blocks: —
  - Category: `deep` | Skills: [`frontend`, `debugging`, `playwright`, `refactor`]
  - QA: per-primitive e2e+axe+storybook green.

### Wave 4 (Imagery + SEO; parallel with Wave 3)

- [x] **T22. Image pipeline**
  - What: avif/webp + dims + TTL; own/allowlist remote image; drop 442KB jpg.
  - Depends: None | Blocks: T19,T23,T26
  - Category: `deep` | Skills: [`frontend`, `programming`, `debugging`]
  - QA: remote image loads; size limits; CSP clean.
- [x] **T23. OG 1200×630 + header mark**
  - What: replace 512 logo across 7 routes; SVG/≤5KB header mark.
  - Depends: T22 | Blocks: —
  - Category: `visual-engineering` | Skills: [`frontend`, `programming`, `playwright`]
  - QA: 1200×630 og on all routes; mark ≤5KB.

### Wave 3 dependency (after T17 + T22)

- [x] **T19. Case-study template**
  - What: render optional fields; degrade when absent.
  - Depends: T10,T14,T15,T17,T22 | Blocks: T26
  - Category: `visual-engineering` | Skills: [`frontend`, `programming`, `playwright`]
  - QA: legacy renders unchanged; enriched fixture works; axe green.

### Wave 5 (HUMAN-GATED — do not start without Tom)

- [~] **T24. Legal pages (P0)** `[HUMAN_GATE]`
  - **SCAFFOLD COMPLETE (2026-09-12), awaiting Tom's facts.** `app/impressum/page.tsx` + `app/datenschutz/page.tsx` shipped with visible `TODO(Tom)` placeholders; footer links, sitemap entries, and axe matrix extended (10/10 pass). Commit `5ae1601`. Remaining: Tom supplies the real legal fields (name, address, contact, USt-IdNr, DPA/Drittland notes) — the acceptance clause "Tom approves text" is not yet met, so this stays `[~]`.
  - Depends: D10 | Category: `writing` | Skills: [`writing`, `programming`, `frontend`]
- [~] **T25. Positioning + founder arc** `[HUMAN_GATE]`
  - **Blocked because — Tom's copy, untransferable (R19.1).** Needs (a) the one-line
    positioning statement and (b) the four founder-arc beats as real biography. An
    agent may not author either as fact. Structural scaffolding already exists:
    `components/FounderArc/FounderArc.tsx` renders four neutral, non-factual beat
    labels (`Origin`, `Turning Point`, `Practice`, `Direction`), and the home hero
    carries the current tagline "Building reliable systems and solving hard
    problems." Tom replaces the labels + adds the narrative; T25 then updates the
    `e2e/fixtures/expectations.ts` copy fixtures in the same PR.
  - Blocked also on **T24** via the declared dependency (both are Wave 5 human gates).
  - Depends: T24 | Category: `writing` | Skills: [`writing`, `frontend`]
- [~] **T26. Three case studies** `[HUMAN_GATE]`
  - **Blocked because — Tom's cleared facts, untransferable (R19.1/R10.4).** Each
    upgrade needs `role`, `outcome`, and `metrics[]` values that Tom has verified as
    publishable, plus a `heroImage`. Metrics about real employers/clients require
    explicit clearance before publication, and an agent cannot invent them. The
    schema already supports every field (`lib/markdown.ts`: `role`, `outcome`,
    `heroImage`, `metrics` all have safe defaults), so this is content-only — no
    code work is outstanding. Empty slots may ship; fabricated proof may not.
  - Blocked also on **T24** and on **T17/T19/T22** via the declared dependencies.
  - Depends: T17,T19,T22,T24 | Category: `writing` | Skills: [`writing`, `frontend`]
- [~] **T27. Two new posts** `[HUMAN_GATE]`
  - **Blocked because — Tom's authorship, untransferable (R19.1).** Two
    human-authored posts tied to the case studies. Only Tom can write these as
    first-person narrative. Structural requirements are already satisfied: the Zod
    frontmatter schema in `lib/markdown.ts` gives every field a `.default()` /
    `.catch()` fallback, so malformed frontmatter degrades safely rather than
    breaking the build. When the posts land, **`BLOG_POST_COUNT` in
    `e2e/fixtures/expectations.ts:42` (currently `3`) must be bumped in the same
    PR** — it is asserted by `e2e/dynamic-content.spec.ts`, so the suite would fail
    otherwise.
  - Note: `scripts/check-project-frontmatter.js` hardcodes
    `EXPECTED_PROJECT_COUNT = 21` but is **not wired into any pre-commit hook, CI
    workflow, or package script** (verified 2026-09-12), so it is not a live gate
    and should not be relied on. Recorded for visibility, not fixed here (out of
    T27 scope).
  - Blocked also on **T24** via the declared dependency.
  - Depends: T24 | Category: `writing` | Skills: [`writing`]
- [~] **T28. Cheesecake/LAY2R/testimonial** `[HUMAN_GATE]`
  - **D8 (testimonial) COMPLETE (2026-09-12).** Labelled-example section shipped: `components/Testimonials/` with an unmissable visible "Example" badge + disclaimer, generic-role attributions only, locked by 4 unit tests. Commit `fefcf7d`. Remaining: D7 cheesecake disposition (Tom chose "keep as part of the blog" per D7, so no archive/delete work) and D6 LAYZR case study (needs Tom's cleared metrics + consent).
  - Depends: T19,T22,T24 | Category: `writing` | Skills: [`writing`, `frontend`]
- [x] **T29. Tag pages** (D9 approved 2026-09-12)
  - **DELIVERED (2026-09-12).** `/tags` index + `/tags/[tag]` archive; `lib/tags.ts` normalizes 87 raw tag forms to 86 canonical keys with deterministic URL-safe slugs (`C++` → `c-plus-plus`), throwing on slug collisions. Entries reuse `ArticleTeaser`/`ProjectTeaser`. Sitemap + axe matrix (12/12) extended, footer link added. Verified: typecheck, prettier, lint 0 errors, Jest 162/162, build 127 static pages, full e2e 83 passed. Commit `ddc18da`. Found and fixed a footer touch-target regression in the same commit (see below).
  - Depends: T10,T24 | Category: `quick` | Skills: [`programming`, `frontend`]
- [x] **T20. About portrait** (structural half complete 2026-09-12; copy stays with T25)
  - **DELIVERED (2026-09-12).** Portrait re-homed from the (now type-led) home hero to About, in a fixed `aspect-[4/5]` box with explicit sizing + `loading="lazy"`. Measured at 375×812: 320×400, top=1519px (below fold), **CLS=0**, `alt` present, optimized via `_next/image`. No duotone/filter — T20's "travertine/basalt duotone" wording is stale Rome-concept language superseded by D13. `PersonTeaser` untouched. Verified: typecheck, prettier, lint 0 errors, images 101 (30.6 KB), build 127 pages, responsive 26, axe 12. Commit `db4aa96`.
  - Depends: T14,T15,T24 | Category: `visual-engineering` | Skills: [`frontend`, `visual-qa`, `playwright`]
  - QA: portrait lazy/dims/no CLS; axe green. ✅ all satisfied.
  - **Open design question (not blocking):** `FounderArc` renders on Home only; T20's "founder-arc reuse" was structural, so it was NOT duplicated into About. Whether About should also host the arc is a design call for Tom.

### Wave 6 (Final Verification — all must approve)

> **Re-run 2026-09-12 (R19.4 amendment).** F1–F4 first approved at commit `962b6a2`.
> Because 1,108 insertions across 13 product files (T20/T24/T28/T29 + footer/sitemap/axe)
> landed **after** that verdict, a wave approval no longer covered HEAD. F1's re-audit
> correctly REJECTED on the stale-ledger defect; the remedy re-ran **F1–F4 against the
> exact `962b6a2..HEAD` delta**, each writing a fresh ledger citing its HEAD SHA. All four
> returned **APPROVE** (`55b54f9`, `0307954`, `42f56f9`). The `[x]` marks below denote the
> post-delta re-approvals, not the superseded `962b6a2` verdicts. Product code was never
> wrong — only the evidence trail was stale.

- [x] **F1. Plan compliance audit** — Depends: all | Category: `deep` | Skills: [`review-work`]
- [x] **F2. Code quality review** — Depends: all | Category: `unspecified-high` | Skills: [`remove-ai-slops`, `programming`, `refactor`]
- [x] **F3. Real manual QA** — Depends: all | Category: `unspecified-high` | Skills: [`playwright`, `visual-qa`, `frontend`]
- [x] **F4. Scope fidelity** — Depends: all | Category: `deep` | Skills: [`review-work`, `git-master`]
- [~] **F5. Regression gate** — Depends: all | Category: `unspecified-high` | Skills: [`playwright`, `frontend`, `debugging`]
  - **Status: UNJUDGED, not failed (2026-09-12).** Code-controlled gates all green.
    Lighthouse cannot be judged: an external `ohmyroadmap` Stryker job held this
    22-core host ~15 h, and **every** post-restyle LHR came from a host slower than
    the baseline (`benchmarkIndex` 598–2416 vs baseline 2511–3064) — incomparable.
    F5 ledger §19–§22.
  - **RESUME — exactly one action:** run the Arm A command (F5 ledger §18: offline
    cached Lighthouse 13.4.1 + `CHROME_PATH=/etc/profiles/per-user/tom/bin/chromium`,
    matched to the T02 baseline) on `/projects`, and read
    `environment.benchmarkIndex`. Require `bi ≥ 2510`; otherwise the reading is void —
    do not judge from it.
    - `bi ≥ 2510` **and** LCP < 2500 ⇒ the gate's LCP criterion **passes with no code
      change** (§21 estimates ≈2414 ms at the baseline's `bi` 2762).
    - LCP > 2500 at valid speed ⇒ `/projects` genuinely fails ⇒ T30 is real.
  - **PRECONDITION — the host clocks down under sustained load (F5 ledger §23–§24).**
    The package is an Intel Core Ultra 7 155H running `governor=powersave` / `epp=performance`
    (hw max 4.5–4.8 GHz, RAPL 40 W sustained). While the external Stryker job pins the
    CPU it clocks ~1.4 GHz avg, which alone depresses `benchmarkIndex`. This is a
    **load-induced power/thermal response, not a defect**: T02 reached `bi` 2511–3064 on
    this same host under the same governor config, so `bi ≥ 2510` **is** reachable once
    the load stops. No governor change is needed (and none is possible without root).
    Only precondition: an **idle CPU**.
  - **Do NOT** run while the host is busy, **do NOT** arm in-session watchers (30-min
    monitor cap < the external job's runtime), and **do NOT** weaken the
    2500/0.1/200 budgets.
  - **Re-probe 2026-09-12T20:19:39Z (F5 ledger §28):** precondition still unmet —
    loadavg 25.7/25.3/26.2 on 22 cores; nine `cc1plus` compilers (external job) plus
    `.opencode-wrapp` at 98.5% CPU. No Lighthouse run attempted (a void reading cannot
    decide the gate). Disposition unchanged: `[~]` UNJUDGED, not failed.
  - **Arm A attempt #5 2026-09-12T20:30Z (F5 ledger §29): reading VOID.** Window
    looked quiet at start (loadavg 5.41, 0 `cc1plus`), so the validated §18 command
    was run against F3's 127/127 build with LH 13.4.1 + nix Chromium 149.0.7827.200
    (both match T02). Result: `benchmarkIndex` **1900 < 2510** → not comparable,
    **not judged**. A fresh `cc1`/`cc1plus` burst (ClosedLoopOS build) pushed loadavg
    back to 22 within a minute of the run. /projects LCP 3989 ms is unused (void);
    CLS 0.000 and TBT 167.7 ms still PASS. Artifact `armA5-projects-lh13.json`.
    Confirm: **F5 cannot be judged from inside an active agent session on this shared
    host** — the harness itself held ~98% CPU.
  - **Attempt #6 2026-09-13T11:28Z (F5 ledger §31): VOID again** (`bi` 1314) — the
    external `ohmyroadmap` Stryker job was still running (PID 2024334, 6h34m, 11
    `tap-runner` workers ≈ 1017% CPU). Consistent with #5: `bi` tracks host load.
  - **Reframed 2026-09-13 — see
    `.omo/decisions/2026-09-13-f5-pre-existing-lcp-debt.md`.** The valid T02 baseline
    (proven above) already failed the **absolute** LCP budget on **3/7** routes
    (`/` 2830, `/projects` 2588, cheesecake 3562) — so Success-Criterion #3's "LCP
    <2.5 s on **every** public route" was **unsatisfiable at plan start** and cannot
    be a restyle-regression gate. CLS/TBT were 0/7 failing at baseline and remain
    green. Post-restyle run-6 medians show `/` (−572) and cheesecake (−1276) now
    **under** 2500 despite a *slower* host ⇒ the restyle likely **fixed** those two.
    Only `/projects` remains unmeasured post-restyle. **Automatic capture:**
    `bash .omo/tools/f5-arm-a-runner.sh` (waits for a quiet window, measures once,
    keeps the reading only if `bi ≥ 2510`, writes `f5-arm-a-verdict.txt`).

### Wave 7 (F5-UNBLOCK — added 2026-09-12, R19.4 plan amendment)

> **Why this wave exists.** F5 revealed the plan's Success-Criterion #3 and T05's
> expectation ("expected to go green once the restyle + T22 land") are **false for
> `/projects`**. Same-tool (Lighthouse 12.6.1) evidence: pre-restyle `/projects`
> with the `h1` as LCP element measured **2632 ms** (T05, rev `1b1062e`); post-restyle
> with the intro `p` as LCP element measured 2923 ms (run 6). Reverting the paragraph
> restores the *already-failing* 2632 ms condition, so the one-line revert is
> **provably insufficient**. `/projects` has never passed the 2500 ms LCP budget at
> any measured revision under any tool. No prior task owned this fix. Full analysis:
> `.omo/evidence/task-F5-2026-refresh-restyle.txt` §14–§16 and
> `.omo/decisions/2026-09-12-f5-lighthouse-methodology.md`.
>
> Budgets are unchanged (2500 / 0.1 / 200). This wave is the real fix, not a
> measurement re-read.

- [~] **T30. `/projects` LCP fix — reduce critical document/DOM render cost** `[BLOCKED: needs quiet-host verification]`
  - Depends: F5 diagnosis (done) | Category: `visual-engineering` (perf-shaped)
  - Skills: [`frontend`, `programming`, `playwright`]
  - Description: Reduce `/projects`' main-thread render delay. Lead candidate:
    `content-visibility: auto` + `contain-intrinsic-size` on the project-card
    containers (21 cards; 212 KB HTML vs `/blog`'s 41 KB at near-equal JS). Verify
    the choice with the quiet-host experiment in
    `.omo/notepads/2026-refresh-restyle/problems.md` BLOCKER 1 before committing.
  - Acceptance: under the gate's LH 12.6.1, `/projects` LCP median < 2500 ms on a
    quiet host; CLS < 0.1; axe zero serious/critical; `pnpm build` 0; e2e green.
  - MUST NOT: weaken the budget; change blog routes; add runtime deps; break
    keyboard/focus behavior or scroll anchoring.
  - **Blocked because — and possibly UNNECESSARY (see below):** the fix cannot be
    verified (R6.1/R8.1) while the external `ohmyroadmap` Stryker job saturates the
    host (22 cores, ~21 runners at ~100 %). A production change with no executable
    verification is forbidden. Unblocks when the host is quiet enough to read
    `/projects` LCP under the gate's tool.
  - **Do NOT start this task before re-reading F5 ledger §19–§22.** Later evidence
    may make it moot: every post-restyle `/projects` reading was taken on a host
    SLOWER than the baseline (`benchmarkIndex` 598–2416 vs baseline 2511–3064), and
    the host-speed model (§21) estimates `/projects` at **≈2414 ms** when corrected
    to the baseline's `bi` 2762 — i.e. **likely already passing**. The real,
    pre-restyle reading (T02) was 2588 ms at `bi` 2762. So the correct sequence is:
    **first** obtain one `/projects` LHR at `benchmarkIndex ≥ 2510` (Arm A command,
    F5 ledger §18); **only if** it reads > 2500 ms does T30 become a real fix.
    A `content-visibility` change is not justified by the current (host-confounded)
    numbers, and the earlier "revert is provably insufficient" claim was withdrawn
    (§20).
- [~] **T31. Lighthouse version parity for CI** `[BLOCKED: Tom process decision]`
  - Depends: — | Category: `unspecified-high`
  - Skills: [`frontend`, `programming`]
  - Description: Align the gate's Lighthouse major with the baseline's (T02 used
    13.4.1; `@lhci/cli@0.15.1` bundles 12.6.1). Tool bias measured at −384…+128 ms
    across routes (median −22). Choose one: pin/upgrade `@lhci/cli` (or invoke a
    pinned `lighthouse`), then re-capture the baseline with the SAME version and
    record `lighthouseVersion` in every comparison.
  - Acceptance: gate and baseline LHRs report the same `lighthouseVersion`; a
    comparison note in `.omo/evidence/task-T05…` states it.
  - **Blocked because (two reasons):**
    1. **Tom process decision** — changing the measuring instrument can read as
       moving the goalposts and must be a deliberate, documented choice by Tom, not
       an agent call (`.omo/decisions/2026-09-12-f5-lighthouse-methodology.md`,
       "Non-decisions").
    2. **No registry access in this environment (verified 2026-09-12)** — pinning or
       upgrading `@lhci/cli`/`lighthouse` needs the npm registry, which is
       unreachable here (`curl https://registry.npmjs.org/lighthouse` → HTTP 000,
       timeout). Only the installed versions exist locally:
       `node_modules/.pnpm/lighthouse@12.6.1`, `node_modules/.pnpm/@lhci+cli@0.15.1`.
       Any version change therefore needs a networked machine.

## Execution Instructions

1. **Wave 0.1** — fire in parallel:
   ```
   task(category="deep", load_skills=["debugging","programming","git-master"], run_in_background=false, prompt="T01: Fix red pnpm lint ...")
   task(category="unspecified-high", load_skills=["playwright","programming","frontend"], run_in_background=false, prompt="T02: Capture measurement baseline ...")
   ```
2. **Wave 0.2** — after 0.1, parallel: T04, T03.
3. **Wave 0.3** — after 0.2, parallel: T05, T06.
4. **Wave 1a** — parallel: T07, T08, T09, T10, T12. Then **Wave 1b**: T11.
5. **Wave 2a**: T13. Then **Wave 2b**: T14, T15.
6. **Wave 3 + Wave 4** — start T22 (Wave 4) alongside Wave 3; parallel T16, T17, T18, T21; then T19 after T17+T22.
7. **Wave 5** — HOLD for Tom; run only approved content todos, per-file approval before commit.
8. **Wave 6** — F1–F5 in parallel; surface results; await explicit user okay.
9. **Wave 7 (F5-unblock, added 2026-09-12)** — T31 (Lighthouse version parity) is a Tom
   process decision; T30 (`/projects` LCP fix) requires a quiet-host LCP verification
   before any commit. Both are `[~]` blocked; do not start either while the external
   Stryker job saturates the host.

> Every todo: write `.omo/evidence/task-<ID>-2026-refresh-restyle.txt`, update `.omo/boulders/`, run the todo's exact QA command, commit atomically with a conventional message, and never bypass hooks.
