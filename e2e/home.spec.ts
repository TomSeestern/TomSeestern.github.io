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

  const projectsHeading = page.getByRole("heading", { name: /My Recent Projects/, level: 2 })
  await expect(projectsHeading).toBeVisible()
  await expect(page.getByTestId("project-collection")).toBeVisible()
  await expect(page.getByTestId("project-list")).toBeVisible()

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

test("homepage shows whole project cards and opens project links with keyboard", async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 812 })
    await page.goto("/")

    const heroHeading = page.getByRole("heading", { level: 1 })
    await expect(heroHeading).toBeVisible()
    await expect(heroHeading).toHaveCSS("opacity", "1")

    const collection = page.getByTestId("project-collection")
    const projectCards = page.getByTestId("project-card")
    await expect(collection).toBeVisible()
    await expect(projectCards.first()).toBeVisible()

    if (width === 375) {
      await expect(collection).toHaveCSS("scroll-snap-type", "x mandatory")
    } else {
      await expect(page.getByTestId("project-list")).toHaveCSS("display", "grid")
    }

    const cardGeometry = await projectCards.evaluateAll((cards, collectionTestId) => {
      const collectionElement = document.querySelector(`[data-testid="${collectionTestId}"]`)
      if (!(collectionElement instanceof HTMLElement)) {
        throw new Error("Project collection missing")
      }

      const collectionBounds = collectionElement.getBoundingClientRect()
      return cards
        .map((card) => card.getBoundingClientRect())
        .filter((card) => card.right > collectionBounds.left && card.left < collectionBounds.right)
        .map((card) => ({
          left: card.left,
          right: card.right,
          collectionLeft: collectionBounds.left,
          collectionRight: collectionBounds.right,
        }))
    }, "project-collection")

    expect(cardGeometry).not.toHaveLength(0)
    for (const card of cardGeometry) {
      expect(card.left).toBeGreaterThanOrEqual(card.collectionLeft)
      expect(card.right).toBeLessThanOrEqual(card.collectionRight)
    }
  }

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/")
  const projectLinkPattern = /\/projects\/entry\//
  let focusedProjectLink = ""

  for (let tabCount = 0; tabCount < 32; tabCount += 1) {
    await page.keyboard.press("Tab")
    focusedProjectLink = await page.evaluate(() => {
      const activeElement = document.activeElement
      return activeElement instanceof HTMLAnchorElement ? activeElement.getAttribute("href") ?? "" : ""
    })
    if (projectLinkPattern.test(focusedProjectLink)) break
  }

  expect(focusedProjectLink).toMatch(projectLinkPattern)
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(projectLinkPattern)
})

test("article prose uses EB Garamond while UI uses Inter", async ({ page }) => {
  await page.goto("/blog/entry/2026-peak-website")

  await expect(page.locator("article.prose")).toHaveCSS("font-family", /EB Garamond/)
  await expect(page.locator("nav").first()).toHaveCSS("font-family", /Inter/)
})
