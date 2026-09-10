#!/usr/bin/env node
/**
 * Bundle-byte budget gate for TomSegbers.de.
 *
 * Reads the committed analyzer output at `.next/analyze/__bundle_analysis.json`
 * (written by `report-bundle-size.js` after `next build`) and compares every
 * route against the committed baseline in `tests/budgets/bundle-baseline.json`.
 *
 * Exits 1 when any of:
 *   - shared first-load JS (`__global`) exceeds SHARED_FIRST_LOAD_BUDGET_BYTES,
 *   - any single route exceeds ROUTE_BUDGET_BYTES,
 *   - any route grows more than ROUTE_GROWTH_BUDGET_RATIO versus the baseline.
 *
 * No dependencies: the analyzer JSON already carries gzip byte sizes, so this
 * script only reads JSON and does arithmetic. It resolves paths from its own
 * location, so it behaves the same from any working directory.
 */
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// --- Budgets ---------------------------------------------------------------

const KIB = 1024
const GLOBAL_KEY = "__global"
const SHARED_FIRST_LOAD_BUDGET_BYTES = 130 * KIB
const ROUTE_BUDGET_BYTES = 180 * KIB
const ROUTE_GROWTH_BUDGET_RATIO = 0.1

// --- Paths -----------------------------------------------------------------

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const ANALYZER_PATH = join(REPO_ROOT, ".next", "analyze", "__bundle_analysis.json")
const BASELINE_PATH = join(REPO_ROOT, "tests", "budgets", "bundle-baseline.json")

// --- Entry point -----------------------------------------------------------

const analyzer = loadSizeMap(
  ANALYZER_PATH,
  "analyzer output",
  'Build the app and generate the analyzer JSON first: "pnpm build && node report-bundle-size.js".'
)
const baseline = loadSizeMap(
  BASELINE_PATH,
  "bundle baseline",
  "The committed T02 baseline is missing; restore tests/budgets/bundle-baseline.json."
)

if (!(GLOBAL_KEY in analyzer)) {
  fail(`Analyzer output has no "${GLOBAL_KEY}" entry, so the shared first-load budget cannot be checked.`)
}

const rows = buildRows(analyzer, baseline)
const violations = rows.flatMap((row) => row.violations.map((reason) => ({ name: row.name, reason })))

printHeader()
printTable(rows)
printNotes(rows)

if (violations.length > 0) {
  console.log(`\nFAIL — ${violations.length} budget violation(s):`)
  for (const { name, reason } of violations) console.log(`  ${name} — ${reason}`)
  console.log("")
  process.exit(1)
}

console.log(`\nPASS — ${rows.length} entries within budget.`)
process.exit(0)

// --- Loading and validation ------------------------------------------------

/** Reads a JSON file and exits with an actionable message if it is absent or malformed. */
function loadSizeMap(path, label, hint) {
  let raw
  try {
    raw = readFileSync(path, "utf8")
  } catch {
    fail(`Missing ${label} at ${rel(path)}. ${hint}`)
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    fail(`${label} at ${rel(path)} is not valid JSON: ${error.message}`)
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    fail(`${label} at ${rel(path)} must be a JSON object mapping route -> { raw, gzip }.`)
  }

  for (const [name, value] of Object.entries(parsed)) {
    if (value === null || typeof value !== "object" || !Number.isFinite(value.gzip)) {
      fail(`${label} entry "${name}" is malformed; expected { raw: number, gzip: number } with a finite gzip size.`)
    }
  }

  return parsed
}

// --- Row construction ------------------------------------------------------

/**
 * One row per analyzer entry. `__global` first, then routes alphabetically for a
 * stable, diffable table. A route absent from the baseline is marked as new and
 * is judged only by the absolute route budget — growth versus baseline is
 * undefined for it.
 */
function buildRows(current, committedBaseline) {
  const names = Object.keys(current)
  names.sort((a, b) => (a === GLOBAL_KEY ? -1 : b === GLOBAL_KEY ? 1 : a.localeCompare(b)))

  return names.map((name) => {
    const isGlobal = name === GLOBAL_KEY
    const absoluteLimit = isGlobal ? SHARED_FIRST_LOAD_BUDGET_BYTES : ROUTE_BUDGET_BYTES
    const currentGzip = current[name].gzip
    const baselineGzip = name in committedBaseline ? committedBaseline[name].gzip : null
    const violations = []

    if (currentGzip > absoluteLimit) {
      violations.push(`exceeds ${formatKib(absoluteLimit)} limit (${formatBytes(currentGzip)} gzip)`)
    }

    const growth = computeGrowthRatio(currentGzip, baselineGzip)
    if (!isGlobal && growth !== null && growth > ROUTE_GROWTH_BUDGET_RATIO) {
      violations.push(
        `grew +${formatPercent(growth)} vs baseline (${formatBytes(baselineGzip)} gzip), limit +${formatPercent(
          ROUTE_GROWTH_BUDGET_RATIO
        )}`
      )
    }

    return { name, isGlobal, currentGzip, baselineGzip, growth, absoluteLimit, violations }
  })
}

function computeGrowthRatio(currentGzip, baselineGzip) {
  if (baselineGzip === null || baselineGzip <= 0) return null
  return (currentGzip - baselineGzip) / baselineGzip
}

// --- Output ----------------------------------------------------------------

function printHeader() {
  console.log("Bundle budget check")
  console.log(`  analyzer : ${rel(ANALYZER_PATH)}`)
  console.log(`  baseline : ${rel(BASELINE_PATH)}`)
  console.log(
    `  limits   : shared first-load ${formatKib(SHARED_FIRST_LOAD_BUDGET_BYTES)}, route ${formatKib(
      ROUTE_BUDGET_BYTES
    )}, route growth +${formatPercent(ROUTE_GROWTH_BUDGET_RATIO)}`
  )
}

function printTable(rows) {
  const headers = ["Route", "Current", "Baseline", "Δ", "Limit"]
  const widths = [
    Math.max(headers[0].length, ...rows.map((row) => row.name.length)),
    Math.max(headers[1].length, ...rows.map((row) => formatBytes(row.currentGzip).length)),
    Math.max(
      headers[2].length,
      ...rows.map((row) => (row.baselineGzip === null ? 1 : formatBytes(row.baselineGzip).length))
    ),
    Math.max(headers[3].length, ...rows.map((row) => formatDelta(row.growth).length)),
    Math.max(headers[4].length, 22),
  ]

  console.log("")
  console.log(formatRow(headers, widths))
  console.log("-".repeat(widths.reduce((total, width) => total + width, 0) + 2 * (widths.length - 1)))
  for (const row of rows) {
    const values = [
      row.name,
      formatBytes(row.currentGzip),
      row.baselineGzip === null ? "—" : formatBytes(row.baselineGzip),
      formatDelta(row.growth),
      row.isGlobal ? formatKib(row.absoluteLimit) : `${formatKib(row.absoluteLimit)} / +10%`,
    ]
    const suffix = row.violations.length > 0 ? "  <-- FAIL" : row.baselineGzip === null ? "  (new route)" : ""
    console.log(formatRow(values, widths) + suffix)
  }
}

function printNotes(rows) {
  const newRoutes = rows.filter((row) => !row.isGlobal && row.baselineGzip === null)
  if (newRoutes.length > 0) {
    console.log(`\nNote: ${newRoutes.length} route(s) absent from baseline — absolute limit only:`)
    for (const row of newRoutes) console.log(`  ${row.name} (${formatBytes(row.currentGzip)} gzip)`)
  }
}

function formatRow(values, widths) {
  return values
    .map((value, index) => (index === 0 ? value.padEnd(widths[index]) : value.padStart(widths[index])))
    .join("  ")
}

// --- Helpers ---------------------------------------------------------------

function formatBytes(bytes) {
  return `${bytes.toLocaleString("en-US")} B`
}

function formatKib(bytes) {
  return `${(bytes / KIB).toFixed(0)} KB`
}

function formatPercent(ratio) {
  return `${(ratio * 100).toFixed(1)}%`
}

function formatDelta(growth) {
  if (growth === null) return "—"
  const sign = growth >= 0 ? "+" : ""
  return `${sign}${formatPercent(growth)}`
}

function rel(path) {
  return path.startsWith(REPO_ROOT) ? path.slice(REPO_ROOT.length + 1) : path
}

function fail(message) {
  console.error(`\nERROR: ${message}\n`)
  process.exit(1)
}
