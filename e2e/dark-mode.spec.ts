import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import type { A11yScheme } from "./fixtures/a11y-known-violations"
import { freezeAnimations, scanSeriousViolations, waitForStableRender } from "./fixtures/axe"

/**
 * Single dark mode (decision D13, revised for the terminal rebuild).
 *
 * The site ships one dark theme: no toggle, no persisted theme preference, and
 * no inline resolver. This spec asserts every public route renders the dark
 * canvas, no theme control is rendered, and the resolved mode does not depend
 * on the OS `prefers-color-scheme`. The filename is retained to avoid churn.
 */

// The single dark mode uses the COLOSSUS canvas token (`#050505`).
const darkSurface = "rgb(5, 5, 5)"

async function expectDarkSurface(page: Page, route: string): Promise<void> {
  await page.goto(route)

  // Exactly one mode: never a light class, always the dark canvas surface.
  await expect(page.locator("html")).not.toHaveClass(/light/)
  await expect(page.locator("body")).toHaveCSS("background-color", darkSurface)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
}

test("public routes render a single dark semantic surface", async ({ page }) => {
  const browserErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  // When / Then
  await expectDarkSurface(page, "/")
  await expectDarkSurface(page, "/about")
  await expectDarkSurface(page, "/blog")
  const blogDetailUrl = await page.locator('h3 a[href^="/blog/entry/"]').first().getAttribute("href")
  await expectDarkSurface(page, blogDetailUrl ?? "")
  await expectDarkSurface(page, "/projects")
  const projectDetailUrl = await page.locator('a[href^="/projects/entry/"]').first().getAttribute("href")
  await expectDarkSurface(page, projectDetailUrl ?? "")
  await expectDarkSurface(page, "/contact")

  // Then
  expect(browserErrors).toEqual([])
})

test("ships no theme toggle and resolves a single mode regardless of system preference", async ({ page }) => {
  // Given — the OS prefers light; a single-mode app must ignore it.
  await page.emulateMedia({ colorScheme: "light" })
  await page.goto("/")

  // Then — no theme control is rendered.
  await expect(page.locator('[data-testid="dark-theme-toggle"]')).toHaveCount(0)

  // Then — the one resolved mode is dark, regardless of the OS preference.
  await expect(page.locator("html")).not.toHaveClass(/light/)
  await expect(page.locator("body")).toHaveCSS("background-color", darkSurface)

  // Then — no resolver script is served and no theme preference is persisted.
  const servedHtml = await page.content()
  expect(servedHtml).not.toContain("prefers-color-scheme")
  expect(servedHtml).not.toContain("localStorage")
  expect(await page.evaluate(() => window.localStorage.length)).toBe(0)
})

/**
 * Colour schemes under contrast audit. Kept in sync with `SCHEMES` in
 * `e2e/a11y.spec.ts`; D13 now leaves a single dark mode.
 */
const CONTRAST_SCHEMES = ["dark"] as const satisfies readonly A11yScheme[]

/**
 * Routes with no known contrast debt. The full public-route scan and the
 * (currently empty) allowlist are owned by `e2e/a11y.spec.ts`; this spec
 * only adds a contrast-only gate on these clean routes so a theme
 * regression is caught without duplicating the allowlist machinery.
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

        // Given — freeze motion before first paint.
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
