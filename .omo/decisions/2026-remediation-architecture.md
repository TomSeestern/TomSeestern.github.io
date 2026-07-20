# Dependency Graph & Atomic Commit Plan — TomSegbers.de Remediation

Scope: 35 findings (C1–C20, H1–H15). MEDIUM deferred per lead.
Risk legend: L=low, M=medium, H=high.

## SHARED CODE TOUCH POINTS (3+ fixes)

| File | Fixes | Why hot | Strategy |
|------|-------|---------|----------|
| `app/layout.tsx` | C1, C7 | Theme script + skip link + JSON-LD scaffold (C4) | Order: C1 first (theme init + suppressHydration), C7 second (skip link), C4 JSON-LD later. |
| `next.config.mjs` | C2 | headers() + CSP + Permissions-Policy + Referrer-Policy | Single commit. |
| `tailwind.config.js` | C19 | Prose raw gray → semantic tokens | One commit. |
| `lib/sendEmail.tsx` | C3, C20, H10 | Zod schema, rate-limit hook, console.error removal | Zod first (C3), then H10 (structured logging), then rate limit. |
| `app/blog/entry/[slug]/page.tsx` + `app/projects/entry/[slug]/page.tsx` | C5, C6, C18 | notFound(), shared component, twitter/OG | C6 extraction first → C5 + C18 land on shared component. |
| `app/contact/page.tsx` | C3 (UI half), C17, H9, H11 | metadata, server-side Zod echo, CSRF, dark green | Bundle metadata wrap (C17) + CSRF (H11) in C3 commit; H9 with C15 token migration. |
| `components/ProjectTeaser/ProjectTeaser.tsx` | C12, C9 | Radix Tooltip swap, decorative img alt | One commit (component pass). |
| `components/Footer/Footer.tsx` | C9 | decorative svg alt="" | With C9 commit. |
| `components/ArticleTeaser/ArticleTeaser.tsx` | C9 | decorative img alt="" | With C9 commit. |
| `app/page.tsx` | C9, C10, C15 | alt, typography tokens, accent migration | One commit per concern to keep diffs small. |
| `app/projects/page.tsx` | C9, C11, C15, H1 | alt, focus rings, accent, missing test | Three commits: H1 test → C11+focus → C15 tokens. |
| `app/about/page.tsx` | C9, C15 | decorative arrow alt, accent tokens | One commit. |
| `app/not-found.tsx` | H8, H12 | focus-visible + English translation | One commit. |
| `components/Header/Header.tsx` | H13 | aria-current="page" | One commit. |
| `package.json` | C13 | next 14.0.3 → 14.2.x | Pre-merge. |
| `content/projects/*.md` | C16 | 21 files: placehold.co → /img/logo.png | Bulk commit; pre-validated by check-project-frontmatter.js. |
| `jest.config.js` | H15 | coverageThreshold | One commit. |
| `lib/markdown.ts`, `lib/blog.tsx`, `lib/projects.tsx` | H14 | JSDoc | One commit. |
| `content/blog/*.md`, `content/projects/*.md` | H2, H3, H4, H5, H6 | authorName, factual fix, date rename, missing id, broken image | 5 small commits or 1 bundle. |

## DEPENDENCY GRAPH

Notation `A → B` = A must land before B.

1. C6 (extract `MarkdownDetailPage`) → C5 (notFound + safe metadata on detail pages)
2. C6 → C18 (twitter/article metadata on shared component)
3. C6 → H1 (projects page test mocks the page; stays orthogonal — parallel safe)
4. C1 (theme script) → C15 (accent tokens readable in dark) → C9 (decorative alt for new icons)
5. C2 (security headers) ∥ everything else (independent)
6. C3 (Zod schema in sendEmail) → H11 (CSRF — Next Server Action has built-in; CSRF needs schema to gate)
7. C3 → C20/H10 (console.error removal — depends on new typed Result)
8. C17 (contact metadata) → C3 (shared file; ship together or C17 first)
9. C4 (robots/sitemap/JSON-LD/canonicals) → C18 (canonical aligns with OG url)
10. C10 (homepage typography tokens) → C15 (accent migration in same file; keep separate commits)
11. C12 (Radix Tooltip swap) → C9 (decorative alt covers new icon tag)
12. C13 (next 14.2.x bump) → C2 (security headers re-check after major bump)
13. C14 (rebuild Storybook) → anything touching visual components (C9, C10, C15, C19)
14. C16 (placehold.co → logo) → H1 (test fixtures reference new path)
15. C19 (prose semantic tokens) → C10 (typography tokens now consistent)
16. H2/H3/H4/H5/H6 (content fixes) → H14 (JSDoc) — independent
17. H7 (min-h-20) → C15 (token migration file touches same lines)
18. H8 + H12 (not-found.tsx English + focus-visible) → C7 (skip link visual baseline)
19. H9 (dark green) → C3 (touches contact page; bundle in C3)
20. H11 (CSRF) → C3 (server action wiring)
21. H13 (aria-current in Header) → C7 (skip link lands first to avoid Header churn mid-PR)
22. H15 (Jest coverage thresholds) → last in test wave (otherwise masks missing coverage)
23. C5 (notFound in detail) → C4 (sitemap excludes invalid slugs by Next convention; not strict but cleaner)

## COMMIT PLAN (ordered)

### Commit 1 — `feat(layout): class-based dark mode + theme init script`
- Files: `app/layout.tsx`, `components/DarkThemeInit/DarkThemeInit.tsx` (new or inline), `e2e/dark-mode.spec.ts` (extend).
- Fixes: **C1**
- Why first: every dark-dependent class fix needs theme live.
- Risk: **M** (FOUC; document inline-script CSP allowance in C2).
- Verification: `pnpm build`, dark-mode e2e.

### Commit 2 — `feat(a11y): skip-to-content link + main landmark id`
- Files: `app/layout.tsx`.
- Fixes: **C7**
- Depends on: C1 (skip-link color must work in dark).
- Risk: **L**.
- Verification: axe on `/`.

### Commit 3 — `refactor(markdown): extract MarkdownDetailPage component`
- Files: new `components/MarkdownDetailPage/`, `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`, `lib/markdown.ts` (add `getMarkdownEntryBySlug` helper).
- Fixes: **C6**
- Why: every later detail fix touches one file.
- Risk: **M**.
- Verification: `pnpm build` (36 routes), dynamic-content e2e.

### Commit 4 — `feat(detail): notFound() + safe metadata on shared MarkdownDetailPage`
- Files: `components/MarkdownDetailPage/MarkdownDetailPage.tsx`, both detail routes.
- Fixes: **C5**
- Depends on: C3.
- Risk: **L**.
- Verification: e2e visits `/blog/entry/does-not-exist` → 404; metadata regex.

### Commit 5 — `feat(seo): rich OpenGraph/Twitter metadata on detail pages`
- Files: `components/MarkdownDetailPage/MarkdownDetailPage.tsx`, both detail routes, `app/page.tsx` canonical url (parallel-friendly).
- Fixes: **C18**
- Depends on: C3 (shared component).
- Risk: **M**.
- Verification: Playwright meta assertions.

### Commit 6 — `feat(seo): robots.ts + sitemap.ts + JSON-LD WebSite + canonical URLs`
- Files: new `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx` (JSON-LD `<script>`), every route metadata (add `alternates.canonical`).
- Fixes: **C4**
- Depends on: C5 (no real-vs-404 slug drift); loosely tied.
- Risk: **M**.
- Verification: `curl /robots.txt`, `/sitemap.xml`, axe.

### Commit 7 — `chore(security): CSP + Permissions-Policy + Referrer-Policy headers`
- Files: `next.config.mjs`.
- Fixes: **C2**
- Independent. Allow `'unsafe-inline'` for `style-src` only (Tailwind utility classes are inline via Next). Add nonce-based script-src later if needed.
- Risk: **H** (CSP can break Flowbite/Next). Mitigation: defensive `style-src 'self' 'unsafe-inline'`.
- Verification: `curl -I`; Lighthouse; visual sanity.

### Commit 8 — `feat(contact): Zod validation + Result contract + honeypot + rate limit + CSRF token`
- Files: `lib/sendEmail.tsx`, `lib/sendEmail.test.tsx`, `app/contact/page.tsx`, `app/contact/layout.tsx` (new, hosts metadata + form), `e2e/contact.spec.ts`.
- Fixes: **C3, C17, H11** (Next.js Server Actions already have built-in CSRF; document and verify), **H9** (dark green variant added here since the file is touched), **H10** (structured logging replaces `console.error`), and the C20 subcluster (console.error, !bg-green dark variant).
- Depends on: nothing structural. C17 metadata wrap MUST land before C3 because form goes through new layout.
- Risk: **M**.
- Verification: full Jest; contact e2e (success, validation errors, rate limit).

### Commit 9 — `refactor(content): replace placehold.co with /img/logo.png across 21 project entries`
- Files: `content/projects/*.md` (21 files), `scripts/check-project-frontmatter.js` (sanity guard).
- Fixes: **C16**
- Depends on: nothing.
- Risk: **L** (single domain change; check-project-frontmatter still passes).
- Verification: `node scripts/check-project-frontmatter.js`, build.

### Commit 10 — `test(projects-listing): add app/projects/page.test.tsx`
- Files: new `app/projects/page.test.tsx`.
- Fixes: **H1**
- Depends on: nothing (mocks `getAllProjects`).
- Risk: **L**.
- Verification: Jest focused suite.

### Commit 11 — `fix(content): factual + author + date + id + broken-image corrections`
- Files: `content/blog/2020-homelab-v2-...md` (C/H3), `content/blog/2024-homelab-v2-...md` (H4), `content/projects/2020-soudest-backend-nodejs.md` (H5), `content/projects/2019-ebeltoft-cheesecake-recipe.md` (H6), 24 author frontmatter (H2).
- Fixes: **H2, H3, H4, H5, H6**
- Risk: **M** (factual fix needs human verification on R710 CPU spec).
- Verification: `node scripts/check-project-frontmatter.js`.

### Commit 12 — `feat(images): convert hero image to WebP and resize to 400x500`
- Files: `public/img/Tom_Segbers_Frontal.webp` (new), `app/page.tsx` (Next/Image reference).
- Fixes: **C8**
- Risk: **L**.
- Verification: Lighthouse; size check ≤ 40 KB.

### Commit 13 — `feat(a11y): decorative image alt="" on arrow/icon SVGs and icons`
- Files: `app/page.tsx`, `app/projects/page.tsx`, `app/about/page.tsx`, `components/ArticleTeaser/ArticleTeaser.tsx`, `components/ProjectTeaser/ProjectTeaser.tsx`, `components/Footer/Footer.tsx`.
- Fixes: **C9**
- Depends on: C1 (theme stable so dark-mode e2e stays green).
- Risk: **L**.
- Verification: axe `image-alt`.

### Commit 14 — `feat(typography): homepage uses semantic text-h1/h2 tokens`
- Files: `app/page.tsx`.
- Fixes: **C10**
- Depends on: tokens in `tailwind.config.js` already shipped (per task 19 evidence).
- Risk: **L**.
- Verification: Lighthouse heading-order; axe.

### Commit 15 — `feat(a11y): focus-visible rings on all interactive links/buttons`
- Files: `app/projects/page.tsx`, `app/not-found.tsx`, plus spot-fix on any remaining non-focus-visible styles.
- Fixes: **C11, H8**
- Depends on: nothing.
- Risk: **L**.
- Verification: axe; interactions e2e.

### Commit 16 — `feat(project-teaser): swap Flowbite Tooltip to Radix Tooltip for keyboard access`
- Files: `components/ProjectTeaser/ProjectTeaser.tsx`, `components/Tooltip/Tooltip.tsx` (Radix already exists, fix import path).
- Fixes: **C12**
- Depends on: nothing.
- Risk: **M** (Radix Tooltip already in `components/Tooltip/`; verify existing Radix wrapper supports single child trigger).
- Verification: jest `Tooltip.test.tsx`; dynamic-content e2e keyboard path.

### Commit 17 — `feat(seo): detail pages canonical + alternates languages`
- Files: both detail routes, `app/sitemap.ts`.
- Fixes: **C4 subitem** (canonical alignment; covers `alternates.canonical` requirement).
- Depends on: C6.
- Risk: **L**.
- Verification: `curl /sitemap.xml | grep canonical`.

### Commit 18 — `chore(deps): upgrade Next.js 14.0.3 → 14.2.x for CVE remediation`
- Files: `package.json`, `pnpm-lock.yaml`, `.github/dependabot.yml` (note).
- Fixes: **C13**
- Depends on: nothing.
- Risk: **M** (Next minor bump may shift image defaults).
- Verification: full pnpm install, build, e2e.

### Commit 19 — `feat(styles): prose typography uses semantic color tokens`
- Files: `tailwind.config.js`.
- Fixes: **C19**
- Depends on: nothing.
- Risk: **M** (prose may render different in dark; verify dark-mode e2e).
- Verification: Storybook + dark-mode e2e.

### Commit 20 — `chore(storybook): rebuild storybook-static with current code`
- Files: `storybook-static/**` (generated; PR if committed).
- Fixes: **C14**
- Depends on: C13, C19 (visual baseline needs current tokens).
- Risk: **L**.
- Verification: `pnpm test-storybook`.

### Commit 21 — `refactor(styles): migrate custom components from primary-* to accent-* tokens`
- Files: `app/page.tsx`, `app/projects/page.tsx`, `app/about/page.tsx`, `app/not-found.tsx`, `app/contact/page.tsx`, `components/Header/Header.tsx`.
- Fixes: **C15**
- Depends on: C19 (tokens consistent first).
- Risk: **M**.
- Verification: visual diff; storybook.

### Commit 22 — `feat(a11y): not-found.tsx translated + focus-visible`
- Files: `app/not-found.tsx`.
- Fixes: **H8 (this commit also covered by C15 ring addition above — keep both fixes here), H12**
- Depends on: nothing.
- Risk: **L**.

### Commit 23 — `feat(header): aria-current=page on active nav link`
- Files: `components/Header/Header.tsx`.
- Fixes: **H13**
- Depends on: C7.
- Risk: **L**.

### Commit 24 — `docs(lib): JSDoc on markdown reader + getAllBlogPosts + getAllProjects`
- Files: `lib/markdown.ts`, `lib/blog.tsx`, `lib/projects.tsx`.
- Fixes: **H14**
- Depends on: nothing.
- Risk: **L**.

### Commit 25 — `chore(ci): jest coverage thresholds`
- Files: `jest.config.js`.
- Fixes: **H15**
- Depends on: all test commits (H1, C3) shipped — otherwise fails.
- Risk: **L**.

### Commit 26 — `docs(adr): security headers + rate limit + CSRF decisions`
- Files: `docs/adr/0011-csp-headers.md`, `docs/adr/0012-contact-rate-limit.md`, `docs/adr/0013-csrf-server-action.md`.
- Fixes: rationale docs.
- Depends on: C2, C3 (H11).
- Risk: **L**.

## PARALLEL EXECUTION WAVES

Wave 0 (foundation, sequential):
- C1 → C7 (theme + skip link)

Wave 1 (parallel groups; max 4 workers):
- A: C3 (markdown extraction)
- B: C2 (security headers)
- C: C9 (contact Zod + Result + honeypot + CSRF + dark green)
- D: C11 (a11y image alt)

Wave 2 (depends on Wave 1):
- A: C4 (notFound) — needs C3
- B: C5 (rich OG/Twitter) — needs C3
- C: H1 (projects test) — independent
- D: H2-H6 (content corrections) — independent
- E: C8 (image WebP) — independent
- F: C11 (focus rings) — independent
- G: C12 (Radix Tooltip) — independent

Wave 3 (depends on Wave 2):
- A: C6 (robots/sitemap/JSON-LD/canonical) — needs C4, C5
- B: C10 (homepage typography) — independent
- C: C16 (placehold.co → logo) — independent
- D: C19 (prose semantic colors) — independent
- E: H13 (Header aria-current) — independent
- F: H14 (JSDoc) — independent

Wave 4 (depends on Wave 3):
- A: C15 (primary → accent migration) — needs C19
- B: C13 (next.js 14.2.x) — independent
- C: C18 (detail canonical) — needs C5
- D: H8 + H12 (not-found English) — independent

Wave 5 (final, depends on Wave 4):
- A: C14 (storybook rebuild) — needs C13, C19
- B: H15 (coverage thresholds) — needs all tests
- C: ADRs — needs C2, C3, H11

### Concrete parallel groupings for 4 workers
- **Wave 1**: C3 ‖ C2 ‖ C9 ‖ C11
- **Wave 2**: C4 ‖ C5 ‖ H1 ‖ H2-H6 (bundle)
- **Wave 3**: C6 ‖ C10 ‖ C16 ‖ C19
- **Wave 4**: C15 ‖ C13 ‖ C18 ‖ H8+H12 (bundle)
- **Wave 5**: C14 ‖ H15 ‖ ADRs

## RISK MATRIX

| Commit | Risk | Rollback | Manual verification? |
|--------|------|----------|----------------------|
| C1 | M | git revert | yes — refresh in dark mode (FOUC check) |
| C7 | L | git revert | no |
| C3 (extract) | M | git revert; routes still build with legacy fallback | no |
| C4 | L | git revert | no |
| C5 | M | git revert | no |
| C6 | M | git revert; sitemap excludes 404 | yes — curl /sitemap.xml |
| C2 | H | git revert; CSP can break inline styles | yes — Lighthouse + browser console |
| C3 (Zod contact) | M | git revert | yes — submit edge cases |
| C16 | L | git revert | no |
| H1 | L | git revert | no |
| H2-H6 | M | git revert | yes — factual fix (R710) needs human verification |
| C8 | L | git revert | no |
| C9 | L | git revert | no |
| C10 | L | git revert | no |
| C11, H8 | L | git revert | no |
| C12 | M | git revert | yes — keyboard interaction |
| C13 | M | git revert; Next major bump risk | no (full e2e catches it) |
| C19 | M | git revert; prose may shift in dark | yes — dark-mode e2e |
| C14 | L | git revert | no |
| C15 | M | git revert | yes — visual diff |
| H8+H12 | L | git revert | no |
| H13 | L | git revert | no |
| H14 | L | git revert | no |
| H15 | L | git revert | no |
| ADRs | L | git revert | no |

## CRITICAL NON-OBVIOUS DEPENDENCIES

1. **C1 → all dark-class fixes**: every `dark:*` variant is dead until C1 lands.
2. **C2 → C13**: re-test security headers after Next.js major bump.
3. **C6 → C5 + C18**: extraction MUST come first; otherwise C5/C18 each touch 2 routes and conflict in PRs.
4. **C3 (Zod) → H11 (CSRF)**: rate limit needs Result tuple to gate; CSRF can be inline with form refactor.
5. **C9 → C12**: Radix Tooltip swap changes trigger wrapper; alt text audit follows.
6. **C16 → H1**: projects page test references content paths; image change may break fixtures.
7. **C17 → C3 (contact refactor)**: metadata must be in a layout file before form changes touch `app/contact/page.tsx`.
8. **C10 + C15 same file**: split into 2 commits to keep PR diff ≤ 100 lines.
9. **C19 (prose) → C14 (storybook)**: rebuild storybook with new tokens.
10. **H15 last**: coverage thresholds must reflect post-migration state.