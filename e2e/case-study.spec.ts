import { expect, test } from "@playwright/test"

const LEGACY_PROJECT_PATH = "/projects/entry/2020-soudest-backend-nodejs"

test("legacy project entry renders no case-study containers", async ({ page }) => {
  // Given a real project entry whose frontmatter has no case-study fields
  await page.goto(LEGACY_PROJECT_PATH)

  // Then the article still renders the original heading and body
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.locator("article.prose")).not.toBeEmpty()

  // And the additive template adds no empty hero or meta containers
  await expect(page.getByTestId("case-study-hero")).toHaveCount(0)
  await expect(page.getByTestId("case-study-meta")).toHaveCount(0)
})
