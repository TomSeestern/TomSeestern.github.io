# 2026-audit-remediation - Work Plan

## TL;DR (For humans)
**What you'll get:** Security, accessibility, metadata, content hygiene, and dependency findings rechecked against current site, then fixed only where reproducible. Stale or unverifiable claims become explicit evidence-backed dispositions instead of speculative edits.

**Why this approach:** Original audit is candidate inventory, not current truth. Each change first proves current behavior, then uses failing-first regression coverage or static baseline checks, and keeps shared files serialized to protect existing work.

**What it will NOT do:** It won't include deferred medium-priority work, invent factual portfolio claims or security infrastructure, reopen completed frontmatter repair, or commit generated Storybook output without proof that repository owns it.

**Effort:** XL
**Risk:** High - CSP, contact delivery, shared Markdown routes, and dependency alignment can break production behavior unless verified on real surfaces.
**Decisions I made for you:** I treated this as open-ended and chose defaults: report/rebaseline CSP before enforcement; no nonce invention; no new rate-limit dependency; block fake process-local protection when deployment semantics invalidate it; target secure supported lock-resolved Next 14.2.x only after advisory verification; keep Storybook output disposable; preserve unsupported factual content unchanged; defer every MEDIUM finding.

Your next move: `/start-work 2026-audit-remediation` already approved this bootstrap. Execute immediately from this plan, with no further interview.

---

> TL;DR (machine): XL effort, HIGH risk (CSP + contact + Markdown + dep), 20 todos + 4 final gates, 6 waves (W0-W5), serial hot files, max parallel lanes within each wave, every todo maps to one or more C/H findings, stale/blocked claims produce evidence not speculative edits

## Scope
### Must have
- Rebaseline every C1-C20 and H1-H15 finding against current site; record stale, blocked, or already-fixed without product changes.
- Theme-safe layout with class-based dark, skip link, accessible root landmark, and metadata + JSON-LD plus canonical paths (C1, C7, C4).
- CSP/security headers report-then-enforce with production browser proof; no nonce invention (C2).
- Contact form with server-side Zod validation, typed Result, privacy-safe error path, and deferred rate-limit disposition if in-process protection is invalid (C3, C9, C17, C20, H10, H11).
- Safe detail routes: renamed and shared loader/renderer, notFound on missing content, safe metadata, detail-only canonical and Twitter metadata (C5, C6, C18).
- Homepage: semantic heading tokens, JPEG-to-WebP hero swap, decorative alt fix (C8, C10).
- Accessibility pass: skip link (C7), decorative alt (C9), focus-visible rings (C11), header aria-current (H13), not-found English + focus-visible (H8, H12), Radix Tooltip swap (C12).
- Typography: prose semantic color tokens plus primary-to-accent migration across all explicit references (C15, C19).
- Content corrections: mechanical author name normalization (H2), placehold.co replacement (C16), source-backed body-only fixes where authorized; no invented facts for unsupported claims (H3-H6).
- Dependency and generated artifact hygiene: exact Next version lock resolution, CI coverage threshold, shared-lib JSDoc, and QA-only Storybook artifact disposition (C13, C14, C20, H13, H15).
- Final gate section checks lint, format, Jest, production build, full Playwright, frontmatter validator, Storybook build/smoke, security and not-found headers, and every available canonical route.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- No product code edits without a baseline characterization that passes first, a failing-first regression proof, and independent adversarial verification.
- No new runtime dependencies, CSP nonces, distributed rate-limit infrastructure, CSRF token systems, logging frameworks, OpenTelemetry, or analytics.
- No change to existing approved text, IDs, dates, filenames, slugs, images, or live public metadata unless exact C/H finding authorizes the value and source evidence supports the edit.
- No committed `storybook-static/**` unless proven tracked by git ownership.
- No reopening closed YAML frontmatter repair or prior portfolio plan checkboxes.
- No MEDIUM findings included in scope.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: TDD for behavior-change todos (C1, C3, C5, C7, C12, C13, C18); baseline + tests-after for static config/content/documentation/format todos.
- Framework: Jest (unit/component), Playwright (e2e headless), curl (headers, routes, output), pnpm build/lint/prettier, Storybook build/smoke, `scripts/check-project-frontmatter.js`.
- Evidence: `.omo/evidence/task-<NN>-2026-audit-remediation.txt` per task; `.omo/start-work/ledger.jsonl` events per task with `DoneClaim` + independent `AdversarialVerify` + all nine ultraqa class dispositions + cleanup receipt.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave; serialization only for named hot-file ownership or data dependencies.

**Wave 0 (foundation, serial):** T01. Layout theme + dark initialization (C1).

**Wave 1 (parallel, 3 lanes):** T02. Security headers (C2). T03. Skip link + root landmark (C7). T05. Contact validation + error path + disposition (C3, C17, C20, H9, H10, H11).

**Wave 2 (parallel, 4 lanes):** T06. Extract shared Markdown detail loader/renderer (C6). T04. SEO robots + sitemap + JSON-LD + canonical (C4). T15. Project content corrections (C16, H2). T17. Dependency hygiene: Next lock alignment, coverage threshold (C13, C20, H15).

**Wave 3 (parallel, 3 lanes):** T07. notFound + safe metadata on shared detail (C5, C18). T09. Homepage hero WebP + typography tokens (C8, C10). T12. Radix Tooltip swap on ProjectTeaser (C12).

**Wave 4 (parallel, 4 lanes):** T10. Projects page test + focus-visible rings (C11, H1). T13. Primary-to-accent token migration (C15). T14. Header aria-current + not-found English + focus-visible (H8, H12, H13). T16. Blog content fidelity edits (H3, H4, H5, H6).

**Wave 5 (parallel, 3 lanes):** T08. Decorative alt="" pass (C9). T11. Prose semantic color tokens (C19). T18. Storybook rebuild + artifact disposition (C14).

**Final gates (parallel, 4 lanes):** F1-F4 in `## Final verification wave`.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T01 | nothing | T03 (same file), T08 (dark stable first) | nothing (serial foundation) |
| T02 | nothing | T18 | T03, T05 (W1) |
| T03 | T01 (same file) | T13 (skip link before accent tokens on same routes) | T02, T05 (W1) |
| T04 | T07 (sitemap excludes missing slugs) | nothing | T06, T15, T17 (W2) |
| T05 | nothing | nothing (contact cluster self-contained) | T02, T03 (W1) |
| T06 | nothing | T07 (shared component) | T04, T15, T17 (W2) |
| T07 | T06 (shared component) | T04 (sitemap canonical) | T09, T12 (W3) |
| T08 | T01 (dark stable), T09 (hero icon alt), T11 (prose tokens visible) | T13 | T18 (W4) |
| T09 | nothing | T08 (hero arrow alt) | T10, T12 (W3 independent lanes) |
| T10 | nothing | nothing (adds test, doesn't change shared code) | T09, T12 (W3) |
| T11 | nothing | T14 | T18 (W4) concurrently |
| T12 | nothing | nothing | T09, T10 (W3) |
| T13 | T03 (skip link), T11 (tokens stable) | nothing | T14, T16 (W4) |
| T14 | nothing | nothing | T13, T16, T17 (W4) |
| T15 | YAML validator prerequisite completed | T16 (same content files) | T04, T06 (W2 independent of content) |
| T16 | T15 (same files, content corrections) | nothing | T13, T14 (W4) |
| T17 | nothing | T18 (Storybook needs current deps) | T04, T06 (W2) |
| T18 | T02 (CSP), T11 (tokens), T17 (deps) | nothing | T08 (W4) |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

<!-- Task batch auto-generated by Prometheus scaffolding — preserve the "## Todos" header and append below it. -->

### W0 - Foundation (serial)

- [x] **T01. Layout theme-safe dark init + class strategy** — C1
  - Files: `app/layout.tsx`
  - Scope: Add `<html className="dark" suppressHydrationWarning>`; verify Flowbite dark theme loads without flash on hard refresh; no `prefers-color-scheme` flicker
  - Acceptance: `pnpm build && pnpm start` then Playwright screenshot in dark mode shows themed bg
  - Happy QA: dark class present in SSR HTML source, no client-side theme toggle race
  - Failure QA: missing dark class → Flowbite renders light-mode layout in dark preference
  - Evidence: `.omo/evidence/task-T01-2026-audit-remediation.txt`

### W1 - Security, a11y foundation, contact (parallel 3 lanes)

- [x] **T02. CSP + security headers report-then-enforce** — C2
  - Files: `next.config.mjs`
  - Scope: Add `Content-Security-Policy-Report-Only` header via `headers()`; audit current third-party origins (Resend, Google Fonts, self); tighten to least-permissive production policy; no nonce invention
  - Acceptance: `curl -I` shows `Content-Security-Policy-Report-Only` AND `Content-Security-Policy` headers; Playwright confirms no CSP violations in console
  - Happy QA: all site assets load without CSP block; report-only phase logs violations
  - Failure QA: overly strict policy blocks images/scripts/fonts → Playwright console error filter catches
  - Evidence: `.omo/evidence/task-T02-2026-audit-remediation.txt`

- [x] **T03. Skip link + accessible root landmark** — C7
  - Files: `app/layout.tsx`
  - Scope: Add skip-to-main-content link as first focusable element; ensure `<main>` has role or aria-label; verify keyboard Tab order
  - Acceptance: Playwright test: Tab on load → skip link visible, Enter → focus moves to main content
  - Happy QA: screen reader announces skip link, main landmark reachable
  - Failure QA: skip link not first focusable, or hidden on focus
  - Evidence: `.omo/evidence/task-T03-2026-audit-remediation.txt`

- [x] **T05. Contact form: Zod validation, typed Result, rate-limit disposition** — C3, C17, C20, H9, H10, H11
  - Files: `app/contact/page.tsx`, `lib/sendEmail.tsx`, `env.mjs`
  - Scope: Server-side Zod schema for name/email/message; typed `Result<T>` return; privacy-safe error messages (no internal details leaked); evaluate in-process rate limit feasibility; if invalid, evidence-defer with block rationale
  - Acceptance: Jest tests for validation edge cases; Playwright submits form with `E2E_CONTACT_FORM_SUCCESS=true`; error path renders user-friendly messages
  - Happy QA: valid submission succeeds; invalid fields show inline errors; double-submit blocked by disable state
  - Failure QA: server error leaks stack trace to client → blocked
  - Evidence: `.omo/evidence/task-T05-2026-audit-remediation.txt`

### W2 - Shared markdown, SEO, content prep, dependency hygiene (parallel 4 lanes)

- [x] **T06. Extract shared Markdown detail loader + renderer** — C6
  - Files: `lib/markdown.ts` (new exported helpers), `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`
  - Scope: Extract `generateStaticParams`, frontmatter parsing, and `notFound` logic into shared `lib/markdown.ts`; both detail routes consume the shared loader
  - Acceptance: `pnpm test` passes existing markdown tests; `pnpm build` produces same static routes; detail pages render identically
  - Happy QA: blog and project detail pages unchanged
  - Failure QA: duplicate or missing static routes → `pnpm build` diff
  - Evidence: `.omo/evidence/task-T06-2026-audit-remediation.txt`

- [x] **T04. SEO: robots.txt, sitemap.xml, JSON-LD, canonical paths** — C4
  - Files: `app/layout.tsx`, `app/sitemap.ts` (new), `app/robots.ts` (new)
  - Scope: Add `sitemap.ts` generating all static routes; add `robots.ts` allowing all; add JSON-LD `WebSite` structured data in root layout; canonical URL in `<head>`
  - Acceptance: `curl /sitemap.xml` returns valid XML with all routes; `curl /robots.txt` allows all; page source contains `<script type="application/ld+json">`
  - Happy QA: sitemap excludes not-found or external-only routes
  - Failure QA: missing canonical on deep pages → Playwright snapshot check
  - Evidence: `.omo/evidence/task-T04-2026-audit-remediation.txt`

- [x] **T15. Project content corrections** — C16, H2
  - Files: `content/projects/*.md`
  - Scope: Replace `placehold.co` image URLs with project-owned assets or remove; normalize author name to "Tom Segbers" across all project frontmatter; no factual invention
  - Acceptance: `pnpm build` succeeds; `grep -r 'placehold.co' content/` returns empty; `scripts/check-project-frontmatter.js` passes
  - Happy QA: all project images render from local `/img/` or `/icon/` paths
  - Failure QA: broken image URLs → Playwright checks all project detail pages
  - Evidence: `.omo/evidence/task-T15-2026-audit-remediation.txt`

- [x] **T17. Dependency hygiene: Next lock alignment, coverage threshold** — C13, C20, H15
  - Files: `package.json`, `pnpm-lock.yaml`, `jest.config.js`
  - Scope: Pin Next.js to exact lock-resolved `14.2.35` (after advisory verification); align `eslint-config-next` version; add `coverageThreshold` to Jest config (80% branches, 80% functions, 80% lines, 80% statements)
  - Acceptance: `pnpm install --frozen-lockfile` succeeds; `pnpm test --coverage` meets thresholds
  - Happy QA: no dependency advisory for pinned Next version
  - Failure QA: coverage below threshold → `pnpm test --coverage` fails
  - Evidence: `.omo/evidence/task-T17-2026-audit-remediation.txt`

### W3 - Detail routes safety, homepage, Tooltip swap (parallel 3 lanes)

- [x] **T07. notFound + safe metadata on shared detail pages** — C5, C18
  - Files: `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`
  - Scope: Ensure `notFound()` called for missing slugs; metadata exports safe (no undefined access); detail pages get canonical URL and Twitter Card metadata; no metadata leaks across content types
  - Acceptance: Playwright: visit `/blog/entry/nonexistent` → 404 page renders; `curl -I` returns 404 status; meta tags differ between blog and project detail
  - Happy QA: valid slugs render with correct `<title>`, `<meta name="description">`, OpenGraph, Twitter Card
  - Failure QA: 500 on missing slug instead of 404 → blocked
  - Evidence: `.omo/evidence/task-T07-2026-audit-remediation.txt`

- [x] **T09. Homepage: JPEG→WebP hero swap + semantic heading tokens** — C8, C10
  - Files: `app/page.tsx`, `public/img/` (hero image)
  - Scope: Convert hero image to WebP; update `<Image>` import; ensure heading hierarchy starts at `<h1>` with semantic Tailwind typography tokens
  - Acceptance: Playwright: homepage has single `<h1>`; hero image loads as WebP (check Content-Type); no layout shift on load
  - Happy QA: Lighthouse image audit passes; heading hierarchy correct
  - Failure QA: multiple `<h1>` or missing heading → blocked
  - Evidence: `.omo/evidence/task-T09-2026-audit-remediation.txt`

- [x] **T12. Radix Tooltip swap on ProjectTeaser** — C12
  - Files: `components/ProjectTeaser/ProjectTeaser.tsx`, `components/Tooltip/` (replace)
  - Scope: Replace Flowbite Tooltip with Radix UI Tooltip (`@radix-ui/react-tooltip`); verify keyboard dismiss (Escape), hover, and focus behavior; no dependency addition if already in tree
  - Acceptance: Playwright: hover over project teaser → tooltip visible; press Escape → tooltip dismisses; focus-visible ring on trigger
  - Happy QA: tooltip content readable at all viewport sizes
  - Failure QA: tooltip escapes viewport on narrow screens → blocked
  - Evidence: `.omo/evidence/task-T12-2026-audit-remediation.txt`

### W4 - Projects page, token migration, header/not-found a11y, blog content (parallel 4 lanes)

- [x] **T10. Projects page test + focus-visible rings** — C11, H1
  - Files: `app/projects/page.tsx`, `components/ProjectTeaser/ProjectTeaser.tsx`
  - Scope: Add Jest component test for projects listing page; ensure all interactive elements have visible `focus-visible` ring styles; keyboard-navigable project cards
  - Acceptance: `pnpm test` passes new test; Playwright: Tab through project cards, each shows visible focus ring
  - Happy QA: focus rings match site color scheme (not browser default blue)
  - Failure QA: any interactive element lacks focus-visible style → blocked
  - Evidence: `.omo/evidence/task-T10-2026-audit-remediation.txt`

- [x] **T13. Primary-to-accent token migration** — C15
  - Files: `tailwind.config.js`, `app/globals.css`, component files with hardcoded `primary-*` references
  - Scope: Migrate all explicit `primary-*` color references to `accent-*` tokens; update Tailwind config color map; verify no visual regressions
  - Acceptance: Playwright visual diff: all pages before/after show no unintended color shifts; `grep -r 'primary-' app/ components/` returns zero matches
  - Happy QA: consistent color palette across all routes
  - Failure QA: hardcoded `primary-*` survives migration → grep failure
  - Evidence: `.omo/evidence/task-T13-2026-audit-remediation.txt`

- [x] **T14. Header aria-current + not-found English + focus-visible** — H8, H12, H13
  - Files: `components/Header/Header.tsx`, `app/not-found.tsx`
  - Scope: Add `aria-current="page"` to active nav link in Header; ensure not-found page has English text, focus-visible ring on back-link, and semantic heading
  - Acceptance: Playwright: navigate to `/blog` → Header link has `aria-current="page"`; visit `/nonexistent` → not-found page in English with focusable back link
  - Happy QA: screen reader announces current page in nav
  - Failure QA: not-found page in non-English or missing focus target → blocked
  - Evidence: `.omo/evidence/task-T14-2026-audit-remediation.txt`

- [x] **T16. Blog content fidelity edits** — H3, H4, H5, H6
  - Files: `content/blog/*.md`
  - Scope: Source-backed body-only fixes where authorized (typos, broken links, date consistency); no factual invention; no change to approved text without source evidence
  - Acceptance: `pnpm build` succeeds; content linter passes; Playwright verifies all blog detail pages render
  - Happy QA: no 404 links in blog body
  - Failure QA: invented claims or unauthorized text changes → blocked
  - Evidence: `.omo/evidence/task-T16-2026-audit-remediation.txt`

### W5 - Alt text, prose tokens, Storybook artifact (parallel 3 lanes)

- [x] **T08. Decorative alt="" pass** — C9
  - Files: `components/ProjectTeaser/ProjectTeaser.tsx`, `components/Footer/Footer.tsx`, `app/page.tsx`, other components with decorative images
  - Scope: Audit all `<Image>` and `<img>` elements; set `alt=""` for purely decorative images; ensure content images retain meaningful alt text
  - Acceptance: `pnpm build` passes (Next.js Image lint); Playwright a11y audit with `@axe-core/playwright` shows no missing-alt violations
  - Happy QA: screen reader skips decorative images; content images announced
  - Failure QA: any decorative image with non-empty alt → flagged
  - Evidence: `.omo/evidence/task-T08-2026-audit-remediation.txt`

- [x] **T11. Prose semantic color tokens** — C19
  - Files: `tailwind.config.js`
  - Scope: Configure `@tailwindcss/typography` prose colors using CSS custom properties mapped to theme tokens; ensure dark mode prose contrast meets WCAG AA (4.5:1)
  - Acceptance: Playwright: blog detail page prose text passes contrast audit; dark mode prose readable
  - Happy QA: prose links, headings, code blocks use semantic tokens
  - Failure QA: prose text contrast < 4.5:1 in either mode → blocked
  - Evidence: `.omo/evidence/task-T11-2026-audit-remediation.txt`

- [x] **T18. Storybook rebuild + artifact disposition** — C14
  - Files: `.storybook/`, components with stories
  - Scope: Rebuild Storybook static output; verify `storybook-static/` is gitignored; if tracked by git (proven), commit; otherwise leave as disposable QA artifact
  - Acceptance: `pnpm build-storybook` succeeds; `pnpm test-storybook` passes all smoke tests; `git check-ignore storybook-static/` confirms gitignored
  - Happy QA: all component stories render without console errors
  - Failure QA: storybook-static committed without git tracking proof → blocked
  - Evidence: `.omo/evidence/task-T18-2026-audit-remediation.txt`

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit
- [x] F2. Code quality review
- [x] F3. Real manual QA
- [x] F4. Scope fidelity

## Commit strategy

## Success criteria
