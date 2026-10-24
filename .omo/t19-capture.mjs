import { chromium } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3031"
const OUTPUT_DIR = ".omo/evidence/t19"
const FIXTURE_SLUG = "zz-t19-case-study-fixture"
const LEGACY_SLUG = "2020-soudest-backend-nodejs"

mkdirSync(OUTPUT_DIR, { recursive: true })

const browser = await chromium.launch()
const results = []

for (const width of [375, 768, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(`${BASE_URL}/projects/entry/${FIXTURE_SLUG}`)
  await page.getByRole("heading", { level: 1 }).waitFor()
  const heroCount = await page.getByTestId("case-study-hero").count()
  const metaCount = await page.getByTestId("case-study-meta").count()
  const metaText = metaCount > 0 ? await page.getByTestId("case-study-meta").innerText() : ""
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  await page.screenshot({ path: `${OUTPUT_DIR}/fixture-${width}.png`, fullPage: true })
  results.push({ slug: FIXTURE_SLUG, width, heroCount, metaCount, scrollWidth, metaText })
  await page.close()
}

const legacyPage = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await legacyPage.goto(`${BASE_URL}/projects/entry/${LEGACY_SLUG}`)
await legacyPage.getByRole("heading", { level: 1 }).waitFor()
const legacyHeroCount = await legacyPage.getByTestId("case-study-hero").count()
const legacyMetaCount = await legacyPage.getByTestId("case-study-meta").count()
await legacyPage.screenshot({ path: `${OUTPUT_DIR}/legacy-1280.png`, fullPage: true })
results.push({
  slug: LEGACY_SLUG,
  width: 1280,
  heroCount: legacyHeroCount,
  metaCount: legacyMetaCount,
  legacy: true,
})
await legacyPage.close()

await browser.close()

writeFileSync(`${OUTPUT_DIR}/capture.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
