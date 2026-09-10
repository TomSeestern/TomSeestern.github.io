import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import type { A11yScheme } from "./fixtures/a11y-known-violations"
import { freezeAnimations, scanSeriousViolations, waitForStableRender } from "./fixtures/axe"

/**
 * Single light mode (decision D13).
 *
 * The site ships one light theme: no toggle, no persisted theme preference, and
 * no inline resolver. This spec replaces the former light/dark coverage — it
 * asserts every public route renders the light surface, no theme control is
 * rendered, and the resolved mode does not depend on the OS
 * `prefers-color-scheme`. The filename is retained to avoid churn.
 */

const lightSurface = "rgb(255, 255, 255)"
const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL6zAAAAABJRU5ErkJggg==",
  "base64"
)

async function interceptUnavailablePlaceholderImage(page: Page): Promise<void> {
  await page.route(/\/_next\/image\?.*placehold\.co/, (route) =>
    route.fulfill({ body: transparentPng, contentType: "image/png" })
  )
}

async function expectLightSurface(page: Page, route: string): Promise<void> {
  await page.goto(route)

  // Exactly one mode: never the dark class, always the light surface.
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(page.locator("body")).toHaveCSS("background-color", lightSurface)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
}

test("public routes render a single light semantic surface", async ({ page }) => {
  const browserErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  await interceptUnavailablePlaceholderImage(page)

  // When / Then
  await expectLightSurface(page, "/")
  await expectLightSurface(page, "/about")
  await expectLightSurface(page, "/blog")
  const blogDetailUrl = await page.locator('h3 a[href^="/blog/entry/"]').first().getAttribute("href")
  await expectLightSurface(page, blogDetailUrl ?? "")
  await expectLightSurface(page, "/projects")
  const projectDetailUrl = await page.locator('a[href^="/projects/entry/"]').first().getAttribute("href")
  await expectLightSurface(page, projectDetailUrl ?? "")
  await expectLightSurface(page, "/contact")

  // Then
  const relevantErrors = browserErrors.filter(
    (err) =>
      !err.includes("placehold.co") && !err.includes("Image corrupt") && !err.includes("Failed to fetch RSC payload")
  )
  expect(relevantErrors).toEqual([])
})

test("ships no theme toggle and resolves a single mode regardless of system preference", async ({ page }) => {
  // Given — the OS prefers dark; a single-mode app must ignore it.
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")

  // Then — no toggle control is rendered.
  await expect(page.locator('[data-testid="dark-theme-toggle"]')).toHaveCount(0)

  // Then — the one resolved mode is light, regardless of the OS preference.
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(page.locator("body")).toHaveCSS("background-color", lightSurface)

  // Then — no resolver script is served and no theme preference is persisted.
  const servedHtml = await page.content()
  expect(servedHtml).not.toContain("prefers-color-scheme")
  expect(servedHtml).not.toContain("localStorage")
  expect(await page.evaluate(() => window.localStorage.length)).toBe(0)
})

/**
 * Colour schemes under contrast audit. Kept in sync with `SCHEMES` in
 * `e2e/a11y.spec.ts`; D13 left a single light mode.
 */
const CONTRAST_SCHEMES = ["light"] as const satisfies readonly A11yScheme[]

/**
 * Routes with no known contrast debt. The full allowlist (with its current
 * debt route `/about` light) is owned by `e2e/a11y.spec.ts` — this spec only
 * adds a contrast-only gate on the clean routes so a theme regression is caught
 * without duplicating the allowlist machinery.
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

        // Given — freeze the marquee before first paint.
        await freezeAnimations(page)

        // When
        await page.goto(route)
        await waitForStableRender(page)
        const violations = await scanSeriousViolations(page, ["color-contrast"])

        // Then — exact match: a contrast-only scan on a clean route must be empty.
        expect(violations, `contrast violations in ${scheme} scheme on ${route}`).toEqual([])
      })
    }
  }
})
