import { chromium } from "@playwright/test"
import fs from "node:fs/promises"

const routes = [
  ["home", "/"],
  ["about", "/about"],
  ["projects", "/projects"],
  ["project-detail", "/projects/entry/2020-soudest-backend-nodejs"],
  ["blog", "/blog"],
  ["blog-detail", "/blog/entry/2019-ebeltoft-cheesecake-recipe"],
  ["tags", "/tags"],
  ["tag-archive", "/tags/c-plus-plus"],
  ["contact", "/contact"],
  ["impressum", "/impressum"],
  ["datenschutz", "/datenschutz"],
  ["not-found", "/__e2e_missing_static_route__"],
]

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1280, height: 800 },
]

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3055"
const outDir = ".omo/evidence/colossus-rework/before"
await fs.mkdir(outDir, { recursive: true })

const browser = await chromium.launch()

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } })
  for (const [name, route] of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${outDir}/${name}-${viewport.name}.png`, fullPage: true })
    console.log(`captured ${name} ${viewport.name}`)
  }
  await page.close()
}

const legal = {}
const contentPage = await browser.newPage({ viewport: { width: 1280, height: 800 } })
for (const route of ["/impressum", "/datenschutz"]) {
  await contentPage.goto(`${baseUrl}${route}`, { waitUntil: "load" })
  await contentPage.waitForTimeout(300)
  const text = await contentPage.locator("#main-content").evaluate((el) => el.innerText)
  legal[route] = text.replace(/\s+/g, " ").trim()
}
await fs.writeFile(`${outDir}/legal.json`, JSON.stringify(legal, null, 2))

const homePage = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await homePage.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" })
await homePage.waitForTimeout(300)
const domCount = await homePage.evaluate(() => document.querySelectorAll("*").length)
await fs.writeFile(`${outDir}/home-dom-count.txt`, String(domCount))
console.log(`home DOM nodes: ${domCount}`)

await browser.close()
