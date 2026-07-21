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
