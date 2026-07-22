import AxeBuilder from "@axe-core/playwright"
import { chromium } from "@playwright/test"

const baseUrl = process.env.TASK_7_AUDIT_URL

if (!baseUrl) {
  throw new Error("TASK_7_AUDIT_URL must point to the selected production audit server.")
}
const browser = await chromium.launch({ headless: true })
const results = {}

async function waitForMotionOpacity(page) {
  await page.locator("main").waitFor({ state: "visible" })
  await page.waitForFunction(() => {
    const main = document.querySelector("main")

    if (!main || getComputedStyle(main).opacity !== "1") {
      return false
    }

    return [...main.querySelectorAll("[style]")].every((element) => getComputedStyle(element).opacity === "1")
  })
}

for (const width of [375, 1280]) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    await page.addInitScript((savedTheme) => {
      window.localStorage.setItem("flowbite-theme-mode", savedTheme)
    }, theme)
    await page.goto(baseUrl, { waitUntil: "networkidle" })

    await waitForMotionOpacity(page)

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
      const collection = document.querySelector('[data-testid="project-collection"]')
      const cards = [...document.querySelectorAll('[data-testid="project-card"]')]

      if (!(collection instanceof HTMLElement)) {
        throw new Error("Project collection missing")
      }

      const collectionBounds = collection.getBoundingClientRect()
      const visibleCards = cards
        .map((card) => card.getBoundingClientRect())
        .filter((card) => card.right > collectionBounds.left && card.left < collectionBounds.right)
        .map((card) => ({
          left: card.left,
          right: card.right,
          fullyInside: card.left >= collectionBounds.left && card.right <= collectionBounds.right,
        }))

      return {
        bodyBackground: getComputedStyle(document.body).backgroundColor,
        muted: firstMuted ? getComputedStyle(firstMuted).color : null,
        accent: firstAccent ? getComputedStyle(firstAccent).color : null,
        badgeBackground: firstBadge ? getComputedStyle(firstBadge).backgroundColor : null,
        badgeForeground: firstBadge ? getComputedStyle(firstBadge).color : null,
        isDark: document.documentElement.classList.contains("dark"),
        projectCollection: {
          display: getComputedStyle(collection).display,
          scrollSnapType: getComputedStyle(collection).scrollSnapType,
          left: collectionBounds.left,
          right: collectionBounds.right,
          visibleCards,
        },
      }
    })

    if (computed.projectCollection.visibleCards.some((card) => !card.fullyInside)) {
      throw new Error(`Visible project card crosses collection edge at ${width}px ${theme}.`)
    }

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
