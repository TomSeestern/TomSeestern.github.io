import { chromium } from "@playwright/test"

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
const page = await context.newPage()
await page.goto("http://127.0.0.1:3099/", { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1500)
const result = await page.evaluate(() => {
  const clientWidth = document.documentElement.clientWidth
  const all = Array.from(document.querySelectorAll("body *"))
  const overflowing = all
    .filter((element) => {
      const rect = element.getBoundingClientRect()
      return rect.right > clientWidth || rect.left < 0
    })
    .slice(0, 6)
    .map((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      const img = element instanceof HTMLImageElement ? element : element.querySelector("img")
      return {
        tag: element.tagName,
        className: String(element.className).slice(0, 90),
        rectWidth: Math.round(rect.width),
        computedWidth: style.width,
        computedHeight: style.height,
        imgComplete: img ? img.complete : null,
        imgNaturalWidth: img ? img.naturalWidth : null,
        imgSrc: img ? img.getAttribute("src") : null,
      }
    })
  return { clientWidth, scrollWidth: document.documentElement.scrollWidth, count: overflowing.length, overflowing }
})
console.log(JSON.stringify(result, null, 2))
await browser.close()
