# peak-website - Work Plan

## TL;DR (For humans)

**What you'll get:** Your portfolio becomes a hire-grade personal site — adds the four signals recruiters check (current-focus `/now` page, `/uses` page, RSS feed, per-post social cards), gives every blog post reading time + table of contents + syntax highlighting + GFM tables, adds `Motion` micro-interactions and page reveals, wires App Router `loading.tsx`/`error.tsx`, adds Lighthouse CI + axe-playwright in GitHub Actions, and ships 1 fresh blog post. Dark mode + Roman palette preserved.

**Why this approach:** The semantic token architecture already lets one config file repaint the whole site (proven by Roman redesign). Adding `Motion` + `rehype-pretty-code` + auto-OG images is the highest-ROI delta per research — brittanychiang.com / leerob.io tier. Skipping MDX migration and view-counters keeps the build static and the privacy posture intact (R15.11).

**What it will NOT do:** No view counters, no newsletter signup, no MDX migration, no search, no GSAP, no view-transitions API, no image CDN, no i18n. These are deferred.

**Effort:** Large
**Risk:** Medium — Motion dep + rehype plugins touch the markdown pipeline; Lighthouse CI requires baseline measurement
**Decisions I made for you:** Motion (not GSAP), `rehype-pretty-code` (not prism), hand-rolled TOC, Lighthouse CI, `/now`+`/uses` content, fix canonical URL to `tom.segbers.de`. **Veto any line in `.omo/drafts/peak-website.md` "Open assumptions" before approval.**

Your next move: approve, edit defaults, or run a high-accuracy review.

---

> TL;DR (machine): Large effort, Medium risk; ship 14 todos across 6 phases + 4-reviewer Final Wave; delivers hire-grade portfolio matching leerob.io feature parity.

## Scope
### Must have
- New content: `/now`, `/uses`, 1 fresh blog post (`content/blog/2026-now-or-never.md`)
- New deps: `motion`, `rehype-pretty-code`, `reading-time`, `feed`, `@axe-core/playwright`
- New rehype plugins in react-markdown: `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `remark-gfm`
- Auto-OG image route: `app/opengraph-image.tsx`
- Per-route App Router hygiene: `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`
- Reading-time + TOC sidebar on blog/project detail pages
- Syntax highlighting on blog/project detail code blocks
- Motion micro-interactions on home (hero stagger, project card hover, page reveal)
- Per-post `BlogPosting` JSON-LD in blog detail `generateMetadata`
- RSS feed: `app/feed.xml/route.ts`
- Wire `tags[]` into Zod schema (`lib/markdown.ts`), render as pills on detail pages
- Fix canonical URL: `tomsegbers.de` → `tom.segbers.de`
- Fix `ProjectTeaser.imageUrl` (remove dead prop)
- Wire dead `Button` component into homepage (or delete)
- GitHub Actions: `.github/workflows/lighthouse.yml`
- `@axe-core/playwright` added to `e2e/static-routes.spec.ts`
- Update `DESIGN.md` to reflect Roman palette + Cinzel typography

### Must NOT have (guardrails, anti-slop, scope boundaries)
- View counters, likes, engagement metrics (R15.11)
- GSAP / heavy animation libs (bundle cost)
- MDX migration
- Search
- Newsletter signup form
- Image CDN integration
- i18n / multi-language
- View Transitions API (requires Next 15+)
- New database, API endpoints beyond OG image route
- Comments / discussion
- Testimonials page
- Resume PDF generation

## Verification strategy
- Test decision: tests-after for new utilities, extend existing e2e for axe
- Evidence: `.omo/evidence/task-<N>-peak-website.txt`

## Execution strategy
### Parallel execution waves
- Wave 1 (Deps + schema foundation): T1, T2 — install deps, update Zod schema, fix dead bugs
- Wave 2 (Content + content pages): T3, T4 — write `/now`, `/uses`, fresh blog post, wire tags rendering
- Wave 3 (Reading UX): T5, T6 — TOC, reading time, syntax highlighting, GFM, OG image, JSON-LD
- Wave 4 (Motion + App Router hygiene): T7, T8 — Motion micro-interactions, loading/error/global-error
- Wave 5 (SEO + perf): T9, T10 — RSS, Lighthouse CI, axe-playwright, DESIGN.md rewrite
- Wave 6 (Verification gate): T11 — full build + lint + test
- Wave 7 (Final Wave): F1, F2, F3, F4 in parallel

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T1 (deps + schema) | — | T2-T14 | — |
| T2 (canonical + Button + imageUrl) | T1 | T11 | T3-T10 (mostly independent) |
| T3 (new content) | — | T4 | T1, T2, T5-T10 |
| T4 (tags rendering) | T1 (schema), T3 (content) | T11 | T5-T10 |
| T5 (TOC + reading time) | T1 | T11 | T3, T6-T10 |
| T6 (OG + JSON-LD + Shiki + GFM) | T1 | T11 | T3, T5, T7-T10 |
| T7 (Motion) | T1 | T11 | T3-T6, T8-T10 |
| T8 (loading/error/global-error) | — | T11 | T3-T7, T9-T10 |
| T9 (RSS) | T1 (feed dep) | T11 | T3-T8, T10 |
| T10 (Lighthouse CI + axe + DESIGN.md) | T1 (axe dep) | T11 | T3-T9 |
| T11 (full verification) | all | Final Wave | — |

## Todos

- [x] 1. Install deps + extend Zod schema
  What to do: `pnpm add motion rehype-pretty-code rehype-slug rehype-autolink-headings remark-gfm reading-time feed` and `pnpm add -D @axe-core/playwright`. Extend `lib/markdown.ts` Zod schema (lines 6-13): add optional `tags: z.array(z.string()).default([])`. Update `MarkdownFrontmatter` type. Update `getMarkdownEntry` / `getAllMarkdownEntries` to surface `tags`.
  Must NOT do: Do NOT change the existing field semantics. `articleContent` stays the teaser. Do NOT make `tags` required.
  Parallelization: Wave 1 | Blocked by: — | Blocks: T4-T10
  References: `package.json`, `lib/markdown.ts:6-13`, `lib/blog.tsx`, `lib/projects.tsx`
  Acceptance criteria: `pnpm install` exits 0, `lib/markdown.ts` compiles, Zod schema accepts `tags: []` default
  QA scenarios: `pnpm test` for markdown.test.ts passes; verify Zod accepts new field via a test that constructs frontmatter with `tags: ['foo']`
  Evidence: `.omo/evidence/task-1-peak-website.txt`
  Commit: Y | chore(deps): add motion, rehype plugins, reading-time, feed, axe-playwright

- [x] 2. Fix canonical URL + dead Button + ProjectTeaser imageUrl
  What to do:
  - Fix canonical URLs in `app/blog/page.tsx:71` and `app/projects/page.tsx:66`: `tomsegbers.de` → `tom.segbers.de` to match `metadataBase` in `app/layout.tsx:11`.
  - Delete unused file `public/img/Tom_Segbers_Frontal.jpg` (duplicate of `.webp`).
  - Fix `components/ProjectTeaser/ProjectTeaser.tsx:1` — the `imageUrl` prop is dead (receives URL path, never renders). Either remove the prop entirely OR wire it to render. **Recommendation**: remove the prop and update ProjectTeaser callers.
  - Wire dead `Button` component into `app/page.tsx` — replace inline button at lines 59-64 with `<Button intent="primary" href="/projects">Learn More</Button>` and lines 75-80 with `<Button intent="secondary" href="/blog">Read the Blog</Button>`.
  Must NOT do: Do NOT change Button variants or CVA config. Do NOT break the existing e2e contact.spec.ts button assertions.
  Parallelization: Wave 1 | Blocked by: — | Blocks: T11
  References: `app/blog/page.tsx:71`, `app/projects/page.tsx:66`, `app/layout.tsx:11`, `app/page.tsx:59-64,75-80`, `components/Button/Button.tsx`, `components/ProjectTeaser/ProjectTeaser.tsx`
  Acceptance criteria: `pnpm lint` exits 0; `pnpm test` still passes (ProjectTeaser tests, contact tests); grep `tomsegbers.de` returns 0 matches except in `metadataBase`
  QA scenarios: `pnpm build` generates correct canonical URLs in sitemap; visual check: homepage buttons render via Button component
  Evidence: `.omo/evidence/task-2-peak-website.txt`
  Commit: Y | fix(canonical): align canonical URL with metadataBase; use Button component on home

- [x] 3. Author new content — /now, /uses, fresh blog post
  What to do: Create three new content files:
  - `content/pages/now.md` — single-page document showing current focus (hiring availability, current projects, what Tom is learning right now, recent wins). Follow nownownow.com pattern. ~200-400 words.
  - `content/pages/uses.md` — editor/IDE, terminal, hardware, services. Follow uses.tech pattern. ~200-400 words.
  - `content/blog/2026-peak-website.md` — meta post about rebuilding the portfolio to "peak" grade. 400-800 words. Include h2 sections, code samples (tests rehype-pretty-code), a comparison table (tests GFM).
  Add `pages/` content type to `lib/pages.tsx` (new thin wrapper) reading from `content/pages/`. Route: `app/now/page.tsx` and `app/uses/page.tsx` (or `app/[slug]/page.tsx` for unified handling).
  Must NOT do: Do NOT write marketing copy. Do NOT use first-person marketing tone. Do NOT exceed 800 words per file. Do NOT add image files.
  Parallelization: Wave 2 | Blocked by: T1 (Zod schema, but content can be drafted without it) | Blocks: T4
  References: `lib/blog.tsx`, `lib/projects.tsx`, `lib/markdown.ts:6-13` (extend for page schema)
  Acceptance criteria: Files exist, frontmatter parses, routes render via `pnpm build`
  QA scenarios: `pnpm test` markdown.test.ts still passes; visual: `/now`, `/uses`, blog post all render
  Evidence: `.omo/evidence/task-3-peak-website.txt`
  Commit: Y | content: add /now, /uses, peak-website post

- [x] 4. Wire tags into Zod schema + render on detail pages
  What to do: After T1's schema extension, render `tags` as clickable pills on `app/blog/entry/[slug]/page.tsx` and `app/projects/entry/[slug]/page.tsx`. Pills route to `/blog?tag=foo` (or `/projects?tag=foo`) — simple client-side filter on listing pages.
  Update Zod test in `lib/markdown.test.ts` to assert `tags` default.
  Must NOT do: Do NOT build a dedicated `/blog/tag/[slug]` route (defer — content volume too low). Do NOT add filtering UI to listing pages if scope-tight.
  Parallelization: Wave 2 | Blocked by: T1 (schema), T3 (content with tags) | Blocks: T11
  References: `lib/markdown.ts:6-13`, `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`
  Acceptance criteria: Pills render with correct text; `pnpm test` passes after updating `markdown.test.ts`
  QA scenarios: visual: pills appear; visual: click filter (if implemented) — else skip
  Evidence: `.omo/evidence/task-4-peak-website.txt`
  Commit: Y | feat(blog): render post tags as pills

- [x] 5. Reading time + table of contents + scroll-spy
  What to do:
  - Add `reading-time` to `lib/markdown.ts` — export `getReadingTime(body: string): number`.
  - Render reading time pill on blog/project detail pages (e.g. "5 min read").
  - Build TOC sidebar: rehype plugins `rehype-slug` + `rehype-autolink-headings` extract h2/h3 with IDs; custom IntersectionObserver in client component scrolls-spy.
  - Place TOC sidebar on blog detail only (long-form content). Position: right side on `lg:`, collapse to top-of-article `<details>` on mobile.
  Must NOT do: Do NOT add a third-party TOC lib. Do NOT add scroll-spy to project pages (mostly short).
  Parallelization: Wave 3 | Blocked by: T1 (deps) | Blocks: T11
  References: `app/blog/entry/[slug]/page.tsx`, `lib/markdown.ts:6-13`, react-markdown docs
  Acceptance criteria: TOC sidebar renders h2/h3 links; click jumps to section; current section highlighted; reading time shows on detail pages
  QA scenarios: Playwright e2e: visit blog post, assert TOC exists, click a link, verify URL hash + scroll; reduced-motion test still passes
  Evidence: `.omo/evidence/task-5-peak-website.txt`
  Commit: Y | feat(blog): reading time + TOC sidebar with scroll-spy

- [x] 6. Syntax highlighting + GFM + auto-OG image + per-post JSON-LD
  What to do:
  - Add `rehype-pretty-code` + `remark-gfm` to react-markdown in `app/blog/entry/[slug]/page.tsx` and `app/projects/entry/[slug]/page.tsx`.
  - Create `app/opengraph-image.tsx` using `next/og` `ImageResponse` — site name, tagline, terracotta background.
  - Create `app/blog/entry/[slug]/opengraph-image.tsx` — post title, author, date, terracotta theme.
  - Extend `generateMetadata` in blog detail page to emit `BlogPosting` JSON-LD: `datePublished`, `author`, `headline`, `image`.
  Must NOT do: Do NOT add KaTeX (math). Do NOT add MDX. Do NOT change OG image dimensions (use 1200x630).
  Parallelization: Wave 3 | Blocked by: T1 (deps) | Blocks: T11
  References: `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`, Next.js ImageResponse docs
  Acceptance criteria: code blocks render with syntax highlighting; tables render; OG image generates at build time; JSON-LD validates against schema.org
  QA scenarios: Playwright e2e: visit blog post with code block, assert highlighted classes present; build: OG image files emitted in `.next/`
  Evidence: `.omo/evidence/task-6-peak-website.txt`
  Commit: Y | feat(content): Shiki highlighting, GFM, auto-OG, BlogPosting JSON-LD

- [x] 7. Motion micro-interactions + page reveal
  What to do:
  - Install `motion`. Wrap homepage hero content with `<motion.div>` stagger animation (delay 100ms between h1, p, button — use `useReducedMotion` for R15.7).
  - Add page reveal: top-level `<motion.main>` in `app/layout.tsx` with fade-in on mount.
  - Card hover: extend `ProjectTeaser` and `ArticleTeaser` with subtle scale + shadow on hover (Motion spring, prefers-reduced-motion-safe).
  Must NOT do: Do NOT use GSAP. Do NOT add scroll-narrative hero. Do NOT exceed ~5KB of Motion code.
  Parallelization: Wave 4 | Blocked by: T1 (deps) | Blocks: T11
  References: `app/page.tsx`, `app/layout.tsx`, `components/ProjectTeaser/ProjectTeaser.tsx`, `components/ArticleTeaser/ArticleTeaser.tsx`
  Acceptance criteria: homepage stagger visible on load (test with motion-safe); reduced-motion media query honored; card hover has scale + shadow transition
  QA scenarios: Playwright e2e with `prefers-reduced-motion: reduce` — verify no animations; without — verify animations present
  Evidence: `.omo/evidence/task-7-peak-website.txt`
  Commit: Y | feat(motion): page reveal + card hover + hero stagger

- [x] 8. App Router hygiene — loading.tsx + error.tsx + global-error.tsx
  What to do:
  - `app/loading.tsx` — centered spinner/skeleton using existing tokens. Use Cinzel for "Loading..." text.
  - `app/error.tsx` — `"use client"` ErrorBoundary with reset button, terracotta accent.
  - `app/global-error.tsx` — root error fallback (renders own `<html>`).
  Must NOT do: Do NOT add a per-route loading.tsx (one app-level is sufficient).
  Parallelization: Wave 4 | Blocked by: — | Blocks: T11
  References: Next.js App Router error.tsx docs, current app/layout.tsx
  Acceptance criteria: `pnpm build` succeeds; manual: navigate during build, see loading state; trigger an error (artificial), see fallback
  QA scenarios: Playwright e2e: assert loading.tsx text present if accessible (or skip — loading is transient); e2e static-routes spec still passes
  Evidence: `.omo/evidence/task-8-peak-website.txt`
  Commit: Y | feat(app): loading, error, global-error boundaries

- [x] 9. RSS feed + sitemap polish
  What to do:
  - Create `app/feed.xml/route.ts` using `feed` npm. Generate RSS 2.0 for all blog posts (most recent first, full content in `<description>`, link to post).
  - Add `<link rel="alternate" type="application/rss+xml">` in `app/layout.tsx` metadata pointing to feed.
  - Verify `app/sitemap.ts` already covers all routes (audit confirms yes).
  Must NOT do: Do NOT add Atom + JSON Feed (RSS only). Do NOT add feed for projects.
  Parallelization: Wave 5 | Blocked by: T1 (feed dep) | Blocks: T11
  References: `app/sitemap.ts`, `app/layout.tsx`
  Acceptance criteria: `/feed.xml` returns valid RSS XML; `<link>` tag in layout; RSS reader can subscribe
  QA scenarios: `curl http://localhost:3000/feed.xml` returns valid XML; validate against W3C feed validator
  Evidence: `.omo/evidence/task-9-peak-website.txt`
  Commit: Y | feat(seo): RSS feed

- [x] 10. Lighthouse CI + axe-playwright + DESIGN.md rewrite
  What to do:
  - `.github/workflows/lighthouse.yml` — `treosh/lighthouse-ci-action@v12`, run on PR, assert ≥90 perf/a11y/seo/best-practices.
  - Extend `e2e/static-routes.spec.ts` with `@axe-core/playwright` scan on each route.
  - Rewrite `DESIGN.md`: update palette table (terracotta + warm marble + gold), typography table (add Cinzel heading), motion section (add Motion library), update color/typography rules.
  Must NOT do: Do NOT make Lighthouse CI blocking on first PR (start as informational, gate after baseline).
  Parallelization: Wave 5 | Blocked by: T1 (axe dep) | Blocks: T11
  References: `.github/workflows/check.yml` (existing CI pattern), `e2e/static-routes.spec.ts`, current `DESIGN.md`
  Acceptance criteria: workflow file syntactically valid; axe scan runs in e2e (existing tests still pass); DESIGN.md sections match current code
  QA scenarios: `pnpm e2e:headless` includes axe assertions; visual: DESIGN.md matches reality
  Evidence: `.omo/evidence/task-10-peak-website.txt`
  Commit: Y | chore(ci+docs): Lighthouse CI, axe-playwright, DESIGN.md update

- [x] 11. Full verification gate
  What to do: Run `pnpm lint`, `pnpm prettier`, `pnpm build`, `pnpm test`, `pnpm e2e:headless` (if Chromium available). All must pass.
  Parallelization: Wave 6 | Blocked by: T1-T10 | Blocks: Final Wave
  References: package.json scripts
  Acceptance criteria: All 5 commands exit 0
  QA scenarios: Manual run all 5; if any fails, fix and rerun
  Evidence: `.omo/evidence/task-11-peak-website.txt`
  Commit: N (verification only)

## Final verification wave
- [x] F1. Plan compliance audit — APPROVE (11 todos done, deps present, 15 suites/91 tests, build clean, DESIGN.md updated)
- [x] F2. Code quality review — APPROVE (no TODOs, no as-any, no console.log, no skip, all modules <250 LOC, reduced-motion guards)
- [x] F3. Real manual QA — APPROVE (all 15 scope items verified: content depth, reading time, TOC, tags, JSON-LD, motion, RSS, OG, /now, /uses, syntax highlighting, Lighthouse CI, error states)
- [x] F4. Scope fidelity — APPROVE (all 12 Scope IN delivered, no Scope OUT leaks, build clean, 91 tests pass)

## Commit strategy

11 conventional commits, one per implementation todo. Each commit passes `pnpm lint && pnpm prettier && pnpm build && pnpm test`. Squash at PR merge if requested.

## Success criteria

- All 11 implementation todos complete with verification evidence
- All 4 final-wave reviewers APPROVE
- `pnpm build` exits 0 with no warnings (Flowbite lint warnings acceptable)
- `pnpm e2e:headless` exits 0 (including axe scans)
- Lighthouse CI workflow file exists and is syntactically valid
- `/now`, `/uses`, RSS feed, OG images, TOC sidebar, syntax highlighting, Motion animations, loading/error states all live on the deployed preview URL
- Conventional commit history preserved (one commit per todo)
- Roman palette preserved (no regression on F1-F4 from previous redesign)

