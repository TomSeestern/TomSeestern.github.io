# Hammer recent highlight + ClosedLoopOS featured swap

## TL;DR

Add a dedicated Recent highlight section to `/projects` for Hammer Robotics.
Keep Hammer as a featured project but render it separately from the other
selected cards. Replace PayMeNow in the featured set with ClosedLoopOS, leaving
four featured projects total: Hammer (highlight), LAYZR, ISeeUNet, ClosedLoopOS.

## Decisions

- Hammer is selected by a new `recentHighlight: true` frontmatter flag, not a
  hardcoded ID in the page.
- `/projects` renders Hammer in a full-width lead card above the selected grid.
- The selected grid filters out the highlight, leaving the other three featured
  projects.
- Home continues to render all four featured projects; its hero lead prefers the
  recent highlight.
- PayMeNow loses `featured: true`; ClosedLoopOS gains it.
- Do not add a duplicate Hammer card to the selected grid.

## Scope

- `lib/markdown.ts` — `recentHighlight` schema/type
- `content/projects/2026-hammer-robotics-mark-humanoid.md` — flag
- `content/projects/2026-closedloop-os-agent-orchestration.md` — featured
- `content/projects/2021-paymenow-...md` — unfeatured
- `app/projects/page.tsx` — highlight section, copy, selected-grid filter
- `app/page.tsx` — featured lead / selected copy
- `README.md` — frontmatter docs
- Content, page, component, and e2e tests
- `.omo/evidence/task-hammer-highlight.txt`

## Steps

- [x] **1. Audit.** Confirm Hammer is already featured and choose the dedicated
  highlight layout; confirm PayMeNow/ClosedLoopOS frontmatter.
- [x] **2. Content flags.** Add `recentHighlight`, promote ClosedLoopOS, demote
  PayMeNow.
- [x] **3. Projects UI.** Render the Hammer highlight above the selected grid and
  exclude it from that grid; update copy and hero anchor.
- [x] **4. Tests/docs.** Update featured inventory, highlight rendering, home
  lead, mocks, and README.
- [x] **5. Verify.** Prettier, typecheck, Jest, design tokens, build, and focused
  browser checks.
- [x] **6. Commit and push.** `5b4471e`.

## Verification

- Frontmatter: 28/28 files pass; ClosedLoopOS featured metrics sourced from its
  repository at `a40904c` (709 test/spec files, 154 API routes, 48 dashboard
  pages).
- Jest: 45/45 suites, 229/229 tests.
- TypeScript: exit 0.
- Lint: 0 errors; Prettier: clean.
- Gates: design tokens, contrast, image size, fonts (after build) all pass.
- Build: 160 static pages.
- Playwright chromium against production build: 100/100 passed.
- Production DOM: Hammer highlight only; selected grid has ClosedLoopOS, LAYZR,
  ISeeUNet; PayMeNow archive-only; mobile overflow 0.
- Evidence: `.omo/evidence/task-hammer-highlight.txt`.
