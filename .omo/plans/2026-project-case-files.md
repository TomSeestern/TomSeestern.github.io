# Project case files — evidence, freshness, and taxonomy

## TL;DR

Fix the six project-case-file findings from the 2026-10-22 audit: remove the two
published TODO/template posts, add evidence (role, outcome, metrics, links,
hero images, repo links) to the archive, add LAYZR and Hammer Robotics plus
current Forgejo work, expand the thinnest entries, normalise the card copy and
grammar, and make the project subject index project-scoped with dynamic counts.
Then verify with Jest, build, image budgets, and the canonical CI command set.

## Scope

- `content/projects/*.md`
- `app/projects/page.tsx`
- `app/projects/entry/[slug]/page.tsx`
- `app/page.tsx`, `components/HomeHero/HomeHero.tsx`
- `components/ProjectDossier/ProjectDossier.tsx`
- `lib/markdown.ts`, `lib/tags.ts`, `lib/projects.tsx`
- `lib/*.test.ts`, `app/projects/*.test.tsx`, `e2e/home.spec.ts`
- `scripts/check-project-frontmatter.js`, `scripts/generate-brand-assets.mjs`
- `README.md` (frontmatter documentation)
- `public/img/projects/*`, `public/img/og-default.png`
- `.omo/evidence/task-project-case-files.txt`

## Source of truth

- `Extensive CV.md` supplied by the author (LAYzR, Hammer Robotics, HAT.tec,
  earlier projects, awards, metrics).
- Public GitHub `TomSeestern` and GitHub orgs (`layzr`, `paymenowde`,
  `hammer-robotics`, `Streamtopia`, `LooperLabs`).
- Self-hosted Forgejo `TomSegbers` (2026 projects, screenshots, READMEs).
- Existing project bodies and `.omo` evidence from T15/T16.

## Steps

- [x] **1. Baseline + source inventory.** Record the current 21-project state, repo scan, and which facts/links are safe to publish. Write `.omo/evidence/task-project-case-files.txt`.
- [x] **2. Schema + dossier links.** Add optional `links: [{label, href}]` to the frontmatter schema/type and render it in `ProjectDossier`; test.
- [x] **3. Project-scoped subjects + dynamic copy.** Add `getAllProjectTags()`, use it on `/projects` for the subject strip and `Subjects` count; derive the archive span and selected-project count from content, and use the same span on About and the home hero. Test that a blog-only tag never appears and counts are project-only.
- [x] **4. Content truth pass.** Rewrite the two template/TODO posts; normalise all 21 `articleContent` summaries to first person; fix article-dropping grammar; add role/outcome where the CV supports it.
- [x] **5. Expand thin entries.** Bring the nine <200-word entries to a useful archive length with CV-sourced detail; add repo links to the public GitHub projects.
- [x] **6. Fresh work from the scan.** Add LAYZR (2020–2024, acquired by Jodel) and Hammer Robotics (2024–present), plus EveryFontEver.com and ClosedLoopOS. Add evidence (metrics, links, hero images), keep exactly four featured projects: Hammer, LAYZR, ISeeUNet, PayMeNow.
- [x] **7. Imagery.** Add optimized project imagery under `public/img/projects/`; keep every file within the image budget.
- [x] **8. Guards + docs.** Add a real-content Jest test (no TODO, required fields, featured evidence), update the frontmatter validator, and document the new fields in README.
- [x] **9. Verification.** `pnpm typecheck`, `pnpm lint`, `pnpm prettier`, `pnpm images`, `pnpm test`, `pnpm build`; Storybook smoke; Chromium Playwright 100/100; focused live checks for `/projects`, `/`, all project detail pages, sitemap, heroes, and dossier links. Record outputs in evidence.
- [x] **10. Commit.** Conventional commit with the content + code changes — `94636cc`.

## Constraints

- Do not invent metrics, users, funding, awards, or links. Use the CV, repo
  READMEs, or public sources.
- Keep private/client material private: no links to private repositories or
  LAN-only Forgejo URLs on the public site.
- Preserve every existing public URL (filenames are slugs). New entries get new
  filenames; existing slugs stay stable.
- Use `heroImage` only for real imagery, not decorative filler.
