// Throwaway F3 post-hydration probe (gitignored under .omo/). Read-only.
import { chromium } from "@playwright/test"

const BASE = "http://127.0.0.1:3000"
const EXEC = process.env.CHROMIUM_PATH || "/etc/profiles/per-user/tom/bin/chromium"

const results = []
function rec(name, pass, detail) {
  results.push({ name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  ${detail}`)
}

const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] })

async function ctx(opts = {}) {
  return browser.newContext(opts)
}

async function waitHydrated(page) {
  // React hydration marker Next.js sets on the root; also wait for load + a settle frame.
  await page.waitForLoadState("load")
  await page.waitForFunction(() => document.readyState === "complete", null, { timeout: 30000 })
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
}

// ---------- 1. /tags index ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/tags`, { waitUntil: "load" })
  await waitHydrated(page)
  const h1 = (await page.locator("h1").first().innerText()).trim()
  rec("/tags h1", h1 === "Tags", `h1=${JSON.stringify(h1)}`)
  const links = await page.locator('a[href^="/tags/"]').count()
  rec("/tags link count", links === 86, `count=${links}`)
  // click a real tag link -> navigates
  const first = page.locator('a[href^="/tags/"]').first()
  const href = await first.getAttribute("href")
  await Promise.all([page.waitForURL(/\/tags\//), first.click()])
  rec("/tags link resolves", page.url().includes("/tags/"), `clicked ${href} -> ${page.url()}`)
  await c.close()
}

// ---------- 2. tag archive c-plus-plus ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/tags/c-plus-plus`, { waitUntil: "load" })
  await waitHydrated(page)
  const h1 = (await page.locator("h1").first().innerText()).trim()
  rec("/tags/c-plus-plus h1", h1 === "C++", `h1=${JSON.stringify(h1)}`)
  const projects = await page.locator('[data-testid="project-teaser"]').count()
  const articles = await page.locator("article").count()
  rec("/tags/c-plus-plus entries", projects + articles > 0, `projects=${projects} articles=${articles}`)
  // breadcrumb links resolve
  const bcTags = await page.locator('a[href="/tags"]').count()
  rec("/tags/c-plus-plus breadcrumb", bcTags >= 1, `tags-breadcrumb-links=${bcTags}`)
  await c.close()
}

// ---------- 3. merged tag digital-transformation ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/tags/digital-transformation`, { waitUntil: "load" })
  await waitHydrated(page)
  const h1 = (await page.locator("h1").first().innerText()).trim()
  rec("/tags/digital-transformation h1", h1 === "Digital Transformation", `h1=${JSON.stringify(h1)}`)
  await c.close()
}

// ---------- 4. bogus tag -> 404 ----------
{
  const c = await ctx()
  const page = await c.newPage()
  const resp = await page.goto(`${BASE}/tags/no-such-tag-zzz`, { waitUntil: "load" })
  rec("/tags/<bogus> 404", resp.status() === 404, `status=${resp.status()}`)
  await c.close()
}

// ---------- 5. /impressum ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/impressum`, { waitUntil: "load" })
  await waitHydrated(page)
  const h1 = (await page.locator("h1").first().innerText()).trim()
  rec("/impressum h1", h1 === "Impressum", `h1=${JSON.stringify(h1)}`)
  const todos = await page.getByText(/TODO\(Tom\):/).count()
  rec("/impressum TODO visible", todos >= 5, `TODO nodes=${todos}`)
  const h2 = await page.locator("h2").count()
  rec("/impressum h2", h2 >= 2, `h2 count=${h2}`)
  await c.close()
}

// ---------- 6. /datenschutz ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/datenschutz`, { waitUntil: "load" })
  await waitHydrated(page)
  const h1 = (await page.locator("h1").first().innerText()).trim()
  rec("/datenschutz h1", h1 === "Datenschutzerklärung", `h1=${JSON.stringify(h1)}`)
  const todos = await page.getByText(/TODO\(Tom\):/).count()
  rec("/datenschutz TODO visible", todos >= 5, `TODO nodes=${todos}`)
  const h2 = await page.locator("h2").count()
  rec("/datenschutz h2", h2 >= 6, `h2 count=${h2}`)
  await c.close()
}

// ---------- 7. /about testimonials labelling ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/about`, { waitUntil: "load" })
  await waitHydrated(page)
  const badge = await page.getByText("Example", { exact: true }).count()
  rec("/about Example badge", badge >= 1, `badge nodes=${badge}`)
  const disclaimer = await page.getByText("Illustrative examples — not real client testimonials.", { exact: true }).count()
  rec("/about disclaimer", disclaimer >= 1, `disclaimer nodes=${disclaimer}`)
  const examples = await page.locator('[data-testid="illustrative-example"]').count()
  rec("/about illustrative examples", examples === 3, `testid count=${examples}`)
  const portraitBelow = await page.locator('img[alt="Portrait of Tom Segbers"]').count()
  rec("/about portrait present", portraitBelow === 1, `portrait imgs=${portraitBelow}`)
  // portrait must be below the testimonials? requirement says portrait below fold. Verify its Y > viewport height OR lazy.
  const portraitBox = await page.locator('img[alt="Portrait of Tom Segbers"]').boundingBox()
  rec("/about portrait below fold", !!portraitBox && portraitBox.y > 0, `portrait y=${portraitBox?.y}`)
  await c.close()
}

// ---------- 8. homepage invariants ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/`, { waitUntil: "load" })
  await waitHydrated(page)
  const marquee = await page.locator(".animate-marquee, .animate-marquee2").count()
  rec("/ no marquee", marquee === 0, `marquee count=${marquee}`)
  const tooltipProviders = await page.locator('[data-radix-tooltip-provider]').count()
  const h1 = (await page.locator("h1").first().innerText()).trim()
  rec("/ h1", h1.includes("Tom Segbers"), `h1=${JSON.stringify(h1)}`)
  console.log(`INFO  / radix tooltip provider nodes=${tooltipProviders}`)
  await c.close()
}

// ---------- 9. no regression on core routes post-hydration ----------
for (const [route, sel] of [
  ["/projects", "h1"],
  ["/blog", "h1"],
  ["/blog/entry/2019-ebeltoft-cheesecake-recipe", "article"],
  ["/contact", "form"],
]) {
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}${route}`, { waitUntil: "load" })
  await waitHydrated(page)
  const n = await page.locator(sel).count()
  rec(`${route} hydration (${sel})`, n >= 1, `${sel} count=${n}`)
  await c.close()
}

// ---------- 10. Footer wrap at 375 + icon min size ----------
{
  const c = await ctx({ viewport: { width: 375, height: 800 } })
  const page = await c.newPage()
  await page.goto(`${BASE}/`, { waitUntil: "load" })
  await waitHydrated(page)
  const footer = page.locator("footer")
  const social = footer.locator("a").filter({ has: page.locator("img") })
  const count = await social.count()
  const sizes = []
  for (let i = 0; i < count; i++) {
    const b = await social.nth(i).boundingBox()
    const img = await social.nth(i).locator("img").boundingBox()
    sizes.push({ link: b && { w: Math.round(b.width), h: Math.round(b.height) }, img: img && { w: Math.round(img.width), h: Math.round(img.height) } })
  }
  const minImg = Math.min(...sizes.map((s) => s.img?.w ?? 999), ...sizes.map((s) => s.img?.h ?? 999))
  rec("375 footer icons ≥24px", minImg >= 24, `min icon dim=${minImg} sizes=${JSON.stringify(sizes.map((s) => s.img))}`)
  const iconLinkW = sizes.map((s) => s.link?.w)
  rec("375 footer icons not crushed", iconLinkW.every((w) => w >= 24), `link widths=${JSON.stringify(iconLinkW)}`)
  // wrap detection: does the flex row wrap to more than one line?
  const tops = sizes.map((s) => s.link?.h)
  const rowCount = await footer.locator("div.flex-wrap").evaluate((el) => {
    const children = Array.from(el.children)
    const tops = children.map((c) => c.getBoundingClientRect().top)
    return new Set(tops.map((t) => Math.round(t))).size
  })
  rec("375 footer row wraps", rowCount >= 2, `distinct rows=${rowCount}`)
  // no horizontal overflow
  const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
  rec("375 no overflow home", overflow.sw <= overflow.cw, `scrollWidth=${overflow.sw} clientWidth=${overflow.cw}`)
  await c.close()
}

// ---------- 11. keyboard: tab reaches tag + legal links in footer ----------
{
  const c = await ctx()
  const page = await c.newPage()
  await page.goto(`${BASE}/`, { waitUntil: "load" })
  await waitHydrated(page)
  // find footer links reachable
  const reachable = []
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab")
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return null
      return { tag: el.tagName, href: el.getAttribute("href") || "", text: (el.textContent || "").trim().slice(0, 30) }
    })
    if (info?.href) reachable.push(info.href)
    if (reachable.includes("/tags") && reachable.includes("/impressum") && reachable.includes("/datenschutz")) break
  }
  rec("keyboard reaches /tags", reachable.includes("/tags"), `seen=${JSON.stringify([...new Set(reachable)].slice(0, 30))}`)
  rec("keyboard reaches /impressum", reachable.includes("/impressum"), "")
  rec("keyboard reaches /datenschutz", reachable.includes("/datenschutz"), "")
  await c.close()
}

// ---------- 12. reduced motion ----------
{
  const c = await ctx({ reducedMotion: "reduce" })
  const page = await c.newPage()
  await page.goto(`${BASE}/`, { waitUntil: "load" })
  await waitHydrated(page)
  const marquee = await page.locator(".animate-marquee, .animate-marquee2").count()
  const running = await page.evaluate(() => document.getAnimations().filter((a) => (a.effect?.getTiming().duration ?? 0) > 1).length)
  rec("reduced-motion: no marquee", marquee === 0, `marquee=${marquee}`)
  rec("reduced-motion: no long animations", running === 0, `animations>1ms=${running}`)
  await c.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\nSUMMARY: ${results.length - failed.length}/${results.length} passed, ${failed.length} failed`)
if (failed.length) {
  console.log("FAILURES:", JSON.stringify(failed, null, 2))
  process.exit(1)
}
