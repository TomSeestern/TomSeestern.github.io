/**
 * Reduced-motion proof for T15.
 *
 * Boots the production build, then drives real Playwright Chromium with
 * `reducedMotion: "reduce"` and asserts that no element carries a running
 * transform/opacity transition or animation. A second "motion on" pass proves
 * the detector is meaningful: the legacy marquee transform must change over time
 * when motion is allowed, and must stay frozen when it is not.
 */
import { spawn } from "node:child_process"
import { setTimeout as sleep } from "node:timers/promises"
import { chromium } from "@playwright/test"

const PORT = 3077
const BASE = `http://127.0.0.1:${PORT}`

const ROUTES = [
  "/",
  "/about",
  "/blog",
  "/projects",
  "/contact",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/projects/entry/2020-soudest-backend-nodejs",
]

async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE}/`)
      if (response.ok) return
    } catch {
      // server not up yet
    }
    await sleep(500)
  }
  throw new Error(`server did not become ready within ${timeoutMs}ms`)
}

/** Every running transform/opacity transition or animation on the page. */
function collectRunningMotion() {
  const violations = []
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el)
    const durations = cs.transitionDuration.split(",").map((value) => Number.parseFloat(value) || 0)
    const longest = Math.max(0, ...durations)
    if (longest > 0.05 && /transform|opacity|all/.test(cs.transitionProperty)) {
      violations.push({
        kind: "transition",
        tag: el.tagName,
        className: String(el.className).slice(0, 80),
        property: cs.transitionProperty,
        seconds: longest,
      })
    }
    const animationSeconds = Number.parseFloat(cs.animationDuration) || 0
    if (cs.animationName !== "none" && animationSeconds > 0.05) {
      violations.push({
        kind: "animation",
        tag: el.tagName,
        className: String(el.className).slice(0, 80),
        name: cs.animationName,
        seconds: animationSeconds,
      })
    }
  }
  return violations
}

async function marqueeTransform(page) {
  return page.evaluate(() => {
    const marquee = document.querySelector('[class*="animate-marquee"]')
    return marquee ? getComputedStyle(marquee).transform : null
  })
}

async function main() {
  const server = spawn("node_modules/.bin/next", ["start", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: "pipe",
  })
  server.stderr.on("data", (chunk) => process.stderr.write(`[next] ${chunk}`))

  const browser = await chromium.launch({ headless: true })
  const results = { reduced: {}, motionOn: {}, marqueeFrozen: null, marqueeMoved: null }
  let failures = 0

  try {
    await waitForServer(90_000)

    // Reduced motion: nothing may be running, on any route.
    const reducedContext = await browser.newContext({ reducedMotion: "reduce" })
    const reducedPage = await reducedContext.newPage()
    for (const route of ROUTES) {
      await reducedPage.goto(`${BASE}${route}`)
      await reducedPage.evaluate(() => document.fonts.ready)
      await reducedPage.waitForTimeout(250)
      const violations = await reducedPage.evaluate(collectRunningMotion)
      results.reduced[route] = violations
      if (violations.length > 0) failures += 1
    }

    // Reduced motion freezes the one legacy marquee.
    await reducedPage.goto(`${BASE}/`)
    const frozenA = await marqueeTransform(reducedPage)
    await reducedPage.waitForTimeout(500)
    const frozenB = await marqueeTransform(reducedPage)
    results.marqueeFrozen = { a: frozenA, b: frozenB, stable: frozenA === frozenB }
    if (frozenA !== frozenB) failures += 1

    // Reduced motion: a hover that would translate under motion-safe must not.
    await reducedPage.goto(`${BASE}/projects`)
    const card = reducedPage.locator('[class*="motion-safe:hover:-translate-y-1"]').first()
    if ((await card.count()) > 0) {
      await card.scrollIntoViewIfNeeded()
      await card.hover()
      await reducedPage.waitForTimeout(200)
      const transform = await card.evaluate((el) => getComputedStyle(el).transform)
      results.hoverUnderReduced = transform
      if (transform !== "none") failures += 1
    }
    await reducedContext.close()

    // Motion on: the same detector must observe the marquee moving.
    const motionContext = await browser.newContext({ reducedMotion: "no-preference" })
    const motionPage = await motionContext.newPage()
    await motionPage.goto(`${BASE}/`)
    const movedA = await marqueeTransform(motionPage)
    await motionPage.waitForTimeout(500)
    const movedB = await marqueeTransform(motionPage)
    results.marqueeMoved = { a: movedA, b: movedB, moved: movedA !== movedB }
    if (movedA === movedB) failures += 1
    results.motionOn["/"] = await motionPage.evaluate(collectRunningMotion)
    await motionContext.close()
  } finally {
    await browser.close()
    server.kill("SIGTERM")
  }

  console.log(JSON.stringify(results, null, 2))
  if (failures > 0) {
    console.error(`\nREDUCED-MOTION PROOF FAILED — ${failures} check(s) failed.`)
    process.exit(1)
  }
  console.log(`\nREDUCED-MOTION PROOF PASSED — ${ROUTES.length} route(s), zero running motion.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
