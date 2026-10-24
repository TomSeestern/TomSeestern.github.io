// Throwaway F3 correction probe: establish H1 case is CSS-only and footer touch-target size.
import { chromium } from "@playwright/test"
const BASE = "http://127.0.0.1:3000"
const EXEC = "/etc/profiles/per-user/tom/bin/chromium"
const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] })
const c = await browser.newContext({ viewport: { width: 375, height: 800 } })
const page = await c.newPage()

for (const [route, expected] of [
  ["/", "Tom Segbers — Senior Developer"],
  ["/tags", "Tags"],
  ["/tags/digital-transformation", "Digital Transformation"],
  ["/impressum", "Impressum"],
  ["/datenschutz", "Datenschutzerklärung"],
]) {
  await page.goto(`${BASE}${route}`, { waitUntil: "load" })
  await page.waitForLoadState("networkidle")
  const h1 = page.locator("h1").first()
  const info = await h1.evaluate((el) => {
    const cs = getComputedStyle(el)
    return { textContent: el.textContent, innerText: el.innerText, transform: cs.textTransform, ff: cs.fontFamily }
  })
  const domEq = info.textContent === expected
  const visualEq = info.transform === "uppercase" && info.textContent?.toUpperCase() === expected.toUpperCase()
  console.log(`H1 ${route}: textContent=${JSON.stringify(info.textContent)} transform=${info.transform} domEq=${domEq} visualEq=${visualEq}`)
}

// Footer touch target audit at 375
await page.goto(`${BASE}/`, { waitUntil: "load" })
await page.waitForLoadState("networkidle")
const audit = await page.locator("footer a").evaluateAll((els) =>
  els.map((el) => {
    const r = el.getBoundingClientRect()
    const img = el.querySelector("img")
    const ir = img ? img.getBoundingClientRect() : null
    return {
      label: (el.textContent || "").trim().slice(0, 20),
      href: el.getAttribute("href"),
      linkW: Math.round(r.width),
      linkH: Math.round(r.height),
      imgW: ir ? Math.round(ir.width) : null,
      imgH: ir ? Math.round(ir.height) : null,
      shrink: getComputedStyle(el).flexShrink,
    }
  })
)
console.log("FOOTER AUDIT:", JSON.stringify(audit, null, 2))
const social = audit.filter((a) => a.imgW !== null)
console.log(`SOCIAL links: count=${social.length} link minW=${Math.min(...social.map((s) => s.linkW))} link minH=${Math.min(...social.map((s) => s.linkH))}`)
const rows = new Set(audit.map((a) => Math.round(a.linkH))).size
await browser.close()
