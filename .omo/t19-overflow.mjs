import { chromium } from "@playwright/test"

const baseUrl = "http://127.0.0.1:3030"
const route = "/projects/entry/zz-t19-case-study-fixture"
const widths = [375, 768, 1280]

const browser = await chromium.launch()
const results = []

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(baseUrl + route, { waitUntil: "load" })
  await page.waitForSelector('[data-testid="case-study-meta"]')

  const measured = await page.evaluate(() => ({
    documentScrollWidth: document.documentElement.scrollWidth,
    documentClientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    heroCount: document.querySelectorAll('[data-testid="case-study-hero"]').length,
    metaCount: document.querySelectorAll('[data-testid="case-study-meta"]').length,
    metaText: document.querySelector('[data-testid="case-study-meta"]')?.innerText ?? null,
  }))

  results.push({ width, ...measured })
  await page.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
