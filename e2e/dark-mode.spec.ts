import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const darkSurface = "rgb(17, 24, 39)"
const darkAccentSoft = "rgb(30, 58, 138)"
const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL6zAAAAABJRU5ErkJggg==",
  "base64"
)

async function interceptUnavailablePlaceholderImage(page: Page): Promise<void> {
  await page.route(/\/_next\/image\?.*placehold\.co/, (route) =>
    route.fulfill({ body: transparentPng, contentType: "image/png" })
  )
}

async function enableDarkMode(page: Page): Promise<void> {
  await page.emulateMedia({ colorScheme: "dark" })
}

async function expectDarkSurface(page: Page, route: string): Promise<void> {
  await page.goto(route)
  await page.locator("html").evaluate((element) => element.classList.add("dark"))

  await expect(page.locator("body")).toHaveCSS("background-color", darkSurface)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
}

test("public routes retain readable semantic surfaces in dark mode", async ({ page }) => {
  // Given
  const browserErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  await enableDarkMode(page)
  await interceptUnavailablePlaceholderImage(page)

  // When
  await expectDarkSurface(page, "/")
  await expectDarkSurface(page, "/about")
  await expectDarkSurface(page, "/blog")
  await expect(page.getByText("Tutorial").first()).toHaveCSS("background-color", darkAccentSoft)
  const blogDetailUrl = await page.locator('h3 a[href^="/blog/entry/"]').first().getAttribute("href")
  await expectDarkSurface(page, blogDetailUrl ?? "")
  await expectDarkSurface(page, "/projects")
  const projectDetailUrl = await page.locator('a[href^="/projects/entry/"]').first().getAttribute("href")
  await expectDarkSurface(page, projectDetailUrl ?? "")
  await expectDarkSurface(page, "/contact")

  // Then
  const relevantErrors = browserErrors.filter((err) => !err.includes("placehold.co") && !err.includes("Image corrupt"))
  expect(relevantErrors).toEqual([])
})
