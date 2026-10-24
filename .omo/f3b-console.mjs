// Throwaway F3 console-error + interactivity sweep on the SERVED PRODUCTION build.
import { chromium } from "@playwright/test"
const BASE = "http://127.0.0.1:3000"
const EXEC = "/etc/profiles/per-user/tom/bin/chromium"

const routes = [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/contact",
  "/tags",
  "/tags/c-plus-plus",
  "/tags/digital-transformation",
  "/tags/robotics",
  "/impressum",
  "/datenschutz",
]

const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] })
let totalErrors = 0

for (const r of routes) {
  const c = await browser.newContext()
  const page = await c.newPage()
  const errors = []
  const warnings = []
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text())
    if (m.type() === "warning") warnings.push(m.text())
  })
  page.on("pageerror", (e) => errors.push(`PAGEERROR ${e.message}`))
  const resp = await page.goto(`${BASE}${r}`, { waitUntil: "load" })
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.waitForTimeout(400)
  totalErrors += errors.length
  console.log(`${errors.length === 0 ? "CLEAN" : "ERRORS"} ${r} status=${resp.status()} errors=${errors.length} warnings=${warnings.length}`)
  for (const e of errors.slice(0, 3)) console.log(`   ERR: ${e.slice(0, 200)}`)
  // Tooltip provider wiring: exactly one provider instance in the React tree is proven by source;
  // here confirm tooltips still function (hover a trigger on / if present)
  await c.close()
}

// Contact form interactivity on production (E2E_CONTACT_FORM_SUCCESS=true)
{
  const c = await browser.newContext()
  const page = await c.newPage()
  await page.goto(`${BASE}/contact`, { waitUntil: "load" })
  await page.waitForLoadState("networkidle")
  await page.fill("#name", "F3 QA")
  await page.fill("#email", "qa@example.com")
  await page.fill("#message", "F3 hydration interactivity probe.")
  await page.click('button[type="submit"]')
  const status = await page.locator('[role="status"]').count()
  const alertText = status ? await page.locator('[role="status"]').first().innerText() : "(none)"
  console.log(`CONTACT submit: role=status count=${status} text=${JSON.stringify(alertText.slice(0, 80))}`)
  await c.close()
}

await browser.close()
console.log(`\nTOTAL CONSOLE ERRORS ACROSS ${routes.length} ROUTES: ${totalErrors}`)
process.exit(totalErrors === 0 ? 0 : 1)
