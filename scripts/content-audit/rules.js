"use strict"

const RULE_META = Object.freeze({
  "hidden-unicode": {
    label: "Hidden Unicode",
    message: "Remove invisible formatting characters; they hide text and are a common prompt-injection artifact.",
  },
  "prompt-artifact": {
    label: "Prompt artifact",
    message: "Remove model chat tokens, canned assistant phrasing, or generation labels from published copy.",
  },
  "hidden-markdown-comment": {
    label: "Hidden Markdown comment",
    message: "HTML comments are invisible in rendered prose. Delete them or use a reviewed slop-audit-allow directive.",
  },
  "invalid-audit-directive": {
    label: "Invalid audit directive",
    message: 'Use `<!-- slop-audit-allow: rule-id reason="why" -->` on the line before the finding.',
  },
  "frontmatter-unknown-key": {
    label: "Unknown frontmatter key",
    message: "Unknown keys can carry generator metadata that the site never renders. Keep frontmatter to the schema.",
  },
  emoji: {
    label: "Emoji formatting",
    message: "Use words, not emoji, for emphasis in long-form copy.",
  },
  "negative-parallelism": {
    label: "Negative parallelism",
    message: "State the claim directly instead of the `not X, but Y` or `not X. It is Y` template.",
  },
  "significance-inflation": {
    label: "Significance inflation",
    message: "Replace the claim about importance with a concrete fact, consequence, or measurement.",
  },
  "slop-vocabulary": {
    label: "Slop vocabulary",
    message: "Use the plain word for the thing; this term is a high-frequency AI-writing tell.",
  },
  "superficial-analysis": {
    label: "Superficial analysis",
    message: "Cut the trailing participle that claims significance; let the preceding fact carry the point.",
  },
  "inline-header-list": {
    label: "Inline-header list",
    message: "Bold pseudo-headings inside list items read like generated outlines. Use prose or ordinary list items.",
  },
  "rule-of-three": {
    label: "Rule of three",
    message: "Vary the list length; repeated exact three-item phrases are a known AI-writing pattern.",
  },
  "canned-conclusion": {
    label: "Canned conclusion",
    message: "Remove the generic summary opener or heading; end on the last concrete point.",
  },
  "formulaic-intro": {
    label: "Formulaic intro",
    message: "Start with the concrete subject instead of a generic article or world framing.",
  },
  "transition-density": {
    label: "Transition density",
    message: "Too many formal transitions. Delete most of them and let the paragraphs connect by subject.",
  },
})

const HIDDEN_RANGES = [
  [0x0000, 0x0008, "C0 control"],
  [0x000b, 0x000c, "C0 control"],
  [0x000e, 0x001f, "C0 control"],
  [0x007f, 0x009f, "C1 control"],
  [0x00ad, 0x00ad, "soft hyphen"],
  [0x034f, 0x034f, "combining grapheme joiner"],
  [0x061c, 0x061c, "Arabic letter mark"],
  [0x115f, 0x1160, "Hangul filler"],
  [0x17b4, 0x17b5, "Khmer inherent vowel"],
  [0x180b, 0x180f, "Mongolian format control"],
  [0x200b, 0x200f, "zero-width or bidi mark"],
  [0x202a, 0x202e, "bidi embedding or override"],
  [0x2028, 0x2029, "line or paragraph separator"],
  [0x2060, 0x2064, "invisible operator"],
  [0x2066, 0x206f, "bidi isolate or format control"],
  [0xfeff, 0xfeff, "byte-order mark or zero-width no-break space"],
  [0xfff9, 0xfffb, "interlinear annotation"],
  [0xfffd, 0xfffd, "replacement character"],
  [0xe0000, 0xe007f, "Unicode tag character"],
]

const HIDDEN_CLASS = [
  "\\u0000-\\u0008",
  "\\u000B\\u000C",
  "\\u000E-\\u001F",
  "\\u007F-\\u009F",
  "\\u00AD",
  "\\u034F",
  "\\u061C",
  "\\u115F\\u1160",
  "\\u17B4\\u17B5",
  "\\u180B-\\u180F",
  "\\u200B-\\u200F",
  "\\u202A-\\u202E",
  "\\u2028\\u2029",
  "\\u2060-\\u2064",
  "\\u2066-\\u206F",
  "\\uFEFF",
  "\\uFFF9-\\uFFFB",
  "\\uFFFD",
  "\\u{E0000}-\\u{E007F}",
].join("")

const HIDDEN_REGEX = new RegExp(`[${HIDDEN_CLASS}]`, "gu")
const COMMENT_REGEX = /<!--[\s\S]*?-->/g
const ALLOW_DIRECTIVE_REGEX = /^<!--\s*slop-audit-allow:\s*([\s\S]*?)\s*-->$/i
const EMOJI_REGEX = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}]/gu

const PROMPT_PATTERNS = [
  { label: "chat-template token", regex: /<\|(?:im_start|im_end|endoftext|eot_id|start_header_id|end_header_id)\|>/gi },
  { label: "instruction token", regex: /\[\/?INST\]/gi },
  { label: "system-prompt token", regex: /<<\/?SYS>>/gi },
  { label: "assistant self-reference", regex: /\bAs an AI (?:language )?model\b/gi },
  { label: "assistant self-reference", regex: /\bAs a (?:large )?language model\b/gi },
  {
    label: "browser disclaimer",
    regex: /\bI (?:cannot|can't) (?:browse|access|see|view) (?:the )?(?:internet|web|links?)\b/gi,
  },
  { label: "canned assistant close", regex: /\bI hope this helps\b/gi },
  { label: "canned assistant offer", regex: /\bLet me know if you(?:'d| would)? (?:like|need|want)\b/gi },
  { label: "canned assistant offer", regex: /\bWould you like me to\b/gi },
  {
    label: "canned rewrite preamble",
    regex: /\bHere(?:'s| is) (?:the|a) (?:revised|updated|complete|final) (?:version|draft|text|article|post)\b/gi,
  },
  { label: "canned assistant opener", regex: /^\s*(?:Certainly|Sure|Of course)[!,.]/gim },
  { label: "generation label", regex: /\bGenerated (?:by|with) (?:ChatGPT|OpenAI|Claude|Gemini|an AI|AI)\b/gi },
  { label: "model attribution", regex: /\b(?:ChatGPT|Claude|Gemini|Copilot)\s+(?:wrote|generated|produced|said)\b/gi },
  { label: "placeholder text", regex: /\bLorem ipsum\b/gi },
]

// High-confidence vocabulary tells. Context-sensitive words such as "journey",
// "navigate", and "landscape" are deliberately not banned on their own: this
// site uses them in historical titles and literal technical prose.
const SLOP_WORDS = [
  ["delve", /\bdelv(?:e|es|ed|ing)\b/gi],
  ["tapestry", /\btapestr(?:y|ies)\b/gi],
  ["seamless", /\bseamless(?:ly)?\b/gi],
  ["cutting-edge", /\bcutting[- ]edge\b/gi],
  ["state-of-the-art", /\bstate[- ]of[- ]the[- ]art\b/gi],
  ["game-changer", /\bgame[- ]chang(?:er|ing)\b/gi],
  ["world-class", /\bworld[- ]class\b/gi],
  ["best-in-class", /\bbest[- ]in[- ]class\b/gi],
  ["unparalleled", /\bunparalleled\b/gi],
  ["revolutionize", /\brevolutioniz(?:e|es|ed|ing)\b/gi],
  ["transformative", /\btransformative\b/gi],
  ["meticulous", /\bmeticulous(?:ly)?\b/gi],
  ["intricate", /\bintricate\b/gi],
  ["myriad", /\bmyriad\b/gi],
  ["plethora", /\bplethora\b/gi],
  ["holistic", /\bholistic\b/gi],
  ["synergy", /\bsynerg(?:y|ies)\b/gi],
  ["paradigm", /\bparadigm\b/gi],
  ["garner", /\bgarner(?:s|ed|ing)?\b/gi],
  ["underscore", /\bunderscor(?:e|es|ed|ing)\b/gi],
  ["foster", /\bfoster(?:s|ed|ing)?\b/gi],
  ["elevate", /\belevat(?:e|es|ed|ing)\b/gi],
  ["empower", /\bempower(?:s|ed|ing)?\b/gi],
  ["unlock", /\bunlock(?:s|ed|ing)?\b/gi],
  ["showcase", /\bshowcas(?:e|es|ed|ing)\b/gi],
  ["leverage", /\bleverag(?:e|es|ed|ing)\b/gi],
  ["robust", /\brobust\b/gi],
  ["vibrant", /\bvibrant\b/gi],
  ["pivotal", /\bpivotal\b/gi],
  ["crucial", /\bcrucial\b/gi],
  ["paramount", /\bparamount\b/gi],
  ["invaluable", /\binvaluable\b/gi],
  ["profound", /\bprofound\b/gi],
  ["bustling", /\bbustling\b/gi],
  ["ever-evolving", /\bever[- ]evolving\b/gi],
  ["fast-paced", /\bfast[- ]paced\b/gi],
  ["multifaceted", /\bmultifaceted\b/gi],
  ["embark", /\bembark(?:s|ed|ing)?\s+on\b/gi],
  ["dive into", /\bdive\s+into\b/gi],
  ["deep dive", /\bdeep\s+dive\b/gi],
  ["realm of", /\brealm\s+of\b/gi],
  ["digital landscape", /\b(?:digital|ever[- ]evolving|modern)\s+landscape\b/gi],
  ["unlock the potential", /\bunlock(?:s|ed|ing)?\s+the\s+(?:potential|power|secrets)\b/gi],
]

const SIGNIFICANCE_PATTERNS = [
  ["a testament to", /\ba\s+testament\s+to\b/gi],
  ["stands as", /\b(?:stand|stands|stood)\s+as\b/gi],
  [
    "serves as a symbol",
    /\b(?:serve|serves|served)\s+as\s+(?:a|an)\s+(?:testament|reminder|bridge|symbol|beacon|cornerstone|foundation|turning point)\b/gi,
  ],
  [
    "plays a significant role",
    /\b(?:play|plays|played|playing)\s+a\s+(?:crucial|pivotal|vital|significant|key)\s+role\b/gi,
  ],
  ["underscores the importance", /\bunderscor(?:e|es|ed|ing)\s+the\s+(?:importance|significance)\b/gi],
  ["highlights the importance", /\bhighlight(?:s|ed|ing)?\s+the\s+(?:importance|significance)\b/gi],
  ["reflects the broader", /\breflect(?:s|ed|ing)?\s+the\s+broader\b/gi],
  ["symbolizes", /\bsymboliz(?:e|es|ed|ing)\b/gi],
  ["is a reminder that", /\bis\s+a\s+reminder\s+that\b/gi],
  ["leaves a lasting impression", /\bleav(?:e|es|ing)\s+a\s+lasting\s+impression\b/gi],
  ["at the intersection of", /\bat\s+the\s+intersection\s+of\b/gi],
  ["more than just", /\bmore\s+than\s+just\b/gi],
  ["the through-line", /\bthe\s+through[- ]line\b/gi],
  ["the key takeaway", /\bthe\s+key\s+takeaway\b/gi],
  ["the bottom line", /\bthe\s+bottom\s+line\b/gi],
]

const NEGATIVE_PARALLELISM_PATTERNS = [
  /\bnot\s+(?:just|only|merely|simply)\b[^.!?\n]{1,160}\b(?:but|yet)\b/gi,
  /\bnot\s+because\b[^.!?\n]{1,160}\bbut\s+because\b/gi,
  /\b(?:is|are|was|were|isn't|aren't|wasn't|weren't)\s+not\s+[^.!?\n:]{1,160}[.;]\s*(?:it|this|that|they|these|those)\s+(?:is|are|was|were)\b/gi,
  /\b(?:is|are|was|were)\s+not\s+[^.!?\n]{1,140},\s*but\b/gi,
  /\bnot\s+(?:a|an|the)\s+[^.!?\n]{1,140},\s*but\b/gi,
  /\bnot\s+[a-z]+(?:ing)?\b[^.!?\n]{1,100},\s*but\b/gi,
  /\bnot\s+(?:just|only)\b[^.!?\n]{1,140}[.;]\s*(?:it|this|that|they|these|those)\s+\w+/gi,
  /\b(?:is|are|was|were)\s+not\s+(?:a|an|the|just|only|merely|simply)?\s*[^.!?\n:]{1,110}\.\s*(?:it|they)\s+(?:is|are|was|were|shape|shapes|determine|determines|define|defines|drive|drives|make|makes|made|give|gives|gave)\b/gi,
  /\bI\s+am\s+not\b[^.!?\n]{1,120}\.\s*I\s+am\b/gi,
  /\b(?:less|more)\s+about\s+[^.!?\n]{1,140}\s+(?:and|than)\s+(?:more|less)\s+about\b/gi,
  /\b(?:rather than|instead of)\s+[^.!?\n]{1,140},\s*(?:it|this|that)\s+(?:is|was)\b/gi,
]

const SUPERFICIAL_ANALYSIS_REGEX =
  /,\s+(?:highlighting|underscoring|emphasizing|showcasing|reflecting|demonstrating|illustrating|signaling|cementing|solidifying|positioning)\b[^.!?\n]{0,140}[.!?]/gi

const FORMULAIC_INTRO_PATTERNS = [
  /\bin this\s+(?:article|post|blog|guide)\b/gi,
  /\bthis\s+(?:article|post|blog|guide)\s+(?:will|explores|examines|covers|looks at)\b/gi,
  /\bhave you ever\s+(?:wondered|thought|asked)\b/gi,
  /\bimagine\s+(?:a|an)\s+(?:world|place|future)\b/gi,
  /\bin today'?s\s+(?:fast[- ]paced|digital|modern|ever[- ]changing)\s+(?:world|landscape|age)\b/gi,
  /\blet'?s\s+(?:dive|unpack)\b/gi,
]

const CANNED_CONCLUSION_PATTERNS = [
  /\bin conclusion\b/gi,
  /\bto sum up\b/gi,
  /\ball in all\b/gi,
  /\bat the end of the day\b/gi,
  /\bin summary\b/gi,
  /\boverall,\s/gi,
]

const TRANSITION_REGEX = /\b(?:Moreover|Furthermore|Additionally|Notably|Importantly)\b/gi
const CONCLUSION_HEADING_REGEX =
  /^(?:in conclusion|conclusion|final thoughts?|key takeaways?|summary|wrap[- ]?up|the bottom line)$/i
const CONCLUSIONS_OPENERS_REGEX =
  /^(?:in conclusion|ultimately|overall|in the end|to sum up|all in all|at the end of the day|the bottom line)\b/i

const FRONTMATTER_KEYS = new Set([
  "id",
  "title",
  "articleDate",
  "articleContent",
  "authorName",
  "authorImgSrc",
  "tags",
  "technologies",
  "featured",
  "recentHighlight",
  "role",
  "outcome",
  "heroImage",
  "metrics",
  "links",
])

function describeCodePoint(codePoint) {
  return `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
}

function hiddenLabel(codePoint) {
  for (const [start, end, label] of HIDDEN_RANGES) {
    if (codePoint >= start && codePoint <= end) return label
  }
  return "format character"
}

function visibleExcerpt(text, index, matchLength) {
  const lineStart = text.lastIndexOf("\n", index - 1) + 1
  const nextNewline = text.indexOf("\n", index)
  const lineEnd = nextNewline === -1 ? text.length : nextNewline
  const line = text.slice(lineStart, lineEnd)
  const relative = index - lineStart
  const start = Math.max(0, relative - 70)
  const end = Math.min(line.length, relative + Math.max(matchLength, 1) + 70)
  const visible = line
    .slice(start, end)
    .replace(HIDDEN_REGEX, (character) => `[${describeCodePoint(character.codePointAt(0))}]`)
    .replace(/\s+/g, " ")
    .trim()

  return `${start > 0 ? "…" : ""}${visible}${end < line.length ? "…" : ""}`
}

function lineColumnAt(text, startLine, index) {
  const before = text.slice(0, index)
  const line = startLine + (before.match(/\n/g) || []).length
  const lastNewline = before.lastIndexOf("\n")
  const column = index - lastNewline
  return { line, column }
}

function addFinding(findings, suppressions, finding) {
  const allowedRules = suppressions && suppressions.get(finding.line)
  if (allowedRules && allowedRules.has(finding.rule)) return

  const dedupeKey = finding.dedupeKey || `${finding.rule}|${finding.line}`
  if (findings.some((existing) => (existing.dedupeKey || `${existing.rule}|${existing.line}`) === dedupeKey)) {
    return
  }

  findings.push({ ...finding, dedupeKey })
}

function collectSuppressions(text, startLine, file) {
  const suppressions = new Map()
  const findings = []

  for (const match of text.matchAll(new RegExp(COMMENT_REGEX.source, "g"))) {
    const comment = match[0]
    if (!/slop-audit-allow/i.test(comment)) continue

    const { line, column } = lineColumnAt(text, startLine, match.index)
    const parsed = parseAllowDirective(comment)
    if (!parsed.ok) {
      addFinding(findings, suppressions, {
        rule: "invalid-audit-directive",
        file,
        line,
        column,
        detail: parsed.reason,
        excerpt: visibleExcerpt(text, match.index, comment.length),
        message: RULE_META["invalid-audit-directive"].message,
      })
      continue
    }

    const lines = text.split("\n")
    let targetIndex = line - startLine + 1
    while (targetIndex < lines.length && lines[targetIndex].trim().length === 0) targetIndex += 1
    if (targetIndex >= lines.length) {
      addFinding(findings, suppressions, {
        rule: "invalid-audit-directive",
        file,
        line,
        column,
        detail: "directive has no following content line to apply to",
        excerpt: visibleExcerpt(text, match.index, comment.length),
        message: RULE_META["invalid-audit-directive"].message,
      })
      continue
    }

    const targetLine = startLine + targetIndex
    const existing = suppressions.get(targetLine) || new Set()
    for (const rule of parsed.rules) existing.add(rule)
    suppressions.set(targetLine, existing)
  }

  return { suppressions, findings }
}

function parseAllowDirective(comment) {
  const match = comment.trim().match(ALLOW_DIRECTIVE_REGEX)
  if (!match) {
    return { ok: false, reason: "directive must use the documented comment syntax" }
  }

  const body = match[1].trim()
  const reasonMatch = body.match(/^(.*?)\s+reason="([^"]+)"$/)
  if (!reasonMatch) {
    return { ok: false, reason: 'directive needs a non-empty reason="..." clause' }
  }

  const ruleIds = reasonMatch[1]
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  if (ruleIds.length === 0) {
    return { ok: false, reason: "directive needs at least one rule id" }
  }

  const unknown = ruleIds.filter((rule) => !RULE_META[rule])
  if (unknown.length > 0) {
    return { ok: false, reason: `unknown rule id(s): ${unknown.join(", ")}` }
  }

  return { ok: true, rules: ruleIds }
}

function scanHiddenUnicode({ file, text, startLine, findings, suppressions }) {
  for (const match of text.matchAll(new RegExp(HIDDEN_REGEX.source, "gu"))) {
    const codePoint = match[0].codePointAt(0)
    const { line, column } = lineColumnAt(text, startLine, match.index)
    addFinding(findings, suppressions, {
      rule: "hidden-unicode",
      file,
      line,
      column,
      detail: `${describeCodePoint(codePoint)} ${hiddenLabel(codePoint)}`,
      excerpt: visibleExcerpt(text, match.index, match[0].length),
      message: RULE_META["hidden-unicode"].message,
      dedupeKey: `hidden-unicode|${line}|${codePoint}`,
    })
  }
}

function scanPromptArtifacts({ file, text, startLine, findings, suppressions }) {
  for (const { label, regex } of PROMPT_PATTERNS) {
    for (const match of text.matchAll(new RegExp(regex.source, regex.flags))) {
      const { line, column } = lineColumnAt(text, startLine, match.index)
      addFinding(findings, suppressions, {
        rule: "prompt-artifact",
        file,
        line,
        column,
        detail: label,
        excerpt: visibleExcerpt(text, match.index, match[0].length),
        message: RULE_META["prompt-artifact"].message,
      })
    }
  }
}

function scanHiddenComments({ file, codeMaskedText, startLine, findings, suppressions }) {
  for (const match of codeMaskedText.matchAll(new RegExp(COMMENT_REGEX.source, "g"))) {
    const parsed = parseAllowDirective(match[0])
    if (parsed.ok) continue

    const { line, column } = lineColumnAt(codeMaskedText, startLine, match.index)
    addFinding(findings, suppressions, {
      rule: "hidden-markdown-comment",
      file,
      line,
      column,
      detail: "invisible HTML comment",
      excerpt: visibleExcerpt(codeMaskedText, match.index, match[0].length),
      message: RULE_META["hidden-markdown-comment"].message,
    })
  }
}

function scanEmoji({ file, text, startLine, findings, suppressions }) {
  for (const match of text.matchAll(new RegExp(EMOJI_REGEX.source, "gu"))) {
    const { line, column } = lineColumnAt(text, startLine, match.index)
    addFinding(findings, suppressions, {
      rule: "emoji",
      file,
      line,
      column,
      detail: match[0],
      excerpt: visibleExcerpt(text, match.index, match[0].length),
      message: RULE_META.emoji.message,
    })
  }
}

function analyzeProseSegments({ file, segments, findings, suppressions }) {
  for (const segment of segments) {
    const text = segment.text
    if (!text || text.trim().length === 0) continue
    const startLine = segment.line

    for (const [label, regex] of SLOP_WORDS) {
      for (const match of text.matchAll(new RegExp(regex.source, regex.flags))) {
        const { line, column } = lineColumnAt(text, startLine, match.index)
        addFinding(findings, suppressions, {
          rule: "slop-vocabulary",
          file,
          line,
          column,
          detail: label,
          excerpt: visibleExcerpt(text, match.index, match[0].length),
          message: RULE_META["slop-vocabulary"].message,
        })
      }
    }

    for (const [label, regex] of SIGNIFICANCE_PATTERNS) {
      for (const match of text.matchAll(new RegExp(regex.source, regex.flags))) {
        const { line, column } = lineColumnAt(text, startLine, match.index)
        addFinding(findings, suppressions, {
          rule: "significance-inflation",
          file,
          line,
          column,
          detail: label,
          excerpt: visibleExcerpt(text, match.index, match[0].length),
          message: RULE_META["significance-inflation"].message,
        })
      }
    }

    for (const regex of NEGATIVE_PARALLELISM_PATTERNS) {
      for (const match of text.matchAll(new RegExp(regex.source, regex.flags))) {
        const { line, column } = lineColumnAt(text, startLine, match.index)
        addFinding(findings, suppressions, {
          rule: "negative-parallelism",
          file,
          line,
          column,
          detail: "contrast template",
          excerpt: visibleExcerpt(text, match.index, match[0].length),
          message: RULE_META["negative-parallelism"].message,
        })
      }
    }

    for (const match of text.matchAll(
      new RegExp(SUPERFICIAL_ANALYSIS_REGEX.source, SUPERFICIAL_ANALYSIS_REGEX.flags)
    )) {
      const { line, column } = lineColumnAt(text, startLine, match.index)
      addFinding(findings, suppressions, {
        rule: "superficial-analysis",
        file,
        line,
        column,
        detail: "trailing participle",
        excerpt: visibleExcerpt(text, match.index, match[0].length),
        message: RULE_META["superficial-analysis"].message,
      })
    }

    for (const regex of FORMULAIC_INTRO_PATTERNS) {
      for (const match of text.matchAll(new RegExp(regex.source, regex.flags))) {
        const { line, column } = lineColumnAt(text, startLine, match.index)
        addFinding(findings, suppressions, {
          rule: "formulaic-intro",
          file,
          line,
          column,
          detail: "generic opening",
          excerpt: visibleExcerpt(text, match.index, match[0].length),
          message: RULE_META["formulaic-intro"].message,
        })
      }
    }

    for (const regex of CANNED_CONCLUSION_PATTERNS) {
      for (const match of text.matchAll(new RegExp(regex.source, regex.flags))) {
        const { line, column } = lineColumnAt(text, startLine, match.index)
        addFinding(findings, suppressions, {
          rule: "canned-conclusion",
          file,
          line,
          column,
          detail: "generic summary phrase",
          excerpt: visibleExcerpt(text, match.index, match[0].length),
          message: RULE_META["canned-conclusion"].message,
        })
      }
    }
  }
}

function stripMarkdown(value) {
  return value
    .replace(/[*_`~]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim()
}

function analyzeMarkdownStructure({ file, body, bodyStartLine, findings, suppressions }) {
  const words = countWords(body)
  const lines = body.split("\n")
  const stats = {
    words,
    sentences: countSentences(body),
    tricolons: 0,
    transitions: 0,
    inlineHeaderLists: 0,
  }

  let listStartLine = null
  let listCount = 0
  const flushList = () => {
    if (listCount >= 3) {
      stats.inlineHeaderLists += 1
      addFinding(findings, suppressions, {
        rule: "inline-header-list",
        file,
        line: listStartLine,
        column: 1,
        detail: `${listCount} bold pseudo-headings in one list`,
        excerpt: "bold pseudo-heading list",
        message: RULE_META["inline-header-list"].message,
      })
    }
    listStartLine = null
    listCount = 0
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const itemMatch = line.match(/^\s*(?:[-*+]|\d+\.)\s+\*\*[^*]+\*\*(?:\s|$)/)
    if (itemMatch) {
      if (listStartLine === null) listStartLine = bodyStartLine + index
      listCount += 1
      continue
    }
    if (line.trim().length > 0) flushList()
  }
  flushList()

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/)
    if (!heading) continue
    const title = stripMarkdown(heading[1])
    if (CONCLUSION_HEADING_REGEX.test(title)) {
      addFinding(findings, suppressions, {
        rule: "canned-conclusion",
        file,
        line: bodyStartLine + index,
        column: 1,
        detail: "conclusion heading",
        excerpt: title,
        message: RULE_META["canned-conclusion"].message,
      })
    }
  }

  const paragraphs = []
  let paragraphStart = 0
  for (let index = 0; index <= lines.length; index += 1) {
    if (index === lines.length || lines[index].trim().length === 0) {
      if (index > paragraphStart) {
        const text = lines.slice(paragraphStart, index).join(" ").trim()
        if (text.length > 0) paragraphs.push({ text, line: bodyStartLine + paragraphStart })
      }
      paragraphStart = index + 1
    }
  }
  const lastParagraph = paragraphs[paragraphs.length - 1]
  if (lastParagraph && CONCLUSIONS_OPENERS_REGEX.test(lastParagraph.text)) {
    addFinding(findings, suppressions, {
      rule: "canned-conclusion",
      file,
      line: lastParagraph.line,
      column: 1,
      detail: "summary opener in final paragraph",
      excerpt: lastParagraph.text.slice(0, 160),
      message: RULE_META["canned-conclusion"].message,
    })
  }

  const tricolons = findRuleOfThree(body)
  stats.tricolons = tricolons.length
  if (tricolons.length >= 3) {
    for (const tricolon of tricolons) {
      const { line, column } = lineColumnAt(body, bodyStartLine, tricolon.index)
      addFinding(findings, suppressions, {
        rule: "rule-of-three",
        file,
        line,
        column,
        detail: "three-item coordinated phrase",
        excerpt: tricolon.text.slice(0, 180),
        message: RULE_META["rule-of-three"].message,
      })
    }
  }

  const transitions = [...body.matchAll(new RegExp(TRANSITION_REGEX.source, TRANSITION_REGEX.flags))]
  stats.transitions = transitions.length
  if (transitions.length >= 4 && words > 0 && (transitions.length / words) * 1000 > 2.5) {
    const first = transitions[0]
    const { line, column } = lineColumnAt(body, bodyStartLine, first.index)
    addFinding(findings, suppressions, {
      rule: "transition-density",
      file,
      line,
      column,
      detail: `${transitions.length} formal transitions in ${words} words`,
      excerpt: visibleExcerpt(body, first.index, first[0].length),
      message: RULE_META["transition-density"].message,
    })
  }

  return stats
}

function findRuleOfThree(text) {
  const matches = []
  const sentenceRegex = /[^.!?\n]+[.!?]?/g
  for (const match of text.matchAll(sentenceRegex)) {
    const sentence = match[0].trim().replace(/\s+/g, " ")
    if (sentence.length < 12 || sentence.startsWith("#")) continue

    const cleaned = sentence
      .replace(/[“”"()]/g, "")
      .replace(/\s+/g, " ")
      .trim()
    const parts = cleaned.split(",").map((part) => part.trim())
    if (parts.length !== 3) continue
    if (!/^and\s+/i.test(parts[2])) continue

    const wordCounts = parts.map(
      (part) =>
        part
          .replace(/^and\s+/i, "")
          .split(/\s+/)
          .filter(Boolean).length
    )
    if (wordCounts.some((count) => count < 1 || count > 6)) continue

    matches.push({ text: sentence, index: match.index })
  }
  return matches
}

function countWords(text) {
  return (text.match(/\b[\p{L}\p{N}'’-]+\b/gu) || []).length
}

function countSentences(text) {
  return (text.match(/[^.!?\n]+[.!?]?/g) || []).filter((sentence) => sentence.trim().length > 0).length
}

function findUnknownFrontmatterKeys({ file, data, frontmatterLines, frontmatterStartLine, findings, suppressions }) {
  for (const key of Object.keys(data)) {
    if (FRONTMATTER_KEYS.has(key)) continue
    const lineIndex = frontmatterLines.findIndex((line) => new RegExp(`^${escapeRegExp(key)}\\s*:`).test(line))
    addFinding(findings, suppressions, {
      rule: "frontmatter-unknown-key",
      file,
      line: lineIndex === -1 ? frontmatterStartLine : frontmatterStartLine + lineIndex,
      column: 1,
      detail: key,
      excerpt: key,
      message: RULE_META["frontmatter-unknown-key"].message,
    })
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

module.exports = {
  RULE_META,
  FRONTMATTER_KEYS,
  HIDDEN_REGEX,
  analyzeMarkdownStructure,
  analyzeProseSegments,
  collectSuppressions,
  countWords,
  findRuleOfThree,
  findUnknownFrontmatterKeys,
  scanEmoji,
  scanHiddenComments,
  scanHiddenUnicode,
  scanPromptArtifacts,
}
