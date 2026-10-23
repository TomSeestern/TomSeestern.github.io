"use strict"

const matter = require("gray-matter")
const ts = require("typescript")

const PROSE_SCALAR_KEYS = new Set(["title", "articleContent", "role", "outcome"])

const CONTENT_ATTRIBUTES = new Set([
  "title",
  "lead",
  "eyebrow",
  "description",
  "alt",
  "placeholder",
  "aria-label",
  "aria-description",
  "label",
  "heading",
  "subtitle",
  "summary",
  "quote",
  "attribution",
  "companyDescription",
  "companyName",
  "outcome",
  "articleContent",
  "message",
  "text",
  "body",
  "caption",
  "cta",
  "actionLabel",
  "emptyMessage",
  "errorMessage",
  "successMessage",
  "helperText",
  "hint",
  "tooltip",
])

const CONTENT_PROPERTIES = new Set([...CONTENT_ATTRIBUTES, "role"])

function spaces(value) {
  return value.replace(/[^\n]/g, " ")
}

function normalizeCopy(value) {
  return value
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
}

function splitFrontmatter(raw) {
  const normalized = raw.replace(/\r\n?/g, "\n")
  const lines = normalized.split("\n")
  if (lines[0]?.trim() !== "---") {
    return {
      normalized,
      lines,
      frontmatterLines: [],
      frontmatterStartLine: 1,
      bodyLines: lines,
      bodyStartLine: 1,
      hasFrontmatter: false,
    }
  }

  let closingIndex = -1
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === "---") {
      closingIndex = index
      break
    }
  }

  if (closingIndex === -1) {
    return {
      normalized,
      lines,
      frontmatterLines: [],
      frontmatterStartLine: 1,
      bodyLines: lines,
      bodyStartLine: 1,
      hasFrontmatter: false,
    }
  }

  return {
    normalized,
    lines,
    frontmatterLines: lines.slice(1, closingIndex),
    frontmatterStartLine: 2,
    bodyLines: lines.slice(closingIndex + 1),
    bodyStartLine: closingIndex + 2,
    hasFrontmatter: true,
  }
}

function extractFrontmatterProse(frontmatterLines, frontmatterStartLine) {
  const segments = []
  let currentProseKey = null

  for (let index = 0; index < frontmatterLines.length; index += 1) {
    const line = frontmatterLines[index]
    const lineNumber = frontmatterStartLine + index
    const keyMatch = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)

    if (keyMatch) {
      const key = keyMatch[1]
      const value = unquote(keyMatch[2].trim())
      currentProseKey = PROSE_SCALAR_KEYS.has(key) ? key : null
      if (currentProseKey && value.length > 0 && value !== ">" && value !== "|") {
        segments.push({ text: value, line: lineNumber, role: "frontmatter" })
      }
      continue
    }

    const nested = line.match(/^\s+(?:-\s+)?(?:label|value):\s*(.*)$/)
    if (nested) {
      const value = unquote(nested[1].trim())
      if (value.length > 0) segments.push({ text: value, line: lineNumber, role: "frontmatter" })
      continue
    }

    if (currentProseKey && /^\s+/.test(line) && line.trim().length > 0) {
      const value = unquote(line.trim())
      if (value.length > 0) segments.push({ text: value, line: lineNumber, role: "frontmatter" })
    }
  }

  return segments
}

function unquote(value) {
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1)
  }
  return value
}

function maskCodeFences(text) {
  const lines = text.split("\n")
  let inFence = false
  let fenceCharacter = ""

  return lines
    .map((line) => {
      const fence = line.match(/^\s*(`{3,}|~{3,})/)
      if (fence) {
        const character = fence[1][0]
        if (!inFence) {
          inFence = true
          fenceCharacter = character
        } else if (character === fenceCharacter) {
          inFence = false
          fenceCharacter = ""
        }
        return spaces(line)
      }
      return inFence ? spaces(line) : line
    })
    .join("\n")
}

function maskHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, spaces)
}

function maskLinkDestinations(text) {
  return text.replace(/\]\(([^)\n]*)\)/g, (match, destination) => `](${spaces(destination)})`)
}

function maskHtmlTags(text) {
  return text.replace(/<[^>\n]+>/g, spaces)
}

function maskInlineCode(text) {
  return text.replace(/(`+)([^`\n]*?)\1/g, (match) => spaces(match))
}

function maskBareUrls(text) {
  return text.replace(/\bhttps?:\/\/[^\s<>"')]+/g, spaces)
}

function maskReferenceDefinitions(text) {
  return text.replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gm, spaces)
}

function maskMarkdownBody(bodyRaw) {
  const codeMaskedText = maskCodeFences(bodyRaw)
  let proseText = maskHtmlComments(codeMaskedText)
  proseText = maskLinkDestinations(proseText)
  proseText = maskHtmlTags(proseText)
  proseText = maskInlineCode(proseText)
  proseText = maskBareUrls(proseText)
  proseText = maskReferenceDefinitions(proseText)
  return { codeMaskedText, proseText }
}

function extractMarkdown(raw) {
  const frontmatter = splitFrontmatter(raw)
  const data = matter(frontmatter.normalized).data || {}
  const bodyRaw = frontmatter.bodyLines.join("\n")
  const { codeMaskedText, proseText } = maskMarkdownBody(bodyRaw)

  return {
    ...frontmatter,
    data,
    bodyRaw,
    bodyProse: proseText,
    bodyCodeMasked: codeMaskedText,
    frontmatterProse: extractFrontmatterProse(frontmatter.frontmatterLines, frontmatter.frontmatterStartLine),
  }
}

function extractTsx(raw) {
  const sourceFile = ts.createSourceFile("copy.tsx", raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const segments = []
  const seen = new Set()

  function add(text, node) {
    const normalized = normalizeCopy(text)
    if (normalized.length < 3 || !/[A-Za-z]/.test(normalized)) return

    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
    const key = `${line + 1}|${normalized}`
    if (seen.has(key)) return
    seen.add(key)
    segments.push({ text: normalized, line: line + 1, role: "copy" })
  }

  function isContentAttribute(node) {
    return ts.isJsxAttribute(node) && CONTENT_ATTRIBUTES.has(node.name.getText(sourceFile))
  }

  function isContentProperty(node) {
    if (!ts.isPropertyAssignment(node)) return false
    const key = node.name.getText(sourceFile).replace(/^["']|["']$/g, "")
    return CONTENT_PROPERTIES.has(key)
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      add(node.getText(sourceFile), node)
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (isContentAttribute(node.parent) || isContentProperty(node.parent)) {
        add(node.text, node)
      }
    }

    if (ts.isTemplateExpression(node) && (isContentAttribute(node.parent) || isContentProperty(node.parent))) {
      add(node.head.text, node.head)
      for (const span of node.templateSpans) add(span.literal.text, span.literal)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return { segments }
}

module.exports = {
  CONTENT_ATTRIBUTES,
  CONTENT_PROPERTIES,
  extractMarkdown,
  extractTsx,
  normalizeCopy,
  splitFrontmatter,
}
