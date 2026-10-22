#!/usr/bin/env node
/**
 * Design-token gate for the COLOSSUS system.
 *
 * The visual language is only enforceable if the old skin cannot creep back in
 * through a class string or a one-off colour. This gate walks the authored
 * TypeScript/TSX/CSS surface plus the Tailwind config and rejects:
 *   - legacy token names from the retired parchment design
 *   - dark-mode utilities after the single-dark-mode decision
 *   - raw hex colours outside the token/config/budget files
 *   - references to the retired display/body faces
 *
 * Comment-only lines are ignored so project prose can explain the migration
 * without tripping its own gate. SVG assets, public/, content/, tests/budgets,
 * and lib/design-tokens.ts legitimately carry colour data and are out of scope.
 *
 * Usage:
 *   node scripts/check-design-tokens.mjs
 *   node scripts/check-design-tokens.mjs --self-test
 */
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE_ROOTS = ["app", "components", "lib", "styles"]
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".css"])
const CONFIG_FILE = join(REPO_ROOT, "tailwind.config.js")
const SELF_PATH = fileURLToPath(import.meta.url)

const LEGACY_PATTERNS = [
  { name: "legacy surface-muted token", pattern: /\bsurface-muted\b/ },
  { name: "legacy accent-soft token", pattern: /\baccent-soft\b/ },
  { name: "legacy foreground-muted token", pattern: /\bforeground-muted\b/ },
  { name: "legacy primary-* token", pattern: /\bprimary-[a-zA-Z0-9]/ },
  { name: "dark-mode utility", pattern: /\bdark:/ },
  { name: "retired Newsreader face", pattern: /\bNewsreader\b/ },
  { name: "retired Inter face", pattern: /\bInter\b/ },
  { name: "retired Instrument Serif face", pattern: /\bInstrument(?: Serif|_Serif)\b/ },
  { name: "retired Silkscreen face", pattern: /\bSilkscreen\b/ },
  { name: "retired parchment reference", pattern: /\bparchment\b/i },
]

const HEX_PATTERN = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g

function isCommentOnly(line) {
  const trimmed = line.trim()
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("*/") ||
    trimmed.startsWith("{/*") ||
    trimmed.startsWith("<!--")
  )
}

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full))
    } else if (SOURCE_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      out.push(full)
    }
  }
  return out
}

function sourceFiles() {
  const files = []
  for (const root of SOURCE_ROOTS) {
    const fullRoot = join(REPO_ROOT, root)
    files.push(...walk(fullRoot))
  }
  files.push(CONFIG_FILE)
  return files.filter((file) => resolve(file) !== resolve(SELF_PATH)).sort()
}

function labelFor(file) {
  return relative(REPO_ROOT, file)
}

function scanText(file, text, allowRawHex) {
  const violations = []
  const lines = text.split(/\r?\n/)

  for (const [index, line] of lines.entries()) {
    if (isCommentOnly(line)) continue

    const where = `${labelFor(file)}:${index + 1}`
    for (const { name, pattern } of LEGACY_PATTERNS) {
      if (pattern.test(line)) {
        violations.push(`${where}: ${name}`)
      }
    }

    if (!allowRawHex) {
      for (const match of line.matchAll(HEX_PATTERN)) {
        violations.push(`${where}: raw hex colour ${match[0]} (use a semantic token)`)
      }
    }
  }

  return violations
}

function scan(files) {
  const violations = []
  for (const file of files) {
    const allowRawHex = file === CONFIG_FILE || file.endsWith("lib/design-tokens.ts")
    violations.push(...scanText(file, readFileSync(file, "utf8"), allowRawHex))
  }
  return violations
}

function selfTest() {
  const tempRoot = mkdtempSync(join(tmpdir(), "colossus-design-token-self-test-"))
  const badFile = join(tempRoot, "bad.tsx")
  const cleanFile = join(tempRoot, "good.tsx")
  try {
    writeFileSync(badFile, 'export const bad = "bg-surface-muted text-[#ff00aa] dark:text-white"\n')
    writeFileSync(cleanFile, 'export const good = "bg-canvas text-ink focus-ring"\n')

    const badViolations = scanText(badFile, readFileSync(badFile, "utf8"), false)
    const cleanViolations = scanText(cleanFile, readFileSync(cleanFile, "utf8"), false)

    if (badViolations.length === 0) {
      throw new Error("fixture with bg-surface-muted/raw hex/dark utility was not rejected")
    }
    if (cleanViolations.length > 0) {
      throw new Error(`clean fixture was rejected: ${cleanViolations.join("; ")}`)
    }

    console.log(`SELF-TEST PASSED — fixture rejected ${badViolations.length} violation(s); clean fixture accepted.`)
    for (const violation of badViolations) console.log(`  - ${violation}`)
    return 0
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
}

function main() {
  if (process.argv.includes("--self-test")) {
    process.exitCode = selfTest()
    return
  }

  const files = sourceFiles()
  const violations = scan(files)

  if (violations.length > 0) {
    console.error(`DESIGN-TOKEN GATE FAILED — ${violations.length} violation(s) across ${files.length} file(s):`)
    for (const violation of violations) console.error(`  - ${violation}`)
    process.exitCode = 1
    return
  }

  console.log(
    `DESIGN-TOKEN GATE PASSED — ${files.length} file(s), no legacy tokens, dark utilities, raw hex, or retired faces.`
  )
}

main()
