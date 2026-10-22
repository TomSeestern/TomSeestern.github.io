import { expect, test } from "@playwright/test"

/**
 * Regression guard for the in-page CTAs. Both pages used to link at
 * `#selected-work` while no element owned that id, so the primary hero action
 * was a no-op. The check asserts the target exists, the hash updates, and the
 * section's top rule lands below the sticky header.
 */
async function expectAnchorClearsHeader(page: import("@playwright/test").Page, hash: string) {
  const position = await page.evaluate((anchor) => {
    const target = document.querySelector(anchor)
    const header = document.querySelector("header")
    if (!target) return null
    return {
      top: target.getBoundingClientRect().top,
      headerHeight: header?.getBoundingClientRect().height ?? 0,
    }
  }, hash)

  expect(position).not.toBeNull()
  expect(page.url()).toContain(hash)
  expect(position?.top ?? 0).toBeGreaterThanOrEqual(position?.headerHeight ?? 0)
}

test("home hero CTA lands the selected work section below the sticky header", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "View selected work" }).click()
  await expectAnchorClearsHeader(page, "#selected-work")
})

test("projects hero CTA lands the selected section and archive below the sticky header", async ({ page }) => {
  await page.goto("/projects")

  await page.getByRole("link", { name: "Selected work", exact: true }).click()
  await expectAnchorClearsHeader(page, "#selected-work")

  await page.getByRole("link", { name: "Jump to the archive" }).click()
  await expectAnchorClearsHeader(page, "#archive")
})
