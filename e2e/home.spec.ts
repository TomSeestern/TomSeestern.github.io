import { expect, test } from "@playwright/test"

import { COPY } from "./fixtures/expectations"

test("homepage renders core sections", async ({ page }) => {
  await page.goto("/")

  // Title metadata set in app/page.tsx
  await expect(page).toHaveTitle(/TomSegbers.de/)

  // Header / Navbar (Flowbite Navbar renders as <nav>)
  const nav = page.locator("nav").first()
  await expect(nav).toBeVisible()
  // Header contains the logo link pointing home
  await expect(nav.locator('a[href="/"]')).toBeVisible()

  // Hero section — h1 with main tagline
  const heroHeading = page.getByRole("heading", { level: 1 })
  await expect(heroHeading).toBeVisible()
  await expect(heroHeading).toHaveText(COPY.home.h1)

  // Project marquee section heading
  const projectsHeading = page.getByRole("heading", { name: COPY.home.recentProjectsH2, level: 2 })
  await expect(projectsHeading).toBeVisible()
  // Marquee animation containers exist somewhere under the page
  await expect(page.locator(".animate-marquee").first()).toBeVisible()

  // Blog section heading
  const blogHeading = page.getByRole("heading", { name: COPY.home.recentBlogH2, level: 2 })
  await expect(blogHeading).toBeVisible()

  // Blog cards rendered (ArticleComponent renders article teasers)
  const blogCards = page.locator('a[href^="/blog/entry/"]')
  const count = await blogCards.count()
  expect(count).toBeGreaterThanOrEqual(1)
})
