import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

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
    expect(await postLinks.count()).toBeGreaterThanOrEqual(1)
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
    await expect(page.locator('h3 a[href^="/blog/entry/"]').first()).toBeVisible()
  })
})

test("project listing discovers a detail route and breadcrumb returns to projects", async ({ page }) => {
  await expectNoBrowserErrors(page, async () => {
    // Given
    await page.goto("/projects")
    // <a> wraps <h3> in ProjectTeaser, not nested inside — use a[href^=...]
    const projectLinks = page.locator('a[href^="/projects/entry/"]')

    // Then
    await expect(projectLinks.first()).toBeVisible()
    expect(await projectLinks.count()).toBeGreaterThanOrEqual(21)
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
    expect(await projectLinks.count()).toBeGreaterThanOrEqual(21)
  })
})
