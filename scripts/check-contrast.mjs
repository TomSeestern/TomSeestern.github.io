#!/usr/bin/env node
/**
 * WCAG 2.x contrast gate for the TomSegbers.de design tokens.
 *
 * Pure JavaScript, zero dependencies. Reads the committed token-pair manifest
 * (`tests/budgets/contrast.json`), computes the WCAG 2.x contrast ratio for
 * every pair, prints a per-pair table, and exits non-zero when a `text` pair is
 * below 4.5:1 or a `ui` (non-text) pair is below 3:1.
 *
 * The manifest is the contract: it enumerates every foreground/background pair
 * the palette actually ships, not the palette in the abstract. When a token
 * value changes, this gate is what stops a low-contrast combination from
 * reaching `main`. See `DESIGN.md` §2 for the palette these pairs describe.
 *
 * Usage:
 *   node scripts/check-contrast.mjs
 *   node scripts/check-contrast.mjs path/to/contrast.json
 */
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DEFAULT_MANIFEST = resolve(REPO_ROOT, "tests", "budgets", "contrast.json")

const DEFAULT_MINIMUMS = { text: 4.5, ui: 3 }

/** Parse a `#rrggbb` string into its three 0–255 channels. Returns null when malformed. */
function parseHex(value) {
  if (typeof value !== "string") return null
  const match = /^#([0-9a-fA-F]{6})$/.exec(value.trim())
  if (!match) return null
  const int = Number.parseInt(match[1], 16)
  return [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff]
}

/** srgb channel (0–1) -> linear-light channel. */
function linearize(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.x relative luminance for a `#rrggbb` colour. */
function relativeLuminance(hex) {
  const rgb = parseHex(hex)
  if (!rgb) return null
  const [r, g, b] = rgb
  return 0.2126 * linearize(r / 255) + 0.7152 * linearize(g / 255) + 0.0722 * linearize(b / 255)
}

/** WCAG 2.x contrast ratio between two `#rrggbb` colours (1–21). */
function contrastRatio(foreground, background) {
  const fg = relativeLuminance(foreground)
  const bg = relativeLuminance(background)
  if (fg === null || bg === null) return null
  const lighter = Math.max(fg, bg)
  const darker = Math.min(fg, bg)
  return (lighter + 0.05) / (darker + 0.05)
}

function loadManifest(path) {
  let raw
  try {
    raw = readFileSync(path, "utf8")
  } catch (error) {
    throw new Error(`cannot read contrast manifest at ${path}: ${error.message}`)
  }
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    throw new Error(`contrast manifest is not valid JSON (${path}): ${error.message}`)
  }
  if (!parsed || !Array.isArray(parsed.pairs) || parsed.pairs.length === 0) {
    throw new Error(`contrast manifest has no "pairs" array: ${path}`)
  }
  return parsed
}

function formatRatio(ratio) {
  return ratio === null ? "  n/a" : ratio.toFixed(2).padStart(6)
}

function main() {
  const manifestPath = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_MANIFEST
  const manifest = loadManifest(manifestPath)
  const minimums = { ...DEFAULT_MINIMUMS, ...(manifest.minimums ?? {}) }

  const rows = []
  const failures = []

  for (const pair of manifest.pairs) {
    const kind = pair.kind
    const minimum = minimums[kind]
    const ratio = contrastRatio(pair.foreground, pair.background)
    const atLeast = typeof minimum === "number" && ratio !== null && ratio >= minimum
    rows.push({ pair, kind, minimum, ratio, pass: atLeast })

    if (typeof minimum !== "number") {
      failures.push(`${pair.name}: unknown kind "${kind}" (expected one of ${Object.keys(minimums).join(", ")})`)
    } else if (ratio === null) {
      failures.push(`${pair.name}: malformed colour (foreground ${pair.foreground}, background ${pair.background})`)
    } else if (!atLeast) {
      failures.push(
        `${pair.name}: ${ratio.toFixed(2)}:1 below the ${minimum}:1 ${kind} minimum ` +
          `(${pair.foreground} on ${pair.background})`
      )
    }
  }

  const nameWidth = Math.max(5, ...rows.map((row) => row.pair.name.length))
  const kindWidth = Math.max(4, ...rows.map((row) => String(row.kind).length))

  console.log(`WCAG 2.x contrast gate — ${rows.length} pair(s) from ${manifestPath}`)
  console.log(`${"STATUS".padEnd(6)} ${"KIND".padEnd(kindWidth)} ${"RATIO".padStart(6)} ${"MIN".padStart(5)}  NAME`)
  console.log("-".repeat(6 + kindWidth + 15 + nameWidth))

  for (const { pair, kind, minimum, ratio, pass } of rows) {
    const status = pass ? "PASS" : "FAIL"
    const min = typeof minimum === "number" ? minimum.toFixed(1).padStart(5) : "  ???"
    console.log(`${status.padEnd(6)} ${String(kind).padEnd(kindWidth)} ${formatRatio(ratio)} ${min}  ${pair.name}`)
  }

  console.log("-".repeat(6 + kindWidth + 15 + nameWidth))
  if (failures.length > 0) {
    console.error(`\nCONTRAST GATE FAILED — ${failures.length} pair(s) below budget:`)
    for (const failure of failures) console.error(`  - ${failure}`)
    process.exit(1)
  }

  console.log(`\nCONTRAST GATE PASSED — all ${rows.length} pair(s) meet their minimums.`)
}

main()
