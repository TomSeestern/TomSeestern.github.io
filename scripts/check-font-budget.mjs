#!/usr/bin/env node
/**
 * Font budget gate for the COLOSSUS two-family treatment.
 *
 * Zero dependencies. After `pnpm build` it reads what Next actually emitted:
 *   - font families from the `@font-face` rules in `.next/static/css/*.css`
 *   - per-file bytes from `.next/static/media/*.woff2`
 *   - the critical preload payload from `<link rel="preload" as="font">` in the
 *     prerendered HTML (Next also marks those files with a `.p.woff2` suffix,
 *     used as a cross-check).
 *
 * Budget: exactly 2 families, Geist (interface/display) and Geist Mono
 * (labels/pixel artifacts); critical preload woff2 <= 100 KiB total. Geist is
 * preloaded because it paints the LCP heading; Geist Mono is deferred because
 * it carries labels and terminal metadata below the LCP path.
 * `next/font/google` emits every unicode-range subset
 * Google serves (cyrillic, greek, latin-ext, ...) but an English page only ever
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
const EXPECTED_FAMILIES = ["Geist", "Geist Mono"]
const DISPLAY = /^Geist$/i
const PIXEL = /^Geist Mono$/i

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
      const family = /font-family:([^;]+)/
        .exec(body)?.[1]
        ?.trim()
        .replace(/^["']|["']$/g, "")
      const url = /src:url\(([^)]+)\)/.exec(body)?.[1]?.trim()
      if (!family || !url || /fallback$/i.test(family)) continue
      families.add(family)
      familyByFile.set(basename(url), family)
    }
  }
  return { familyByFile, families: [...families].sort() }
}

/** Critical-preload font files: HTML preload links, falling back to Next's `.p.woff2` marker. */
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
  if (!families.some((family) => DISPLAY.test(family))) {
    failures.push("Geist interface face is not present in the built CSS")
  }
  if (!families.some((family) => PIXEL.test(family))) {
    failures.push("Geist Mono label/pixel face is not present in the built CSS")
  }
  for (const expected of EXPECTED_FAMILIES) {
    if (!families.includes(expected)) failures.push(`expected font family ${expected} is missing from the built CSS`)
  }
  for (const family of families) {
    if (!EXPECTED_FAMILIES.includes(family))
      failures.push(`unexpected font family ${family}; budget is ${EXPECTED_FAMILIES.join(", ")}`)
  }
  if (!shippedFamilies.has("Geist")) {
    failures.push("Geist (the LCP face) has no preloaded woff2")
  }

  const total = shipped.reduce((sum, row) => sum + row.bytes, 0)
  const displayTotal = shipped.filter((row) => DISPLAY.test(row.family)).reduce((sum, row) => sum + row.bytes, 0)
  const pixelTotal = allEmitted
    .filter((file) => PIXEL.test(familyByFile.get(file) ?? ""))
    .reduce((sum, file) => sum + statSync(join(MEDIA_DIR, file)).size, 0)
  if (total > TOTAL_BUDGET) failures.push(`critical preload woff2 ${kib(total)} exceeds ${kib(TOTAL_BUDGET)}`)

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
  console.log(`Critical preload woff2: ${kib(total)} / ${kib(TOTAL_BUDGET)} budget`)
  console.log(`  Geist:        ${kib(displayTotal)} (interface/display)`)
  console.log(`  Geist Mono:   ${kib(pixelTotal)} emitted, deferred (labels/pixel)`)
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

  console.log(`\nFONT BUDGET GATE PASSED — ${families.length} families, critical preload ${kib(total)}.`)
}

main()
