import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const darkSurface = "rgb(28, 25, 23)"
const darkAccentSoft = "rgb(75, 15, 24)"
const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL6zAAAAABJRU5ErkJggg==",
  "base64"
)

async function interceptUnavailablePlaceholderImage(page: Page): Promise<void> {
  await page.route(/\/_next\/image\?.*placehold\.co/, (route) =>
    route.fulfill({ body: transparentPng, contentType: "image/png" })
  )
}

async function expectDarkSurface(page: Page, route: string): Promise<void> {
  await page.goto(route)

  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(page.locator("body")).toHaveCSS("background-color", darkSurface)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
}

test("public routes retain readable semantic surfaces in dark mode", async ({ page }) => {
  // Given — set localStorage BEFORE navigation so inline script picks it up
  await page.addInitScript(() => {
    window.localStorage.setItem("flowbite-theme-mode", "dark")
  })

  const browserErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  await interceptUnavailablePlaceholderImage(page)

  // When / Then
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
  const relevantErrors = browserErrors.filter(
    (err) =>
      !err.includes("placehold.co") && !err.includes("Image corrupt") && !err.includes("Failed to fetch RSC payload")
  )
  expect(relevantErrors).toEqual([])
})

test("DarkThemeToggle toggles dark mode and persists on reload", async ({ page }) => {
  // Given — emulate dark colorScheme so inline script's matchMedia check passes
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")

  // SSR delivers <html class="… dark">, inline script keeps it (matchMedia matches)
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(page.locator("body")).toHaveCSS("background-color", darkSurface)

  // When — click the theme toggle (light mode)
  const toggle = page.locator('[data-testid="dark-theme-toggle"]')
  await toggle.click()

  // Then — dark class removed, light surface shown
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  const lightSurface = "rgb(245, 240, 230)"
  await expect(page.locator("body")).toHaveCSS("background-color", lightSurface)

  // And — localStorage persists the choice
  const storedMode = await page.evaluate(() => window.localStorage.getItem("flowbite-theme-mode"))
  expect(storedMode).toBe("light")

  // When — reload the page
  await page.reload()

  // Then — inline script reads localStorage, removes dark class again
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(page.locator("body")).toHaveCSS("background-color", lightSurface)
})
