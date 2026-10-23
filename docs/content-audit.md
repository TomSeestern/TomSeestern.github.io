# Content Audit

`pnpm content:audit` is a deterministic gate over the prose this site publishes. It
looks for concrete AI-writing tells, Google Search spam and quality anti-patterns,
and hidden-text artifacts, then fails CI with rule, file, line, excerpt, and a
remediation message.

It is not an AI detector. It does not score authorship, and a clean run is not proof
that a person wrote a sentence. It is a style, search-quality, and hygiene check
with a short, reviewable rule set.

Google does not ban AI-assisted content. Its spam policies target scaled, scraped,
deceptive, keyword-stuffed, or otherwise unoriginal content, and its helpful-content
guidance asks for original information, descriptive titles, and first-hand
experience. This gate checks prose-level proxies for those policies. It does not
predict rankings or claim that Google penalizes AI writing as such.

## Scope

The gate scans:

- `content/blog/*.md`
- `content/projects/*.md`
- visible strings and JSX text in `app/**/*.tsx` and `components/**/*.tsx`
- exact duplicate spans shared by two Markdown content files

It ignores tests, stories, imports, `className` values, URLs, fenced code, inline
code, and code comments. Internal documentation such as `README.md`, `AGENTS.md`,
ADRs, and `.omo/` notes is outside the published-content scope.

## Command

```bash
pnpm content:audit
pnpm content:audit --verbose
pnpm content:audit --json
pnpm content:audit content/blog/2026-what-llm-agents-are-missing.md
```

The command exits `1` on any finding. It is part of `.forgejo/workflows/check.yml`
and runs on every push and pull request. The focused Jest suite in
`scripts/content-audit/rules.test.js` runs the same gate over the committed content,
so `pnpm test` catches a regression too.

## Rules

| Rule | What it catches |
| --- | --- |
| `hidden-unicode` | Zero-width spaces and joiners, bidi controls, soft hyphens, tag characters, interlinear annotations, C0/C1 controls, BOMs, replacement characters |
| `prompt-artifact` | Chat-template tokens (`<|im_start|>`, `[INST]`, `<<SYS>>`), "As an AI language model", canned assistant closes, generated-by labels, Lorem ipsum |
| `hidden-markdown-comment` | HTML comments that render invisibly in Markdown |
| `invalid-audit-directive` | A malformed `slop-audit-allow` directive |
| `frontmatter-unknown-key` | Keys outside the content schema, which can carry generator metadata the site never renders |
| `emoji` | Emoji used as prose formatting |
| `negative-parallelism` | `not just X, but Y`, `not X; it is Y`, `not X. It is Y`, `less about X and more about Y`, `I am not ... I am ...` |
| `significance-inflation` | `a testament to`, `stands as`, `plays a pivotal role`, `underscores the importance`, `at the intersection of` |
| `slop-vocabulary` | High-frequency terms such as `delve`, `tapestry`, `seamless`, `cutting-edge`, `leverage`, `robust`, `showcase`, `foster`, `unlock` |
| `superficial-analysis` | Trailing `-ing` clauses that claim significance (`highlighting`, `underscoring`, `showcasing`) |
| `inline-header-list` | Three or more bold pseudo-headings inside one list |
| `rule-of-three` | Three or more exact three-item coordinated phrases in one document |
| `canned-conclusion` | `In conclusion`, `Final thoughts`, `Key takeaways`, generic summary openers |
| `formulaic-intro` | `In this article`, `Have you ever wondered`, `Imagine a world`, `In today's fast-paced world` |
| `transition-density` | Four or more formal transitions (`Moreover`, `Furthermore`, `Additionally`) above 2.5 per 1,000 words |
| `vague-attribution` | `Experts say`, `studies show`, `research suggests`, `many believe`, `it is widely believed`, `according to sources` without a same-line link or footnote |
| `hedging-disclaimer` | `It is important to note`, `it is worth noting`, `needless to say`, `it goes without saying`, `as a general rule` |
| `formulaic-phrase` | `When it comes to`, `at its core`, `in a nutshell`, `here's the thing`, `whether you're a ... or a ...`, `look no further` |
| `outline-conclusion` | `Despite its ... challenges`, `faces challenges`, `the future of ... lies in`, `continues to evolve`, `only time will tell` |
| `promotional-language` | Hype adjectives and phrases such as `unforgettable`, `irresistible`, `breathtaking`, `must-see`, `hidden gem`, `something for everyone` |
| `keyword-stuffing` | A three-content-word phrase repeated at least five times and occupying at least 2% of a document's words |
| `duplicate-content` | An exact 12-word span shared by two Markdown content files |

A bare em dash, a curly quotation mark, or a single three-item list is not a
finding. The site uses em dashes and curly quotes deliberately, and Wikipedia's
current guidance treats em-dash overuse as a historical indicator rather than a
reliable one.

The rule set also leaves out indicators that are too weak or too dependent on house
style: perfect grammar, isolated transition words, title case (the site uses title
case for headings), and boldface on its own (the recipe uses bold labels for
ingredients and steps). It reports the patterns above, not a general impression that
the prose "sounds like AI".

## What the gate cannot detect

Statistical text watermarks are not hidden characters.

- OpenAI's `textGrain` changes the randomness used to choose words. OpenAI states
  that it "does not add hidden characters, invisible spaces, or unusual
  punctuation." Its text detector is limited to approved research and academic
  organizations.
- Google DeepMind's SynthID adjusts token probabilities during generation.
  Detection happens through Google's detector, not by inspecting Markdown.
- C2PA Content Credentials are metadata attached to files such as images and
  audio. A Markdown file does not carry a C2PA manifest for its prose.

This gate therefore detects the artifacts it can prove: hidden Unicode, prompt
residue, invisible comments, unknown metadata keys, and visible prose patterns. It
does not claim to detect `textGrain`, SynthID, or any other statistical watermark.
If that proof is required, use the provider's detector on the original generated
output, not this repository's Markdown.

The search-quality checks have their own limits:

- `duplicate-content` compares exact 12-word shingles. It catches copied or lightly
  edited spans, not paraphrase, translation, or synonym substitution. It is not a
  plagiarism detector and does not compare against the open web.
- `keyword-stuffing` is a conservative density heuristic. Technical writing can
  repeat a term legitimately; the threshold is five three-word repetitions at 2% of
  the document, so ordinary repetition stays below it.
- `vague-attribution` only checks whether a link or footnote is on the same line. It
  does not verify that the source exists, supports the claim, or is authoritative.
- A clean run does not establish originality, expertise, or ranking potential. Those
  require editorial review, source checking, and Search Console data.

Sources:

- [Google Search: Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies)
- [Google Search: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search: Guidance about AI-generated content](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content)
- [OpenAI: Provenance signals in OpenAI-generated content](https://help.openai.com/en/articles/8912793-provenance-signals-in-openai-generated-content)
- [Google DeepMind: SynthID](https://deepmind.google/models/synthid/)
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

The Wikipedia page is descriptive, not evidentiary. It says these patterns are
common in LLM output, not that any one pattern proves LLM authorship. The gate uses
the high-confidence patterns and reports evidence rather than an authorship score.

## False positives

Rewrite first. If a phrase is genuinely required by a product name, a quotation, or
a technical term, put a narrow directive on the line before it:

```md
<!-- slop-audit-allow: slop-vocabulary reason="Seamless is the product's registered name" -->
Seamless is the product's registered name.
```

The directive must name one or more rule ids and a non-empty reason. It suppresses
only those rules on the next non-empty line. A malformed directive is itself a
finding, and the directive comment is exempt from `hidden-markdown-comment` so the
exception stays reviewable.

There is no global mute file. Exemptions are line-local, visible in the diff, and
should be rare. If a rule produces repeated false positives, change the rule and add
a fixture; do not weaken the content to hide a detector problem.

## Adding a rule

1. Add the rule id and remediation message to `RULE_META` in
   `scripts/content-audit/rules.js`.
2. Add the prose pattern to `rules.js`, or the repetition/cross-document analysis
   to `scripts/content-audit/repetition.js`. Record the threshold in the code and in
   this document.
3. Add a positive fixture and a negative fixture to
   `scripts/content-audit/rules.test.js`. For a cross-file rule, prove both files
   report the finding.
4. Run `pnpm content:audit` and `pnpm test --runInBand scripts/content-audit/rules.test.js`.
5. If the rule catches real content, rewrite the content rather than exempting it.

## Current result

The gate scans 34 Markdown files and 60 TSX copy files. At the time of writing it
covers 22,045 prose words across 22 rule families and reports no findings.
