import { expect, test } from "@playwright/test"

import { COPY, FEATURED_PROJECT_COUNT, MAX_HOME_DOM_NODES } from "./fixtures/expectations"

test("homepage renders core sections", async ({ page }) => {
  await page.goto("/")

  // Title metadata set in app/page.tsx
  await expect(page).toHaveTitle(/TomSegbers.de/)

  // Header / Navbar (Flowbite Navbar renders as <nav>)
  const nav = page.locator("nav").first()
  await expect(nav).toBeVisible()
  await expect(nav.locator('a[href="/"]')).toBeVisible()

  // Type-led hero — h1 with main tagline and the existing positioning line
  const heroHeading = page.getByRole("heading", { level: 1 })
  await expect(heroHeading).toBeVisible()
  await expect(heroHeading).toHaveText(COPY.home.h1)
  await expect(page.getByText(COPY.home.positioning, { exact: true })).toBeVisible()

  // Curated featured set — exactly N monuments, each a project link
  const featuredHeading = page.getByRole("heading", { name: COPY.home.featuredH2, level: 2 })
  await expect(featuredHeading).toBeVisible()
  const featuredLinks = page.locator('[data-testid="featured-project"]')
  await expect(featuredLinks).toHaveCount(FEATURED_PROJECT_COUNT)
  for (const index of Array.from({ length: FEATURED_PROJECT_COUNT }, (_, i) => i)) {
    await expect(featuredLinks.nth(index)).toHaveAttribute("href", /^\/projects\/entry\/[^/]+$/)
  }

  // The 42-card marquee is gone
  await expect(page.locator(".animate-marquee, .animate-marquee2")).toHaveCount(0)

  // Founder-arc scaffold — four structural beats, no fabricated content
  const founderArcHeading = page.getByRole("heading", { name: COPY.home.founderArcH2, level: 2 })
  await expect(founderArcHeading).toBeVisible()
  await expect(page.locator('[data-testid="founder-arc-beat"]')).toHaveCount(4)

  // Blog section heading and teasers retained
  const blogHeading = page.getByRole("heading", { name: COPY.home.recentBlogH2, level: 2 })
  await expect(blogHeading).toBeVisible()

  const blogCards = page.locator('a[href^="/blog/entry/"]')
  expect(await blogCards.count()).toBeGreaterThanOrEqual(1)
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
