import { expect, test } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

/**
 * Drive the real pointer into the trigger from outside it. Radix opens on
 * `pointermove`, so landing directly via `locator.hover()` fires only
 * `pointerenter`; entering from outside guarantees a pointermove over the
 * focusable span.
 */
async function hoverFromOutside(page: Page, trigger: Locator): Promise<void> {
  const box = await trigger.boundingBox()
  if (!box) throw new Error("tooltip trigger has no bounding box")
  await page.mouse.move(Math.max(1, box.x - 20), Math.max(1, box.y - 20))
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 })
}

test.describe("tooltip (route-local provider)", () => {
  test("technology tooltip opens on hover and dismisses on Escape on a project dossier", async ({ page }) => {
    await page.goto("/projects/entry/2021-paymenow-leveraging-tech-to-secure-payments-for-ebay-sellers")

    const trigger = page.locator('[data-testid="tech-tooltip-trigger"][data-technology="React"]')
    await trigger.scrollIntoViewIfNeeded()
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute("role", "button")
    await expect(trigger).toHaveAttribute("aria-label", "React technology details")
    await expect(trigger).toHaveAttribute("data-state", "closed")

    // A cold dev server hydrates after the first paint, and a pointermove fired
    // before hydration completes is dropped by React's event delegation. Re-drive
    // the real gesture until the app's observable state proves it was handled.
    await expect(async () => {
      await hoverFromOutside(page, trigger)
      await expect(trigger).toHaveAttribute("data-state", /open/, { timeout: 1000 })
    }).toPass({ timeout: 15_000, intervals: [250, 500, 1000] })

    const tooltip = page.getByRole("tooltip")
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toContainText("React: technology used on this case file.")

    await page.keyboard.press("Escape")
    await expect(tooltip).toBeHidden()
    await expect(trigger).toHaveAttribute("data-state", "closed")
  })
})
