# Boulder: Content audit AI-tells and search-spam extension

Status: completed — commits `46f03e5`, `aa35eaf`; Check, Playwright, and Bundle green; Lighthouse TBT flaked on the shared host
Plan: `.omo/plans/2026-content-audit-seo-extension.md`
Started: 2026-10-23
Owner: default

## Tasks

- [x] T1 capture baseline audit and focused test result
- [x] T2 add positive/negative fixtures for the new rules
- [x] T3 implement vague attribution, hedging, formulaic phrase, outline conclusion, and promotional language rules
- [x] T4 implement keyword-stuffing and duplicate-content analysis
- [x] T5 run the expanded audit and rewrite real findings
- [x] T6 update docs and any test fixture affected by content changes
- [x] T7 run full verification and prove the CLI failure path
- [x] T8 commit, push, and verify CI

## Verification

Evidence: `.omo/evidence/task-content-audit-seo-extension.txt`

- Baseline audit: PASS over 34 Markdown files and 60 TSX copy files, 22,072 prose words.
- Expanded audit: four findings, then PASS after rewriting the recipe title/meta/heading and the duplicated project-result template.
- Focused tests: 37 pass. Full Jest: 46 suites / 288 tests pass.
- Typecheck: pass. Lint: pass with 26 pre-existing warnings, 0 errors. Prettier: pass.
- Production build: pass, 173 static pages.
- Storybook: 13 suites / 16 tests pass. Contrast, design tokens, image budget, font budget: pass.
- CLI failure proof: temporary fixture exits 1 with `keyword-stuffing` and `vague-attribution`.
- CI commit `46f03e5`: Check run 3943 success, including the content audit at 22,045 words; Playwright run 3946 success (100 tests); screenshots run 3947 success.
- CI commit `46f03e5`: Lighthouse run 3944 and Bundle Analysis run 3945 failed on transient network errors (Google Fonts and data.forgejo.org unreachable). Dispatched reruns 3958 and 3959 both succeeded.
- CI commit `aa35eaf`: Check run 3966 success (content audit PASS at 22,045 words), Playwright run 3969 success (100 tests), Bundle Analysis run 3968 success.
- CI commit `aa35eaf`: Lighthouse run 3967 failed on TBT (host load); dispatched rerun 3979 also failed on TBT. Host load average was 37–52 during the runs. This is the documented shared-host Lighthouse flake, and the diff does not touch runtime JS.

## File ownership

- `scripts/content-audit/**`
- `scripts/check-content-slop.js` (only if CLI behavior changes)
- `docs/content-audit.md`
- `README.md` (only if commands or scope change)
- `content/blog/2019-ebeltoft-cheesecake-recipe.md`
- `app/blog/entry/[slug]/page.test.tsx`
- `components/ArticleCard/ArticleCard.test.tsx`
- `components/ArticleCard/ArticleCard.stories.tsx`
- `.omo/plans/2026-content-audit-seo-extension.md`
- `.omo/boulders/task-content-audit-seo-extension.md`
- `.omo/evidence/task-content-audit-seo-extension.txt`

## Guardrails

- Do not weaken a rule, threshold, assertion, or existing narrative floor.
- Do not add a global allow file; exemptions stay line-local and reviewed.
- Do not flag em dashes, curly quotes, title case, or boldface on their own.
- Do not claim Google penalizes AI assistance; describe the spam/quality distinction accurately.
- Preserve facts, first-person voice, URLs, and content dates.
- Every finding must include rule, file, line, excerpt, and actionable remediation.
