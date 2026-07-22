import { expect, test } from "@playwright/test"

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
  await expect(heroHeading).toHaveText("Tom Segbers — Senior Developer")

  // Project marquee section — h2 "My Recent Projects"
  const projectsHeading = page.getByRole("heading", { name: /My Recent Projects/, level: 2 })
  await expect(projectsHeading).toBeVisible()
  // Marquee animation containers exist somewhere under the page
  await expect(page.locator(".animate-marquee").first()).toBeVisible()

  // Blog section — h2 "My Recent Blog Posts"
  const blogHeading = page.getByRole("heading", { name: /My Recent Blog Posts/, level: 2 })
  await expect(blogHeading).toBeVisible()

  // Blog cards rendered (ArticleComponent renders article teasers)
  const blogCards = page.locator('a[href^="/blog/entry/"]')
  const count = await blogCards.count()
  expect(count).toBeGreaterThanOrEqual(1)
})

test("homepage exposes semantic Roman font roles", async ({ page }) => {
  await page.goto("/")

  const fontVariables = await page.locator("html").evaluate((element) => {
    const styles = getComputedStyle(element)

    return {
      body: styles.getPropertyValue("--font-body").trim(),
      heading: styles.getPropertyValue("--font-heading").trim(),
      sans: styles.getPropertyValue("--font-sans").trim(),
    }
  })

  expect(fontVariables.heading).not.toBe("")
  expect(fontVariables.body).not.toBe("")
  expect(fontVariables.sans).not.toBe("")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("font-family", /Cinzel/)
  await expect(page.getByRole("heading", { level: 2 }).first()).toHaveCSS("font-family", /Cinzel/)
  await expect(page.locator("nav").first()).toHaveCSS("font-family", /Inter/)
  await expect(page.getByText("Building reliable systems and solving hard problems.")).toHaveCSS("font-family", /Inter/)
})

test("homepage keeps hero visible and obscures marquee edge fragments on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/")

  const heroHeading = page.getByRole("heading", { level: 1 })
  await expect(heroHeading).toBeVisible()
  await expect(heroHeading).toHaveCSS("opacity", "1")

  const marquee = page.getByTestId("project-marquee")
  await expect(marquee).toBeVisible()
  await expect(marquee).toHaveCSS("mask-image", "none")
  await expect(page.getByTestId("project-marquee-start-guard")).toBeVisible()
  await expect(page.getByTestId("project-marquee-end-guard")).toBeVisible()
})

test("article prose uses EB Garamond while UI uses Inter", async ({ page }) => {
  await page.goto("/blog/entry/2026-peak-website")

  await expect(page.locator("article.prose")).toHaveCSS("font-family", /EB Garamond/)
  await expect(page.locator("nav").first()).toHaveCSS("font-family", /Inter/)
})
