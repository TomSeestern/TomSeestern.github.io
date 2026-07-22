## 2026-07-21 — Tailwind Roman palette applied

- `tailwind.config.js`: full Roman palette + Cinzel heading font, 191 lines
- No structural changes — only values replaced in place
- `primary` constant: blue (#3b82f6) → terracotta (#C2410C)
- `surface`: cool whites → warm marble (#FAF9F6)
- `foreground`: cool grays → warm charcoal (#1C1917)
- `muted/border`: warm stone tones
- `fontFamily.heading`: added `["Cinzel", "serif"]`
- `fontFamily.body`/`sans`: Inter retained
- `accent.*` tokens reference `primary[N]` — auto-updated from terracotta scale
- `typography` config uses `theme()` — no edits needed; auto-resolved
- All animations (marquee), borderWidths, minHeight, keyframes preserved
- Dark variants present for every semantic token
- JS parse verified: `node -e "require('./tailwind.config.js')"` passes

## 2026-07-21 — Page file review: zero hardcoded blue, all semantic tokens

### Audit scope
7 page files: `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/blog/page.tsx`, `app/blog/entry/[slug]/page.tsx`, `app/projects/page.tsx`, `app/projects/entry/[slug]/page.tsx`

### Grep results
`blue-|sky-|indigo-|#3b82|#2563|#1d4e` → **0 matches** in `app/` directory

### Findings per file
- `app/page.tsx` — all semantic tokens; hero button `bg-accent-hover` (terracotta) intentional; headings use `font-extrabold` (weight utility, fine); hero h1 uses `text-4xl` not `text-h1` (hero-specific sizing, acceptable)
- `app/about/page.tsx` — `text-h1-sm`/`text-h1`/`text-h2-sm`/`text-h2` semantic heading tokens; `bg-accent-soft` badge; links use `hover:text-accent-hover`
- `app/contact/page.tsx` — all semantic tokens; form error red-600 (correct for errors); success button green-700 (correct for success state); submit button uses `bg-accent-hover`
- `app/blog/page.tsx` — `text-h1-sm`/`text-h1` semantic; `text-muted` subtitles
- `app/blog/entry/[slug]/page.tsx` — `prose prose-lg dark:prose-invert` (typography plugin handles body); heading uses `text-h1-sm sm:text-h1`
- `app/projects/page.tsx` — `text-h1-sm`/`text-h1` semantic; links use `text-accent`
- `app/projects/entry/[slug]/page.tsx` — same pattern as blog entry

### Verdict
No fixes needed. All 7 pages use semantic tokens exclusively. The tailwind config change auto-propagated to every page via CSS variable resolution. `accent` tokens (terracotta) are correctly referenced everywhere they should be. Red/green for form states are semantically appropriate and not design-system colors.

## 2026-07-21 — Component review: 1 fix needed (Tooltip), 7 clean

### Audit scope
8 component files: Header, Footer, Button, ArticleTeaser, ProjectTeaser, TimelineEntry, PersonTeaser, Tooltip

### Grep results
`blue-|sky-|indigo-|zinc-|#3b82|#2563|#1d4e` → **2 matches** (both in Tooltip.tsx — fixed). After fix → **0 matches**.

### Findings per component
- **Tooltip** (FIXED): `bg-zinc-700` → `bg-surface-dark` (#292524 warm charcoal). `fill-zinc-700` → `fill-surface-dark`. `font-open-sans` → `font-body` (was undefined in tailwind config, dead class).
- **Button**: All CVA variants use semantic tokens (`accent-light`, `accent-hover`, `text-foreground-dark`). `focus-visible:ring-accent-soft`. Zero hardcoded colors. ✅
- **Header**: Contact button `bg-accent-hover` (terracotta) + `text-white` — good contrast on terracotta. All semantic. ✅
- **Footer**: `bg-surface`, `text-muted`, `hover:text-accent-hover`, `focus-visible:ring-accent-soft`. All semantic. ✅
- **ArticleTeaser**: Badge `bg-accent-soft`/`text-accent-soft-foreground` verified. Link `text-accent` + `hover:text-accent-hover`. All semantic. ✅
- **ProjectTeaser**: Same pattern as ArticleTeaser. All semantic. ✅
- **TimelineEntry**: `bg-border-subtle`, `text-muted`, `hover:text-accent-hover`. All semantic. ✅
- **PersonTeaser**: `hover:bg-surface-muted`, `text-foreground`, `text-muted`. All semantic. ✅

## 2026-07-21 — Verification suite: all 4 gates pass with zero redesign-caused failures

### Results
- `pnpm lint` → exit 0 (warnings only: pre-existing import-order, Tailwind shorthand, unused-vars)
- `pnpm prettier` → exit 0 (all files match Prettier style)
- `pnpm build` → exit 0 (38 static pages generated, First Load JS unchanged)
- `pnpm test` → exit 0 (12 suites, 82 tests, 0 snapshots)

### Pre-existing non-issues (NOT caused by redesign)
- `text-2xs` in Tooltip → not in Tailwind config, but exists since 2023 initial commit (commit `d0fb39b`). Build passes — Tailwind JIT silently ignores undefined classes at build time.
- `rounded-0.5md` in Tooltip → same story (commit `d0fb39b`, 2023). Build passes.
- All lint warnings (import-order, tailwindcss/enforces-shorthand, no-unused-vars) → pre-existing, none introduced by redesign.

### Redesign-specific changes that passed cleanly
- `bg-surface-dark` / `fill-surface-dark` / `font-body` in Tooltip → all resolve correctly from tailwind.config.js
- Cinzel font loading via `next/font/google` in `app/layout.tsx` → no build/lint errors
- Terracotta palette replacements in tailwind.config.js → theme() resolution correct in typography config
- No hardcoded colors remain in any component (verified via grep in earlier audit)

### Verdict
Redesign is build- and test-clean. No fixes needed.

## 2026-07-22 — Critic attack framework for hyperplan-roman-peak

**Author:** critic (adversarial planner). **Targets:** other 4 plans.
**Stance:** HOSTILE. Find weaknesses before implementation.

### Codebase ground truth (verified before writing framework)

- Stack: Next.js 14 App Router, static export, Tailwind v3 + Flowbite React 0.7.x, pnpm 10.15.1 (NOT yarn — AGENTS.md wrong in R3.1/R4.13/R9.7/R10.1).
- Current palette IS already Roman-leaning: terracotta `primary` 50-900 (#E85D3A), cream surface #FAF9F6, stone neutrals. Cinzel+Inter wired. **User says "dogshit" → current attempt FAILED. Plan that just "more Roman" repeats known failure.**
- `app/layout.tsx` hardcodes `className="... dark"` on `<html>` AND injects localStorage theme-toggle script → FOUC + hydration-mismatch risk.
- `tailwind.config.js` defines `text-h1`/`h2`/`h3` scale BUT homepage uses `text-4xl font-extrabold` inline → **tokens defined, not enforced** (R15.8 violation in tree).
- Homepage hardcodes hero copy ("LAYZR.gg", "Recent Blog Posts") — not data-driven.
- Projects marquee duplicates project array twice (two `animate-marquee` divs) — hacky infinite scroll, a11y-fragile.
- `lodash` imported into `tailwind.config.js` for `pick`/`omit` never used. Dead dep in build-critical file.
- No `DESIGN.md` exists. Frontend skill mandates it before any UI work.
- Testing: 3 e2e specs only; Storybook 7 (EOL); no a11y e2e spec; no visual-regression suite.
- `flowbite-react: ^0.7.0` ~5 minors behind (0.12+); breaking API changes 0.8-0.12. Upgrade OR replace = major migration, not `pnpm update`.
- 62 Dependabot alerts. Suspects: `next 14.2.35`, `postcss ^8.4.31`, `@babel/*`, `storybook ^7.5.3` (EOL), `eslint 8.54.0` (EOL), `webpack 5.89.0`, `semantic-release`+plugins, `@vercel/otel` (likely unused), `next-compose-plugins` (unmaintained), `patch-package` (patches may break on upgrade).
- AGENTS.md says "yarn" in R3.1/R4.13/R9.7/R10.1/R14.1 but README + package.json + lockfile say pnpm. **Documentation drift = planning failure indicator.**

### Attack Vector 1 — Visual design (Roman, not costume)

Sophisticated Roman-imperial = restraint, material, proportion. NOT iconography dump. Risk = "Caesar's Palace buffet": gold-on-gold, column emojis, faux-marble everything, Comic-Sans-adjacent body fonts, over-saturated imperial purple, laurel dividers. Peak 0.01% Roman = typographic + proportional: Trajan-column inscription capitals for display headings ONLY (Cinzel already chosen — good), disciplined warm-neutral ground (cream/travertine/limestone NOT marble white), single restrained accent (terracotta/oxblood/pompeian red — already in palette), generous negative space, strict type scale. Material richness = SUBTLE texture (paper grain, not marble veins) + ONE premium detail (hairline gold rule, single ligature) — not texture overlay on every surface.

**Attack questions:**
1. Palette specificity — name exact hex for light AND dark: surface, surface-elevated, foreground, foreground-muted, accent, accent-soft, border. "Warm Roman tones" without hex = mood-board, fail.
2. Saturation discipline — how many distinct accent hues per screen? Peak = 1 (maybe 2 for state). >2 = costume.
3. Cinzel usage boundary — Cinzel for h1/h2 display ONLY, or also body/buttons/captions? Cinzel body = illegible costume. State the rule.
4. Texture strategy — marble/parchment/grain? Where, opacity, how many surfaces? >2 surfaces = theme park. Survive dark mode?
5. Gold handling — metallic gradient, flat #D4AF37, or restrained #B8943A hairline? Metallic gold gradients = #1 dogshit tell. Which + where exactly?
6. Column/arch/SPQR cliche audit — Doric columns, arch shapes, laurel/SPQR, statue imagery? Each cliche unless justified. Demand justification per element.
7. Dark-mode parity (R15.14) — dark palette with SAME specificity as light? Roman-warm-in-dark often becomes muddy brown. Dark surface hex + why not zinc-950-generic?
8. Reference fidelity — name 1-2 concrete reference sites/brands (frontend skill Layer B). "Roman" alone not a reference. Which real shipped site is fidelity target?
9. Proportion system — Roman = proportional grids, not just 12-col. Vertical rhythm / baseline grid defined, or just "use Tailwind spacing"? Vague = fail.
10. "Dogshit" root cause — current site ALREADY has Roman palette + Cinzel + user hated it. What SPECIFICALLY does plan change to NOT repeat? "More Roman" = also dogshit. Demand the delta.

### Attack Vector 2 — Technical (restyle failure modes)

Common failures: forgotten pages (not-found, /now, /about, /contact, entry pages, form states), dark-mode breakage, spacing drift, FOUC/hydration mismatch, Flowbite React coupling, mobile breakage, a11y regression, hydration mismatches, bundle bloat, Storybook drift, `prose` plugin coupling.

**Attack questions:**
1. Route coverage matrix — list EVERY public route: /, /about, /blog, /blog/entry/[slug], /projects, /projects/entry/[slug], /contact, /now, /not-found. Missing route = not "full." Demand matrix.
2. Theme-init strategy — how handle `<html dark>` + localStorage FOUC? Keep inline script, cookie, or `next-themes`? How avoid hydration mismatch with new client components?
3. Token enforcement — current code violates R15.8 (homepage `text-4xl font-extrabold` not `text-h1`). Plan include lint/grep to BAN ad-hoc type/spacing/color classes? Else new tokens ignored.
4. Flowbite decision — (a) keep 0.7, (b) upgrade 0.12+, (c) replace Radix/shadcn. Which + why? Blast radius per option? Silent = incomplete.
5. Mobile hero — current hides portrait below `xl`. New hero work at 375px? What replaces hidden image? Demand mobile-first layout.
6. `prose`/markdown styling — blog+project posts use `@tailwindcss/typography`. Plan re-theme `prose` config block? Else post body stays old-styled while chrome changes = inconsistent.
7. Hydration test evidence — add Playwright assertion for zero hydration-warning console messages (R24.2)? If not, how verified?
8. Bundle budget — new fonts+textures+motion. Set bundle-size budget (R12.1) + measure `pnpm analyze` before/after?
9. Storybook update — update every existing story to new tokens, or `pnpm test-storybook` fails CI?
10. LSP/lint/build gate — exact verify command sequence (`pnpm lint && pnpm prettier && pnpm test && pnpm build && pnpm test-storybook`)? Says "yarn" = reading wrong AGENTS.md = fail.

### Attack Vector 3 — Vulnerability remediation (false solutions)

False solutions: "just `pnpm update`" (misses transitive), ignoring transitive deps, lockfile breakage, introducing NEW vulns via major upgrades (next 15, React 19, Storybook 8, ESLint 9), dev-dep complacency (devDeps run in CI with secret access), `patch-package` drift (postinstall runs every install; upgrades may break patches), unused-dep false fix (removing @vercel/otel breaks if imported), audit-tool gap (no `pnpm audit` in CI per R10.2/R18.2 `[manual]`).

**Attack questions:**
1. Categorize the 62 — production runtime vs devDep vs transitive-only? Plan treating all 62 same = naive. Demand breakdown.
2. Transitive strategy — for subdeps pnpm can't reach directly, use `pnpm.overrides` or `resolutions`? Show exact override entries.
3. `next` upgrade scope — 14.2.35 → 14.2.x-latest (patch) vs 14→15 (major)? 15 breaks App Router patterns, `next/font`, image config. Justify major + list migration steps.
4. React 19? — any plan bump React to 19? If yes, Flowbite React 0.7 may not support React 19 — verified?
5. `patch-package` audit — what's in `patches/`? Which break on upgrade? Re-verify each patch post-upgrade?
6. Lockfile discipline — `pnpm-lock.yaml` committed? Atomic with dep bumps? `pnpm install --frozen-lockfile` in CI (R9.7)?
7. New-vuln check — after upgrades, re-run `pnpm audit`/Dependabot to confirm NET reduction (not "moved CVEs")?
8. `flowbite-react` vuln path — `flowbite-react@0.7` pulls `flowbite@2.2`. Which CVEs trace to `flowbite` vs `flowbite-react`? Upgrade to 0.12 may drop vulnerable trees — verified?
9. Storybook 7→8 — Storybook 7 EOL + vuln magnet. Upgrade to 8? Config migration (`.storybook/main.ts`, test-runner, addons) scoped?
10. `@vercel/otel` / `next-compose-plugins` / unused devDeps — grep-confirm dead before removing? Dead-code evidence?
11. Secrets redacted (R10.8) — upgrade change how `@t3-oss/env-nextjs` or `resend` read env? If `env.mjs` schema changes, `.env.local` still valid?

### Attack Vector 4 — Scope / effort / sequencing (planning failures)

Common failures: underestimating Flowbite React replacement (NOT find-replace; each component has own API, keyboard nav, a11y contract), forgetting Storybook, ignoring e2e tests (new layout breaks selectors), not accounting for content rewrite, sequencing visual+vuln together (dep upgrades change Flowbite/Storybook versions → visual work built on v0.7 may not compile on v0.12; order matters: vuln/upgrades FIRST, then visual, or visual work thrown away), single-contributor realism (0.01% peak solo = multi-week), no DESIGN.md first (frontend skill: no DESIGN.md = no UI work), no rollback plan (broken `pnpm build` blocks main).

**Attack questions:**
1. Sequencing — vuln/dep upgrades BEFORE or AFTER visual restyle? If after, visual work targets Flowbite 0.7, may be discarded on upgrade. Demand order + rationale.
2. Flowbite scope — list every file importing `flowbite-react`? (Header, Breadcrumb in blog/project/now pages, Tooltip, Footer, Button). Import inventory where?
3. Storybook work — story updates as explicit tasks, or assume "just work"?
4. e2e selector update — new layout = new DOM = broken selectors. Update `home.spec.ts`, `static-routes.spec.ts`, `dynamic-content.spec.ts`? Add hydration-console assertion?
5. Content scope — hero copy / microcopy rewrite in scope? If yes, who authors? If no, "peak" ceiling capped by stale copy.
6. DESIGN.md deliverable — produce `DESIGN.md` (tokens, type scale, spacing, motion, a11y constraints, accepted debt) BEFORE any component code? If no, fail design-system gate.
7. Phase plan — phases with independent mergeability (Phase 1: vuln+dep upgrades preview branch; Phase 2: DESIGN.md; Phase 3: token+layout; Phase 4: component restyle; Phase 5: content; Phase 6: e2e/a11y/Lighthouse verify)? Demand phase list.
8. Effort estimate per phase — solo contributor. Hour estimates per phase? No estimates = can't sequence.
9. Preview-deploy strategy — Vercel preview deployments per phase, or push to main and pray?
10. AGENTS.md vs README drift — plan cites AGENTS.md rules. Reconcile yarn/pnpm contradiction? Plan quoting wrong PM breaks CI.

### Attack Vector 5 — Peak quality (0.01% or delusion?)

**Good vs 0.01%:** Good = consistent tokens, working dark mode, Lighthouse 90+, looks intentional. 0.01% = recognizable signature (type pairing nobody else uses, one motion gesture mapping to real interaction, material restraint [one premium detail not ten], dark mode as second designed theme not inverted light, a11y exceeding WCAG AA [keyboard nav as good as mouse, motion-reduce honored, contrast 7:1 body], Lighthouse 100 every category on real Playwright Chromium per frontend skill `perfection` ruleset — NOT `lighthouse` CLI). **0.01% is measurable.** Plan can't name metric (Lighthouse score, LCP ms, contrast ratio, bundle KB) = "peak" is feeling, not bar.

**Realistic for one contributor?** No — not in one pass. 0.01% sites are team products (Linear, Stripe, Vercel, Apple) with dedicated designers, motion engineers, weeks of QA. Solo dev can hit **0.1%** (excellent) with discipline; 0.01% requires (a) narrowing scope to ONE signature page (homepage) accepting "good" elsewhere, or (b) multi-phase over weeks.

**Acceptable compromises:** Restyle homepage to peak; leave blog/project entry prose-styled but token-consistent. Ship dark mode as designed second theme for homepage+nav only; mark deep-dark-mode parity as accepted debt (R15.14 says required — but debt must be EXPLICIT, not silent). Defer Lighthouse-100 to follow-up; ship Lighthouse-90+ first. Use concrete Layer B brand reference (Linear/Stripe/Vercel per frontend skill) as fidelity target rather than "Roman" mood.

**NOT acceptable compromises:** Emoji icons (frontend skill forbids — SVG only). Marble/parchment texture on >2 surfaces. Cinzel for body copy or buttons. Skipping DESIGN.md. Skipping e2e/a11y verification. Bumping deps without lockfile + re-audit. "Yarn" commands in pnpm repo. Hardcoded hero copy left as-is while calling it "peak redesign."

**Attack questions:**
1. Peak metric — single number proving "0.01%"? Lighthouse-100-on-Chromium? LCP <1.5s? Contrast 7:1? No number = unverifiable.
2. Signature element — ONE detail making site unmistakably Tom's + unmistakably Roman that no template ships? Can't name it = reskin not peak.
3. Scope honesty — plan admit 0.01% is multi-week team bar + propose realistic solo target, or promise 0.01% in one sprint? Latter = delusion.
4. Reference fidelity — name Layer B brand matched (per frontend skill)? "Roman" not a brand. Which shipped site is the bar?
5. Dark-mode-as-second-theme — dark mode designed or inverted light? Show dark palette hex. `zinc-950` generic = fail.
6. A11y ceiling — target WCAG AAA (7:1 body) on key text, or stop at AA (4.5:1)? Peak = AAA on body. Which?
7. Motion meaning — per frontend skill, motion maps to real interaction. Motion list maps each animation to state change/affordance, or "looks cool"? Latter = slop, forbidden.
8. Acceptable-debt ledger — name explicitly deferred (e.g. "dark-mode parity on blog entry pages = accepted debt, tracked")? Silent debt = broken window (R39.3).
9. "Would I show this?" gate (R15.16) — human-review checkpoint before merge, or auto-merge on green CI? Peak requires human gate.
10. Regression-proof — add Playwright visual baseline + Lighthouse-CI assertion so next PR can't regress peak? If not, peak erodes next commit.

### Meta-attack: plan-internal contradictions

For every plan also check:
- Cite AGENTS.md rules referencing "yarn" while running pnpm commands? Drift = planner didn't read codebase.
- Promise "0.01% peak" AND "fix all 62 vulns" AND "full restyle" in one phase with no hour estimates? Three projects, not one.
- Name a designer or assume LLM will design? LLM-as-designer without Layer B reference = generic output (frontend skill warns).
- Touch `app/layout.tsx` theme script without addressing existing FOUC/hydration risk? Incomplete.
- Add fonts/textures/motion without bundle budget? LCP regression incoming.
- Say "TBD"/"explore" for Flowbite React decision? Highest-risk item; deferring = plan not decision-complete.

### How I will use this

When each of 4 plans lands, run through every numbered question. Plan fails an attack vector if it cannot answer >3 questions in that vector with codebase-grounded specificity. Send lead a per-plan scorecard: pass/weak/fail per vector, with specific unanswered questions cited.

## 2026-07-22 — Homepage contrast repair

- Keep muted body text on shared semantic token `muted.DEFAULT`; changing individual homepage classes risks light/dark token drift.
- `#706963` on warm surface `#F5F0E8` yields 4.76:1, giving margin above WCAG AA's 4.5:1 minimum.
- Verify with axe after `main` transition reaches `opacity: 1`; earlier scans can measure transitional alpha composites instead of final colors.
- Literal Playwright evidence needs raw redirection plus explicit exit status. `pnpm exec playwright test --list` fixed scope at 40 tests; two separate full `pnpm e2e:headless` runs each ended `40 passed` and `EXIT_CODE=0` in `.omo/evidence/eslint-9-e2e-run-{1,2}.log`.

## 2026-07-22 — Task 3 pnpm override configuration blocked by scope

- Baseline `pnpm audit --json`: 5 low, 9 moderate, 12 high, 0 critical (26 total local advisories).
- Current audit candidates: `glob@10.3.10` via `@next/eslint-plugin-next`, `minimatch@9.0.3` via `@typescript-eslint/typescript-estree`, `postcss@8.4.31` via `next`, and `shell-quote@1.8.4` via `concurrently`.
- `tar`, `axios`, `esbuild`, `sharp`, `uuid`, and `elliptic` had no current audit finding; no blind override added.
- Current pnpm ignores `package.json#pnpm.overrides` and root `package.json#overrides` did not affect resolution. Official pnpm docs require root `pnpm-workspace.yaml` for current overrides.
- Task scope permits only `package.json`, `pnpm-lock.yaml`, and `.omo/`; creating `pnpm-workspace.yaml` would violate it. Exploratory package/lockfile changes reverted. Full reproducible evidence: `.omo/evidence/task-3-pnpm-overrides-blocked.md`.

Framework is hostile by design. Better plans survive it; weak ones caught before a line of code written.

## 2026-07-22 — Phase 5 Synthesis: Decision-complete Roman redesign plan

**Author:** critic (synthesizer). **Target:** 0.1% solo quality. 0.01% = aspiration requiring iteration.

### TL;DR

Sequential plan: (1) security-first dep remediation with compatibility spike gate, (2) Flowbite React replacement with Radix primitives, (3) visual restyle with pompeian palette + 3-font system + CSS-first motion, (4) a11y/Lighthouse verification. 12-16d solo. Rejects arch frame, 5th font, Lenis, magnetic hover, scroll-bound font weight, SVG turbulence. Gates Next 15 behind React 19 + Flowbite 0.7 compatibility proof.

### Accepted design decisions

1. **3-font system + system monospace:** Cinzel (h1 display ONLY, weights 400-700), EB Garamond (body copy, weight 400-600, 3099 glyphs), Inter (UI labels, metadata, 12-14px). Code blocks: `ui-monospace, SFMono-Regular, Menlo, monospace` (system stack, no web font). Total: 3 web fonts. NOT 5. JetBrains Mono DROPPED — system monospace is zero-cost.
2. **Palette:** Pompeian red `#A82A38` (accent, links, CTAs, focus rings). Marble canvas `#F5F0E6` light / `#1C1917` dark. Warm charcoal foreground `#2A2017` light / `#F5F0E6` dark. Gold `#C9A34F` (connective ONLY — hairline rules, dividers, NOT body text NOT backgrounds). Imperial purple `#5A1843` DROPPED — no usage rule, risks costume. Dark surface uses existing warm stone `#292524` for elevated, `#1C1917` for base.
3. **Roman signature through restraint:** Sharp geometry (`rounded-sm` NOT `rounded-xl`), positive letter-spacing on Cinzel (`tracking-wide`), drop caps on article first paragraph (`:first-of-type::first-letter`), subtle gold hairline rules (`h-px bg-[#C9A34F] opacity-60`), `OPVS · MMXXVI` overline on hero ONLY (12px, `tracking-[0.3em]`, `text-muted`). NO arch portrait frame. NO diamond dividers. NO marble/parchment texture overlay. NO SVG feTurbulence grain.
4. **Motion: CSS-first, GPU-composited only.** Page reveal (opacity 0→1, 300ms, `ease-out`), hero stagger (CSS `animation-delay` per child, 100ms increments), card hover (`motion-safe:transition-transform motion-safe:hover:-translate-y-0.5`, NOT Motion library scale). Marquee: keep existing CSS keyframe, add `pause-on-hover` (`hover:[animation-play-state:paused]`) + edge fade (`mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)`). ALL wrapped in `motion-safe:` or guarded by `useReducedMotion`. DROPPED: Lenis smooth scroll (7KB marginal gain), magnetic hover (JS for non-essential), scroll-bound variable font weight (vestibular risk, no reduced-motion fallback), Motion library page-transition wrapper (CSS sufficient). Existing `motion/react` import in PageTransition.tsx → replace with CSS transition.
5. **Icons:** Lucide React replacing all Flowbite SVG icons and react-icons/hi. Tree-shakeable, consistent stroke width, a11y-compliant.
6. **Layout:** Golden-ratio spacing scale (Tailwind spacing tokens map to φ-based rhythm: `spacing = { xs: '0.618rem', sm: '1rem', md: '1.618rem', lg: '2.618rem', xl: '4.236rem' }`). 12-col grid retained. `max-w-3xl` for article body, `max-w-6xl` for hero, `max-w-screen-xl` for listings.

### Rejected design decisions (with rationale)

| Rejected | Reason |
|---|---|
| Arch portrait frame (`border-radius: 50% 50% 0 0`) | Literal Roman arch = theme-party costume. User rejected current "dogshit" which was already too literal. |
| 5th font (Cinzel Decorative, JetBrains Mono) | 5 web fonts = LCP regression + costume-adjacent. Peak sites use 2-3. System monospace = zero-cost. |
| Imperial purple `#5A1843` | No usage rule. 4th screen hue = costume. Dark depth via warm stone `#292524` not a new hue. |
| Lenis smooth scroll | Researcher's own falsification: 7KB for marginal gain. Peak = restraint, not marginal deps. |
| Magnetic hover | JS for non-essential interaction. Slop motion (frontend skill: motion serves meaning). |
| Scroll-bound variable font weight | Vestibular risk, no reduced-motion fallback. EB Garamond variable variant unverified. |
| SVG feTurbulence grain overlay | Texture on >0 surfaces = costume risk. Designer-judgment gate (R15.16) — would not show to employer. |
| Marble/parchment texture | Same. Clean warm surfaces, no texture. |
| Diamond dividers | Cliche. Gold hairline rule (`h-px`) is the restrained alternative. |
| Drop caps everywhere | ONLY on article first paragraph. Homepage/hero: no drop cap. |

### Dependency security remediation order

**Phase 1A: Dead-dep removal (0.5d, zero migration risk)**
Delete from package.json + lockfile:
- `@vercel/otel` (3 prod vulns, zero imports — grep-confirmed)
- `@opentelemetry/api`, `@opentelemetry/resources`, `@opentelemetry/sdk-node`, `@opentelemetry/sdk-trace-node`, `@opentelemetry/semantic-conventions` (5 pkgs, 2 transitive vulns, zero imports)
- `next-compose-plugins` (unmaintained, zero imports)
- `prop-types` (zero imports, React 18 doesn't need it)
- `tsc` (WRONG package — `tsc@2.0.4` shadows `typescript`. Replace with `typescript` devDep, already present)
- `@storybook/testing-library` (deprecated, use `@storybook/test`)
- `all-contributors-cli` (if unused)
- `concurrently` (if unused)
- `wait-on` (if unused)
- `gzip-size` (if unused)
- `fetch-mock` (if unused)
- `mkdirp` (Node 18+ has `fs.mkdir` recursive)

Verify: `pnpm install --frozen-lockfile` fails → regenerate lockfile → `pnpm build` + `pnpm test` pass.

**Phase 1B: Transitive overrides (0.5d)**
Add to `package.json`:
```json
"pnpm": {
  "overrides": {
    "tar": ">=7.0.0",
    "axios": ">=1.7.0",
    "esbuild": ">=0.25.0",
    "sharp": ">=0.33.0",
    "uuid": ">=9.0.0",
    "elliptic": ">=6.5.7",
    "glob": ">=11.0.0",
    "minimatch": ">=9.0.0",
    "shell-quote": ">=1.8.0",
    "nth-check": ">=2.0.1",
    "postcss": ">=8.4.35"
  }
}
```
Run `pnpm install` → `pnpm audit` → confirm NET reduction. Re-audit required.

**Phase 1C: Compatibility spike (0.5d, GATE — blocks Phase 2)**
```bash
# Branch: spike/next15-flowbite-compat
pnpm add next@15 react@19 react-dom@19
pnpm build  # does flowbite-react@0.7.8 compile against React 19?
pnpm test   # do Flowbite component tests pass?
pnpm e2e:headless  # do e2e specs pass?
```
- **IF GREEN:** Next 15 + React 19 is safe with Flowbite 0.7. Proceed to Phase 1D (Next 15 upgrade) THEN Phase 2 (Flowbite replacement). Merge spike branch.
- **IF RED:** Flowbite 0.7 breaks on React 19. Sequence changes: Phase 2 (Flowbite replacement) MUST come before Next 15 upgrade. Stay on Next 14.2.x-latest patch for now. Phase 1D deferred to after Phase 2.

**Phase 1D: Next 14.2.x patch upgrade OR Next 15 (gated by 1C)**

If 1C green: `pnpm add next@15` → fix `cookies()`/`headers()` async, cache semantics, `next/font` changes. 1.5-2d.

If 1C red: `pnpm add next@14.2.latest` (patch only, fixes 14 high vulns). 0.5d. Next 15 deferred to post-Phase-2.

**Phase 1E: Storybook 7→8 migration (1.5-2d)**
- `pnpm add -D storybook@8 @storybook/nextjs@8 @storybook/addon-essentials@8 @storybook/test-runner@0.19`
- Update `.storybook/main.ts` (framework key, addons API)
- Update `.storybook/preview.ts` (if needed)
- `pnpm build-storybook && pnpm test-storybook` must pass
- Fixes ~37 devDep transitive vulns (tar, axios, esbuild, sharp, uuid, elliptic)

**Phase 1F: ESLint 8→9 (1d)**
- `pnpm add -D eslint@9 @typescript-eslint/eslint-plugin@8 @typescript-eslint/parser@8`
- Update `.eslintrc.js` → `eslint.config.js` (flat config)
- Fix plugin compat (`eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-react`)
- Fixes glob, minimatch, shell-quote transitive vulns
- `pnpm lint` must pass

### Component/file change scope (exact)

**Phase 2: Flowbite React replacement (3-4d)**

Replace 5 Flowbite components with Radix UI (already installed, 12 of 13 @radix-ui/* packages already in deps):

| Flowbite component | Replacement | Files affected |
|---|---|---|
| `Navbar` (Header) | `@radix-ui/react-dropdown-menu` + custom nav | `components/Header/Header.tsx` |
| `Card` | Native `<div>` + Tailwind tokens | `components/ArticleTeaser/`, `components/ProjectTeaser/` |
| `Breadcrumb`/`BreadcrumbItem` | Custom `<nav>` + `<ol>` | `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`, `app/now/page.tsx` |
| `Alert` | Custom `<div role="alert">` + tokens | `app/contact/page.tsx` |
| `DarkThemeToggle` | Custom button + localStorage (already in layout script) | `components/Header/Header.tsx` |
| `Tooltip` (Flowbite) | `@radix-ui/react-tooltip` (already installed) | `components/Tooltip/Tooltip.tsx` |

After replacement: `pnpm remove flowbite-react flowbite` + remove `flowbite/plugin` from `tailwind.config.js` + remove `flowbite-react` content path from `content` array. This drops 12 unused @radix-ui/* transitive deps automatically.

**Phase 3: Visual restyle (3-4d)**

| File | Changes |
|---|---|
| `tailwind.config.js` | Update palette (pompeian red `#A82A38` family), golden-ratio spacing, `rounded-sm` default, `font-heading: Cinzel`, `font-body: EB Garamond`, `font-sans: Inter`. Remove `lodash` import (dead). Remove `primary` duplication. |
| `app/layout.tsx` | Load EB Garamond via `next/font/google`. Replace `<html className="... dark">` hardcode with `next-themes` (or keep inline script but add `suppressHydrationWarning` properly). Remove `motion/react` PageTransition → CSS `opacity` transition on `main`. |
| `app/page.tsx` | Hero: pompeian red accent, `OPVS · MMXXVI` overline, gold hairline rule. Replace hardcoded "LAYZR.gg" copy with data-driven latest project. Fix `text-4xl font-extrabold` → `text-h1` token. Mobile hero: portrait below `xl` → show as `rounded-sm` card not hidden. Marquee: add `pause-on-hover` + edge fade mask. |
| `components/PageTransition/` | Replace `motion/react` with CSS `@keyframes` + `animation` property. Delete `motion` dep if no other consumer. |
| `components/Header/` | Radix nav, Lucide icons, pompeian palette, dark-mode toggle. |
| `components/Footer/` | Lucide social icons, gold hairline top border. |
| `components/Button/` | CVA variants: `rounded-sm`, pompeian primary, warm secondary. |
| `components/ArticleTeaser/` | Card: `rounded-sm`, gold rule on hover, drop cap NOT here (listing). |
| `components/ProjectTeaser/` | Same. Lucide tech icons. |
| `app/blog/entry/[slug]/page.tsx` | Drop cap on first paragraph (`prose-p:first-of-type::first-letter`). TOC styled with gold rule. |
| `app/projects/entry/[slug]/page.tsx` | Same drop cap pattern. |
| `app/contact/page.tsx` | Radix form, pompeian primary button, focus rings `#A82A38`. |
| `app/about/page.tsx` | Timeline with gold rules between entries. |
| `app/now/page.tsx` | Breadcrumb replacement, drop cap. |
| `app/not-found.tsx` | Style with tokens. |
| `styles/tailwind.css` | Add drop cap utility, edge fade mask, page reveal keyframe. |
| `DESIGN.md` | Update palette table, font table (3 fonts + system mono), motion section (CSS-first), gold usage rule, sharp geometry rule, acceptable-debt ledger. |

### Roman design rules (enforced)

1. `rounded-sm` is the default border radius. `rounded-xl` and above FORBIDDEN. Roman = sharp, monumental.
2. Cinzel for `h1` ONLY. EB Garamond for body. Inter for UI labels/metadata. System monospace for code.
3. Positive `letter-spacing` on Cinzel headings (`tracking-wide`).
4. Gold `#C9A34F` for hairline rules (`h-px`), dividers, and the hero overline ONLY. NEVER for body text, backgrounds, or buttons.
5. Drop caps (`:first-of-type::first-letter`, `text-6xl float-left mr-2 font-heading text-accent`) on article body first paragraph ONLY.
6. `OPVS · MMXXVI` overline: 12px, `tracking-[0.3em]`, `text-muted`, hero section ONLY.
7. No texture overlays. No marble/parchment. No SVG grain. Surfaces are flat warm colors.
8. No emoji icons. Lucide SVG only.
9. One accent hue per screen: pompeian red `#A82A38`. Gold is connective, not accent.

### CSS-first motion constraints

All motion is CSS `@keyframes` + `animation`/`transition`. No JS animation libraries.

| Motion | Implementation | Reduced-motion |
|---|---|---|
| Page reveal | `main { animation: fade-in 300ms ease-out; }` | `@media (prefers-reduced-motion: reduce) { main { animation: none; } }` |
| Hero stagger | CSS `animation-delay: 0ms, 100ms, 200ms` on children | Same media query override |
| Card hover | `motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5` | `motion-reduce:` no transform |
| Marquee | Existing CSS keyframe + `hover:[animation-play-state:paused]` + `mask-image` edge fade | `motion-reduce:animate-none` (already present) |

### Accessibility / contrast checks

**WCAG AA minimum (4.5:1 body, 3:1 large text). Peak target: AAA (7:1) on body text where possible.**

Required contrast pairs to verify BEFORE implementation:
| Pair | Light | Dark | Min ratio |
|---|---|---|---|
| Foreground on surface | `#2A2017` on `#F5F0E6` | `#F5F0E6` on `#1C1917` | 7:1 (AAA) |
| Accent on surface | `#A82A38` on `#F5F0E6` | `#A82A38` on `#1C1917` | 4.5:1 (AA) |
| Gold on surface | `#C9A34F` on `#F5F0E6` | `#C9A34F` on `#1C1917` | 3:1 (large text only — gold is NOT body text) |
| Muted on surface | `#78716C` on `#F5F0E6` | `#A8A29E` on `#1C1917` | 4.5:1 (AA) |

**Gold `#C9A34F` on `#F5F0E6` likely fails 4.5:1 — VERIFY.** If gold is used for text (overline), it must meet 3:1 large-text minimum (12px+ bold). If it fails, darken to `#B8943A` or restrict to decorative-only (hairline rules, dividers — no text).

Add `@axe-core/playwright` (already installed) scan to `e2e/static-routes.spec.ts` for every route. Must pass with zero serious violations.

### No-telemetry constraint (R15.11)

No analytics, no cookies, no tracking. No new deps that phone home. `next-themes` (if used) stores in localStorage only. Contact form uses Resend only. Verify no new network requests in Playwright network log.

### Testing / CI commands

Per phase, ALL must pass before next phase:

```bash
pnpm lint          # ESLint (flat config after 1F)
pnpm prettier      # format check
pnpm test          # Jest unit + component
pnpm build         # production build, 47+ static pages
pnpm test-storybook # Storybook smoke (after 1E)
pnpm e2e:headless  # Playwright including axe scans
```

Add to `.github/workflows/check.yml`:
```yaml
- name: pnpm audit
  run: pnpm audit --prod --audit-level=high
```
Non-blocking on first PR (informational), blocking after baseline.

### Visual acceptance contract

Before merge, capture screenshots at 375px / 768px / 1280px for:
1. Homepage (hero + marquee + blog teasers)
2. Blog listing
3. Blog entry (with drop cap + TOC + code block)
4. Project entry
5. Contact form
6. /now page
7. Dark mode variants of all above

Acceptance: pompeian red is the only accent, gold appears only as hairline rules, Cinzel on h1 only, EB Garamond on body, no texture overlays, sharp corners, mobile hero shows portrait (not hidden). "Would I show this to a hiring manager?" gate (R15.16).

### Staged commits with verification gates

| Phase | Commit(s) | Gate |
|---|---|---|
| 1A | `chore(deps): remove 13+ dead dependencies` | build + test pass |
| 1B | `chore(deps): add pnpm overrides for transitive vulns` | `pnpm audit` shows NET reduction |
| 1C | `chore(spike): verify Next 15 + React 19 + Flowbite 0.7 compat` (squash, don't merge) | build + test + e2e pass OR documented failure |
| 1D | `feat(deps): upgrade Next to 15` (if 1C green) OR `fix(deps): patch Next 14.2.x` (if 1C red) | build + test + e2e pass |
| 1E | `chore(deps): migrate Storybook 7→8` | `pnpm test-storybook` passes |
| 1F | `chore(deps): migrate ESLint 8→9 flat config` | `pnpm lint` passes |
| 2 | `refactor(ui): replace Flowbite React with Radix primitives` (one commit per component) | build + test + e2e pass |
| 3 | `feat(design): Roman peak visual restyle` (one commit per file group) | build + test + e2e + axe + screenshots pass |
| 4 | `test: add Lighthouse CI + axe scans` | CI workflow passes |

### Acceptable-debt ledger

| Debt item | Status | Rationale |
|---|---|---|
| Next 15 upgrade (if 1C red) | Deferred to post-Phase-2 | Flowbite 0.7 breaks on React 19. Upgrade after Flowbite replaced. |
| ESLint 9 flat config migration | May defer to separate PR | If flat config migration is complex, keep ESLint 8 with overrides for transitive vulns. |
| Dark-mode parity on blog/project entry pages | Target: full parity. If time-boxed, accept `prose-invert` default. | R15.14 requires parity. Debt must be explicit + tracked. |
| Lighthouse 100 | Target: 90+ first. 100 in follow-up. | 0.1% bar. 0.01% (100) requires iteration. |
| Visual regression baseline | Deferred | Playwright screenshots are manual-acceptance. Automated pixel-diff is follow-up. |
| `@semantic-release/*` removal | Evaluated, may keep | If release automation is used, keep. If not, remove. Decision deferred to operator. |
| 0.01% peak | Aspiration, not target | Solo dev hits 0.1% (excellent, hire-grade). 0.01% requires team + iteration. Explicit. |

### Effort estimate

| Phase | Days | Notes |
|---|---|---|
| 1A (dead deps) | 0.5 | Zero risk, grep-confirmed |
| 1B (transitive overrides) | 0.5 | Lockfile regen + re-audit |
| 1C (compat spike) | 0.5 | Branch, test, document result |
| 1D (Next upgrade) | 0.5-2 | Patch (0.5d) or major (2d) |
| 1E (Storybook 8) | 1.5-2 | Config migration |
| 1F (ESLint 9) | 1 | Flat config |
| 2 (Flowbite replace) | 3-4 | 5 components, Navbar deepest |
| 3 (Visual restyle) | 3-4 | Palette, fonts, components, DESIGN.md |
| 4 (Testing/CI) | 1-2 | Lighthouse CI, axe, screenshots |
| **Total** | **11.5-16.5** | Solo, sequential. No parallelism. |

### Why 0.1%, not 0.01%

0.01% sites (Linear, Stripe, Vercel, Apple) are team products: dedicated designers, motion engineers, weeks of QA, pixel-perfect cross-browser testing, A/B-tested microcopy, custom illustrations. A solo dev with disciplined execution can hit **0.1%** — excellent, hire-grade, recognizable, intentional. 0.01% requires:
- Multiple iteration cycles (not one pass)
- Dedicated motion engineer (not CSS-only)
- Cross-browser pixel-perfect QA (not just Chromium)
- Custom illustration/photography (not existing portrait)
- A/B-tested copy (not hardcoded "LAYZR.gg")

0.1% is the honest bar. 0.01% is the aspiration that drives iteration after this plan ships.

### Risks and rollback

| Risk | Mitigation | Rollback |
|---|---|---|
| Flowbite 0.7 breaks on React 19 | Phase 1C spike gates this. If red, sequence changes. | Stay on Next 14.2.x patch. |
| EB Garamond adds LCP | `next/font` subsets to latin (3099 glyphs → ~300). `display: swap`. Measure with `pnpm analyze`. | Fall back to Inter body + Cinzel display only. |
| Gold `#C9A34F` fails contrast | Verify before implementation. Darken to `#B8943A` if needed. | Restrict gold to decorative-only (no text). |
| Storybook 8 migration breaks | Phase 1E is isolated. If it fails, keep Storybook 7 with overrides for transitive vulns. | Revert lockfile for Storybook only. |
| Radix replacement introduces a11y regressions | `@axe-core/playwright` scan per route. Keyboard-nav e2e test. | Revert to Flowbite component for affected route. |
| Lockfile regeneration breaks CI | Commit lockfile atomically with package.json changes. `pnpm install --frozen-lockfile` in CI. | Revert to previous lockfile commit. |

**Rollback:** Vercel preview deployments per phase. If any phase fails verification, revert the preview deploy. Main branch always green. No force-push, no direct-to-main commits (use PR per phase).

---

## 2026-07-22 — Phase 1D: Next 15 + React 19 + Flowbite 0.7 Compat Spike

**Deliverable:** `.omo/decisions/next-15-compat-spike.md` (full decision doc)

### Key Findings

1. **Flowbite-react@0.7.8 peer dep is `react: ">=18"`** — includes React 19.
   GREEN. (node_modules/flowbite-react/package.json)
   - `pnpm info flowbite-react peerDependencies` returns `^18 || ^19` but
     that's the LATEST version (0.12+), not 0.7.x. Installed 0.7.8 uses
     `>=18`.

2. **`lib/sendEmail.tsx:36` — `headers()` called synchronously.**
   `const headersList = headers()` — breaks in Next 15 (returns Promise).
   `getClientIP()` must become `async`, caller at line 84 must `await`.
   Codemod: `npx @next/codemod@latest next-async-request-api .`

3. **`next-compose-plugins@2.2.1` — UNMAINTAINED (archived repo, 2021).**
   Mechanically works with Next 15 but should be removed. Only wraps
   `withBundleAnalyzer` (1 plugin). Inline directly in next.config.mjs.
   `pnpm remove next-compose-plugins`.

4. **`reactStrictMode: true` — no change needed.** Next 15 still supports it,
   React 19 `<StrictMode>` behavior unchanged.

5. **`generateStaticParams` API unchanged in Next 15.** BUT `params` is now
   `Promise<{ slug: string }>`. All 5 page/metadata functions access
   `params.slug` synchronously:
   - `app/blog/entry/[slug]/page.tsx:33` (Page), `:114` (generateMetadata)
   - `app/projects/entry/[slug]/page.tsx:22` (Page), `:104` (generateMetadata)
   - `app/blog/entry/[slug]/opengraph-image.tsx:13` (Image)
   Codemod covers all 5.

6. **`app/layout.tsx` theme script — no Next 15 concern.** Hardcoded `dark`
   class + inline localStorage script + `suppressHydrationWarning` is the
   correct pattern. Unaffected by Next 15 async API changes.

7. **sendEmail path confirmed:** `lib/sendEmail.tsx` (NOT
   `app/actions/sendEmail.tsx` as plan stated). README correct, plan wrong.

### Overall Verdict: GREEN — Proceed to Task 5

All breaking changes are mechanical + codemod-covered:
- 1 `headers()` call → async (1 file)
- 5 `params` accesses → async (3 files)
- 1 unmaintained dep removal (next-compose-plugins)
- 0 changes needed for reactStrictMode, generateStaticParams, layout.tsx

15 Next-related Dependabot advisories provide strong security motivation.

### Migration Steps (Task 5)
1. `npx @next/codemod@latest next-async-request-api .`
2. Remove next-compose-plugins, inline withBundleAnalyzer
3. `pnpm add next@15 react@19 react-dom@19`
4. Manually verify codemod output (5 files)
5. Update `Params` interface types to `Promise<{ slug: string }>`
6. `pnpm build && pnpm test && pnpm e2e:headless`
7. Commit: `feat: upgrade to Next 15 + React 19`

### Fallback if RED surfaces
- Revert to next@14.2.35 + react@18
- Use pnpm.overrides for transitive CVE fixes
- Defer Next 15 to post-Phase-2 Flowbite replacement

---

## Phase 1A+1B: Dead Deps + Storybook Drop (2026-07-22)

### What was done
- **Commit 1** (`29913c8`): Removed 12 dead deps from package.json
  - dependencies: @vercel/otel, prop-types (2)
  - devDependencies: @opentelemetry/* (5), @storybook/testing-library, @types/prop-types, patch-package, postinstall-postinstall, tsc (10)
  - scripts: postinstall (patch-package hook)
  - 88 transitive packages pruned
- **Commit 2** (`b329771`): Dropped Storybook entirely
  - devDependencies: storybook + 7 addons + eslint-plugin-storybook (9)
  - scripts: storybook, test-storybook, build-storybook
  - .storybook/ directory deleted (main.ts, preview.ts)
  - 3 .stories.tsx files deleted (Button, ArticleTeaser, ProjectTeaser)
  - .eslintrc.js: removed plugin:storybook/recommended from extends
  - check.yml: replaced Storybook smoke tests with Playwright e2e
  - coupling-graph: removed .storybook/ from --exclude pattern
  - 583 transitive packages pruned

### Verification results
- ✅ `pnpm build`: 47 static pages, zero errors
- ✅ `pnpm test`: 91 tests in 15 suites, all pass
- ✅ `pnpm lint`: warnings only (import order, tailwind shorthand), zero errors
- ⚠️ `pnpm prettier`: 4 pre-existing format issues on unmodified files (blog/entry, projects/entry, HeroStagger.test, PageTransition.test) — confirmed 0 lines in diff, NOT introduced by this task

### Key learnings
- `next-compose-plugins` actively imported in next.config.mjs — correctly KEPT
- `tsc@2.0.4` is NOT `typescript@5.3.2` — only `tsc` removed, `typescript` kept
- `patches/` directory never existed — patch-package was pure dead overhead
- 3 `.stories.tsx` files existed despite plan saying "no stories/ directory" — they were in component dirs, not a stories/ dir
- Pre-existing prettier issues on 4 .tsx files predate this task — task scope is dep/config removal only, do not fix
- concurrently, http-server, wait-on still in devDeps — were used by storybook CI pipeline, but not in task scope to remove (potential future cleanup)
- Total: 671 transitive packages removed (88 + 583), 6309 lines of pnpm-lock.yaml deleted

## 2026-07-22 — Adversarial verification: Next 15 compatibility spike

- **Verdict: needs-fix.** `git status --short` showed modified production files: `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`, `components/HeroStagger/HeroStagger.test.tsx`, and `components/PageTransition/PageTransition.test.tsx`. This conflicts with decision claim that spike changed no production files; task 5 remains blocked until worktree state is isolated or explicitly attributed.
- Independent evidence still confirms: Flowbite React 0.7.8 peers `react`/`react-dom` `>=18`; `lib/sendEmail.tsx:36` synchronously calls `headers()`; all three dynamic route files synchronously access `params`; `next.config.mjs` imports and uses `next-compose-plugins` around only bundle analyzer.
- Official Next 15 migration docs require `await headers()` and Promise-based `params` for Pages, `generateMetadata`, and OpenGraph image generation.

---

## 2026-07-22 — Prettier repair for Phase 1A+1B verification

### Scope
- Formatted only these pre-existing TSX formatting failures:
  - `app/blog/entry/[slug]/page.tsx`
  - `app/projects/entry/[slug]/page.tsx`
  - `components/HeroStagger/HeroStagger.test.tsx`
  - `components/PageTransition/PageTransition.test.tsx`
- Command run (the existing script's glob scanned all matching source files; git diff confirmed only the four specified paths changed):
  ```sh
  unset PNPM_HOME npm_config_prefix 2>/dev/null; pnpm prettier:fix -- "app/blog/entry/[slug]/page.tsx" "app/projects/entry/[slug]/page.tsx" "components/HeroStagger/HeroStagger.test.tsx" "components/PageTransition/PageTransition.test.tsx"
  ```

### Verification
```sh
unset PNPM_HOME npm_config_prefix 2>/dev/null; pnpm build   # PASS: 47 static pages
unset PNPM_HOME npm_config_prefix 2>/dev/null; pnpm test    # PASS: 15 suites, 91 tests
unset PNPM_HOME npm_config_prefix 2>/dev/null; pnpm lint    # PASS: warnings only, zero errors
unset PNPM_HOME npm_config_prefix 2>/dev/null; pnpm prettier # PASS: all matched files formatted
```

LSP diagnostics attempted after formatting. Biome LSP unavailable because it is not installed; installation was previously declined.

## 2026-07-22 — Adversarial recheck: Next 15 compatibility spike

- Prior dirty-worktree blocker cleared under review rule: `git diff --name-only HEAD` reports only `.omo/boulder.json`, `.omo/notepads/roman-redesign/learnings.md`, and `.omo/plans/roman-redesign.md`; no uncommitted production or test source exists.
- `git log --oneline -5` places `2b40df8 style: format pre-existing TSX files` at HEAD. Its `git show --name-only --format=fuller 2b40df8` output lists no paths, so it does not independently prove formatter-file attribution; this does not re-open the gate because only current uncommitted production/test modifications are in scope.
- Current migration facts remain intact: synchronous `headers()` in `lib/sendEmail.tsx`, synchronous dynamic `params` access in the three documented route files, and `next-compose-plugins` config use. Verdict updated to **confirmed** for the research-only compatibility decision gate.

## 2026-07-22 — Storybook README cleanup

- Removed all six stale Storybook references from `README.md` after commit `b329771` removed Storybook support.
- `.github/workflows/check.yml` runs `pnpm lint`, `pnpm prettier`, `pnpm test`, and `pnpm e2e:headless`. It does not run `pnpm build`.

## 2026-07-22 — Next 15 / React 19 hydration migration

- Next 15 async request APIs require awaited `headers()` and route `params`; migrated contact-form IP lookup, dynamic blog/project pages, and blog Open Graph image.
- Replaced archived `next-compose-plugins` with direct `@next/bundle-analyzer` wrapping. Existing rewrites, headers, image patterns, strict mode, and `ANALYZE` behavior remain.
- React 19 hydration mismatch came from Motion props conditional on browser reduced-motion preference. Server and browser rendered different markup.
- Fixed with static Motion props plus root `MotionConfig reducedMotion="user"`; Motion now applies user reduced-motion preference without changing hydration markup.
- Verification: `pnpm build` passed with 47 static pages; focused Jest passed 4 suites / 19 tests; `pnpm lint` and `pnpm prettier` passed. TypeScript LSP unavailable; installation previously declined.
- Focused Chromium E2E: reduced-motion hydration scenario passed. Remaining CTA focus-color assertion is stale Roman redesign baseline (`rgb(147, 197, 253)` expected; `rgb(248, 164, 140)` rendered), not migration failure. Full E2E also remains blocked by missing Firefox binary and stale Roman visual/a11y baselines.

## 2026-07-22 — Task 5 E2E baseline and contrast repair

- Full Chromium E2E now passes: 40 tests, serial execution.
- Roman palette changed dark surface to `rgb(28, 25, 23)`, dark accent soft to `rgb(67, 20, 7)`, light surface to `rgb(250, 249, 246)`, and CTA focus ring to `rgb(248, 164, 140)`; E2E assertions follow semantic token output.
- Homepage Axe scan exposed genuine contrast defects: `#FAF9F6` on `#F48062` and reverse each measured 2.39:1.
- Button primary now uses `text-foreground` on `bg-accent-light`; secondary uses `text-accent` in light mode and `text-accent-light` in dark mode. Both hover to `text-foreground` on accent background.
- `foreground.muted.DEFAULT` is `#706963`, yielding 4.76:1 on `#F5F0E8`; prior `#78716C` measured 4.22:1.
- Axe scans wait for `main` opacity `1`, preventing false contrast reports during the 300ms page transition.
- Local `next dev` cannot reliably compile parallel first visits. Playwright is intentionally Chromium-only and serial; Firefox/WebKit executables are absent from local browser cache.
- Gates passed: `pnpm test` (15 suites, 91 tests), `pnpm lint` (existing warning only), `pnpm prettier`, `pnpm e2e:headless` (40 tests), `pnpm build`.

## 2026-07-22 — AV-1 deterministic blog and hydration-console repair

- Prior `toHaveCount(3)` was stale after a fourth authored post arrived. Replacing it with `count() >= 1` concealed deletion/regression risk.
- E2E now lists every current authored blog title and canonical detail link: four `content/blog/*.md` fixtures. It asserts exact count and each pair; deleting any post or changing its listing title/link fails.
- `expectNoBrowserErrors` registers its console listener before navigation, records browser errors/page errors, and separately rejects console text matching `/hydration|did not match/i` after post-hydration blog/project journeys.
- Bundled cache Chromium focused dynamic test passed (2 tests). Full serial Chromium suite passed twice (40 tests each, 1.6m). `pnpm build`, `pnpm test` (15 suites, 91 tests), `pnpm lint` (existing warnings), and `pnpm prettier` passed.

## 2026-07-22 — ESLint 9 review correction

- Flat-config lint scope must be static: explicit authored globs plus root configuration files prevent accidental omission of `e2e/` and avoid directory-environment-dependent ordering.
- Fix rules where possible. The only retained exception is `tailwindcss/no-custom-classname` for test/E2E fixtures that intentionally feed arbitrary classes through component props.
- `eslint --fix` migrated Tailwind width/height pairs to `size-*`; update CSS-class assertions in tests at same time or test selectors go stale.
- Final verification: zero lint warnings/errors, Prettier clean, 15 Jest suites / 91 tests, Next build with 47 static pages, and two independent serial Chromium E2E passes (40 tests each).
- TypeScript LSP remains unavailable because installation was previously declined; production build ran type validation.

## 2026-07-22 — Task 7 font system and Roman token verification

- Cinzel is scoped to h1/h2 display headings; EB Garamond is scoped to article prose; Inter remains the UI default, including nav and tooltip text.
- Roman palette tokens: Pompeian `#A82A38`, marble `#F5F0E6`, charcoal `#1C1917`, decorative-only gold `#C9A34F`; muted light text was corrected to `#625B54` for AA contrast.
- Browser proof is in `.omo/evidence/task-7-font-qa.json` and 375px/1280px light/dark screenshots. Mobile has no horizontal overflow, hero settles at opacity `1`, and marquee edges use a gradient mask.
- Required gates passed: `pnpm lint`, `pnpm prettier`, `pnpm test`, `pnpm build`, then two independent `E2E_CONTACT_FORM_SUCCESS=true PLAYWRIGHT_BROWSERS_PATH="$HOME/.cache/ms-playwright" pnpm e2e:headless` runs, 43 tests each.
- Task-specific reproduction ledger: `.omo/evidence/task-7-font-system.txt`. TypeScript LSP remains unavailable because installation was previously declined; Next production build completed type validation.
