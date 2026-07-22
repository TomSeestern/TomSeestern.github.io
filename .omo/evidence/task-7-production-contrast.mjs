import AxeBuilder from "@axe-core/playwright"
import { chromium } from "@playwright/test"

const baseUrl = process.env.TASK_7_AUDIT_URL ?? "http://127.0.0.1:3051"
const browser = await chromium.launch({ headless: true })
const results = {}

for (const width of [375, 1280]) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    await page.addInitScript((savedTheme) => {
      window.localStorage.setItem("flowbite-theme-mode", savedTheme)
    }, theme)
    await page.goto(baseUrl, { waitUntil: "networkidle" })

    const main = page.locator("main")
    await main.waitFor({ state: "visible" })
    await main.evaluate(async (element) => {
      await new Promise((resolve) => {
        if (getComputedStyle(element).opacity === "1") {
          resolve()
          return
        }
        const observer = new MutationObserver(() => {
          if (getComputedStyle(element).opacity === "1") {
            observer.disconnect()
            resolve()
          }
        })
        observer.observe(element, { attributes: true, attributeFilter: ["style"] })
      })
    })

    const axe = await new AxeBuilder({ page }).withTags(["wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
    const colorContrast = axe.violations.filter((violation) => violation.id === "color-contrast")
    const contrastDetails = colorContrast.map((violation) => ({
      description: violation.description,
      help: violation.help,
      nodes: violation.nodes.map((node) => ({
        any: node.any.map((check) => ({ data: check.data, message: check.message })),
        html: node.html,
        target: node.target,
      })),
    }))
    const computed = await page.evaluate(() => {
      const firstMuted = document.querySelector(".text-muted")
      const firstAccent = document.querySelector(".text-accent")
      const firstBadge = document.querySelector(".bg-accent-soft")
      return {
        bodyBackground: getComputedStyle(document.body).backgroundColor,
        muted: firstMuted ? getComputedStyle(firstMuted).color : null,
        accent: firstAccent ? getComputedStyle(firstAccent).color : null,
        badgeBackground: firstBadge ? getComputedStyle(firstBadge).backgroundColor : null,
        badgeForeground: firstBadge ? getComputedStyle(firstBadge).color : null,
        isDark: document.documentElement.classList.contains("dark"),
      }
    })

    results[`${width}-${theme}`] = {
      colorContrastViolations: colorContrast.length,
      contrastDetails,
      totalViolations: axe.violations.length,
      computed,
    }
    await page.screenshot({ path: `.omo/evidence/task-7-production-${width}-${theme}.png`, fullPage: true })
    await context.close()
  }
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
