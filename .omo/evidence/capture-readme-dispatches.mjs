import { chromium } from "@playwright/test"
import fs from "node:fs/promises"
import path from "node:path"

const baseURL = "http://127.0.0.1:3040"
const targets = [
  { name: "home", route: "/" },
  { name: "blog", route: "/blog" },
]

const disableAnimationsCss = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    animation-play-state: paused !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  nextjs-portal { display: none !important; }
`

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
})
const page = await context.newPage()

for (const target of targets) {
  const response = await page.goto(`${baseURL}${target.route}`, { waitUntil: "networkidle" })
  if (response?.status() !== 200) throw new Error(`${target.route} returned ${response?.status()}`)
  await page.addStyleTag({ content: disableAnimationsCss })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  const cdp = await page.context().newCDPSession(page)
  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "webp",
    quality: 85,
    captureBeyondViewport: false,
  })
  const output = path.resolve("public/img/screenshots", `${target.name}.webp`)
  const buffer = Buffer.from(screenshot.data, "base64")
  await fs.writeFile(output, buffer)
  console.log(`${target.name}.webp ${(buffer.length / 1024).toFixed(1)} KB`)
}

await browser.close()
