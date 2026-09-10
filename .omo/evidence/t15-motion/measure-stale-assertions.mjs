/**
 * Measures the computed colours the T13 palette remap left stale in the e2e
 * assertions. Boots the production build and reads real getComputedStyle values
 * so the specs assert measured token values, not guesses.
 */
import { spawn } from "node:child_process"
import { setTimeout as sleep } from "node:timers/promises"
import { chromium } from "@playwright/test"

const PORT = 3078
const BASE = `http://127.0.0.1:${PORT}`

async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE}/`)
      if (response.ok) return
    } catch {
      // not ready
    }
    await sleep(500)
  }
  throw new Error("server not ready")
}

async function readFocusRing(page, locator) {
  await locator.focus()
  return locator.evaluate((el) => {
    const cs = getComputedStyle(el)
    return {
      outlineStyle: cs.outlineStyle,
      outlineColor: cs.outlineColor,
      boxShadow: cs.boxShadow,
      ringColor: cs.getPropertyValue("--tw-ring-color").trim(),
    }
  })
}

async function main() {
  const server = spawn("node_modules/.bin/next", ["start", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: "pipe",
  })
  server.stderr.on("data", (chunk) => process.stderr.write(`[next] ${chunk}`))

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const result = {}

  try {
    await waitForServer(90_000)

    await page.goto(`${BASE}/`)
    result.bodyBackground = await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor)

    const contactCta = page.locator("nav").getByRole("link", { name: "Contact", exact: true }).first()
    result.contactCtaClass = await contactCta.getAttribute("class")
    result.contactCtaRing = await readFocusRing(page, contactCta)

    const learnMore = page.locator('a:has-text("Learn More")').first()
    result.learnMoreClass = await learnMore.getAttribute("class")
    result.learnMoreRing = await readFocusRing(page, learnMore)

    const viewAll = page.getByRole("link", { name: "View all Projects" }).first()
    result.viewAllClass = await viewAll.getAttribute("class")
    result.viewAllRing = await readFocusRing(page, viewAll)
  } finally {
    await browser.close()
    server.kill("SIGTERM")
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
