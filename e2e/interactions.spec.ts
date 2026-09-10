import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

// CTAs carry `focus-visible:ring-accent-soft-foreground-dark`, so their focus
// ring is tailwind.config.js `accent.soft-foreground-dark` (#DEA48C). General
// links/cards use `focus-visible:ring-accent-soft` (accent.soft, #BE6A50).
// Measured from the production build's computed `box-shadow` after the T13 remap.
const CTA_FOCUS_RING = /rgb\(222, 164, 140\)/
const LINK_FOCUS_RING = /rgb\(190, 106, 80\)/

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
    await expect(contactCallToAction).toHaveCSS("box-shadow", CTA_FOCUS_RING)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("home featured link exposes a visible keyboard focus indicator", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.goto("/")
    const featuredLink = page.locator('[data-testid="featured-project"]').first()

    // When
    await featuredLink.focus()

    // Then
    await expect(featuredLink).toBeFocused()
    await expect(featuredLink).toHaveCSS("box-shadow", LINK_FOCUS_RING)
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

  test("reduced motion freezes every home entrance primitive while content stays visible", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    await page.emulateMedia({ reducedMotion: "reduce" })

    // When
    await page.goto("/")
    const primitives = page.locator(".motion-rise, .motion-fade")

    // Then — the primitives are inert and their content is rendered.
    const count = await primitives.count()
    expect(count).toBeGreaterThan(0)
    for (const index of Array.from({ length: count }, (_, i) => i)) {
      await expect(primitives.nth(index)).toHaveCSS("animation-name", "none")
    }
    await expect(page.locator('[data-testid="featured-project"]').first()).toBeVisible()
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("home entrance primitives animate when motion is allowed", async ({ page }) => {
    // Given — positive control: without the reduced-motion preference the
    // primitive must actually run, so the freeze assertion above cannot pass
    // vacuously.
    await page.emulateMedia({ reducedMotion: "no-preference" })

    // When
    await page.goto("/")
    const primitive = page.locator(".motion-rise").first()

    // Then
    await expect(primitive).toHaveCSS("animation-name", "calm-rise")
  })
})
