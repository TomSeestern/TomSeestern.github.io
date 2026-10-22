import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { BLOG_POST_COUNT, COPY, FEATURED_PROJECT_COUNT, MIN_PROJECT_COUNT } from "./fixtures/expectations"

async function expectNoBrowserErrors(page: Page, runJourney: () => Promise<void>): Promise<void> {
  const browserErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    browserErrors.push(error.message)
  })

  await runJourney()

  expect(browserErrors).toEqual([])
}

test("blog listing discovers a detail route and breadcrumb returns to blog", async ({ page }) => {
  await expectNoBrowserErrors(page, async () => {
    // Given
    await page.goto("/blog")
    const postLinks = page.locator('h3 a[href^="/blog/entry/"]')

    // Then
    await expect(postLinks).toHaveCount(BLOG_POST_COUNT)
    const detailUrl = await postLinks.first().getAttribute("href")
    expect(detailUrl).toMatch(/^\/blog\/entry\/[^/]+$/)

    // When
    await page.goto(detailUrl ?? "")

    // Then
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i })
    const breadcrumbBlogLink = breadcrumb.getByRole("link", { name: "Blog" })
    await expect(breadcrumb).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible()
    await expect(breadcrumbBlogLink).toBeVisible()
    await expect(page.locator("article.prose")).not.toBeEmpty()

    // When
    await breadcrumbBlogLink.click()

    // Then
    await expect(page).toHaveURL(/\/blog$/)
    await expect(postLinks).toHaveCount(BLOG_POST_COUNT)
  })
})

test("project listing discovers a detail route and breadcrumb returns to projects", async ({ page }) => {
  await expectNoBrowserErrors(page, async () => {
    // Given
    await page.goto("/projects")
    // The archive title link wraps its heading in MonumentCard — use a[href^=...]
    const projectLinks = page.locator('a[href^="/projects/entry/"]')
    const projectTeasers = page.getByTestId("project-teaser")

    // Then — the archive renders every entry as a teaser.
    await expect(projectLinks.first()).toBeVisible()
    expect(await projectLinks.count()).toBeGreaterThanOrEqual(MIN_PROJECT_COUNT)
    expect(await projectTeasers.count()).toBeGreaterThanOrEqual(MIN_PROJECT_COUNT)
    const detailUrl = await projectLinks.first().getAttribute("href")
    expect(detailUrl).toMatch(/^\/projects\/entry\/[^/]+$/)

    // When
    await page.goto(detailUrl ?? "")

    // Then
    const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i })
    const breadcrumbProjectsLink = breadcrumb.getByRole("link", { name: "Projects" })
    await expect(breadcrumb).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible()
    await expect(breadcrumbProjectsLink).toBeVisible()
    // Last breadcrumb item is the project title (not a link)
    await expect(breadcrumb.locator("li:last-child")).not.toBeEmpty()
    await expect(page.locator("article.prose")).not.toBeEmpty()

    // When
    await breadcrumbProjectsLink.click()

    // Then
    await expect(page).toHaveURL(/\/projects$/)
    await expect(projectLinks.first()).toBeVisible()
    expect(await projectLinks.count()).toBeGreaterThanOrEqual(MIN_PROJECT_COUNT)
  })
})

test("project archive presents the featured selection as selected", async ({ page }) => {
  await expectNoBrowserErrors(page, async () => {
    // Given
    await page.goto("/projects")
    await expect(page.getByRole("heading", { level: 1, name: COPY.projects.h1 })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: COPY.projects.archiveH2 })).toBeVisible()

    // Then — the shared selection rule marks exactly FEATURED_PROJECT_COUNT entries.
    const featuredCards = page.locator('[data-featured="true"]')
    await expect(featuredCards).toHaveCount(FEATURED_PROJECT_COUNT)
    await expect(page.getByTestId("featured-badge")).toHaveCount(FEATURED_PROJECT_COUNT)
    await expect(page.getByTestId("featured-badge").first()).toHaveText(COPY.projects.selectedBadge)

    for (const index of Array.from({ length: FEATURED_PROJECT_COUNT }, (_, i) => i)) {
      const card = featuredCards.nth(index)
      await expect(card).toBeVisible()
      await expect(card.locator('a[href^="/projects/entry/"]').first()).toHaveAttribute(
        "href",
        /^\/projects\/entry\/[^/]+$/
      )
    }

    // And — the whole archive stays reachable alongside the featured markers.
    expect(await page.getByTestId("project-teaser").count()).toBeGreaterThanOrEqual(MIN_PROJECT_COUNT)
  })
})
