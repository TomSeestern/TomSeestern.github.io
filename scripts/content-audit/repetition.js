"use strict"

const { RULE_META, addFinding, lineColumnAt, visibleExcerpt } = require("./rules")

const WORD_REGEX = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu
const DUPLICATE_SHINGLE_WORDS = 12
const KEYWORD_PHRASE_WORDS = 3
const KEYWORD_MIN_COUNT = 5
const KEYWORD_MIN_SHARE = 0.02

// Function words are excluded from keyword phrases because they turn ordinary
// sentences into accidental matches. The remaining words are the ones a stuffed
// page would repeat as a ranking phrase.
const STOP_WORDS = new Set(
  (
    "a about above after again against all also am an and any are as at be because been before being below " +
    "between both but by can could did do does doing down during each few for from further had has have having " +
    "he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor " +
    "not now of off on once only or other our ours ourselves out over own same she should so some such than that the " +
    "their theirs them themselves then there these they this those through to too under until up very was we were what " +
    "when where which while who whom why will with would you your yours yourself yourselves"
  ).split(" ")
)

function tokenize(text) {
  const tokens = []
  for (const match of text.matchAll(new RegExp(WORD_REGEX.source, "gu"))) {
    tokens.push({ value: match[0].toLowerCase(), index: match.index })
  }
  return tokens
}

function isContentWord(token) {
  return token.value.length >= 3 && !STOP_WORDS.has(token.value)
}

function findRepeatedPhrases(
  text,
  { phraseWords = KEYWORD_PHRASE_WORDS, minCount = KEYWORD_MIN_COUNT, minShare = KEYWORD_MIN_SHARE } = {}
) {
  const tokens = tokenize(text)
  if (tokens.length < phraseWords * minCount) return []

  const counts = new Map()
  for (let index = 0; index + phraseWords <= tokens.length; index += 1) {
    const slice = tokens.slice(index, index + phraseWords)
    if (!slice.every(isContentWord)) continue

    const phrase = slice.map((token) => token.value).join(" ")
    const existing = counts.get(phrase)
    if (existing) {
      existing.count += 1
      continue
    }
    counts.set(phrase, { phrase, count: 1, startIndex: slice[0].index })
  }

  return [...counts.values()].filter(({ count }) => {
    const share = (count * phraseWords) / tokens.length
    return count >= minCount && share >= minShare
  })
}

function scanKeywordStuffing({ file, body, startLine, findings, suppressions }) {
  for (const match of findRepeatedPhrases(body)) {
    const { line, column } = lineColumnAt(body, startLine, match.startIndex)
    addFinding(findings, suppressions, {
      rule: "keyword-stuffing",
      file,
      line,
      column,
      detail: `"${match.phrase}" repeated ${match.count} times`,
      excerpt: visibleExcerpt(body, match.startIndex, match.phrase.length),
      message: RULE_META["keyword-stuffing"].message,
    })
  }
}

function findDuplicateContent(results) {
  const findings = []
  const documents = results
    .filter((result) => result.kind === "markdown" && typeof result.bodyProse === "string")
    .map((result) => ({
      file: result.file,
      bodyProse: result.bodyProse,
      bodyStartLine: result.bodyStartLine,
      tokens: tokenize(result.bodyProse),
      windows: [],
      firstWindowByPhrase: new Map(),
    }))
    .filter((document) => document.tokens.length >= DUPLICATE_SHINGLE_WORDS)

  const filesByShingle = new Map()
  for (const document of documents) {
    for (let index = 0; index + DUPLICATE_SHINGLE_WORDS <= document.tokens.length; index += 1) {
      const phrase = document.tokens
        .slice(index, index + DUPLICATE_SHINGLE_WORDS)
        .map((token) => token.value)
        .join(" ")
      document.windows[index] = phrase
      if (!document.firstWindowByPhrase.has(phrase)) document.firstWindowByPhrase.set(phrase, index)

      const files = filesByShingle.get(phrase) || new Set()
      files.add(document.file)
      filesByShingle.set(phrase, files)
    }
  }

  for (const document of documents) {
    const duplicateStarts = [...document.firstWindowByPhrase.entries()]
      .filter(([phrase]) => filesByShingle.get(phrase).size > 1)
      .map(([, start]) => start)
      .sort((left, right) => left - right)

    const runs = []
    for (const start of duplicateStarts) {
      const last = runs[runs.length - 1]
      if (last && start === last.end + 1) {
        last.end = start
        continue
      }
      runs.push({ start, end: start })
    }

    for (const run of runs) {
      const otherFiles = new Set()
      for (let index = run.start; index <= run.end; index += 1) {
        for (const file of filesByShingle.get(document.windows[index])) {
          if (file !== document.file) otherFiles.add(file)
        }
      }
      if (otherFiles.size === 0) continue

      const startToken = document.tokens[run.start]
      const wordCount = run.end - run.start + DUPLICATE_SHINGLE_WORDS
      const { line, column } = lineColumnAt(document.bodyProse, document.bodyStartLine, startToken.index)
      const otherLabel = [...otherFiles].sort().slice(0, 2).join(", ")
      addFinding(findings, new Map(), {
        rule: "duplicate-content",
        file: document.file,
        line,
        column,
        detail: `${wordCount}-word exact overlap with ${otherLabel}`,
        excerpt: visibleExcerpt(
          document.bodyProse,
          startToken.index,
          Math.min(160, document.bodyProse.length - startToken.index)
        ),
        message: RULE_META["duplicate-content"].message,
      })
    }
  }

  return findings
}

module.exports = {
  DUPLICATE_SHINGLE_WORDS,
  findDuplicateContent,
  findRepeatedPhrases,
  scanKeywordStuffing,
  tokenize,
}
