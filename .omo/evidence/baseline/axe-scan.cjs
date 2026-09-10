/* T02 axe baseline scanner. Injects axe-core (downloaded to /tmp/axe.min.js) into
 * the served production build and records violations for each route in both
 * color schemes. Does NOT modify package.json (axe fetched via CDN to /tmp). */
const fs = require("fs")
const { chromium } = require("@playwright/test")

const BASE = "http://127.0.0.1:3000"
const ROUTES = [
  ["home", "/"],
  ["about", "/about"],
  ["blog", "/blog"],
  ["blog-cheesecake", "/blog/entry/2019-ebeltoft-cheesecake-recipe"],
  ["projects", "/projects"],
  ["project-soudest", "/projects/entry/2020-soudest-backend-nodejs"],
  ["contact", "/contact"],
]
const THEMES = ["dark", "light"]
const CHROME = "/etc/profiles/per-user/tom/bin/chromium"

async function main() {
  const axeSource = fs.readFileSync("/tmp/axe.min.js", "utf8")
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  const results = { meta: { base: BASE, axe: "4.10.3", chrome: CHROME }, routes: {} }

  for (const theme of THEMES) {
    results.routes[theme] = {}
    for (const [name, route] of ROUTES) {
      const context = await browser.newContext({ colorScheme: theme })
      await context.addInitScript((t) => {
        try {
          localStorage.setItem("flowbite-theme-mode", t)
        } catch {
          /* about:blank has no origin */
        }
      }, theme)
      const page = await context.newPage()
      const consoleErrors = []
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text())
      })
      await page.goto(BASE + route, { waitUntil: "networkidle" })
      await page.waitForTimeout(400)
      const htmlClass = await page.evaluate(() => document.documentElement.className)
      await page.addScriptTag({ content: axeSource })
      const axe = await page.evaluate(async () => {
        // window.axe injected above
        const r = await window.axe.run(document, { resultTypes: ["violations"] })
        return {
          violationCount: r.violations.length,
          violations: r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
            help: v.help,
          })),
          passCount: r.passes.length,
          incompleteCount: r.incomplete.length,
        }
      })
      results.routes[theme][name] = {
        route,
        htmlClass,
        isDark: htmlClass.includes("dark"),
        consoleErrors,
        axe,
      }
      const ids = axe.violations.map((v) => `${v.id}(${v.nodes})`).join(", ") || "none"
      console.log(`${theme} ${name} isDark=${htmlClass.includes("dark")} violations=${axe.violationCount} [${ids}]`)
      await context.close()
    }
  }

  fs.writeFileSync(".omo/evidence/baseline/axe-baseline.json", JSON.stringify(results, null, 2))
  console.log("WROTE .omo/evidence/baseline/axe-baseline.json")
  await browser.close()
}

main().catch((e) => {
  console.error("FATAL", e)
  process.exit(1)
})
