import { expect, test } from "@playwright/test"

/**
 * Observable behavior of the detail-route breadcrumb (D11 / T21).
 *
 * Locks the contract the in-tree replacement must preserve: a `navigation`
 * landmark named "Breadcrumb", an ordered list, the section crumb as a link,
 * and the current page as the last, non-link crumb whose text matches the page
 * heading. The `aria-current` assertion is the one improvement the in-tree
 * primitive adds over the Flowbite one.
 */

const DETAIL_ROUTES = [
  { route: "/blog/entry/2019-ebeltoft-cheesecake-recipe", parent: "Blog" },
  { route: "/projects/entry/2020-soudest-backend-nodejs", parent: "Projects" },
] as const

for (const { route, parent } of DETAIL_ROUTES) {
  test(`breadcrumb on ${route} exposes ordered-list semantics and the current page`, async ({ page }) => {
    // Given
    await page.goto(route)

    // When
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" })

    // Then — a labelled landmark wraps a three-item ordered list.
    await expect(breadcrumb).toBeVisible()
    const items = breadcrumb.locator("ol > li")
    await expect(items).toHaveCount(3)

    // Then — the trail links back through the section.
    await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible()
    await expect(breadcrumb.getByRole("link", { name: parent })).toBeVisible()

    // Then — the last crumb is the current page, not a link, and mirrors the H1.
    const currentCrumb = items.nth(2)
    await expect(currentCrumb.locator("a")).toHaveCount(0)
    await expect(currentCrumb.locator('[aria-current="page"]')).toHaveCount(1)
    const headingText = (await page.getByRole("heading", { level: 1 }).textContent())?.trim()
    const crumbText = (await currentCrumb.textContent())?.trim()
    expect(crumbText).toBe(headingText)
  })
}
