// T08 zero-visual-change proof: capture computed styles for the home page.
// Usage: node capture.mjs <output.json> <baseURL>
// Captures a stable, ordered set of elements plus a raw-vs-token probe table,
// at mobile / tablet / desktop widths.
import { chromium } from "@playwright/test"
import { writeFileSync } from "node:fs"

const outPath = process.argv[2]
const baseURL = process.argv[3] ?? "http://127.0.0.1:3000"

const PROPS = [
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "fontWeight",
  "fontFamily",
  "color",
  "backgroundColor",
  "textTransform",
  "textDecorationLine",
  "display",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "borderTopLeftRadius",
  "borderTopWidth",
  "borderTopColor",
  "gap",
  "width",
  "height",
]

// name -> CSS selector, evaluated in document order on the home page.
const TARGETS = [
  ["heroH1", "section.relative h1"],
  ["heroSubtitle", "section.relative p.font-light"],
  ["sectionH2", "section h2"],
  ["heroInnerH2", "section.relative h2"],
  ["projectCardTitle", "h3"],
  ["projectCardDesc", "p.line-clamp-3"],
  ["projectCardMeta", "span.text-sm"],
  ["projectCta", "a.inline-flex"],
  ["textLink", "a.flex.items-center"],
]

// Raw classes currently in app/ vs the semantic token we might swap to.
const PROBES = [
  ["hero-base", "text-4xl font-extrabold leading-none tracking-tight", "text-h1-sm leading-none"],
  ["section-h2", "text-4xl font-extrabold tracking-tight", "text-h1-sm"],
  ["hero-inner-h2", "text-xl font-semibold", "text-h3-sm"],
  ["notfound-h2", "text-3xl font-bold tracking-tight", "text-h2-sm tracking-tight"],
  ["hero-subtitle", "font-light md:text-lg lg:text-xl", "text-body-lg"],
  ["section-sub", "font-light sm:text-xl", "text-body-lg"],
]

const VIEWPORTS = [
  ["mobile", 375, 812],
  ["tablet", 768, 1024],
  ["desktop", 1280, 720],
]

const coreScript = ({ targets, probes, props }) => {
  const readProps = (el, props) => {
    const cs = getComputedStyle(el)
    const out = {}
    for (const p of props) out[p] = cs[p]
    return out
  }
  const result = {}
  for (const [name, selector] of targets) {
    const els = Array.from(document.querySelectorAll(selector))
    result[name] = els.map((el, i) => ({
      index: i,
      text: (el.textContent ?? "").trim().slice(0, 60),
      style: readProps(el, props),
    }))
  }
  const host = document.createElement("div")
  host.setAttribute("data-t08-probe", "1")
  document.body.appendChild(host)
  const table = {}
  for (const [name, raw, token] of probes) {
    const a = document.createElement("span")
    a.textContent = "Xg"
    a.className = raw
    const b = document.createElement("span")
    b.textContent = "Xg"
    b.className = token
    host.appendChild(a)
    host.appendChild(b)
    const sa = readProps(a, props)
    const sb = readProps(b, props)
    const diffs = {}
    for (const p of props) if (sa[p] !== sb[p]) diffs[p] = { raw: sa[p], token: sb[p] }
    table[name] = { raw, token, equal: Object.keys(diffs).length === 0, diffs }
  }
  host.remove()
  return { capture: result, probes: table }
}

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(baseURL, { waitUntil: "networkidle" })
await page.emulateMedia({ reducedMotion: "reduce" })

const viewports = {}
for (const [label, width, height] of VIEWPORTS) {
  await page.setViewportSize({ width, height })
  await page.waitForTimeout(150)
  viewports[label] = await page.evaluate(coreScript, { targets: TARGETS, probes: PROBES, props: PROPS })
}

writeFileSync(
  outPath,
  JSON.stringify({ url: baseURL, capturedAt: new Date().toISOString(), viewports }, null, 2)
)
await browser.close()
console.log(`wrote ${outPath}`)
