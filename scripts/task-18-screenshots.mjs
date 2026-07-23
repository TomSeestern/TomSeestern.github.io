import { chromium } from "@playwright/test"
import { mkdirSync } from "fs"
import path from "path"

const BASE = "http://localhost:3053"
const OUT = path.join(process.cwd(), ".omo/evidence/task-18-screenshots")
mkdirSync(OUT, { recursive: true })

const pages = [
  { name: "home", url: "/" },
  { name: "blog", url: "/blog" },
  { name: "blog-detail", url: "/blog/entry/2026-peak-website" },
  { name: "projects", url: "/projects" },
  { name: "uses", url: "/uses" },
  { name: "contact", url: "/contact" },
]

const breakpoints = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 900 },
]

const browser = await chromium.launch({ headless: true })

for (const theme of ["light", "dark"]) {
  for (const page of pages) {
    for (const bp of breakpoints) {
      const context = await browser.newContext({
        viewport: { width: bp.width, height: bp.height },
        deviceScaleFactor: 1,
      })
      // Set theme before navigation
      await context.addInitScript((themeMode) => {
        try {
          localStorage.setItem("flowbite-theme-mode", themeMode)
          if (themeMode === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        } catch (e) {}
      }, theme)

      const pg = await context.newPage()
      try {
        await pg.goto(`${BASE}${page.url}`, { waitUntil: "networkidle", timeout: 15000 })
        // Wait for motion to settle
        await pg.waitForTimeout(1000)
        const filename = `${page.name}-${bp.width}-${theme}.png`
        await pg.screenshot({ path: path.join(OUT, filename), fullPage: false })
        console.log(`✓ ${filename}`)
      } catch (err) {
        console.error(`✗ ${page.name}-${bp.width}-${theme}: ${err.message}`)
      }
      await context.close()
    }
  }
}

await browser.close()
console.log("Done.")
