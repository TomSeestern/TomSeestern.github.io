import { chromium } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

const BASE = process.argv[2] ?? "http://127.0.0.1:3077"
const OUT = process.argv[3] ?? ".omo/evidence/t14-fonts"
mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  ["mobile", 375, 812],
  ["tablet", 768, 1024],
  ["desktop", 1280, 720],
]

const PAGES = [
  ["home", "/"],
  ["blog-entry", "/blog/entry/2019-ebeltoft-cheesecake-recipe"],
]

const executablePath = process.env.CHROME_PATH || "/etc/profiles/per-user/tom/bin/chromium"

const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] })
const report = { base: BASE, generatedAt: new Date().toISOString(), pages: {} }

for (const [pageName, path] of PAGES) {
  report.pages[pageName] = {}
  for (const [vp, width, height] of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" })
    const page = await context.newPage()
    await page.goto(BASE + path, { waitUntil: "load" })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)

    const metrics = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h1, h2"))
        .slice(0, 6)
        .map((el) => {
          const cs = getComputedStyle(el)
          return {
            tag: el.tagName,
            text: (el.textContent || "").trim().slice(0, 60),
            fontFamily: cs.fontFamily,
            fontWeight: cs.fontWeight,
            textTransform: cs.textTransform,
            letterSpacing: cs.letterSpacing,
            fontSize: cs.fontSize,
            right: Math.round(el.getBoundingClientRect().right),
          }
        })
      const overflow = Array.from(document.querySelectorAll("body *"))
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 10)
        .map((el) => ({
          tag: el.tagName,
          cls: String(el.className).slice(0, 80),
          right: Math.round(el.getBoundingClientRect().right),
        }))
      return {
        viewport: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        headings,
        overflow,
      }
    })

    const shot = `${OUT}/${pageName}-${vp}.png`
    await page.screenshot({ path: shot, fullPage: true })
    report.pages[pageName][vp] = { ...metrics, screenshot: shot }
    await context.close()
  }
}

await browser.close()
writeFileSync(`${OUT}/heading-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
