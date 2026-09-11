#!/usr/bin/env node
/**
 * Shipped-image byte-budget gate for TomSegbers.de.
 *
 * Walks the static asset tree (`public/` by default) and exits non-zero when a
 * shipped image exceeds its byte budget:
 *   - every shipped raster/vector image must be <= 200 KB (204,800 B),
 *   - a "hero" image (path contains `hero`, case-insensitive) must be <= 50 KB
 *     (51,200 B) — heroes are the large above-the-fold visuals, so they get the
 *     tighter budget that protects LCP.
 *
 * No dependencies: the check only stats files, so it needs no image decoder and
 * stays fast enough to run on every commit. Images reach `public/` by hand, so
 * this gate is the only thing standing between a 4 MB export and production.
 *
 * The `deviceSizes` ladder for `next/image` lives in `next.config.mjs`; this
 * gate complements it by capping the on-disk source bytes that get shipped
 * verbatim (SVG icons, `react-markdown` `<img>` sources, and static assets).
 *
 * Usage:
 *   node scripts/check-image-size.mjs            # scan ./public
 *   node scripts/check-image-size.mjs path/to/dir # scan another root (probe)
 */
import { readdirSync, statSync } from "node:fs"
import { dirname, extname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// --- Budgets ---------------------------------------------------------------

const KB = 1024
const MAX_IMAGE_BYTES = 200 * KB
const MAX_HERO_BYTES = 50 * KB

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"])

/**
 * A file is a hero when its path names it as one. The convention is deliberate:
 * no static check can know which image is above the fold, so imagery that is
 * must carry `hero` in the filename (`case-study-hero.webp`, `og-hero.png`).
 */
const HERO_PATTERN = /hero/i

// --- Paths -----------------------------------------------------------------

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DEFAULT_ROOT = join(REPO_ROOT, "public")

// --- Entry point -----------------------------------------------------------

const root = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_ROOT
const files = collectImages(root)

if (files.length === 0) {
  console.error(`\nERROR: no images found under ${rel(root)} — refusing to pass an empty scan.\n`)
  process.exit(1)
}

const rows = files
  .map((path) => {
    const bytes = statSync(path).size
    const hero = HERO_PATTERN.test(relative(root, path))
    const limit = hero ? MAX_HERO_BYTES : MAX_IMAGE_BYTES
    return { path: rel(path), kind: hero ? "hero" : "image", bytes, limit, pass: bytes <= limit }
  })
  .sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path))

printHeader(root, rows.length)
printTable(rows)

const violations = rows.filter((row) => !row.pass)
if (violations.length > 0) {
  console.error(`\nIMAGE SIZE GATE FAILED — ${violations.length} image(s) over budget:`)
  for (const row of violations) {
    console.error(`  - ${row.path}: ${formatBytes(row.bytes)} exceeds ${formatBudget(row.limit)} (${row.kind})`)
  }
  console.error("")
  process.exit(1)
}

console.log(`\nIMAGE SIZE GATE PASSED — ${rows.length} image(s) within budget.\n`)
process.exit(0)

// --- Collection ------------------------------------------------------------

/** Returns the absolute path of every image file under `dir`, recursively. */
function collectImages(dir) {
  const found = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      found.push(...collectImages(full))
    } else if (entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      found.push(full)
    }
  }
  return found
}

// --- Output ----------------------------------------------------------------

function printHeader(root, count) {
  console.log("Image byte-budget gate")
  console.log(`  root   : ${rel(root)}`)
  console.log(`  limits : image ${formatBudget(MAX_IMAGE_BYTES)}, hero ${formatBudget(MAX_HERO_BYTES)}`)
  console.log(`  scanned: ${count} image(s)`)
}

function printTable(rows) {
  const headers = ["STATUS", "KIND", "SIZE", "BUDGET", "PATH"]
  const widths = [
    headers[0].length,
    Math.max(headers[1].length, ...rows.map((row) => row.kind.length)),
    Math.max(headers[2].length, ...rows.map((row) => formatBytes(row.bytes).length)),
    Math.max(headers[3].length, ...rows.map((row) => formatBudget(row.limit).length)),
    Math.max(headers[4].length, ...rows.map((row) => row.path.length)),
  ]

  console.log("")
  console.log(formatRow(headers, widths))
  console.log("-".repeat(widths.reduce((total, width) => total + width, 0) + 2 * (widths.length - 1)))
  for (const row of rows) {
    const values = [row.pass ? "PASS" : "FAIL", row.kind, formatBytes(row.bytes), formatBudget(row.limit), row.path]
    console.log(formatRow(values, widths))
  }
}

function formatRow(values, widths) {
  const leftAligned = new Set([0, 1, 4])
  return values
    .map((value, index) => (leftAligned.has(index) ? value.padEnd(widths[index]) : value.padStart(widths[index])))
    .join("  ")
}

// --- Helpers ---------------------------------------------------------------

function formatBytes(bytes) {
  return bytes < KB ? `${bytes} B` : `${(bytes / KB).toFixed(1)} KB`
}

function formatBudget(bytes) {
  return `${(bytes / KB).toFixed(0)} KB`
}

function rel(path) {
  return path.startsWith(REPO_ROOT) ? path.slice(REPO_ROOT.length + 1) : path
}
