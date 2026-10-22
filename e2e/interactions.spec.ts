import { expect, test } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

// COLOSSUS focus rings are 3px outlines. `focus-ring` uses ink; primary CTA
// buttons use the accent ring so it reads around the light fill.
const CTA_FOCUS_OUTLINE = "rgb(255, 92, 53)"
const LINK_FOCUS_OUTLINE = "rgb(250, 250, 250)"

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

async function expectOutline(target: Locator, color: string): Promise<void> {
  await expect(target).toBeVisible()
  await target.focus()
  await expect(target).toBeFocused()
  await expect(target).toHaveCSS("outline-style", "solid")
  await expect(target).toHaveCSS("outline-width", "3px")
  await expect(target).toHaveCSS("outline-color", color)
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

  test("keyboard focus gives the primary header CTA a visible outline", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")

    // When / Then
    await expectOutline(page.locator('header a[href="/contact"]').last(), CTA_FOCUS_OUTLINE)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("home featured link exposes a visible keyboard outline", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")

    // When / Then
    await expectOutline(page.locator('[data-testid="featured-project"]').first(), LINK_FOCUS_OUTLINE)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("keyboard activation follows a home CTA without a pointer", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")
    const projectsCta = page.getByRole("link", { name: "All case files" })

    // When
    await projectsCta.focus()
    await page.keyboard.press("Enter")

    // Then
    await expect(page).toHaveURL(/\/projects$/)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })
})
