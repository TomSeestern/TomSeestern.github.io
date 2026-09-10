#!/usr/bin/env node
/**
 * Font budget gate for the carved two-font treatment (T14/D3).
 *
 * Zero dependencies. After `pnpm build` it reads what Next actually emitted:
 *   - font families from the `@font-face` rules in `.next/static/css/*.css`
 *   - per-file bytes from `.next/static/media/*.woff2`
 *   - the first-load payload from `<link rel="preload" as="font">` in the
 *     prerendered HTML (Next also marks those files with a `.p.woff2` suffix,
 *     used as a cross-check).
 *
 * Budget: at most 2 families; first-load woff2 <= 100 KiB total, Newsreader
 * portion <= 60 KiB. `next/font/google` emits every unicode-range subset Google
 * serves (cyrillic, greek, latin-ext, ...) but an English page only ever
 * downloads the preloaded latin subset, so that is the number gated here. The
 * all-subset total is printed for visibility, not asserted.
 *
 * Usage: node scripts/check-font-budget.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { basename, dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const NEXT_DIR = join(REPO_ROOT, ".next")
const MEDIA_DIR = join(NEXT_DIR, "static", "media")
const CSS_DIR = join(NEXT_DIR, "static", "css")
const HTML_ROOT = join(NEXT_DIR, "server")

const KIB = 1024
const MAX_FAMILIES = 2
const TOTAL_BUDGET = 100 * KIB
const NEWSREADER_BUDGET = 60 * KIB
const NEWSREADER = /newsreader/i

function walk(dir, matches) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, matches))
    else if (matches(full)) out.push(full)
  }
  return out
}

function requireDir(dir) {
  if (!existsSync(dir)) {
    console.error(`Font budget gate: ${dir} is missing — run \`pnpm build\` first.`)
    process.exit(1)
  }
}

/** basename -> family, from every @font-face the built CSS ships. */
function readFamilies() {
  requireDir(CSS_DIR)
  const familyByFile = new Map()
  const families = new Set()
  for (const cssFile of walk(CSS_DIR, (file) => file.endsWith(".css"))) {
    const css = readFileSync(cssFile, "utf8")
    for (const block of css.matchAll(/@font-face\{([^}]*)\}/g)) {
      const body = block[1]
      const family = /font-family:([^;]+)/.exec(body)?.[1]?.trim()
      const url = /src:url\(([^)]+)\)/.exec(body)?.[1]?.trim()
      if (!family || !url || /fallback$/i.test(family)) continue
      families.add(family)
      familyByFile.set(basename(url), family)
    }
  }
  return { familyByFile, families: [...families].sort() }
}

/** First-load font files: HTML preload links, falling back to Next's `.p.woff2` marker. */
function readPreloaded() {
  requireDir(MEDIA_DIR)
  const fromHtml = new Set()
  for (const htmlFile of walk(HTML_ROOT, (file) => file.endsWith(".html"))) {
    const html = readFileSync(htmlFile, "utf8")
    for (const tag of html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)) {
      const href = /href="([^"]+)"/.exec(tag[0])?.[1]
      if (href) fromHtml.add(basename(href))
    }
  }
  if (fromHtml.size > 0) return fromHtml
  return new Set(readdirSync(MEDIA_DIR).filter((file) => file.endsWith(".p.woff2")))
}

function kib(bytes) {
  return `${(bytes / KIB).toFixed(1)} KiB`
}

function main() {
  const { familyByFile, families } = readFamilies()
  const preloaded = readPreloaded()
  const allEmitted = readdirSync(MEDIA_DIR).filter((file) => file.endsWith(".woff2"))

  const shipped = allEmitted
    .filter((file) => preloaded.has(file) && familyByFile.has(file))
    .map((file) => {
      const family = familyByFile.get(file)
      return { file, family, bytes: statSync(join(MEDIA_DIR, file)).size }
    })

  const failures = []
  const shippedFamilies = new Set(shipped.map((row) => row.family))
  if (families.length > MAX_FAMILIES) {
    failures.push(`${families.length} font families in use (${families.join(", ")}); budget is ${MAX_FAMILIES}`)
  }
  if (!families.some((family) => NEWSREADER.test(family))) {
    failures.push("Newsreader display face is not present in the built CSS")
  }
  for (const family of families) {
    if (!shippedFamilies.has(family)) failures.push(`family ${family} has no preloaded woff2 (preload the LCP face)`)
  }

  const total = shipped.reduce((sum, row) => sum + row.bytes, 0)
  const newsreader = shipped.filter((row) => NEWSREADER.test(row.family))
  const newsreaderTotal = newsreader.reduce((sum, row) => sum + row.bytes, 0)
  if (total > TOTAL_BUDGET) failures.push(`first-load woff2 ${kib(total)} exceeds ${kib(TOTAL_BUDGET)}`)
  if (newsreaderTotal > NEWSREADER_BUDGET) {
    failures.push(`Newsreader woff2 ${kib(newsreaderTotal)} exceeds ${kib(NEWSREADER_BUDGET)}`)
  }

  const nameWidth = Math.max(6, ...shipped.map((row) => row.family.length))
  const fileWidth = Math.max(4, ...shipped.map((row) => row.file.length))

  console.log(`Font budget gate — families: ${families.join(", ")} (${families.length}/${MAX_FAMILIES})`)
  console.log(`${"FAMILY".padEnd(nameWidth)}  ${"FILE".padEnd(fileWidth)}  ${"SIZE".padStart(9)}`)
  console.log("-".repeat(nameWidth + fileWidth + 13))
  for (const row of shipped.sort((a, b) => a.family.localeCompare(b.family))) {
    console.log(`${row.family.padEnd(nameWidth)}  ${row.file.padEnd(fileWidth)}  ${kib(row.bytes).padStart(9)}`)
  }

  const allTotal = allEmitted.reduce((sum, file) => sum + statSync(join(MEDIA_DIR, file)).size, 0)
  console.log("-".repeat(nameWidth + fileWidth + 13))
  console.log(`First-load woff2: ${kib(total)} / ${kib(TOTAL_BUDGET)} budget`)
  console.log(`  Newsreader:     ${kib(newsreaderTotal)} / ${kib(NEWSREADER_BUDGET)} budget`)
  console.log(
    `All emitted woff2 (every unicode-range subset, not all downloaded): ${kib(allTotal)} across ${
      allEmitted.length
    } file(s)`
  )

  if (failures.length > 0) {
    console.error(`\nFONT BUDGET GATE FAILED — ${failures.length} issue(s):`)
    for (const failure of failures) console.error(`  - ${failure}`)
    process.exit(1)
  }

  console.log(`\nFONT BUDGET GATE PASSED — ${families.length} families, first-load ${kib(total)}.`)
}

main()
