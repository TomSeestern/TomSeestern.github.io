import { chromium } from "@playwright/test"
import { mkdirSync } from "node:fs"

const BASE_URL = process.env.T18_BASE_URL ?? "http://127.0.0.1:3096/blog"
const OUT_DIR = "/home/tom/Projects/tomsegbers-de/.omo/evidence"
mkdirSync(OUT_DIR, { recursive: true })

const viewports = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 960 },
]

const browser = await chromium.launch()
const report = []

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await context.newPage()
  await page.goto(BASE_URL, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  const metrics = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('h3 a[href^="/blog/entry/"]'))
    const hrefs = new Set(links.map((a) => a.getAttribute("href")))
    const chips = Array.from(document.querySelectorAll('[data-testid="article-tag"]')).map(
      (el) => el.textContent?.trim() ?? "",
    )
    return {
      articleLinkAnchors: links.length,
      uniqueBlogEntries: hrefs.size,
      tagChips: chips.length,
      tagChipTexts: chips,
      introPostsMention: document.querySelector("header p")?.textContent?.trim() ?? "",
      documentScrollWidth: document.documentElement.scrollWidth,
      documentClientWidth: document.documentElement.clientWidth,
    }
  })
  const path = `${OUT_DIR}/t18-blog-${vp.name}.png`
  await page.screenshot({ path, fullPage: true })
  report.push({ viewport: `${vp.width}x${vp.height}`, screenshot: path, ...metrics })
  await context.close()
}

await browser.close()
console.log(JSON.stringify(report, null, 2))
