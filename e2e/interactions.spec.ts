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
    await expect(contactCallToAction).toHaveCSS("box-shadow", /rgb\(228, 168, 177\)/)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("reduced motion keeps native project navigation available", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.emulateMedia({ reducedMotion: "reduce" })

    // When
    await page.goto("/")
    const collection = page.getByTestId("project-collection")

    // Then: at mobile width, native scroll-snap is active
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(collection).toBeVisible()
    await expect(collection).toHaveCSS("scroll-snap-type", "x mandatory")
    await page.getByRole("link", { name: "View all Projects" }).click()
    await expect(page).toHaveURL(/\/projects$/)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })
})
