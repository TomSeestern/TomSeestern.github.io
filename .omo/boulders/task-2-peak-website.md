# T2 — Canonical URL, Button, ProjectTeaser cleanup

- Status: in_progress
- Plan: `.omo/plans/peak-website.md` todo 2
- Dependencies: T1 dependency declared by plan; package changes already present in worktree and left untouched
- Owned files:
  - `app/blog/entry/[slug]/page.tsx`
  - `app/projects/entry/[slug]/page.tsx`
  - `app/page.tsx`
  - `app/projects/page.tsx`
  - `components/ProjectTeaser/ProjectTeaser.tsx`
  - `components/ProjectTeaser/ProjectTeaser.test.tsx`
  - `public/img/Tom_Segbers_Frontal.jpg`
  - `.omo/notepads/roman-redesign/learnings.md`
  - `.omo/notepads/peak-website/learnings.md`
  - `.omo/evidence/task-2-peak-website.txt`

## Steps

- [x] Inspect current files and resolve stale line references
- [x] Fix detail-page canonical URLs
- [x] Replace homepage inline CTAs with `Button`
- [x] Remove dead `ProjectTeaser.imageUrl` prop and all callers (including test fixture and Storybook story)
- [x] Apply readonly to re-touched `ProjectProps` interface
- [x] Delete duplicate JPEG
- [x] Append learnings
- [x] Run diagnostics — `pnpm lint` exit 0, `pnpm test` exit 0 (84 tests), `pnpm build` exit 0 (38 pages)
- [x] Finalize evidence
- [ ] Commit with conventional commit message

