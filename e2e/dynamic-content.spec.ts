import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const expectedBlogPosts = [
  {
    title: "Rebuilding My Portfolio Site to Peak Grade",
    href: "/blog/entry/2026-peak-website",
  },
  {
    title: "Transforming my Homelab with Advanced Automation - The 3rd Iteration Journey",
    href: "/blog/entry/2024-homelab-v2-transforming-homelab-with-advanced-automation",
  },
  {
    title: "The Evolution of My Homelab Journey - The Second Iteration",
    href: "/blog/entry/2020-homelab-v2-the-evolution-of-my-homelab-journey-second-edition",
  },
  {
    title: "Memorable Ebeltoft Cheesecake – A Sweet Souvenir",
    href: "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  },
] as const

async function expectNoBrowserErrors(page: Page, runJourney: () => Promise<void>): Promise<void> {
  const browserErrors: string[] = []
  const hydrationMessages: string[] = []
  page.on("console", (message) => {
    const text = message.text()
    if (message.type() === "error") {
      browserErrors.push(text)
    }
    if (/hydration|did not match/i.test(text)) {
      hydrationMessages.push(text)
    }
  })
  page.on("pageerror", (error) => {
    browserErrors.push(error.message)
  })

  await runJourney()

  expect(browserErrors).toEqual([])
  expect(hydrationMessages).toEqual([])
}

test("blog listing discovers a detail route and breadcrumb returns to blog", async ({ page }) => {
  await expectNoBrowserErrors(page, async () => {
    // Given
    await page.goto("/blog")
    const postLinks = page.locator('h3 a[href^="/blog/entry/"]')

    // Then
    await expect(postLinks).toHaveCount(expectedBlogPosts.length)
    for (const post of expectedBlogPosts) {
      const postLink = page.locator(`h3 a[href="${post.href}"]`)
      await expect(postLink).toHaveText(post.title)
    }
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
