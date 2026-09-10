import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

function collectBrowserConsoleErrors(page: Page): readonly string[] {
  const consoleErrors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })

  return consoleErrors
}

function expectNoUnexpectedBrowserConsoleErrors(consoleErrors: readonly string[]): void {
  expect(consoleErrors).toEqual([])
}

test.describe("interactive accessibility", () => {
  test("skip link becomes visible on Tab and moves focus to main content on Enter", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")

    // When: Tab to focus the skip link (first focusable element after page load)
    await page.keyboard.press("Tab")
    const skipLink = page.locator('a[href="#main-content"]')

    // Then: skip link visible and focused
    await expect(skipLink).toBeVisible()
    await expect(skipLink).toBeFocused()

    // When: Enter activates the skip link
    await page.keyboard.press("Enter")

    // Then: focus moves to #main-content
    await expect(page.locator("#main-content")).toBeFocused()
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("keyboard focus gives the custom contact CTA a visible indicator", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")
    const contactCallToAction = page.locator("nav").getByRole("link", { name: "Contact", exact: true }).first()

    // When
    await contactCallToAction.focus()

    // Then
    await expect(contactCallToAction).toBeFocused()
    await expect(contactCallToAction).toHaveCSS("outline-style", "solid")
    await expect(contactCallToAction).toHaveCSS("box-shadow", /rgb\(147, 197, 253\)/)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("reduced motion stops marquee animation while retaining project navigation", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.emulateMedia({ reducedMotion: "reduce" })

    // When
    await page.goto("/")
    const marquee = page.locator(".animate-marquee").first()

    // Then
    await expect(marquee).toBeVisible()
    await expect(marquee).toHaveCSS("animation-name", "none")
    await page.getByRole("link", { name: "View all Projects" }).click()
    await expect(page).toHaveURL(/\/projects$/)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("home primary CTA exposes a visible keyboard focus indicator", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")
    const primaryCta = page.locator('a:has-text("Learn More")').first()

    // When
    await primaryCta.focus()

    // Then
    await expect(primaryCta).toBeFocused()
    await expect(primaryCta).toHaveCSS("outline-style", "solid")
    await expect(primaryCta).toHaveCSS("box-shadow", /rgb\(147, 197, 253\)/)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("keyboard activation follows a home CTA without a pointer", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")
    const projectsCta = page.getByRole("link", { name: "View all Projects" })

    // When
    await projectsCta.focus()
    await page.keyboard.press("Enter")

    // Then
    await expect(page).toHaveURL(/\/projects$/)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("reduced motion freezes both marquee tracks while cards stay visible", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.emulateMedia({ reducedMotion: "reduce" })

    // When
    await page.goto("/")
    const tracks = page.locator(".animate-marquee, .animate-marquee2")

    // Then
    await expect(tracks).toHaveCount(2)
    for (const index of [0, 1]) {
      await expect(tracks.nth(index)).toHaveCSS("animation-name", "none")
    }
    await expect(page.locator('.animate-marquee a[href^="/projects/entry/"]').first()).toBeVisible()
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })
})
