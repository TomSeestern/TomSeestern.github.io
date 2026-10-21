#!/usr/bin/env node
/**
 * Banned-ornament gate for the "engineered calm" theme (T15).
 *
 * The parchment/terracotta identity is deliberately free of classical and
 * precious-material ornament. This gate walks the source tree (code, style,
 * config and markup files) and exits non-zero when a banned term appears as a
 * whole word, so a Roman prop, a `gold`/`marble` design token, or a `bust`
 * divider cannot be reintroduced. Content markdown and prose docs are out of
 * scope — this guards the shipped code and design tokens, not the English
 * language.
 *
 * Excluded: dependencies, build output, agent state (`.omo/`), and vendored
 * tooling (`.claude/` skills such as impeccable, plus its `.impeccable/`
 * runtime cache) — third-party code carries its own vocabulary, and this gate
 * guards what we ship. The gate script itself is excluded because it must name
 * the terms it bans.
 *
 * Usage: node scripts/check-ornaments.mjs
 */
import { readdirSync, readFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SELF = fileURLToPath(import.meta.url)

const EXCLUDED_DIRS = new Set([
  ".git",
  ".next",
  ".omo",
  // Vendored design skill and its runtime cache: third-party vocabulary, not our tokens
  ".claude",
  ".impeccable",
  "node_modules",
  "storybook-static",
  "test-results",
  "playwright-report",
  "coverage",
  ".lighthouseci",
])

const INCLUDED_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".css", ".json", ".html"])

const BANNED = [
  { term: "laurel", reason: "Roman ornament" },
  { term: "bust", reason: "Roman ornament" },
  { term: "spqr", reason: "Roman ornament" },
  { term: "colosseum", reason: "Roman ornament" },
  { term: "toga", reason: "Roman ornament" },
  { term: "papyrus", reason: "Roman ornament" },
  { term: "gold", reason: "banned design token" },
  { term: "marble", reason: "banned design token" },
]

const PATTERNS = BANNED.map((entry) => ({ ...entry, regex: new RegExp(`\\b${entry.term}\\b`, "i") }))

function walk(dir, files) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) walk(join(dir, entry.name), files)
    } else if (entry.isFile()) {
      const full = join(dir, entry.name)
      if (full !== SELF && INCLUDED_EXTENSIONS.has(extname(entry.name).toLowerCase())) files.push(full)
    }
  }
}

function scan() {
  const files = []
  walk(REPO_ROOT, files)

  const hits = []
  for (const file of files) {
    const content = readFileSync(file, "utf8")
    const lines = content.split(/\r?\n/)
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]
      for (const { term, reason, regex } of PATTERNS) {
        if (regex.test(line)) {
          hits.push({ file: relative(REPO_ROOT, file), line: index + 1, term, reason, text: line.trim().slice(0, 160) })
        }
      }
    }
  }

  return { files, hits }
}

function main() {
  const { files, hits } = scan()

  console.log(`Banned-ornament gate — scanned ${files.length} source file(s)`)
  console.log(`Banned terms: ${BANNED.map((entry) => entry.term).join(", ")}`)

  if (hits.length > 0) {
    console.error(`\nORNAMENT GATE FAILED — ${hits.length} banned term(s) found:`)
    for (const hit of hits) {
      console.error(`  ${hit.file}:${hit.line}  [${hit.term}] (${hit.reason})  ${hit.text}`)
    }
    process.exit(1)
  }

  console.log("\nORNAMENT GATE PASSED — no banned ornament or token found.")
}

main()
