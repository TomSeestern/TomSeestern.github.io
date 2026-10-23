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
