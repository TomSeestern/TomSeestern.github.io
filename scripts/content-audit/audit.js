"use strict"

const fs = require("fs")
const path = require("path")
const {
  RULE_META,
  analyzeMarkdownStructure,
  analyzeProseSegments,
  collectSuppressions,
  countWords,
  findUnknownFrontmatterKeys,
  scanEmoji,
  scanHiddenComments,
  scanHiddenUnicode,
  scanPromptArtifacts,
} = require("./rules")
const { extractMarkdown, extractTsx } = require("./extract")
const { findDuplicateContent, scanKeywordStuffing } = require("./repetition")

const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"])
const COPY_EXTENSIONS = new Set([".tsx"])

function walkFiles(directory, predicate) {
  if (!fs.existsSync(directory)) return []
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name.startsWith(".")) continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, predicate))
      continue
    }
    if (entry.isFile() && predicate(fullPath)) files.push(fullPath)
  }
  return files
}

function isMarkdownFile(filePath) {
  return MARKDOWN_EXTENSIONS.has(path.extname(filePath))
}

function isCopyFile(filePath) {
  if (!COPY_EXTENSIONS.has(path.extname(filePath))) return false
  return !/\.(?:test|stories|spec)\.tsx$/.test(filePath)
}

function collectTargets(root) {
  const contentDirectory = path.join(root, "content")
  const appDirectory = path.join(root, "app")
  const componentsDirectory = path.join(root, "components")

  return [
    ...walkFiles(contentDirectory, isMarkdownFile),
    ...walkFiles(appDirectory, isCopyFile),
    ...walkFiles(componentsDirectory, isCopyFile),
  ]
    .map((filePath) => path.resolve(filePath))
    .filter((filePath, index, all) => all.indexOf(filePath) === index)
    .sort()
}

function resolveTargets(root, targetArgs) {
  if (targetArgs.length === 0) return collectTargets(root)
  const files = []
  for (const target of targetArgs) {
    const absolute = path.resolve(root, target)
    if (!fs.existsSync(absolute)) throw new Error(`Audit target does not exist: ${target}`)
    const stats = fs.statSync(absolute)
    if (stats.isDirectory()) {
      files.push(...walkFiles(absolute, (filePath) => isMarkdownFile(filePath) || isCopyFile(filePath)))
    } else {
      files.push(absolute)
    }
  }
  return files
    .map((filePath) => path.resolve(filePath))
    .filter((filePath, index, all) => all.indexOf(filePath) === index)
    .sort()
}

function displayPath(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join("/")
}

function auditMarkdownSource(raw, file) {
  const extracted = extractMarkdown(raw)
  const findings = []
  const { suppressions, findings: directiveFindings } = collectSuppressions(
    extracted.bodyCodeMasked,
    extracted.bodyStartLine,
    file
  )
  findings.push(...directiveFindings)

  scanHiddenUnicode({ file, text: extracted.normalized, startLine: 1, findings, suppressions })
  scanPromptArtifacts({ file, text: extracted.normalized, startLine: 1, findings, suppressions })
  scanHiddenComments({
    file,
    codeMaskedText: extracted.bodyCodeMasked,
    startLine: extracted.bodyStartLine,
    findings,
    suppressions,
  })
  scanEmoji({ file, text: extracted.bodyProse, startLine: extracted.bodyStartLine, findings, suppressions })
  for (const segment of extracted.frontmatterProse) {
    scanEmoji({ file, text: segment.text, startLine: segment.line, findings, suppressions })
  }

  analyzeProseSegments({
    file,
    segments: [
      { text: extracted.bodyProse, line: extracted.bodyStartLine, role: "body" },
      ...extracted.frontmatterProse,
    ],
    findings,
    suppressions,
  })

  const stats = analyzeMarkdownStructure({
    file,
    body: extracted.bodyProse,
    bodyStartLine: extracted.bodyStartLine,
    findings,
    suppressions,
  })

  scanKeywordStuffing({
    file,
    body: extracted.bodyProse,
    startLine: extracted.bodyStartLine,
    findings,
    suppressions,
  })

  findUnknownFrontmatterKeys({
    file,
    data: extracted.data,
    frontmatterLines: extracted.frontmatterLines,
    frontmatterStartLine: extracted.frontmatterStartLine,
    findings,
    suppressions,
  })

  return {
    file,
    kind: "markdown",
    findings,
    bodyProse: extracted.bodyProse,
    bodyStartLine: extracted.bodyStartLine,
    words: stats.words + extracted.frontmatterProse.reduce((total, segment) => total + countWords(segment.text), 0),
    stats,
  }
}

function auditTsxSource(raw, file) {
  const extracted = extractTsx(raw)
  const findings = []
  const suppressions = new Map()

  scanHiddenUnicode({ file, text: raw, startLine: 1, findings, suppressions })
  scanPromptArtifacts({ file, text: raw, startLine: 1, findings, suppressions })

  for (const segment of extracted.segments) {
    scanEmoji({ file, text: segment.text, startLine: segment.line, findings, suppressions })
  }

  analyzeProseSegments({ file, segments: extracted.segments, findings, suppressions })

  return {
    file,
    kind: "copy",
    findings,
    words: extracted.segments.reduce((total, segment) => total + countWords(segment.text), 0),
    stats: { segments: extracted.segments.length },
  }
}

function auditFile(root, filePath) {
  const raw = fs.readFileSync(filePath, "utf8")
  return isMarkdownFile(filePath)
    ? auditMarkdownSource(raw, displayPath(root, filePath))
    : auditTsxSource(raw, displayPath(root, filePath))
}

function runAudit({ root = process.cwd(), targets = [] } = {}) {
  const files = resolveTargets(root, targets)
  const results = files.map((filePath) => auditFile(root, filePath))
  const findings = [...results.flatMap((result) => result.findings), ...findDuplicateContent(results)]

  findings.sort((left, right) => {
    if (left.file !== right.file) return left.file.localeCompare(right.file)
    if (left.line !== right.line) return left.line - right.line
    return left.rule.localeCompare(right.rule)
  })

  return {
    root,
    files,
    results,
    findings,
    markdownFiles: results.filter((result) => result.kind === "markdown").length,
    copyFiles: results.filter((result) => result.kind === "copy").length,
    words: results.reduce((total, result) => total + result.words, 0),
  }
}

function formatReport(result, { verbose = false } = {}) {
  const lines = []
  const fileCount = new Set(result.findings.map((finding) => finding.file)).size
  lines.push("Content slop audit")
  lines.push(
    `Scanned ${result.markdownFiles} Markdown file(s) and ${result.copyFiles} TSX copy file(s); ${result.words} prose words.`
  )

  if (result.findings.length === 0) {
    lines.push("")
    lines.push("PASS — no slop signals found.")
    lines.push("")
    lines.push(
      "Note: textGrain and SynthID are statistical watermarks. They cannot be detected from plain Markdown; this gate checks hidden Unicode, prompt residue, and visible prose patterns instead."
    )
    return lines.join("\n")
  }

  lines.push("")
  lines.push(`FAIL — ${result.findings.length} finding(s) across ${fileCount} file(s).`)
  lines.push("")

  let currentFile = null
  for (const finding of result.findings) {
    if (finding.file !== currentFile) {
      currentFile = finding.file
      lines.push(currentFile)
    }
    lines.push(
      `  ${String(finding.line).padStart(4)}:${String(finding.column || 1).padEnd(3)} ${finding.rule.padEnd(25)} ${
        finding.detail
      }`
    )
    lines.push(`        ${finding.excerpt}`)
    if (verbose) lines.push(`        ${finding.message}`)
  }

  lines.push("")
  lines.push("Findings by rule:")
  const counts = new Map()
  for (const finding of result.findings) counts.set(finding.rule, (counts.get(finding.rule) || 0) + 1)
  for (const [rule, count] of [...counts.entries()].sort((left, right) => right[1] - left[1])) {
    lines.push(`  ${String(count).padStart(3)}  ${rule.padEnd(25)} ${RULE_META[rule]?.message || ""}`)
  }

  lines.push("")
  lines.push(
    "Note: textGrain and SynthID are statistical watermarks. They cannot be detected from plain Markdown; this gate checks hidden Unicode, prompt residue, and visible prose patterns instead."
  )
  return lines.join("\n")
}

function printUsage() {
  return [
    "Usage: node scripts/check-content-slop.js [options] [file-or-directory ...]",
    "",
    "Scans published Markdown content and visible TSX copy for high-confidence AI-writing",
    "patterns, hidden Unicode, prompt residue, and unknown frontmatter keys.",
    "",
    "Options:",
    "  --json     Print a machine-readable result.",
    "  --verbose  Include the remediation message for each finding.",
    "  --help     Show this help.",
  ].join("\n")
}

function main(argv = process.argv.slice(2), { root = process.cwd() } = {}) {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(printUsage())
    return true
  }

  const json = argv.includes("--json")
  const verbose = argv.includes("--verbose")
  const targets = argv.filter((argument) => !argument.startsWith("-"))
  const result = runAudit({ root, targets })

  if (json) {
    console.log(
      JSON.stringify(
        {
          markdownFiles: result.markdownFiles,
          copyFiles: result.copyFiles,
          words: result.words,
          findings: result.findings.map(({ dedupeKey, ...finding }) => finding),
        },
        null,
        2
      )
    )
  } else {
    console.log(formatReport(result, { verbose }))
  }

  return result.findings.length === 0
}

if (require.main === module) {
  const ok = main()
  if (!ok) process.exitCode = 1
}

module.exports = {
  auditMarkdownSource,
  auditTsxSource,
  collectTargets,
  formatReport,
  main,
  runAudit,
}
