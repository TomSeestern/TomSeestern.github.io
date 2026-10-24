# Content Audit: AI-Tells and Search-Spam Extension

## TL;DR

Extend the existing deterministic content audit with additional high-confidence AI-writing tells and Google-spam/search-quality anti-patterns. Every new rule gets positive and negative fixtures plus the committed-corpus gate. Any real content finding is rewritten, not exempted. The audit still reports evidence, not authorship.

## Research basis

- Google Search spam policies: keyword stuffing, scaled content abuse, scraping/duplicate content, doorway abuse, and thin affiliate pages. Appropriate AI assistance is not itself a violation; using automation primarily to manipulate rankings is.
- Google helpful-content guidance: original information, descriptive non-exaggerated titles, first-hand experience, and people-first rather than search-engine-first content.
- Wikipedia, *Signs of AI writing*: vague attribution/weasel wording, hedging disclaimers, phrasal templates, outline-like challenge/future conclusions, promotional language, and other high-confidence patterns. The page is descriptive, not proof of authorship.
- Deliberately excluded as weak or false-positive-prone: em dashes, curly quotes, isolated transitions, perfect grammar, title case (the site uses title case deliberately), boldface density (the recipe uses functional labels), and heading-level checks (project bodies start at H2 because the page supplies the H1).

## New rules

### AI-writing tells

- `vague-attribution`: unsourced authority claims such as “experts say”, “studies show”, “research suggests”, “many believe”, “it is widely believed”, and “according to sources”. A same-line link or footnote suppresses the finding.
- `hedging-disclaimer`: “it is important to note”, “it is worth noting”, “needless to say”, “it goes without saying”, and similar didactic padding.
- `formulaic-phrase`: “when it comes to”, “at its core”, “in a nutshell”, “here’s the thing”, “whether you’re a … or a …”, “look no further”, and related stock phrases.
- `outline-conclusion`: rigid “despite its challenges”, “faces challenges”, “the future of … lies in”, “continues to evolve”, “only time will tell”, and “the possibilities are endless” endings.
- `promotional-language`: high-confidence hype adjectives and phrases such as “unforgettable”, “irresistible”, “breathtaking”, “must-see”, “hidden gem”, and “something for everyone”.

### Google search-quality / spam anti-patterns

- `keyword-stuffing`: a three-content-word phrase repeated at least five times and occupying at least 2% of the document’s words. The threshold is intentionally conservative; ordinary technical repetition stays below it.
- `duplicate-content`: an exact 12-word span shared by two Markdown content files. This catches copied/scraped text, not paraphrases; the limitation is documented.

## Scope

- `scripts/content-audit/rules.js`: rule metadata and prose patterns.
- `scripts/content-audit/repetition.js`: keyword-stuffing and cross-document shingle analysis.
- `scripts/content-audit/audit.js`: wire the new checks into Markdown and repository-level runs.
- `scripts/content-audit/rules.test.js`: positive and negative fixtures for every new rule, including the same-line citation exception and cross-file duplicate detection.
- `docs/content-audit.md`: rule table, research basis, Google policy distinction, and detection limits.
- `content/blog/2019-ebeltoft-cheesecake-recipe.md` and its page test fixture: rewrite promotional title/meta/heading if the new rule flags them.
- `.omo/` plan, boulder, and evidence files.

## Out of scope

- Statistical watermark detection (`textGrain`, SynthID).
- Paraphrase detection or semantic similarity.
- Ranking predictions, authorship scoring, or claims that Google “punishes AI writing”.
- New dependencies.
- Unrelated site architecture or design changes.

## Success criteria

1. `pnpm content:audit` exits 0 over the committed Markdown and TSX corpus.
2. `pnpm test --runInBand scripts/content-audit/rules.test.js` passes with a positive and negative fixture for every new rule.
3. The committed-corpus gate still fails on any finding.
4. A temporary fixture proves the CLI exits 1 for at least one new rule.
5. `pnpm typecheck`, `pnpm lint`, `pnpm prettier`, `pnpm test --runInBand`, and `pnpm build` exit 0.
6. `docs/content-audit.md` states the Google policy distinction and the exact detection limits.
7. No existing rule, threshold, or project narrative floor is weakened.

## Verification plan

1. Capture the baseline audit and the focused test result before changes.
2. Add fixtures first, observe the expected failures, then implement the rules.
3. Run the audit; rewrite real findings without allow directives.
4. Run the focused suite, full Jest suite, typecheck, lint, Prettier, and production build.
5. Prove the CLI failure path with a temporary fixture.
6. Commit and push; verify Forgejo CI.

## Outcome

- Added seven rule families: `vague-attribution`, `hedging-disclaimer`,
  `formulaic-phrase`, `outline-conclusion`, `promotional-language`,
  `keyword-stuffing`, and `duplicate-content`.
- Added `scripts/content-audit/repetition.js` for conservative three-word phrase
  density and exact 12-word cross-document shingles.
- The first expanded run found four findings: three promotional phrases in the
  Ebeltoft cheesecake title/meta/heading, and a duplicated project-result template
  shared by AudioForge and FullSound. Both were rewritten.
- The duplicate rule exposed a cross-file dedupe bug in `addFinding`: the default
  key omitted the file path. The key now includes the file, and the duplicate
  fixture asserts that both files report the finding.
- Focused tests: 37 pass. Full Jest: 46 suites / 288 tests pass. Typecheck, lint
  (26 pre-existing warnings, 0 errors), Prettier, production build (173 pages),
  Storybook (13 suites / 16 tests), contrast, design tokens, image budget, and font
  budget pass.
- CLI failure proof: a temporary fixture with a repeated `best seo agency` phrase
  and `Experts say` exits 1 with `keyword-stuffing` and `vague-attribution`.
- Commit `46f03e5` pushed to `origin/main`; follow-up `aa35eaf` updates the CLI
  usage text. CI Check run 3966 passed on `aa35eaf`, including the content audit
  at 22,045 words. Playwright run 3969 passed (100 tests), Bundle Analysis run
  3968 passed, and the `46f03e5` screenshots run 3947 passed.
- Lighthouse run 3967 failed on total-blocking-time, and dispatched rerun 3979
  failed the same assertion while the shared host load average was 37–52. This is
  the documented shared-host Lighthouse flake; the diff does not touch runtime
  JavaScript. The canonical Check workflow is green.
