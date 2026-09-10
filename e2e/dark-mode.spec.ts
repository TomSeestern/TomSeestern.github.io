import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import type { A11yScheme } from "./fixtures/a11y-known-violations"
import { freezeAnimations, scanSeriousViolations, waitForStableRender } from "./fixtures/axe"
import { waitForScheme } from "./fixtures/theme"

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
  const lightSurface = "rgb(255, 255, 255)"
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

/**
 * Colour schemes under contrast audit. Kept in sync with `SCHEMES` in
 * `e2e/a11y.spec.ts`; T07 (single light mode) reduces this to `["light"]`.
 */
const CONTRAST_SCHEMES = ["light", "dark"] as const satisfies readonly A11yScheme[]

/**
 * Routes with no known contrast debt in either scheme. The full allowlist
 * (with its currently-debt routes: `/` dark, `/blog` dark, `/projects` dark,
 * `/about` light) is owned by `e2e/a11y.spec.ts` — this spec only adds a
 * contrast-only gate on the clean routes so a theme regression is caught per
 * scheme without duplicating the allowlist machinery.
 */
const CONTRAST_ROUTES = [
  "/contact",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/projects/entry/2020-soudest-backend-nodejs",
] as const

test.describe("contrast per scheme (axe color-contrast)", () => {
  for (const scheme of CONTRAST_SCHEMES) {
    for (const route of CONTRAST_ROUTES) {
      test(`${scheme} ${route} has no serious or critical contrast violations`, async ({ page }) => {
        test.setTimeout(90_000)

        // Given — freeze the marquee and set the scheme before first paint.
        await freezeAnimations(page)
        await page.addInitScript((value: string) => {
          window.localStorage.setItem("flowbite-theme-mode", value)
        }, scheme)

        // When
        await page.goto(route)
        await waitForScheme(page, scheme)
        await waitForStableRender(page)
        const violations = await scanSeriousViolations(page, ["color-contrast"])

        // Then — exact match: a contrast-only scan on a clean route must be empty.
        expect(violations, `contrast violations in ${scheme} scheme on ${route}`).toEqual([])
      })
    }
  }
})
