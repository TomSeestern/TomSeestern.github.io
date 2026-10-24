// Throwaway T23 asset generator (not committed; .omo/ is gitignored).
// Renders the branded OpenGraph card and writes public/img/og-default.png.
// Fonts are fetched here (Node, with a working CA bundle) and inlined as
// base64 so the Chromium render does not depend on its own TLS trust store.
import { chromium } from "@playwright/test"
import { writeFileSync } from "node:fs"

const FONT_CSS = [
  "https://fonts.googleapis.com/css2?family=Newsreader:wght@700&display=swap",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
]

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" } })
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`)
  return res.text()
}

function parseFontFaces(css) {
  const faces = []
  const blockRe = /@font-face\s*\{([^}]*)\}/g
  let block
  while ((block = blockRe.exec(css)) !== null) {
    const body = block[1]
    const family = /font-family:\s*'([^']+)'/.exec(body)?.[1]
    const weight = /font-weight:\s*(\d+)/.exec(body)?.[1] ?? "400"
    const style = /font-style:\s*(\w+)/.exec(body)?.[1] ?? "normal"
    const url = /url\((https:[^)]+)\)/.exec(body)?.[1]
    if (family && url) faces.push({ family, weight, style, url })
  }
  return faces
}

async function inlineFonts() {
  const css = (await Promise.all(FONT_CSS.map(fetchText))).join("\n")
  const faces = parseFontFaces(css)
  const seen = new Set()
  const out = []
  for (const face of faces) {
    const key = `${face.family}-${face.weight}-${face.style}`
    if (seen.has(key)) continue
    seen.add(key)
    const res = await fetch(face.url)
    const buf = Buffer.from(await res.arrayBuffer())
    out.push(
      `@font-face{font-family:'${face.family}';font-weight:${face.weight};font-style:${face.style};` +
        `src:url(data:font/ttf;base64,${buf.toString("base64")}) format('truetype');}`
    )
  }
  return out.join("\n")
}

const html = (fontFaces) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fontFaces}
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { background: #F5EFE1; color: #1B1B1F; font-family: 'Inter', system-ui, sans-serif; }
.frame { width: 1200px; height: 630px; padding: 68px 88px 56px; display: flex; flex-direction: column; }
.top { display: flex; align-items: center; gap: 20px; }
.seal { width: 64px; height: 64px; border-radius: 14px; background: #A63D28; color: #F5EFE1;
  font-family: 'Newsreader', Georgia, serif; font-weight: 700; font-size: 36px; letter-spacing: -0.04em;
  display: flex; align-items: center; justify-content: center; }
.eyebrow { font-weight: 600; font-size: 22px; letter-spacing: 0.22em; text-transform: uppercase; color: #5C5548; }
.content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-bottom: 8px; }
h1 { font-family: 'Newsreader', Georgia, serif; font-weight: 700; font-size: 124px; line-height: 0.98;
  letter-spacing: -0.025em; color: #1B1B1F; margin: 0; }
.role { font-weight: 600; font-size: 36px; color: #A63D28; margin: 20px 0 0; letter-spacing: 0.005em; }
.footer { display: flex; align-items: baseline; justify-content: space-between;
  border-top: 1px solid #D8CDB6; padding-top: 22px; }
.tag { font-weight: 400; font-size: 24px; color: #5C5548; max-width: 760px; }
.url { font-weight: 600; font-size: 24px; color: #1B1B1F; letter-spacing: 0.01em; }
</style></head>
<body>
  <main class="frame">
    <div class="top">
      <div class="seal">TS</div>
      <div class="eyebrow">TomSegbers.de</div>
    </div>
    <div class="content">
      <h1>Tom Segbers</h1>
      <div class="role">Senior Developer</div>
    </div>
    <div class="footer">
      <div class="tag">Building reliable systems and solving hard problems.</div>
      <div class="url">tom.segbers.de</div>
    </div>
  </main>
</body></html>`

const fontFaces = await inlineFonts()
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html(fontFaces), { waitUntil: "load" })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: "public/img/og-default.png" })
await browser.close()

const out = "public/img/og-default.png"
const buf = (await import("node:fs")).readFileSync(out)
const width = buf.readUInt32BE(16)
const height = buf.readUInt32BE(20)
console.log(`wrote ${out}: ${width}x${height}, ${buf.length} bytes`)
