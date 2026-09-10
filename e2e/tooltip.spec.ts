import { expect, test } from "@playwright/test"

test.describe("tooltip (single root provider)", () => {
  test("technology tooltip opens on hover and dismisses on Escape on /projects", async ({ page }) => {
    await page.goto("/projects")

    const trigger = page.locator('img[src^="/icon/"][data-state]').first()
    await trigger.scrollIntoViewIfNeeded()
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute("data-state", "closed")

    // Real pointer path into the trigger. Radix opens on pointermove, so enter
    // from outside the element rather than landing directly on it via hover().
    const box = await trigger.boundingBox()
    if (!box) throw new Error("tooltip trigger has no bounding box")
    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2
    await page.mouse.move(Math.max(1, box.x - 20), Math.max(1, box.y - 20))
    await page.mouse.move(centerX, centerY, { steps: 6 })

    const tooltip = page.getByRole("tooltip")
    await expect(tooltip).toBeVisible()
    await expect(tooltip).not.toBeEmpty()
    // delayed-open proves the hoisted provider's 200ms delay is in effect
    await expect(trigger).toHaveAttribute("data-state", "delayed-open")

    await page.keyboard.press("Escape")
    await expect(tooltip).toBeHidden()
    await expect(trigger).toHaveAttribute("data-state", "closed")
  })
})
