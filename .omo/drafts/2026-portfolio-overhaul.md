---
slug: 2026-portfolio-overhaul
status: ready-for-approval
intent: clear
review_required: false
pending-action: awaiting user approval to begin execution
round1_momus: REJECT — 3 blockers (circular dep 9↔11, test overlap 22/26-28, verification contradiction)
round1_oracle: REJECT — 9 findings (AGENTS.md scope, missing scripts, Jest/Vitest, lefthook, Flowbite risk, no baseline, missing responsive audit, circular dep, SSR regression)
revisions_applied: All 12+ R1 findings addressed. Content move before dedup. AGENTS.md split into 3 batches (3a/3b/3c). Jest locked. pre-commit kept. Baseline measurements added (todo 5). Flowbite audit added (todo 17). Responsive audit added (todo 31). Content smoke check added (todo 16). Human gates explicit.
round2_momus: REJECT — 2 blockers (missing boilerplate copy todo, todo 5 dependency gap) + 6 minors
round2_oracle: REJECT — 3 HIGH (RESEND_API_KEY, CI pnpm setup, preinstall ordering) + 2 MEDIUM (--passWithNoTests, AGENTS.md auto-script guidance)
revisions_applied_r2: All 7 blockers fixed. Todo 12b added (boilerplate copy). Todo 5 deps (2,4). RESEND_API_KEY optional. CI pnpm/action-setup. preinstall ordering. --passWithNoTests removal. AGENTS.md auto-script preference.
round3_momus: REJECT — 3 new small blockers (F1 stale count 32→35, commit strategy 34→35, dep matrix todo 17 missing ,16) + 4 minors
round3_oracle: PASS with 2 MEDIUM (cr.yml removal, AGENTS.md merge sequential) + 3 LOW watch-items
revisions_applied_r3: All 3 Momus blockers fixed (counts updated, dep matrix corrected). cr.yml removal added to todo 4. AGENTS.md merge mandated sequential. Icon map placeholder defined. Content slug stability note added.
round4_momus: REJECT — 4 blockers (count mismatch 35→37, dep matrix todo 9 Blocks 24→28, dep matrix todo 10 Blocks 24→29, 3a/3b acceptance criteria unscoped grep) + 5 minors
round4_oracle: PASS — 4 MEDIUM (Node version mismatch dev vs CI, AGENTS.md no coherence pass, human-gate latency, Storybook double-install) + 4 LOW
revisions_applied_r4: All 4 Momus blockers fixed (35→37 count across all 4 locations + draft, dep matrix corrected, 3a/3b grep scoped). Phantom "18-prep" removed from dep matrix. Node version update (v18→22) added to todo 4. Storybook test-runner already-installed fixed. Wave 1 range clarified.
final_todo_count: 37 (numed) + 4 final verification = 41 checkboxes total
plan_file: .omo/plans/2026-portfolio-overhaul.md
approach: Six-phase overhaul of TomSegbers.de into a Senior-Dev-hire portfolio site. Foundation (AGENTS.md + Nix/direnv), Cleanup (bug fixes + boilerplate removal), Content (rewrite 24 markdown entries), Design (Flowbite refinement + typography/spacing polish), Tests (TDD: unit + component + e2e), Polish (README, metadata, Lighthouse). All 40 AGENTS.md rule categories ported and adapted. TDD for all code changes. Nix flake + direnv replaces yarn.
---

# Draft: 2026-portfolio-overhaul

## Components (topology ledger)
| id | outcome | status | evidence path |
| -- | ------- | ------ | ------------- |
| C1 | Comprehensive AGENTS.md — all 40 rule categories adapted to this project | active | .omo/evidence/task-agents-2026-portfolio-overhaul.txt |
| C2 | Nix flake + direnv — Node 22, pnpm, reproducible shell | active | .omo/evidence/task-nix-2026-portfolio-overhaul.txt |
| C3 | Bug fixes + boilerplate cleanup — ProjectTeaser fs crash, Footer alt, middleware, dead e2e, duplicate code | active | .omo/evidence/task-fixes-2026-portfolio-overhaul.txt |
| C4 | Content rewrite — 21 projects + 3 blog posts, AI voice → personal/story-driven | active | .omo/evidence/task-content-2026-portfolio-overhaul.txt |
| C5 | Design/UI refinement — typography, spacing, color, dark mode, micro-interactions (keep Flowbite) | active | .omo/evidence/task-design-2026-portfolio-overhaul.txt |
| C6 | Test infrastructure — TDD: unit (lib/components), e2e (all routes), Storybook smoke | active | .omo/evidence/task-tests-2026-portfolio-overhaul.txt |

## Open assumptions (announced defaults)
| assumption | adopted default | rationale | reversible? |
| ---------- | --------------- | --------- | ----------- |
| Next.js version | Stay on 14 | Stable, works; 15/16 adds migration risk with zero payoff for static content site | Yes |
| Markdown location | Move from app/ to content/ | Cleaner separation; matches README docs. Files shouldn't live in app/ | Yes |
| Linter | Keep ESLint + Prettier | Already configured and working; Biome migration is a separate concern | Yes |
| Package manager | pnpm via Nix | Industry standard, faster than yarn v1, nix-provided | Yes |
| Email service | Keep Resend | Works, minimal, already configured | Yes |
| Hosting | Keep Vercel (assumed) | Not discussed; staying on current deployment | Yes |

## Findings (cited - path:lines)
- ProjectTeaser.tsx:48-53 — `fs.accessSync(process.cwd(), ...)` in client component; will crash in browser
- Footer.tsx:24-47 — alt text bugs: LinkedIn→"Facebook Logo"(L24), Email→"Dribble Logo"(L45)
- middleware.ts:6-8 — redirects next-enterprise.vercel.app → Blazity; boilerplate
- e2e/example.spec.ts:6 — asserts title "Next.js Enterprise Boilerplate"; dead test
- app/blog/page.tsx:18-43 — duplicates getAllBlogPosts() logic from lib/blog.tsx instead of importing
- lib/blog.tsx + lib/projects.tsx — 95% identical copy-paste; no shared abstraction
- ArticleTeaser.tsx:5,94-101 — imports prop-types alongside TypeScript; redundant
- ProjectTeaser.tsx:22-31 — ctaText, buttonText, buttonLink declared but never used in JSX
- Tooltip.tsx — CVA has single-value variants (intent: primary only, size: md only); hollow abstraction
- tailwind.config.js:20-32 — primary color scale exists but no semantic tokens; hardcoded blue palette
- AGENTS.md — 200+ rules from pr0gramm-downloader project; completely unrelated to this codebase
- README.md — 95% boilerplate describing unused features (ChatGPT review, semantic-release, health checks)
- app/blog/page.tsx:52 — "We use an agile approach to test assumptions"; boilerplate copy
- Footer.tsx:13 — © 2019-2024; stale for 2026
- No test files exist anywhere (jest.config.js runs --passWithNoTests)
- 3 blog posts in app/blog/entry/*.md, 21 project entries in app/projects/entry/*.md

## Decisions (with rationale)
1. **AGENTS.md: full 40 categories** — user chose comprehensive over essential-only. Maximum agent discipline.
2. **Content rewrite: agent does all** — user chose agent rewrite with Tom review. 24 entries.
3. **UI: keep Flowbite, refine** — user chose minimal churn, focus on typography/spacing/polish.
4. **Tests: TDD** — user chose strict discipline. Write failing tests before every fix/feature.

## Scope IN
- AGENTS.md: all 40 rule categories adapted and written
- Nix: flake.nix + flake.lock + .envrc (use flake)
- pnpm: yarn.lock → pnpm-lock.yaml, package.json scripts updated
- Fix: ProjectTeaser fs bug, Footer alt text, middleware redirect, e2e test, code duplication
- Content: rewrite all 24 markdown entries in personal voice
- Content: move .md files from app/*/entry/ → content/*/
- Design: typography tokens, spacing system, color refinement, dark mode audit, micro-interactions
- Design: semantic color tokens replacing hardcoded blue palette
- Tests: unit tests for lib/blog.tsx, lib/projects.tsx, lib/sendEmail.tsx
- Tests: component tests for all 8 components
- Tests: Playwright e2e for all 7 routes
- Tests: Storybook smoke tests for 3 stories
- README: rewritten for the actual project
- Footer: copyright updated to 2026
- Metadata: OG images, descriptions, viewport config
- Component: remove prop-types from ArticleTeaser
- Component: remove unused props from ProjectTeaser
- Component: fix Tooltip CVA (add real variants or remove)
- Deduplication: extract shared markdown reader from blog.tsx + projects.tsx → lib/markdown.ts
- Blog index: use lib function instead of inline duplicate

## Scope OUT (Must NOT have)
- New projects (Layzr.gg, Hammer Robotics) — deferred to future plan
- New blog posts — deferred to future plan
- CMS or database — stays filesystem markdown
- Hosting migration — stays on current deployment
- Biome migration — stays ESLint + Prettier
- Next.js 15/16 migration
- Third-party analytics, SEO tooling, or tracking
- Animation framework or heavy JS effects
- Contact form changes beyond email validation fix

## Open questions
(None remaining — all forks resolved in interview)

## Approval gate
status: approved
User said: "poceede to write the plan, then do a double deep review"
Next: generate full plan, run Metis gap analysis, run dual high-accuracy review (Momus + Oracle)
