import { expect, test } from "@playwright/test"

/**
 * Observable behavior of the site header navigation (D11 / T21).
 *
 * These assertions lock the contract the in-tree replacement must preserve: the
 * mobile toggle opens and closes the menu, is keyboard-operable, and the
 * desktop layout shows the navigation while hiding the toggle. The accessible
 * names ("Open main menu", "Tom Segbers", "About"…) are the same names the
 * Flowbite `Navbar` primitives exposed.
 */

test.describe("site header navigation", () => {
  test("mobile menu toggle opens and closes the navigation", async ({ page }) => {
    // Given
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")

    const toggle = page.getByRole("button", { name: /menu/i })
    const aboutLink = page.locator("nav").getByRole("link", { name: "About", exact: true })

    // Then — the menu starts collapsed on mobile.
    await expect(toggle).toBeVisible()
    await expect(aboutLink).toBeHidden()

    // When — the toggle is activated.
    await toggle.click()

    // Then — the menu opens.
    await expect(aboutLink).toBeVisible()

    // When — the toggle is activated again.
    await toggle.click()

    // Then — the menu closes.
    await expect(aboutLink).toBeHidden()
  })

  test("mobile menu toggle is operable with Enter and Space", async ({ page }) => {
    // Given
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")

    const toggle = page.getByRole("button", { name: /menu/i })
    const aboutLink = page.locator("nav").getByRole("link", { name: "About", exact: true })

    // When — Enter opens the menu.
    await toggle.focus()
    await page.keyboard.press("Enter")

    // Then
    await expect(aboutLink).toBeVisible()

    // When — Space closes it again.
    await page.keyboard.press("Space")

    // Then
    await expect(aboutLink).toBeHidden()
  })

  test("mobile menu toggle exposes its expanded state and controls the navigation", async ({ page }) => {
    // Given
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")

    const toggle = page.getByRole("button", { name: /menu/i })
    const navList = page.locator("#site-nav")

    // Then — the disclosure relationship is explicit and starts collapsed.
    await expect(toggle).toHaveAttribute("aria-controls", "site-nav")
    await expect(toggle).toHaveAttribute("aria-expanded", "false")
    await expect(navList).toBeHidden()

    // When
    await toggle.click()

    // Then
    await expect(toggle).toHaveAttribute("aria-expanded", "true")
    await expect(navList).toBeVisible()
  })

  test("desktop shows the navigation and hides the mobile toggle", async ({ page }) => {
    // Given
    await page.setViewportSize({ width: 1280, height: 960 })
    await page.goto("/")

    // Then — navigation links are plain-visible and the toggle is not.
    await expect(page.locator("nav").getByRole("link", { name: "About", exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: /menu/i })).toBeHidden()
  })
})
