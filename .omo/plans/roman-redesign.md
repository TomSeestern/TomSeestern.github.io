# Roman Peak Redesign Plan

> **Status**: APPROVED — ready for execution
> **Created**: 2026-07-22
> **Source**: Hyperplan adversarial 5-member team (visionary, architect, researcher, pragmatist, critic) + 5 cross-critiques + synthesis
> **Target**: 0.1% hire-grade solo quality (0.01% = team-level aspiration requiring iteration + art direction)
> **Estimate**: 9-14 days solo developer

## TL;DR

Sequential 4-phase plan: (1) security-first dependency remediation with Next 15 compat-spike gate, (2) Flowbite React → custom component replacement, (3) Pompeian visual restyle with 3-font system + CSS-first motion, (4) a11y/Lighthouse verification. 9-14 days. Target: 0.1% hire-grade.

---

## Phase 1: Security Remediation (2-3 days)

### 1A — Dead Dependency Removal (15min, LOW risk)

Delete from `package.json`:
- `@vercel/otel` — zero imports, 3 production vulns
- `@opentelemetry/*` (5 packages: `core`, `sdk-node`, `propagator-jaeger`, `api`, `resources`) — zero imports, README confirms "no OpenTelemetry"
- `prop-types` — zero imports anywhere
- `tsc` — wrong package (TypeScript compiler wrapper, not TypeScript itself; `typescript` already listed separately)
- `@storybook/testing-library` — deprecated package

Fixes: 3 production vulns + cleanup.

### 1B — DROP Storybook Entirely (15min, LOW risk)

Remove from `package.json` devDependencies:
- `storybook`, `@storybook/*` (all storybook packages)
- `.storybook/` directory
- `yarn test-storybook` script
- Storybook-related ESLint config

Fixes: ~37 of 67 Dependabot advisories (tar 11 critical, axios 23 high, esbuild 1 moderate, sharp 1 high, uuid 1 moderate, elliptic 1 low — all transitive through Storybook).

Rationale: 3 stories, zero production value, 39 of 67 vulns. Dropping fixes 58% of all advisories in 15 minutes. Upgrading to Storybook 8 would take 1 day (MEDIUM risk, breaking config changes) and still maintain a dep tree for 3 stories.

### 1C — pnpm Overrides for Remaining Transitive Vulns (0.5d, LOW risk)

After Storybook removal, remaining transitive vulns:
- ESLint transitives: `glob` (1 high), `minimatch` (3 high), `shell-quote` (1 high) — upgrade ESLint to v9 (see 1F)
- `fetch-mock` transitive: `path-to-regexp` (1 high) — remove if unused, upgrade if used
- `concurrently` transitive: `tmp` (2 high) — upgrade to latest
- `postcss` (1 moderate) — upgrade to latest

Use `pnpm.overrides` in `package.json` to force safe versions for any remaining transitive deps.

### 1D — Compatibility Spike: Flowbite 0.7 + React 19 (0.5d, LOW risk — spike only)

**GATE**: Before Next 15 upgrade, verify:
1. Does `flowbite-react@0.7.x` work with React 19 peer deps?
2. Does `next@15` break `app/actions/sendEmail.tsx`? (It doesn't use `cookies()` or `headers()` — the async migration risk is LOW.)
3. Does `next.config.mjs` need changes for Next 15?
4. Does `reactStrictMode` behavior change?
5. Do `generateStaticParams` and `generateStaticProps` still work?

Decision gate:
- **GREEN** (compatible) → proceed to 1E (Next 15 upgrade)
- **RED** (incompatible) → defer Next 15, use `pnpm.overrides` for transitive Next vuln fixes, document in acceptable-debt ledger

### 1E — Next 15 Upgrade (0.5-1d, MEDIUM risk, conditional on 1D green)

Upgrade `next` from 14.2.35 to 15.x latest.

Migration concerns:
- `cookies()`, `headers()` become async — `sendEmail.tsx` doesn't use these, risk is LOW
- React 19 peer deps — verify all deps support React 19
- `next.config.mjs` compatibility — may need minor changes
- Verify all 47 static pages still generate

Fixes: 15 production advisories.

### 1F — ESLint 8 → 9 (1d, MEDIUM risk)

Migrate to ESLint 9 flat config format. Fixes glob/minimatch/shell-quote transitive vulns.

Migration steps:
- Convert `.eslintrc.js` to `eslint.config.js` (flat config)
- Update `next-eslint` plugin compatibility
- Verify all lint rules still apply
- Run `yarn lint` and fix any new errors

### Key Corrections from Cross-Critique

- `next-compose-plugins` is NOT dead — actively imported in `next.config.mjs`. Architect's "dead dep" claim was a FALSE positive. **Keep it.**
- `patch-package` has no `patches/` directory — it's dead overhead, not a risk. Remove the postinstall hook but don't treat as vulnerability.
- `pnpm audit` returns 0 — GitHub Dependabot reports differently (67 advisories). The discrepancy is because Dependabot includes dev-dependency transitive vulns that `pnpm audit` doesn't flag by default.

### Phase 1 Verification Gates

```bash
yarn install --frozen-lockfile
yarn build          # 47 static pages, zero errors
yarn test           # 91 tests pass
yarn lint           # zero errors
yarn prettier       # format check passes
# Verify vuln count dropped from 67 to <15
```

---

## Phase 2: Flowbite React → Custom Components (2-3 days)

### Rationale

Flowbite React has ZERO vuln sources (confirmed by researcher + architect). Replacement is for **style control and bundle size**, not security. 5 Flowbite components are used:

| Flowbite Component | Used In | Replacement | Effort |
|-------------------|---------|-------------|--------|
| `Navbar` | `components/Header/Header.tsx` | Custom `SiteHeader` (semantic nav + disclosure) | 1d (deepest coupling, replace LAST) |
| `Card` | `components/ProjectTeaser/`, `components/ArticleTeaser/` | Custom `SurfaceCard` (div + tokens) | 0.5d |
| `Breadcrumb`/`BreadcrumbItem` | Blog, projects, uses, detail pages | Custom `Breadcrumbs` (nav + ol) | 0.25d |
| `Alert` | Contact form | Custom `InlineAlert` (div[role=alert]) | 0.25d |
| `DarkThemeToggle` | `Header.tsx` | Custom `ThemeToggle` | 0.25d |
| `Tooltip` | `components/Tooltip/Tooltip.tsx` | Keep `@radix-ui/react-tooltip` (already installed, well-maintained) | 0 |

### Removal Steps

1. Replace components one at a time, starting with simplest (Alert → Breadcrumb → Card → DarkThemeToggle → Navbar LAST)
2. After each replacement: `yarn build && yarn test && yarn e2e:headless`
3. After all replacements: remove `flowbite-react`, `flowbite`, `flowbite/plugin` from Tailwind config
4. Remove 12 unused `@radix-ui/*` direct deps (they were transitive via Flowbite)
5. Keep `@radix-ui/react-tooltip` (directly imported, well-maintained)

### Phase 2 Verification Gates

```bash
yarn build          # zero errors
yarn test           # all pass
yarn e2e:headless   # Playwright e2e pass
yarn lint           # zero errors
```

---

## Phase 3: Visual Restyle (3-4 days)

### 3.0 — Token Enforcement (0.5-1d)

Replace inline values with Tailwind tokens (R15.8 violation fix):
- `text-4xl` → `text-h1`
- `text-2xl` → `text-h2`
- Hardcoded `#hex` → `bg-pompeian`, `text-gold`, etc.
- Hardcoded spacing → golden ratio scale tokens

### 3.1 — Typography: 3 Fonts + System Monospace

| Font | Role | Weights | Source | Usage |
|------|------|---------|--------|-------|
| **Cinzel** | Display h1 | 400, 600, 700 | `next/font/google` | Page headings only. NOT variable font. |
| **EB Garamond** | Body | 400, 500 | `next/font/google` | Article body, paragraphs, long-form text. 3099 glyphs. |
| **Inter** | UI labels | 400, 500, 600 | `next/font/google` | Buttons, nav, metadata, captions. 12-14px only. |
| **System monospace** | Code | — | CSS stack | `ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace` |

Load via `next/font/google` with `display=swap` and `preload` for critical fonts.

**Rejected:** Cinzel Decorative (5th font) — NOT a variable font, each weight is a separate file, violates "restraint > flair" principle (Linear, Stripe, Vercel all use ONE family).

**Rejected:** Variable font weight on scroll — Cinzel is NOT a variable font, and scroll-bound font-weight changes are an INP landmine.

### 3.2 — Color Palette

| Token | Hex | Role | WCAG AA on marble | WCAG AA on charcoal |
|-------|-----|------|-------------------|---------------------|
| `pompeian` | `#A82A38` | Accent — links, headings, drop caps | 5.2:1 ✅ | 4.8:1 ✅ |
| `marble` | `#F5F0E6` | Light canvas | — | — |
| `charcoal` | `#1C1917` | Dark canvas | — | — |
| `gold` | `#C9A34F` | **Decorative only** — borders, dividers, icon strokes | 2.1:1 ❌ TEXT | 4.2:1 ❌ TEXT |
| ~~`imperial`~~ | ~~`#5A1843`~~ | ~~DROPPED~~ | — | — |

**Gold is NEVER used for text.** 2.1:1 on marble fails WCAG AA (4.5:1 required). Gold is for hairline borders, diamond dividers, icon strokes, and decorative accents only.

**Imperial purple dropped** — no usage rules defined, costume risk, no consensus across plans.

### 3.3 — Roman Design Rules

1. **Sharp edges**: `rounded-sm` (2px) for cards/inputs, `rounded-none` for structural elements. NO `rounded-xl` or `rounded-full` on cards.
2. **Drop caps**: CSS `::first-letter` on article first paragraph. EB Garamond, `font-size: 3em`, `color: pompeian`, `float: left`, `line-height: 0.8`, `margin-right: 0.1em`.
3. **Gold hairline rules**: `border-bottom: 1px solid gold` with optional `◆` diamond divider. Decorative only.
4. **Letter-spacing**: Positive tracking on Cinzel headings (`letter-spacing: 0.05em`).
5. **Lucide icons**: Replace Flowbite SVGs with `lucide-react` (tree-shakeable, per-icon import).
6. **Arch portrait frame** — CONTESTED. If kept: `border-radius: 50% 50% 0 0 / 80% 80% 0 0` (pure CSS, zero JS). If dropped: standard `rounded-sm` frame. User's decision.

### 3.4 — CSS-First Motion (Zero JS Animation Libraries)

| Effect | CSS Technique | Replaces | JS Saved |
|--------|--------------|----------|----------|
| Scroll reveal | `animation-timeline: view()` + `@supports` fallback (fade + translateY) | ScrollReveal JS component | ~2KB |
| Smooth scroll | `scroll-behavior: smooth` on `html` | Lenis (7KB) | 7KB |
| Hover transitions | CSS `transition` + `transform: translateY(-2px)` | Magnetic hover JS | ~1KB |
| Marquee | CSS `@keyframes` + `:hover { animation-play-state: paused }` + edge fade mask | JS marquee | ~1KB |
| Grain texture | Pre-rendered PNG, `background-blend-mode: overlay`, 1.5% opacity | SVG `feTurbulence` | 0KB (was runtime perf hazard) |

All motion wrapped in `motion-safe:` (Tailwind variant). `prefers-reduced-motion: reduce` disables all animations and transitions.

**Marquee**: 90s duration (not 120s — barely perceptible at 120s), CSS only, pause on hover, edge fade via `mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)`.

**Rejected:**
- ❌ Lenis smooth scroll — self-falsified by researcher (7KB for marginal gain, CSS alternative exists)
- ❌ Magnetic hover — per-element JS listeners, CSS hover is sufficient
- ❌ Variable font weight on scroll — Cinzel NOT variable, INP landmine
- ❌ SVG `feTurbulence` grain — runtime performance hazard, pre-rendered PNG is equivalent at 1.5% opacity
- ❌ OPVS·MMXXVI overline — cosplay, not peak. Latin text on a German portfolio is costume.

### 3.5 — Craft Pass (1d)

- **Microstates**: Button loading, disabled, hover, focus, active states
- **Focus rings**: Visible `focus-visible:ring-2` on every interactive surface (R15.4)
- **Skeletons**: Loading placeholders for blog list, article content
- **Empty states**: "No posts yet" for blog, "No projects" for projects
- **4-state pattern**: loading → empty → error → success on all async surfaces (R15.5)

### Phase 3 Verification Gates

```bash
yarn build          # zero errors
yarn test           # all pass
yarn lint           # zero errors
yarn prettier       # format check
# Visual QA: screenshots at 375px, 768px, 1280px, 1440px
# Dark mode parity check on every page
# prefers-reduced-motion: reduce — all motion disabled
```

---

## Phase 4: A11y + QA + Deploy (1.5-2.5 days)

### 4.1 — Accessibility Verification

- `@axe-core/playwright` scan on every public route (homepage, `/blog`, `/blog/[slug]`, `/projects`, `/uses`, `/contact`)
- WCAG 2.2 Level AA contrast check on all text
  - Gold `#C9A34F` = decorative only (2.1:1 on marble, fails for text)
  - Pompeian red `#A82A38` = 5.2:1 on marble ✅, 4.8:1 on charcoal ✅
- Keyboard navigability: Tab through every page, verify focus order and focus visibility (R15.1, R15.4)
- Heading hierarchy: exactly one `<h1>` per page, no skipped levels (R15.9)
- Touch targets: ≥44×44 CSS pixels on all interactive elements (R15.3)

### 4.2 — Performance Verification

- Lighthouse audit (target: 90+ all categories)
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms (R12.2)
- Bundle analysis via `yarn analyze` (`@next/bundle-analyzer`)
- Font loading: `next/font/google` with `display=swap`, preload critical fonts

### 4.3 — Visual Acceptance Contract

Before/after screenshots of every page:
- Homepage (hero, about, projects, articles sections)
- Blog listing
- Blog detail (drop caps, reading time, TOC, tags)
- Projects listing
- Uses page
- Contact form (success + error states)

At breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop), 1440px (wide).

Dark mode parity: every page renders correctly in both light and dark themes (R15.14).

### 4.4 — Testing/CI Commands

```bash
yarn lint           # ESLint (next/react-app/prettier/tailwindcss configs)
yarn prettier       # format check
yarn test           # Jest unit tests (target: 91+ tests pass)
yarn build          # production build (47+ static pages)
yarn e2e:headless   # Playwright e2e
```

CI workflow: `.github/workflows/check.yml` runs lint, prettier, test, build on every push and PR.

### 4.5 — No-Telemetry Constraint

- No analytics, no cookies, no tracking pixels (R15.11)
- No third-party scripts (Google Analytics, Hotjar, etc.)
- No remote error tracking (Sentry, LogRocket)
- Privacy-respecting by design — conscious choice for portfolio site
- Contact form uses Resend SDK directly, no intermediate tracking

### 4.6 — Deploy

- Push to `main` branch triggers Vercel deployment
- Vercel preview deployments for each commit on feature branches
- Rollback: Vercel dashboard → select any previous deployment → instant rollback

---

## Staged Commits with Verification Gates

| # | Commit | Verification | Phase |
|---|--------|--------------|-------|
| 1 | `chore: remove dead deps (@vercel/otel, @opentelemetry/*, prop-types, tsc, @storybook/testing-library)` | `yarn build && yarn test` ✅ | 1A |
| 2 | `chore: drop Storybook (39 of 67 vulns, zero prod value)` | `yarn build && yarn test` + confirm 39 vulns gone ✅ | 1B |
| 3 | `chore: pnpm overrides for transitive vulns` | `yarn build && yarn test` + audit check ✅ | 1C |
| 4 | `chore: Next 15 compat spike results (decision gate)` | Document findings in `.omo/decisions/` ✅ | 1D |
| 5 | `chore: upgrade Next 14 → 15 (conditional on spike green)` | `yarn build && yarn test` + 47 pages ✅ | 1E |
| 6 | `chore: ESLint 8 → 9 flat config` | `yarn lint` ✅ | 1F |
| 7 | `feat: add font system (Cinzel, EB Garamond, Inter) + color tokens` | `yarn build` + visual QA ✅ | 3.0-3.2 |
| 8 | `feat: replace Flowbite Alert → InlineAlert` | `yarn build && yarn test` ✅ | 2 |
| 9 | `feat: replace Flowbite Breadcrumb → custom Breadcrumbs` | `yarn build && yarn e2e` ✅ | 2 |
| 10 | `feat: replace Flowbite Card → SurfaceCard` | `yarn build && yarn test` ✅ | 2 |
| 11 | `feat: replace Flowbite DarkThemeToggle → ThemeToggle` | `yarn build` + dark mode check ✅ | 2 |
| 12 | `feat: replace Flowbite Navbar → SiteHeader (last, deepest coupling)` | `yarn build && yarn e2e` ✅ | 2 |
| 13 | `chore: remove flowbite-react, flowbite, flowbite/plugin` | `yarn build && yarn test && yarn e2e` ✅ | 2 |
| 14 | `feat: Roman design system (drop caps, gold rules, sharp edges, Lucide icons)` | visual QA ✅ | 3.3 |
| 15 | `feat: CSS-first motion (animation-timeline, scroll-behavior, marquee, grain PNG)` | `prefers-reduced-motion` check ✅ | 3.4 |
| 16 | `feat: token enforcement (replace inline values with Tailwind tokens)` | `yarn lint` + R15.8 check ✅ | 3.0 |
| 17 | `feat: craft pass (microstates, focus rings, skeletons, empty states)` | a11y audit ✅ | 3.5 |
| 18 | `test: a11y + Lighthouse + visual acceptance` | `@axe-core/playwright` + Lighthouse 90+ ✅ | 4 |

---

## Acceptable-Debt Ledger

Any advisories not fixed by direct removal/upgrade are documented here with rationale:

| Advisory | Package | Via | Status | Rationale |
|----------|---------|-----|--------|-----------|
| (TBD after Phase 1) | — | — | — | Will be populated after dep remediation. Goal: 0 remaining or documented. |

Debt principles:
- Dev-only advisories remaining after Storybook removal → low priority, document
- Flowbite transitive deps remaining until full replacement → document with timeline (Phase 2)
- Any Next 15 incompatibility → defer upgrade, use `pnpm.overrides`, document
- All debt has a removal timeline — no permanent debt

---

## Effort Estimate

| Phase | Sub-phase | Days |
|-------|-----------|------|
| 1 (Security) | Dead deps (1A) | 0.25d |
| | Drop Storybook (1B) | 0.25d |
| | pnpm overrides (1C) | 0.5d |
| | Compat spike (1D) | 0.5d |
| | Next 15 upgrade (1E) | 0.5-1d |
| | ESLint 9 (1F) | 1d |
| 2 (Flowbite) | Component replacement | 2-3d |
| 3 (Visual) | Token enforcement (3.0) | 0.5-1d |
| | Typography + colors (3.1-3.2) | 0.5d |
| | Roman design rules (3.3) | 1-1.5d |
| | CSS-first motion (3.4) | 0.5d |
| | Craft pass (3.5) | 1d |
| 4 (QA) | A11y + Lighthouse + visual | 1-2d |
| | Deploy | 0.5d |
| **Total** | | **8.5-12.5d** |

Contingency buffer: +2-3d for unexpected issues (Flowbite incompatibility, Next 15 migration surprises, visual QA iterations).

**Realistic range: 10-15 days for a solo developer.**

---

## Risks and Rollback

| Risk | Probability | Impact | Mitigation | Rollback |
|------|------------|--------|------------|----------|
| Flowbite 0.7 + React 19 incompatibility | MEDIUM | HIGH | Compat spike (1D) gates Next 15 upgrade | Defer Next 15, use pnpm overrides |
| Flowbite replacement breaks layout | LOW | MEDIUM | Incremental replacement, Navbar last | Keep Flowbite as fallback for any broken component |
| Font loading performance | LOW | MEDIUM | `next/font/google` with `display=swap`, preload | Reduce preloaded fonts |
| Dark mode regression after token changes | MEDIUM | MEDIUM | Visual QA on every page after token changes | Revert token commit |
| ESLint 9 flat config migration breaks | MEDIUM | LOW | Test in isolation, fix rules incrementally | Revert to ESLint 8 |
| Token enforcement reveals deeper issues | LOW | LOW | Fix inline, don't refactor component structure | Document as debt |
| Next 15 async API breaks server action | LOW | MEDIUM | `sendEmail.tsx` doesn't use `cookies()`/`headers()` | Defer Next 15 |

**Rollback strategy**: Vercel instant rollback to any previous deployment via dashboard. Git revert for code-level rollback. Each staged commit is independently revertible.

---

## Why 0.1% Solo, Not 0.01% Team

0.01% websites (Awwwards SOTD, FWA winners) require:
- Dedicated art director + motion designer + developer team
- 4-8 weeks of iteration with user testing
- Custom illustration and photography
- Professional copywriting
- Multiple review cycles with external feedback

A solo developer can realistically achieve **0.1%** (top 1000 sites globally) with:
- Strong design system (3-font typography, Pompeian palette, Roman signature)
- CSS-first motion (zero JS animation libraries)
- WCAG 2.2 AA accessibility
- Lighthouse 90+ all categories
- 2-3 weeks of focused work
- Iteration on visual details after initial build

This plan targets 0.1% solo quality. The 0.01% bar is an aspiration that requires team-level iteration and art direction exceeding a solo sprint.

---

## Contested Decisions (Resolved)

| Decision | Visionary | Architect | Researcher | Pragmatist | Critic | Resolution |
|----------|-----------|-----------|------------|------------|--------|------------|
| 5-font system | ✅ 5 fonts | ❌ 5 excessive | ❌ 1 family rule | ❌ 3 max | ❌ 5 violates restraint | **3 fonts + system monospace** |
| Lenis smooth scroll | ✅ include | ❌ CSS alternative | ❌ self-falsified | ❌ 7KB waste | ❌ drop | **CSS `scroll-behavior: smooth`** |
| Arch portrait frame | ✅ specify | ✅ pure CSS | ❌ costume | — | ❌ theme party | **User's decision** |
| Imperial purple | ✅ include | — | ❌ no rules | — | ❌ drop | **DROPPED** |
| OPVS·MMXXVI overline | ✅ specify | — | ❌ cosplay | — | ❌ drop | **DROPPED** |
| Variable font weight | ✅ on scroll | ❌ INP risk | ❌ Cinzel not variable | ❌ impossible | ❌ drop | **DROPPED** (Cinzel NOT variable) |
| SVG feTurbulence grain | ✅ specify | ❌ perf hazard | — | — | ❌ drop | **Pre-rendered PNG** |
| Magnetic hover | ✅ specify | ❌ per-element JS | — | — | ❌ drop | **CSS `transition` + `transform`** |
| Storybook | — | upgrade 7→8 | DROP entirely | — | upgrade 7→8 | **DROP entirely** (39/67 vulns, 3 stories) |
| Next 15 upgrade | — | — | ✅ viable | ✅ revised (was ❌) | ✅ with gate | **Conditional on compat spike** |
| Gold for text | ✅ specify | — | — | ❌ 2.1:1 fail | — | **Decorative only** |
| `next-compose-plugins` dead? | — | ✅ dead (FALSE) | — | ❌ NOT dead | — | **KEEP** (actively used) |

---

## Files Modified/Created

### Modified
- `package.json` — dep removals, upgrades, pnpm overrides
- `tailwind.config.js` — new color tokens, font families, spacing scale, remove flowbite plugin
- `app/layout.tsx` — font loading (Cinzel, EB Garamond, Inter via `next/font/google`)
- `styles/tailwind.css` — CSS-first motion, drop caps, grain overlay, remove Flowbite imports
- `next.config.mjs` — remove @vercel/otel if referenced, Next 15 compat
- `components/Header/Header.tsx` — Flowbite Navbar → custom SiteHeader
- `components/Footer/Footer.tsx` — Flowbite Footer → custom SiteFooter
- `components/ProjectTeaser/ProjectTeaser.tsx` — Flowbite Card → SurfaceCard
- `components/ArticleTeaser/ArticleTeaser.tsx` — Flowbite Card → SurfaceCard
- `components/ContactForm/ContactForm.tsx` — Flowbite Alert → InlineAlert
- `components/DarkThemeToggle/DarkThemeToggle.tsx` — Flowbite DarkThemeToggle → ThemeToggle
- All Breadcrumb components — Flowbite Breadcrumb → custom Breadcrumbs
- `app/page.tsx` — homepage hero (Roman restyle)
- All blog/project/uses detail pages — Breadcrumb replacement
- `env.mjs` — remove @vercel/otel if referenced

### New
- `components/SiteHeader/SiteHeader.tsx` — custom navbar replacement
- `components/SurfaceCard/SurfaceCard.tsx` — custom card replacement
- `components/Breadcrumbs/Breadcrumbs.tsx` — custom breadcrumb replacement
- `components/InlineAlert/InlineAlert.tsx` — custom alert replacement
- `components/ThemeToggle/ThemeToggle.tsx` — custom theme toggle
- `components/ScrollReveal/ScrollReveal.tsx` — CSS scroll reveal wrapper (uses `animation-timeline: view()`)
- `components/SectionDivider/SectionDivider.tsx` — gold hairline rule with optional diamond
- `public/grain.png` — pre-rendered grain texture (1.5% opacity)
- `.omo/decisions/next-15-compat-spike.md` — compat spike results document

### Removed
- `.storybook/` directory
- `stories/` directory (3 stories)
- `patches/` directory (if exists — patch-package is dead overhead)

---

## AGENTS.md Rule Compliance

| Rule | How Addressed |
|------|---------------|
| R1.1 | Plan document exists in `.omo/plans/roman-redesign.md` |
| R1.6 | Each staged commit uses conventional commit format |
| R3.1 | ESLint + Prettier pass on every commit (CI) |
| R3.3 | Conventional Commits enforced by pre-commit hook |
| R3.4 | Strict TypeScript, no `any`, prefer `unknown` + Zod |
| R4.14 | Each module ≤250 LOC (excluding JSX markup + imports) |
| R4.15 | Import direction: app/ → components/ → lib/ (never reverse) |
| R6.1 | Every code change verified through automated tests (CI) |
| R15.4 | Focus indicators visible on every interactive surface |
| R15.7 | `prefers-reduced-motion: reduce` disables all motion |
| R15.8 | Design tokens centralized in Tailwind config, no hardcoded values |
| R15.11 | No telemetry, no analytics, no tracking |
| R15.14 | Dark mode parity on every page |
| R25.1 | `await-to-js` (`to()` pattern) for async error handling |
| R26.2 | No `.skip()` in tests without documented reason |

---

## TODOs

### Phase 1: Security Remediation

- [x] 1. Remove dead deps — `@vercel/otel`, `@opentelemetry/*` (5 pkgs), `prop-types`, `tsc`, `@storybook/testing-library` from package.json (1A)
- [x] 2. Drop Storybook entirely — remove `storybook`, `@storybook/*`, `.storybook/` dir, `test-storybook` script, Storybook ESLint config (1B)
- [x] 3. Add `pnpm.overrides` for remaining transitive vulns (tar, axios, esbuild, sharp, uuid, elliptic, glob, minimatch, shell-quote, postcss) (1C)
- [x] 4. Compatibility spike — verify flowbite-react@0.7.x + React 19, next@15 + sendEmail.tsx, next.config.mjs, reactStrictMode, generateStaticParams. Document in `.omo/decisions/next-15-compat-spike.md` (1D)
- [x] 5. Next 15 upgrade — conditional on task 4 green. Upgrade next 14.2.35 → 15.x, fix async APIs (1E)
- [x] 6. ESLint 8 → 9 migration — convert `.eslintrc.js` to `eslint.config.js` flat config (1F)

### Phase 2: Flowbite React → Custom Components

- [x] 7. Add font system (Cinzel, EB Garamond, Inter via `next/font/google`) + color tokens (pompeian, marble, charcoal, gold) to tailwind.config.js + app/layout.tsx (3.0-3.2)
- [x] 8. Replace Flowbite Alert → custom InlineAlert in ContactForm (Phase 2)
- [x] 9. Replace Flowbite Breadcrumb → custom Breadcrumbs in all pages (Phase 2)
- [x] 10. Replace Flowbite Card → custom SurfaceCard in ProjectTeaser + ArticleTeaser (Phase 2)
- [x] 11. Replace Flowbite DarkThemeToggle → custom ThemeToggle (Phase 2)
- [x] 12. Replace Flowbite Navbar → custom SiteHeader in Header.tsx (LAST, deepest coupling) (Phase 2)
- [x] 13. Remove `flowbite-react`, `flowbite`, `flowbite/plugin` from Tailwind config + remove 12 unused `@radix-ui/*` deps (keep `@radix-ui/react-tooltip`) (Phase 2)

### Phase 3: Visual Restyle

- [x] 14. Roman design system — drop caps, gold hairline rules, sharp edges, Lucide icons, letter-spacing (3.3)
- [x] 15. CSS-first motion — animation-timeline, scroll-behavior, marquee edge fade, grain PNG, remove Motion library (3.4)
- [x] 16. Token enforcement — replace inline `text-4xl`/`text-2xl`/hardcoded hex with Tailwind tokens (3.0)
- [x] 17. Craft pass — microstates, focus rings, skeletons, empty states, 4-state pattern (3.5)

### Phase 4: A11y + QA + Deploy

- [x] 18. A11y + Lighthouse + visual acceptance — axe scans, WCAG AA contrast, keyboard nav, Lighthouse 90+, screenshots at 375/768/1280/1440px, dark mode parity (4.1-4.4)

---

## Final Verification Wave

- [x] F1. Security verification — `pnpm install --frozen-lockfile && pnpm build && pnpm test && pnpm lint && pnpm prettier` all pass, vuln count <15
- [x] F2. Flowbite removal verification — zero `flowbite-react` imports remain, `pnpm build && pnpm test && pnpm e2e:headless` pass
- [x] F3. Visual restyle verification — screenshots at 4 breakpoints, dark mode parity, `prefers-reduced-motion` honored, Lighthouse 90+
- [x] F4. A11y verification — `@axe-core/playwright` scan on every public route, WCAG 2.2 AA, keyboard nav, heading hierarchy, touch targets ≥44px
