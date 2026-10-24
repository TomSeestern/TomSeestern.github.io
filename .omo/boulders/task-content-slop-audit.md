# Boulder: Content slop audit

Status: completed and pushed — commits `f80f2d7`, `69f60f0`; CI Check success
Plan: `.omo/plans/2026-content-slop-audit.md`
Extension: `.omo/boulders/task-content-audit-seo-extension.md`
Started: 2026-10-23
Owner: default

## Tasks

- [x] T1 implement rule engine and extractors
- [x] T2 add fixture tests for every rule family
- [x] T3 wire `pnpm content:audit` and capture baseline
- [x] T4 rewrite Markdown content findings
- [x] T5 rewrite published UI copy findings
- [x] T6 add docs and CI step
- [x] T7 run full verification
- [x] T8 commit and push

## Verification

Evidence: `.omo/evidence/task-content-slop-audit.txt`

- Baseline: 60 findings across 25 files.
- Final audit: PASS over 34 Markdown files and 60 TSX copy files, 22,072 prose words.
- Typecheck: pass. Lint: pass with 26 pre-existing warnings, 0 errors. Prettier: pass.
- Jest: 46 suites / 274 tests pass, including 23 audit fixtures and the committed-repo gate.
- Production build: pass, 173 static pages.
- Storybook: 13 suites / 16 tests pass against the static build.
- Contrast, design tokens, images, fonts: pass.
- Production `next start` route checks: 12 changed routes return expected copy.
- CLI failure proof: a fixture with a `not just ... but` sentence and U+200B exits 1 with two findings.
- CI Check: final commit `69f60f0` run 3919 passed; its log shows the content audit step PASS.
- Final commit CI: Check, Lighthouse, bundle analysis, and Playwright all passed. The content commit had one Lighthouse TBT flake that also occurred on `7cdd8ed`; the rerun passed.
- Existing 450-word project narrative floor caught one shortened case file; restored it to 453 words rather than lowering the test.
- No content exemption directives were needed.

## File ownership

- `scripts/content-audit/**`
- `scripts/check-content-slop.js`
- `scripts/content-audit/rules.test.js`
- `package.json`
- `.forgejo/workflows/check.yml`
- `docs/content-audit.md`
- `README.md`
- `content/blog/**`
- `content/projects/**`
- `app/**/*.tsx`
- `components/**/*.tsx`
- `.omo/plans/2026-content-slop-audit.md`
- `.omo/boulders/task-content-slop-audit.md`
- `.omo/evidence/task-content-slop-audit.txt`

## Guardrails

- Do not weaken a rule to make content pass.
- Do not flag em dashes or curly quotes by themselves.
- Do not claim to detect `textGrain`, SynthID, or any statistical watermark from plain text.
- Preserve facts, first-person voice, public URLs, and content dates.
- Do not touch legal placeholder copy or unrelated site architecture.
- Every finding must be actionable: rule, file, line, excerpt, rationale.
