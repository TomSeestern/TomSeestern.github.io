import { chromium } from "@playwright/test"
import { mkdirSync } from "node:fs"

const BASE_URL = "http://127.0.0.1:3099/"
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
  const metrics = await page.evaluate(() => ({
    nodeCount: document.querySelectorAll("*").length,
    marqueeCount: document.querySelectorAll(".animate-marquee, .animate-marquee2").length,
    featuredCount: document.querySelectorAll('[data-testid="featured-project"]').length,
    founderArcBeats: document.querySelectorAll('[data-testid="founder-arc-beat"]').length,
    projectLinks: document.querySelectorAll('a[href^="/projects/entry/"]').length,
    blogLinks: document.querySelectorAll('a[href^="/blog/entry/"]').length,
    documentScrollWidth: document.documentElement.scrollWidth,
    documentClientWidth: document.documentElement.clientWidth,
  }))
  const path = `${OUT_DIR}/t16-home-${vp.name}.png`
  await page.screenshot({ path, fullPage: true })
  report.push({ viewport: `${vp.width}x${vp.height}`, screenshot: path, ...metrics })
  await context.close()
}

await browser.close()
console.log(JSON.stringify(report, null, 2))
