/**
 * Throwaway F3 manual-QA driver (gitignored under .omo/).
 * Drives the real production build at http://127.0.0.1:3050 and records
 * evidence to .omo/evidence/f3/.
 *
 * Run: PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright \
 *      node_modules/.bin/tsx .omo/f3-journey.ts   (or npx tsx)
 */
import { chromium, type Browser, type ConsoleMessage, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync, appendFileSync } from "node:fs"
import { resolve } from "node:path"

const BASE = process.env.F3_BASE ?? "http://127.0.0.1:3050"
const OUT = resolve(process.cwd(), ".omo/evidence/f3")
const SHOOT = resolve(OUT, "shots")
mkdirSync(SHOOT, { recursive: true })

const LOG = resolve(OUT, "journey-run.log")
writeFileSync(LOG, `# F3 journey run ${new Date().toISOString()} base=${BASE}\n`)

function log(line: string): void {
  // eslint-disable-next-line no-console
  console.log(line)
  appendFileSync(LOG, line + "\n")
}

type ConsoleEntry = { route: string; type: string; text: string }
type OverflowEntry = { route: string; width: number; scrollWidth: number; clientWidth: number; ok: boolean }
type Check = { name: string; ok: boolean; detail: string }

const consoleEntries: ConsoleEntry[] = []
const overflows: OverflowEntry[] = []
const checks: Check[] = []
const screenshots: { route: string; viewport: string; path: string }[] = []

function record(name: string, ok: boolean, detail: string): void {
  checks.push({ name, ok, detail })
  log(`${ok ? "PASS" : "FAIL"}  ${name}  — ${detail}`)
}

function attachConsole(page: Page, route: string): void {
  page.on("console", (msg: ConsoleMessage) => {
    const type = msg.type()
    if (type === "error" || type === "warning") {
      consoleEntries.push({ route, type, text: msg.text() })
    }
  })
  page.on("pageerror", (err: Error) => {
    consoleEntries.push({ route, type: "pageerror", text: err.message })
  })
}

async function waitStable(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.evaluate(() => document.fonts.ready).catch(() => {})
  await page
    .evaluate(
      () =>
        new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())))
    )
    .catch(() => {})
}

async function measureOverflow(page: Page, route: string, viewportLabel: string): Promise<number> {
  const m = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }))
  const ok = m.scrollWidth === m.clientWidth
  overflows.push({ route, width: m.clientWidth, scrollWidth: m.scrollWidth, clientWidth: m.clientWidth, ok })
  record(
    `overflow ${viewportLabel} ${route}`,
    ok,
    `scrollWidth=${m.scrollWidth} clientWidth=${m.clientWidth}${ok ? "" : "  <-- HORIZONTAL OVERFLOW"}`
  )
  return m.scrollHeight
}

async function shot(page: Page, route: string, name: string, fullPage = true): Promise<number> {
  const safe = route.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "root"
  const path = resolve(SHOOT, `${name}__${safe}.png`)
  await page.screenshot({ path, fullPage })
  screenshots.push({ route, viewport: name, path })
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  log(`SHOT ${name} ${route} -> ${path} (height=${h})`)
  return h
}

const JOURNEY_ROUTES = [
  { route: "/", label: "home" },
  { route: "/projects", label: "projects-archive" },
  { route: "/projects/entry/2020-soudest-backend-nodejs", label: "project-detail-legacy" },
  { route: "/blog", label: "blog-listing" },
  { route: "/blog/entry/2019-ebeltoft-cheesecake-recipe", label: "blog-post" },
  { route: "/contact", label: "contact" },
] as const

async function desktopJourney(browser: Browser): Promise<void> {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  log("\n===== DESKTOP JOURNEY (1280) =====")

  // --- 1. Homepage ---
  attachConsole(page, "/")
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" })
  await waitStable(page)
  const homeH = await shot(page, "/", "desktop-home")
  record("home h1 present", (await page.locator("h1").first().innerText()).length > 0, `h1="${await page
    .locator("h1")
    .first()
    .innerText()}"`)

  const featured = page.locator('[data-testid="featured-project"]')
  const featuredCount = await featured.count()
  record("home featured set count=4", featuredCount === 4, `count=${featuredCount}`)
  const featuredTitles = await featured.locator("h3").allInnerTexts()
  log(`      featured titles: ${JSON.stringify(featuredTitles)}`)

  // marquee retired
  const marqueeCount = await page.locator(".animate-marquee, .animate-marquee2").count()
  record("home marquee retired (0 .animate-marquee)", marqueeCount === 0, `count=${marqueeCount}`)

  // OG on home
  const ogHome = await page.locator('meta[property="og:image"]').first().getAttribute("content")
  record("home og:image = /img/og-default.png", ogHome === "/img/og-default.png", `og:image="${ogHome}"`)

  // brand mark
  const brandStatus = await page.evaluate(async (b) => {
    const res = await fetch(b + "/icon/brand-mark.svg")
    return { status: res.status, type: res.headers.get("content-type") }
  }, BASE)
  record("brand mark /icon/brand-mark.svg 200", brandStatus.status === 200, `status=${brandStatus.status} type=${brandStatus.type}`)
  const logoAlt = await page.locator("header img").first().getAttribute("alt")
  record('brand mark accessible name "Tom Segbers Logo"', logoAlt === "Tom Segbers Logo", `alt="${logoAlt}"`)

  // --- 2. Featured set -> click a featured project ---
  attachConsole(page, "/#featured-click")
  const firstFeatured = featured.first()
  const featuredHref = await firstFeatured.getAttribute("href")
  await firstFeatured.scrollIntoViewIfNeeded()
  await shot(page, "/", "desktop-featured-section", true)
  await Promise.all([page.waitForURL(/\/projects\/entry\//), firstFeatured.click()])
  await waitStable(page)
  const detailUrl = new URL(page.url()).pathname
  record(
    "featured click navigates to project detail",
    detailUrl.startsWith("/projects/entry/"),
    `${featuredHref} -> ${detailUrl}`
  )
  await shot(page, detailUrl, "desktop-project-detail-from-featured")

  // --- 3. Legacy project detail degrade (explicit) ---
  attachConsole(page, "/projects/entry/2020-soudest-backend-nodejs")
  await page.goto(BASE + "/projects/entry/2020-soudest-backend-nodejs", { waitUntil: "domcontentloaded" })
  await waitStable(page)
  const heroCount = await page.locator('[data-testid="case-study-hero"]').count()
  const metaCount = await page.locator('[data-testid="case-study-meta"]').count()
  record("legacy project: no case-study-hero", heroCount === 0, `count=${heroCount}`)
  record("legacy project: no case-study-meta", metaCount === 0, `count=${metaCount}`)
  const legacyArticleText = await page.locator("article.prose").innerText()
  record("legacy project article non-empty", legacyArticleText.trim().length > 100, `len=${legacyArticleText.trim().length}`)
  const detailH1 = await page.locator("article h1").first().innerText()
  record("legacy project has h1", detailH1.trim().length > 0, `h1="${detailH1}"`)
  const ogDetail = await page.locator('meta[property="og:image"]').first().getAttribute("content")
  record("project detail og:image = /img/og-default.png", ogDetail === "/img/og-default.png", `og:image="${ogDetail}"`)
  await shot(page, "/projects/entry/2020-soudest-backend-nodejs", "desktop-project-detail-legacy")

  // breadcrumb present
  const bc = await page.locator('nav[aria-label="Breadcrumb"]').count()
  record("project detail breadcrumb present", bc === 1, `count=${bc}`)

  // --- 4. Blog listing ---
  attachConsole(page, "/blog")
  await page.goto(BASE + "/blog", { waitUntil: "domcontentloaded" })
  await waitStable(page)
  const blogH1 = await page.locator("h1").first().innerText()
  record("blog listing h1 = Blog", blogH1.trim() === "Blog", `h1="${blogH1}"`)
  const cardCount = await page.locator("a[href^='/blog/entry/']").count()
  record("blog listing has cards", cardCount > 0, `links=${cardCount}`)
  const chip = await page.locator("span").filter({ hasText: /^[A-Za-z ]+$/ }).count()
  log(`      blog listing cardCount=${cardCount}`)
  await shot(page, "/blog", "desktop-blog-listing")

  // --- 5. Blog post ---
  attachConsole(page, "/blog/entry/2019-ebeltoft-cheesecake-recipe")
  await page.goto(BASE + "/blog/entry/2019-ebeltoft-cheesecake-recipe", { waitUntil: "domcontentloaded" })
  await waitStable(page)
  const postText = await page.locator("article.prose").innerText()
  record("blog post article non-empty", postText.trim().length > 100, `len=${postText.trim().length}`)
  const blogBc = await page.locator('nav[aria-label="Breadcrumb"]').count()
  record("blog post breadcrumb present", blogBc === 1, `count=${blogBc}`)
  await shot(page, "/blog/entry/2019-ebeltoft-cheesecake-recipe", "desktop-blog-post")

  // --- 6. Contact form ---
  attachConsole(page, "/contact")
  await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" })
  await waitStable(page)
  const nameField = page.locator("#name")
  const emailField = page.locator("#email")
  const msgField = page.locator("#message")
  const submit = page.locator('button[type="submit"]')
  record("contact form fields present", (await nameField.count()) === 1 && (await emailField.count()) === 1 && (await msgField.count()) === 1, "name/email/message")
  await shot(page, "/contact", "desktop-contact")

  // blur validation on email
  await emailField.click()
  await emailField.fill("not-an-email")
  await nameField.click() // blur email
  await page.waitForTimeout(150)
  const emailInvalid = await emailField.getAttribute("aria-invalid")
  const emailErr = await page.locator("#email-error").count()
  record("contact email blur validation sets aria-invalid + error", emailInvalid === "true" && emailErr === 1, `aria-invalid=${emailInvalid} errNodes=${emailErr}`)
  await shot(page, "/contact", "desktop-contact-validation")

  // focus ring on submit
  await submit.focus()
  const focusRing = await submit.evaluate((el) => {
    const s = getComputedStyle(el)
    return { outline: s.outlineStyle + " " + s.outlineWidth, boxShadow: s.boxShadow }
  })
  record("contact submit has visible focus treatment", focusRing.outline !== "none 0px" || focusRing.boxShadow !== "none", JSON.stringify(focusRing))

  // full valid submit (E2E override enables success)
  await nameField.fill("QA Bot")
  await emailField.fill("qa@example.com")
  await msgField.fill("F3 manual QA journey verification.")
  await submit.click()
  await page.waitForTimeout(1200)
  const successNode = await page.locator('[role="status"]').count()
  const alertText = await page.locator('[role="status"]').first().innerText().catch(() => "")
  record("contact valid submit shows role=status success", successNode >= 1, `nodes=${successNode} text="${alertText.replace(/\n/g, " ")}"`)
  await shot(page, "/contact", "desktop-contact-success")

  await ctx.close()
}

async function responsiveOverflow(browser: Browser): Promise<void> {
  log("\n===== RESPONSIVE OVERFLOW (375 / 768 / 1280) =====")
  const viewports = [
    { w: 375, h: 812, label: "mobile-375" },
    { w: 768, h: 1024, label: "tablet-768" },
    { w: 1280, h: 900, label: "desktop-1280" },
  ] as const

  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } })
    const page = await ctx.newPage()
    for (const { route } of JOURNEY_ROUTES) {
      attachConsole(page, `${route}@${vp.label}`)
      await page.goto(BASE + route, { waitUntil: "domcontentloaded" })
      await waitStable(page)
      await measureOverflow(page, route, vp.label)
      if (vp.w !== 1280) {
        // capture one representative shot per route at mobile/tablet (viewport-only to limit size)
        if (route === "/" || route === "/projects/entry/2020-soudest-backend-nodejs" || route === "/blog" || route === "/contact") {
          await shot(page, route, vp.label, false)
        }
      }
    }
    await ctx.close()
  }
}

async function keyboardFlow(browser: Browser): Promise<void> {
  log("\n===== KEYBOARD FLOW =====")
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  attachConsole(page, "keyboard")
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" })
  await waitStable(page)

  // Tab from load -> skip link visible
  await page.keyboard.press("Tab")
  const skip = page.locator('a[href="#main-content"]')
  const skipVisible = await skip.isVisible()
  const skipFocused = await skip.evaluate((el) => el === document.activeElement)
  record("keyboard: first Tab lands on skip link (visible)", skipVisible && skipFocused, `visible=${skipVisible} focused=${skipFocused}`)
  await shot(page, "/", "keyboard-skip-link", false)

  // Enter -> focus lands on #main-content
  await page.keyboard.press("Enter")
  await page.waitForTimeout(200)
  const mainFocused = await page.evaluate(() => document.activeElement?.id === "main-content")
  record("keyboard: Enter on skip link moves focus to #main-content", mainFocused, `activeElement=${await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName)}`)

  await ctx.close()

  // Mobile nav toggle
  const mctx = await browser.newContext({ viewport: { width: 375, height: 812 } })
  const mpage = await mctx.newPage()
  attachConsole(mpage, "keyboard-mobile-nav")
  await mpage.goto(BASE + "/", { waitUntil: "domcontentloaded" })
  await waitStable(mpage)
  const toggle = mpage.locator('button[aria-controls="site-nav"]')
  const expandedInitial = await toggle.getAttribute("aria-expanded")
  await toggle.focus()
  await mpage.keyboard.press("Enter")
  await mpage.waitForTimeout(150)
  const expandedAfterEnter = await toggle.getAttribute("aria-expanded")
  const navVisible = await mpage.locator("#site-nav").isVisible()
  record(
    "keyboard: mobile nav toggle Enter flips aria-expanded + reveals nav",
    expandedInitial === "false" && expandedAfterEnter === "true" && navVisible,
    `initial=${expandedInitial} afterEnter=${expandedAfterEnter} navVisible=${navVisible}`
  )
  await shot(mpage, "/", "keyboard-mobile-nav-open", false)
  await mpage.keyboard.press("Space")
  await mpage.waitForTimeout(150)
  const expandedAfterSpace = await toggle.getAttribute("aria-expanded")
  record("keyboard: mobile nav toggle Space closes (aria-expanded=false)", expandedAfterSpace === "false", `afterSpace=${expandedAfterSpace}`)

  // Contact form keyboard reachability
  attachConsole(mpage, "keyboard-contact")
  await mpage.goto(BASE + "/contact", { waitUntil: "domcontentloaded" })
  await waitStable(mpage)
  await mpage.locator("#name").focus()
  const nameFocused = await mpage.evaluate(() => document.activeElement?.id === "name")
  await mpage.keyboard.press("Tab")
  const emailFocused = await mpage.evaluate(() => document.activeElement?.id === "email")
  await mpage.keyboard.press("Tab")
  const msgFocused = await mpage.evaluate(() => document.activeElement?.id === "message")
  await mpage.keyboard.press("Tab")
  const submitFocused = await mpage.evaluate(() => document.activeElement?.getAttribute("type") === "submit")
  record(
    "keyboard: contact fields + submit reachable via Tab",
    nameFocused && emailFocused && msgFocused && submitFocused,
    `name=${nameFocused} email=${emailFocused} message=${msgFocused} submit=${submitFocused}`
  )

  // submit focus ring computed
  const ring = await mpage.locator('button[type="submit"]').evaluate((el) => {
    const s = getComputedStyle(el)
    return { boxShadow: s.boxShadow, outline: s.outlineStyle + " " + s.outlineWidth }
  })
  record("keyboard: submit focus-ring visible", ring.boxShadow !== "none" || ring.outline !== "none 0px", JSON.stringify(ring))
  await mctx.close()
}

async function reducedMotion(browser: Browser): Promise<void> {
  log("\n===== PREFERS-REDUCED-MOTION: reduce =====")
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" })
  const page = await ctx.newPage()
  for (const { route } of JOURNEY_ROUTES) {
    attachConsole(page, `${route}@reduce`)
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" })
    await waitStable(page)
    const marquee = await page.locator(".animate-marquee, .animate-marquee2").count()
    record(`reduced-motion ${route}: 0 marquee`, marquee === 0, `count=${marquee}`)
    // no running animations longer than the 0.01ms guard
    const running = await page.evaluate(() => {
      return document.getAnimations().filter((a) => {
        const dur = (a.effect?.getTiming().duration ?? 0) as number
        return dur > 1
      }).length
    })
    record(`reduced-motion ${route}: no animation >1ms running`, running === 0, `running=${running}`)
  }
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" })
  await waitStable(page)
  await shot(page, "/", "reduced-motion-home", false)
  await ctx.close()
}

async function main(): Promise<void> {
  const browser = await chromium.launch()
  try {
    await desktopJourney(browser)
    await responsiveOverflow(browser)
    await keyboardFlow(browser)
    await reducedMotion(browser)
  } finally {
    await browser.close()
  }

  const summary = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    checks,
    failures: checks.filter((c) => !c.ok),
    consoleEntries,
    overflows,
    screenshots,
  }
  writeFileSync(resolve(OUT, "journey-summary.json"), JSON.stringify(summary, null, 2))

  log("\n===== SUMMARY =====")
  log(`checks: ${checks.length}, failures: ${summary.failures.length}`)
  for (const f of summary.failures) log(`  FAIL: ${f.name} — ${f.detail}`)
  log(`console entries captured: ${consoleEntries.length}`)
  const errs = consoleEntries.filter((e) => e.type === "error" || e.type === "pageerror")
  log(`console ERRORS: ${errs.length}`)
  for (const e of errs.slice(0, 40)) log(`  [${e.type}] ${e.route}: ${e.text.slice(0, 300)}`)
  const warns = consoleEntries.filter((e) => e.type === "warning")
  log(`console WARNINGS: ${warns.length}`)
  for (const w of warns.slice(0, 40)) log(`  [warn] ${w.route}: ${w.text.slice(0, 300)}`)
  const overflowFails = overflows.filter((o) => !o.ok)
  log(`overflow failures: ${overflowFails.length}`)
}

main().catch((err) => {
  log(`FATAL: ${err instanceof Error ? err.stack : String(err)}`)
  process.exit(1)
})
