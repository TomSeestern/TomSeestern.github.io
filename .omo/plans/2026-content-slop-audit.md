# Content Slop Audit

## TL;DR

Add a deterministic, repo-owned gate that scans every published prose surface for high-confidence AI-writing patterns, hidden Unicode, prompt residue, and metadata-like artifacts. Then rewrite every finding without weakening the rule set. The gate is not an AI detector: it reports concrete evidence and documents the limits of statistical text watermarks.

## Scope

- Markdown content: `content/blog/*.md`, `content/projects/*.md`.
- Published UI copy: visible strings and JSX text in `app/**/*.tsx` and `components/**/*.tsx`, excluding tests and stories.
- Audit implementation: `scripts/content-audit/`, `scripts/check-content-slop.js`.
- Tests: focused Jest fixture tests for every rule family and extraction path.
- Command: `pnpm content:audit`.
- CI: add the audit to `.forgejo/workflows/check.yml`.
- Docs: `docs/content-audit.md`, plus README script/Content references.

## Out of scope

- README, AGENTS.md, ADRs, `.omo/`, vendored skill docs, and code comments. These are internal documentation, not published site copy.
- Image provenance/C2PA scanning. The audit covers text artifacts only.
- Statistical watermark detection. OpenAI `textGrain` and Google SynthID change token-choice probabilities; they do not insert hidden characters. Provider detectors are keyed and not available to this repo.
- Em dashes and curly quotation marks as violations. Both are legitimate site style and unreliable indicators on their own.

## Research basis

- Wikipedia, *Signs of AI writing*: significance inflation, promotional language, superficial `-ing` analysis, negative parallelism, rule of three, inline-header lists, canned conclusions, emoji formatting. The page is explicitly descriptive, not proof.
- OpenAI, *Provenance signals in OpenAI-generated content*: `textGrain` is an invisible statistical watermark; it "does not add hidden characters, invisible spaces, or unusual punctuation." Text detector access is limited.
- Google DeepMind, *SynthID*: text watermarking adjusts token probabilities; detection is provider-side.
- Consequence: hidden-character and prompt-residue checks are real; statistical watermark detection from plain Markdown is not.

## Rule set

### Artifact rules

- `hidden-unicode`: zero-width characters, bidi controls, soft hyphens, tag characters, interlinear annotations, C0/C1 controls, BOMs.
- `prompt-artifact`: model chat tokens (`<|im_start|>`, `[INST]`, `<<SYS>>`), "As an AI language model", "I hope this helps", canned rewrite preambles, generated-by labels.
- `hidden-markdown-comment`: HTML comments in Markdown content, except the audit's own explicit allow directive.
- `frontmatter-unknown-key`: frontmatter keys outside the schema allowlist.
- `emoji`: emoji used as prose formatting.

### Prose rules

- `negative-parallelism`: "not just X, but Y", "not X; it is Y", "less about X and more about Y", "X rather than Y".
- `significance-inflation`: "a testament to", "stands as", "plays a pivotal role", "underscores the importance", "leaves a lasting impression".
- `promotional-language`: high-confidence slop vocabulary (`seamless`, `cutting-edge`, `world-class`, `revolutionize`, `unlock the potential`, etc.).
- `superficial-analysis`: trailing `-ing` clauses that claim significance (`highlighting`, `underscoring`, `showcasing`, `reflecting`, `demonstrating`).
- `inline-header-list`: vertical lists whose items are bold pseudo-headings; flag at three or more in one list.
- `rule-of-three`: high density of exact three-item coordinated phrases; density-based, not a blanket ban.
- `canned-conclusion`: "In conclusion", "Final thoughts", "Key takeaways", and final-paragraph summary openers.
- `formulaic-intro`: "In this article", "Have you ever wondered", "Imagine a world", "In today's fast-paced world".
- `transition-density`: `Moreover`/`Furthermore`/`Additionally`/`Notably`/`Importantly` above a conservative density threshold.
- `sentence-uniformity`: low sentence-length variance over a long enough sample; reported as a weak signal.

## Severity and false-positive policy

- Every finding has a rule id, file, line, excerpt, and one-line rationale.
- CI fails on any finding. There is no warning-only mode for the gate.
- A deliberate exception uses `<!-- slop-audit-allow: rule-id reason="..." -->` on the line before the match. The directive is parsed, must name at least one rule and a non-empty reason, and suppresses only that rule for the next non-empty line. The directive itself is exempt from `hidden-markdown-comment`.
- Exemptions must be narrow and justified in review. No global phrase mute file.
- A finding is not an accusation about authorship. It is a request to rewrite a concrete pattern.
- Statistical signals (sentence uniformity, tricolon density) use conservative thresholds and are reported with their measured value.

## Implementation steps

1. Add `scripts/content-audit/rules.js`, `extract.js`, `audit.js`, and `scripts/check-content-slop.js`.
2. Add `scripts/content-audit/rules.test.js` with positive and negative fixtures for each family, extraction of Markdown/TSX, allow directives, and CI exit behavior.
3. Add `content:audit` to `package.json`; run it and capture the baseline.
4. Rewrite content and UI copy until the audit exits 0. Preserve first-person voice, factual claims, and existing URLs.
5. Add `docs/content-audit.md` and README references.
6. Add the CI step.
7. Run typecheck, lint, Prettier, Jest, audit, build, and production browser spot checks.
8. Commit and push.

## Success criteria

1. `pnpm content:audit` exits 0 over all 34 Markdown files and all published TSX copy.
2. The audit fails on a knowingly sloppy fixture and on hidden Unicode; tests prove both.
3. The audit ignores fenced code, inline code, URLs, class names, imports, tests, and stories.
4. CI runs the audit on every push and PR.
5. `pnpm typecheck`, `pnpm lint`, `pnpm prettier`, `pnpm test --runInBand`, and `pnpm build` exit 0.
6. No content file contains a hidden-character artifact, prompt residue, or an unexplained negative parallelism.
7. Documentation states plainly which watermarks cannot be detected and why.

## Verification plan

1. Baseline: run the audit against the current tree, save the finding inventory to `.omo/evidence/`.
2. After each content batch, rerun the audit and check the count decreases without rule changes.
3. Prove the gate fails: fixture tests and one deliberate bad temporary input (not committed).
4. Full gates and production route spot checks after the final rewrite.
5. Commit with a conventional message; record exact commands and outputs in evidence.


## Outcome

- Added a four-part gate: `scripts/content-audit/rules.js` (rule data and checks), `scripts/content-audit/extract.js` (Markdown/TSX extraction), `scripts/content-audit/audit.js` (orchestration and report), and `scripts/check-content-slop.js` (CLI).
- The first run found 60 findings across 25 files. The bulk were negative-parallelism templates; the rest were outline lists, significance inflation, formulaic frontmatter, and slop vocabulary.
- All 60 findings were rewritten. A second manual pass found 11 more contrast variants that the first rule set missed; the negative-parallelism patterns were expanded, the new findings were rewritten, and fixtures still pass.
- No allow directives were needed in published content. The directive path is tested, including rejection of a directive without a reason.
- The existing 450-word project narrative test caught one shortened case file. It was restored to 453 words; the floor was not changed.
- `pnpm content:audit` passes over 34 Markdown files and 60 TSX copy files (22,072 prose words).
- Full verification passed: typecheck, lint (26 pre-existing warnings), Prettier, 46 Jest suites / 270 tests, 173-page production build, Storybook 13 suites / 16 tests, contrast, design tokens, images, fonts, and 12 production route checks.
- `docs/content-audit.md` records the rule set, the false-positive policy, and the hard limit that `textGrain` and SynthID cannot be detected from plain Markdown.
- Commits `f80f2d7` and test-only `69f60f0` pushed to `origin/main`; Forgejo `Check` run 3919 passed, including the content audit step.
- Final commit CI: Check, Lighthouse, bundle analysis, and Playwright passed. A Lighthouse TBT flake appeared on the content commit and on the pre-change `7cdd8ed`; the follow-up run passed.

## Extension

The 2026 AI-tells and search-spam extension adds seven rule families, exact
cross-document duplicate detection, and fixtures. See
[`2026-content-audit-seo-extension.md`](./2026-content-audit-seo-extension.md).
