import { expect, test } from "@playwright/test"

import { COPY, FEATURED_PROJECT_COUNT, MAX_HOME_DOM_NODES, PROJECT_CASE_FILE_COUNT } from "./fixtures/expectations"

test("homepage renders the COLOSSUS sections", async ({ page }) => {
  await page.goto("/")

  // Metadata and the exact positioning line stay stable.
  await expect(page).toHaveTitle(/TomSegbers.de/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(COPY.home.h1)
  await expect(page.getByText(COPY.home.positioning, { exact: true })).toBeVisible()

  // The terminal hero is the first artefact, not a portrait or a marquee.
  await expect(page.getByTestId("home-hero")).toBeVisible()
  await expect(page.getByTestId("home-hero").getByText("portfolio / 2026")).toBeVisible()
  await expect(page.getByTestId("home-archive-status")).toContainText("2010—2026")
  await expect(page.getByTestId("home-archive-status")).toContainText(String(PROJECT_CASE_FILE_COUNT))
  await expect(page.getByTestId("ticker")).toHaveCount(0)

  // Curated featured set — exactly four monuments, each a project link.
  await expect(page.getByRole("heading", { level: 2, name: COPY.home.featuredH2 })).toBeVisible()
  await expect(page.getByTestId("home-featured-grid")).toBeVisible()
  const featuredLinks = page.locator('[data-testid="featured-project"]')
  await expect(featuredLinks).toHaveCount(FEATURED_PROJECT_COUNT)
  for (const index of Array.from({ length: FEATURED_PROJECT_COUNT }, (_, i) => i)) {
    await expect(featuredLinks.nth(index)).toHaveAttribute("href", /^\/projects\/entry\/[^/]+$/)
  }

  // Practice band and latest dispatches.
  await expect(page.getByRole("heading", { level: 2, name: COPY.home.practiceH2 })).toBeVisible()
  await expect(page.getByTestId("home-practice")).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: COPY.home.recentBlogH2 })).toBeVisible()
  await expect(page.getByTestId("home-dispatches")).toBeVisible()

  await expect(page.getByTestId("article-card")).toHaveCount(3)
  expect(await page.locator('a[href^="/blog/entry/"]').count()).toBeGreaterThanOrEqual(3)

  // Closing CTA.
  await expect(page.getByRole("heading", { level: 2, name: COPY.home.closing })).toBeVisible()

  // The retired marquee, scaffold, and portrait-led hero are gone.
  await expect(page.locator(".animate-marquee, .animate-marquee2")).toHaveCount(0)
  await expect(page.locator('[data-testid="founder-arc-beat"]')).toHaveCount(0)
  await expect(page.locator('img[alt="Portrait of Tom Segbers"]')).toHaveCount(0)
})

test("home page stays within the DOM node budget", async ({ page }) => {
  // Given
  await page.goto("/")

  // When
  const nodeCount = await page.evaluate(() => document.querySelectorAll("*").length)

  // Then — record the measured number on the report, then assert it is within budget.
  test.info().annotations.push({ type: "home-dom-node-count", description: String(nodeCount) })
  expect(nodeCount).toBeLessThanOrEqual(MAX_HOME_DOM_NODES)
})

test("home page does not overflow at 375px", async ({ page }) => {
  // Given
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/")

  // When
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)

  // Then
  expect(fits).toBe(true)
})
