"use strict"

const fs = require("fs")
const os = require("os")
const path = require("path")
const { auditMarkdownSource, auditTsxSource, runAudit } = require("./audit")

function rulesFor(result) {
  return result.findings.map((finding) => finding.rule)
}

describe("content audit", () => {
  it("accepts clean prose, em dashes, and curly quotes", () => {
    const result = auditMarkdownSource(
      "# Notes\n\n“The server is fine” — I checked the logs at 14:00. The disk error was real.\n",
      "clean.md"
    )

    expect(result.findings).toEqual([])
  })

  it("flags a not-just-but construction", () => {
    const result = auditMarkdownSource("# Notes\n\nThis is not just a tool, but a system.\n", "contrast.md")

    expect(rulesFor(result)).toContain("negative-parallelism")
  })

  it("flags the not-X-it-is-Y template across sentences", () => {
    const result = auditMarkdownSource("# Notes\n\nThe update is not a rewrite. It is a correction.\n", "contrast.md")

    expect(rulesFor(result)).toContain("negative-parallelism")
  })

  it("does not flag an ordinary unavailable-service sentence", () => {
    const result = auditMarkdownSource("# Notes\n\nThe server is not available; retry later.\n", "clean.md")

    expect(rulesFor(result)).not.toContain("negative-parallelism")
  })

  it("flags significance inflation", () => {
    const result = auditMarkdownSource("# Notes\n\nThe launch was a testament to careful work.\n", "puffery.md")

    expect(rulesFor(result)).toContain("significance-inflation")
  })

  it("flags high-confidence slop vocabulary", () => {
    const result = auditMarkdownSource("# Notes\n\nWe offer seamless delivery.\n", "vocabulary.md")

    expect(rulesFor(result)).toContain("slop-vocabulary")
  })

  it("flags a trailing significance participle", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nThe system retries failed jobs, highlighting the importance of resilience.\n",
      "analysis.md"
    )

    expect(rulesFor(result)).toContain("superficial-analysis")
  })

  it("flags a canned conclusion heading", () => {
    const result = auditMarkdownSource("# Notes\n\n## Final thoughts\n\nThe server is stable.\n", "conclusion.md")

    expect(rulesFor(result)).toContain("canned-conclusion")
  })

  it("flags a formulaic article opening", () => {
    const result = auditMarkdownSource("# Notes\n\nIn this article, we explore the system.\n", "intro.md")

    expect(rulesFor(result)).toContain("formulaic-intro")
  })

  it("flags dense formal transitions", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nMoreover, the server restarted. Furthermore, the logs rotated. Additionally, the queue drained. Notably, the test passed.\n",
      "transitions.md"
    )

    expect(rulesFor(result)).toContain("transition-density")
  })

  it("flags unsourced vague attribution", () => {
    const result = auditMarkdownSource("# Notes\n\nExperts say the server is stable.\n", "attribution.md")

    expect(rulesFor(result)).toContain("vague-attribution")
  })

  it("allows vague attribution when the same line cites a source", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nResearch shows the server is stable ([status page](https://example.com/status)).\n",
      "attribution.md"
    )

    expect(rulesFor(result)).not.toContain("vague-attribution")
  })

  it("flags didactic hedging", () => {
    const result = auditMarkdownSource("# Notes\n\nIt is important to note that the server restarted.\n", "hedging.md")

    expect(rulesFor(result)).toContain("hedging-disclaimer")
  })

  it("does not flag a concrete sentence about importance", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nThe restart was important because it cleared the stuck queue.\n",
      "hedging.md"
    )

    expect(rulesFor(result)).not.toContain("hedging-disclaimer")
  })

  it("flags stock phrasing", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nWhen it comes to deployments, the queue is the bottleneck.\n",
      "formulaic.md"
    )

    expect(rulesFor(result)).toContain("formulaic-phrase")
  })

  it("does not flag a literal core measurement", () => {
    const result = auditMarkdownSource("# Notes\n\nThe core is 40 mm wide.\n", "formulaic.md")

    expect(rulesFor(result)).not.toContain("formulaic-phrase")
  })

  it("flags an outline-like challenge conclusion", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nDespite its promising results, the project faces challenges.\n",
      "outline.md"
    )

    expect(rulesFor(result)).toContain("outline-conclusion")
  })

  it("does not flag a concrete challenge", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nThe first challenge was scale: the queue doubled under load.\n",
      "outline.md"
    )

    expect(rulesFor(result)).not.toContain("outline-conclusion")
  })

  it("flags promotional hype", () => {
    const result = auditMarkdownSource("# Notes\n\nThe result is an unforgettable, must-see improvement.\n", "promo.md")

    expect(rulesFor(result)).toContain("promotional-language")
  })

  it("does not flag a factual description", () => {
    const result = auditMarkdownSource("# Notes\n\nThe result cut the queue from nine minutes to two.\n", "promo.md")

    expect(rulesFor(result)).not.toContain("promotional-language")
  })

  it("flags repeated keyword phrases", () => {
    const result = auditMarkdownSource(
      [
        "# Notes",
        "",
        "The best seo agency is the best seo agency for a reason.",
        "Choose the best seo agency, then ask the best seo agency for a plan.",
        "A best seo agency should explain the work, and the best seo agency should measure it.",
        "This is the best seo agency.",
        "",
      ].join("\n"),
      "stuffed.md"
    )

    expect(rulesFor(result)).toContain("keyword-stuffing")
  })

  it("does not flag ordinary technical repetition", () => {
    const result = auditMarkdownSource(
      [
        "# Notes",
        "",
        "The deployment pipeline runs the deployment pipeline tests before the deployment pipeline applies changes.",
        "A deployment pipeline can fail, and a deployment pipeline should report why.",
        "",
      ].join("\n"),
      "repetition.md"
    )

    expect(rulesFor(result)).not.toContain("keyword-stuffing")
  })

  it("flags an exact duplicate span across two content files", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "content-audit-duplicate-"))
    try {
      const blogDirectory = path.join(root, "content", "blog")
      fs.mkdirSync(blogDirectory, { recursive: true })
      const shared =
        "The deployment pipeline validates configuration before it applies changes to any production host in the cluster today."
      fs.writeFileSync(
        path.join(blogDirectory, "one.md"),
        `# One\n\n${shared}\n\nThis paragraph is unique to the first file.\n`
      )
      fs.writeFileSync(
        path.join(blogDirectory, "two.md"),
        `# Two\n\n${shared}\n\nThis paragraph is unique to the second file.\n`
      )

      const result = runAudit({ root })
      const duplicateFiles = result.findings
        .filter((finding) => finding.rule === "duplicate-content")
        .map((finding) => finding.file)
        .sort()

      expect(duplicateFiles).toEqual(["content/blog/one.md", "content/blog/two.md"])
    } finally {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })

  it("does not flag a short shared phrase across two content files", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "content-audit-duplicate-"))
    try {
      const blogDirectory = path.join(root, "content", "blog")
      fs.mkdirSync(blogDirectory, { recursive: true })
      fs.writeFileSync(
        path.join(blogDirectory, "one.md"),
        "# One\n\nThe deployment pipeline validates configuration before it applies changes. The first file adds context.\n"
      )
      fs.writeFileSync(
        path.join(blogDirectory, "two.md"),
        "# Two\n\nThe deployment pipeline validates configuration before it applies changes. The second file adds other context.\n"
      )

      const result = runAudit({ root })

      expect(rulesFor(result)).not.toContain("duplicate-content")
    } finally {
      fs.rmSync(root, { recursive: true, force: true })
    }
  })

  it("flags hidden Unicode", () => {
    const hidden = String.fromCodePoint(0x200b)
    const result = auditMarkdownSource(`# Notes\n\nHello${hidden}world\n`, "hidden.md")

    expect(rulesFor(result)).toContain("hidden-unicode")
    expect(result.findings.find((finding) => finding.rule === "hidden-unicode").detail).toContain("U+200B")
  })

  it("flags prompt residue and generation labels", () => {
    const result = auditMarkdownSource("# Notes\n\n<|im_start|>system\n\nGenerated by ChatGPT\n", "prompt.md")

    expect(rulesFor(result)).toContain("prompt-artifact")
  })

  it("flags an unresolved cross-reference placeholder", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nSee requirement {{r:Backup and restore}} for the drill.\n",
      "xref.md"
    )

    expect(rulesFor(result)).toContain("prompt-artifact")
  })

  it("does not flag a resolved cross-reference", () => {
    const result = auditMarkdownSource("# Notes\n\nSee requirement 33 for the drill.\n", "xref.md")

    expect(rulesFor(result)).not.toContain("prompt-artifact")
  })

  it("flags hidden HTML comments", () => {
    const result = auditMarkdownSource("# Notes\n\n<!-- hidden editorial note -->\n\nBody.\n", "comment.md")

    expect(rulesFor(result)).toContain("hidden-markdown-comment")
  })

  it("lets a reviewed allow directive suppress the next content line", () => {
    const result = auditMarkdownSource(
      '# Notes\n\n<!-- slop-audit-allow: slop-vocabulary reason="Seamless is the product name" -->\n\nSeamless is the product name.\n',
      "allow.md"
    )

    expect(rulesFor(result)).not.toContain("slop-vocabulary")
    expect(rulesFor(result)).not.toContain("hidden-markdown-comment")
  })

  it("rejects an allow directive without a reason", () => {
    const result = auditMarkdownSource(
      "# Notes\n\n<!-- slop-audit-allow: slop-vocabulary -->\n\nSeamless delivery.\n",
      "allow.md"
    )

    expect(rulesFor(result)).toContain("invalid-audit-directive")
  })

  it("ignores fenced code and inline code", () => {
    const result = auditMarkdownSource(
      "# Notes\n\n```\nnot just a tool, but a system\n```\n\nUse `not just X, but Y` carefully.\n",
      "code.md"
    )

    expect(rulesFor(result)).not.toContain("negative-parallelism")
  })

  it("ignores link destinations", () => {
    const result = auditMarkdownSource("# Notes\n\n[Example](https://example.com/not-just-but)\n", "links.md")

    expect(rulesFor(result)).not.toContain("negative-parallelism")
  })

  it("flags a list of bold pseudo-headings", () => {
    const result = auditMarkdownSource(
      "# Notes\n\n- **First:** one.\n- **Second:** two.\n- **Third:** three.\n",
      "list.md"
    )

    expect(rulesFor(result)).toContain("inline-header-list")
  })

  it("flags repeated exact three-item phrases", () => {
    const result = auditMarkdownSource(
      "# Notes\n\nWe built a ledger, a scheduler, and a gate.\nThe system records inputs, outputs, and cost.\nThe result is smaller, faster, and clearer.\n",
      "tricolon.md"
    )

    expect(rulesFor(result)).toContain("rule-of-three")
  })

  it("flags unknown frontmatter keys", () => {
    const result = auditMarkdownSource(
      "---\ntitle: Notes\ngenerator: model-v1\n---\n\n# Notes\n\nBody.\n",
      "frontmatter.md"
    )

    expect(rulesFor(result)).toContain("frontmatter-unknown-key")
    expect(result.findings.find((finding) => finding.rule === "frontmatter-unknown-key").line).toBe(3)
  })

  it("flags emoji formatting", () => {
    const result = auditMarkdownSource("# Notes\n\nGreat launch 🚀\n", "emoji.md")

    expect(rulesFor(result)).toContain("emoji")
  })

  it("passes on the committed content and copy", () => {
    const result = runAudit({ root: process.cwd() })

    expect(result.findings).toEqual([])
  })

  it("extracts visible TSX copy and ignores className", () => {
    const result = auditTsxSource(
      [
        "export function Example() {",
        '  return <PageHero title="A seamless system" description="This is not just a demo, but a system." />',
        "}",
        'const markup = <p className="seamless flex">Ordinary copy</p>',
      ].join("\n"),
      "copy.tsx"
    )

    expect(rulesFor(result)).toContain("slop-vocabulary")
    expect(rulesFor(result)).toContain("negative-parallelism")
    expect(result.findings).toHaveLength(2)
  })
})

describe("statement rules", () => {
  // A file opts in by naming the sections whose numbered lists are statements,
  // and carries its own dictionary: an entry is a bold word followed by an em
  // dash. The case of that line is the case the statements must use.
  const statementDocument = (statements, { entries = true, section = "Requirements" } = {}) =>
    [
      "---",
      "statementRules:",
      `  - ${section}`,
      "---",
      "",
      "## The given words",
      "",
      ...(entries
        ? [
            "**HASH** — the content address of a byte string.",
            "",
            "**TASK** — a unit of work.",
            "",
            "**APPEND** — to add a record.",
            "",
            "**PARTY** — a thing that can act.",
            "",
            "**SIGN** — to make a mark.",
            "",
            "**gate** — a rule and the check it runs.",
            "",
          ]
        : []),
      "## Requirements",
      "",
      ...statements,
      "",
    ].join("\n")

  const words = (count) => Array.from({ length: count }, (_, index) => `w${index}`).join(" ")

  it("ignores numbered lines in a file that does not opt in", () => {
    const result = auditMarkdownSource(`# Notes\n\n1. ${words(40)}.\n`, "plain.md")

    expect(rulesFor(result)).not.toContain("statement-too-long")
  })

  it("flags a statement over the 25-word limit", () => {
    const result = auditMarkdownSource(statementDocument([`1. ${words(26)}.`]), "long.md")

    expect(rulesFor(result)).toContain("statement-too-long")
  })

  it("accepts a statement at the 25-word limit", () => {
    const result = auditMarkdownSource(statementDocument([`1. ${words(25)}.`]), "limit.md")

    expect(rulesFor(result)).not.toContain("statement-too-long")
  })

  it("flags a statement that opens with a bare pronoun", () => {
    const result = auditMarkdownSource(statementDocument(["1. It records the APPEND."]), "pronoun.md")

    expect(rulesFor(result)).toContain("statement-bare-pronoun")
  })

  it("accepts a demonstrative that names its subject", () => {
    const result = auditMarkdownSource(statementDocument(["1. That PARTY records the APPEND."]), "named.md")

    expect(rulesFor(result)).not.toContain("statement-bare-pronoun")
  })

  it("flags the perfect tense", () => {
    const result = auditMarkdownSource(statementDocument(["1. The HASH has waited since the APPEND."]), "tense.md")

    expect(rulesFor(result)).toContain("statement-tense")
  })

  it("accepts the present and the past", () => {
    const result = auditMarkdownSource(
      statementDocument(["1. The HASH waits until the APPEND.", "2. The PARTY SIGNed the HASH."]),
      "simple.md"
    )

    expect(rulesFor(result)).not.toContain("statement-tense")
  })

  it("flags a capital that marks no entry", () => {
    const result = auditMarkdownSource(statementDocument(["1. Every KPI carries a HASH."]), "capital.md")

    expect(rulesFor(result)).toContain("statement-case")
  })

  it("accepts an abbreviation", () => {
    const result = auditMarkdownSource(statementDocument(["1. The VAT rate sits in a HASH."]), "abbreviation.md")

    expect(rulesFor(result)).not.toContain("statement-case")
  })

  it("accepts an inflection of an entry", () => {
    const result = auditMarkdownSource(
      statementDocument(["1. A TASK APPENDs a HASH.", "2. The HASHes APPENDed to a TASK."]),
      "inflection.md"
    )

    expect(rulesFor(result)).not.toContain("statement-case")
  })

  it("flags an entry written in ordinary type", () => {
    const result = auditMarkdownSource(statementDocument(["1. A task carries a HASH."]), "lowercase.md")

    expect(rulesFor(result)).toContain("statement-case")
  })

  it("accepts an approved compound that has no entry", () => {
    const result = auditMarkdownSource(statementDocument(["1. A gate refuses the APPEND."]), "compound.md")

    expect(rulesFor(result)).not.toContain("statement-case")
  })

  it("ignores a word in guillemets or inline code", () => {
    const result = auditMarkdownSource(
      statementDocument(["1. A «task» file holds the HASH.", "2. The `task` file holds the HASH."]),
      "masked.md"
    )

    expect(rulesFor(result)).not.toContain("statement-case")
  })

  it("ignores a numbered list outside the declared sections", () => {
    const document = [
      "---",
      "statementRules:",
      "  - Requirements",
      "---",
      "",
      "## The given words",
      "",
      "**HASH** — the content address of a byte string.",
      "",
      "**TASK** — a unit of work.",
      "",
      "## Notes",
      "",
      `1. ${words(40)} task.`,
      "",
      "## Requirements",
      "",
      "1. A TASK APPENDs a HASH.",
      "",
    ].join("\n")

    const result = auditMarkdownSource(document, "scoped.md")

    expect(rulesFor(result)).not.toContain("statement-too-long")
    expect(rulesFor(result)).not.toContain("statement-case")
  })

  it("reports a declared section that is not in the file", () => {
    const result = auditMarkdownSource(
      statementDocument(["1. A TASK APPENDs a HASH."], { section: "Elsewhere" }),
      "missing.md"
    )
    const caseFindings = result.findings.filter((finding) => finding.rule === "statement-case")

    expect(caseFindings).toHaveLength(1)
    expect(caseFindings[0].detail).toContain("declared section not found")
  })

  it("reports a missing dictionary instead of every capital", () => {
    const result = auditMarkdownSource(statementDocument(["1. A TASK holds a HASH."], { entries: false }), "nodict.md")

    expect(result.findings.filter((finding) => finding.rule === "statement-case")).toHaveLength(1)
    expect(result.findings.find((finding) => finding.rule === "statement-case").detail).toContain("no dictionary")
  })

  it("checks a post against a dictionary another post defines", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "statement-dictionary-"))
    fs.writeFileSync(
      path.join(directory, "dictionary.md"),
      "**HASH** — the content address of a byte string.\n\n**PARTY** — a thing that can act.\n\n**SIGN** — to make a mark.\n"
    )
    const document = [
      "---",
      "statementRules:",
      "  - Requirements",
      "statementDictionary: dictionary.md",
      "---",
      "",
      "## Requirements",
      "",
      "1. A PARTY SIGNs the HASH.",
      "",
    ].join("\n")

    const result = auditMarkdownSource(document, path.join(directory, "post.md"))

    expect(result.findings).toEqual([])
  })

  it("reports a shared dictionary that is missing", () => {
    const document = [
      "---",
      "statementRules:",
      "  - Requirements",
      "statementDictionary: missing.md",
      "---",
      "",
      "## Requirements",
      "",
      "1. A PARTY SIGNs the HASH.",
      "",
    ].join("\n")

    const result = auditMarkdownSource(document, "post.md")
    const caseFindings = result.findings.filter((finding) => finding.rule === "statement-case")

    expect(caseFindings).toHaveLength(1)
    expect(caseFindings[0].detail).toContain("statementDictionary not found")
  })

  // The post states how many statements its rules govern. Without this the
  // number is prose, and the next edit that adds or drops a statement leaves
  // it stale while every gate stays green.
  it("keeps the statement count in the published post true", () => {
    const post = fs.readFileSync(
      path.join(__dirname, "..", "..", "content", "blog", "2026-seven-nouns-eighteen-verbs.md"),
      "utf8"
    )
    const claimed = post.match(/The rules govern the (\d+) statements/)
    expect(claimed).not.toBeNull()

    const result = auditMarkdownSource(post, "2026-seven-nouns-eighteen-verbs.md")

    expect(result.stats.statements).toBe(Number(claimed[1]))
  })
})
