// T22 proof: the self-hosted cheesecake image actually renders in a real
// browser against the PRODUCTION build (`pnpm start`). Asserts naturalWidth > 0
// and that no console error mentions remotePatterns / next-image / CSP.
import { chromium } from "@playwright/test"

const BASE = "http://127.0.0.1:3000"
const ROUTE = "/blog/entry/2019-ebeltoft-cheesecake-recipe"

async function waitForServer(deadlineMs) {
  const start = Date.now()
  while (Date.now() - start < deadlineMs) {
    try {
      const res = await fetch(`${BASE}${ROUTE}`)
      if (res.ok) return true
    } catch {
      // server not up yet
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  return false
}

const ready = await waitForServer(90_000)
if (!ready) {
  console.error("SERVER_NOT_READY")
  process.exit(2)
}

const browser = await chromium.launch()
const page = await browser.newPage()

const consoleErrors = []
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text())
})
page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`))

await page.goto(`${BASE}${ROUTE}`, { waitUntil: "networkidle" })

const image = page.locator('img[src*="cheesecake-ebeltoft"]').first()
await image.waitFor({ state: "visible", timeout: 15_000 })

// Force the browser to finish decoding so naturalWidth reflects the real bytes.
await image.evaluate((el) => el.decode().catch(() => {}))

const probe = await image.evaluate((el) => ({
  src: el.getAttribute("src"),
  currentSrc: el.currentSrc,
  naturalWidth: el.naturalWidth,
  naturalHeight: el.naturalHeight,
  complete: el.complete,
}))

const forbidden = /remotePatterns|next\/image|Content Security Policy|CSP|hostname .* is not configured/i
const offendingErrors = consoleErrors.filter((line) => forbidden.test(line))

await browser.close()

const result = {
  route: ROUTE,
  image: probe,
  consoleErrorCount: consoleErrors.length,
  consoleErrors,
  offendingErrors,
  pass: probe.naturalWidth > 0 && probe.complete && offendingErrors.length === 0,
}

console.log(JSON.stringify(result, null, 2))
process.exit(result.pass ? 0 : 1)
