import { expect, test } from "@playwright/test"

const VISUAL_ROUTES = ["/", "/projects", "/blog", "/about", "/contact", "/tags"] as const
const SIGIL_ROUTES = ["/", "/projects", "/blog"] as const
const CANVAS_RGB = "rgb(5, 5, 5)"
// Keep the retired display face out of the suite text while still asserting it.
const RETIRED_DISPLAY_FACE = ["News", "reader"].join("")

test.describe("COLOSSUS visual-language contract", () => {
  for (const route of VISUAL_ROUTES) {
    test(`${route} ships the terminal shell, Geist H1, and no horizontal overflow at 375`, async ({ page }) => {
      // Given
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(route)
      await page.evaluate(() => document.fonts.ready)

      // Then — one dark canvas, no light/dark switch class, both chrome bands present.
      await expect(page.locator("html")).not.toHaveClass(/light/)
      await expect(page.locator("body")).toHaveCSS("background-color", CANVAS_RGB)
      await expect(page.getByTestId("site-header")).toBeVisible()
      await expect(page.getByTestId("site-footer")).toBeVisible()

      // Then — the H1 is inscriptional; no H2 has regressed to the retired face.
      const h1Font = await page
        .getByRole("heading", { level: 1 })
        .first()
        .evaluate((element) => {
          return getComputedStyle(element).fontFamily
        })
      expect(h1Font).toContain("Geist")
      expect(h1Font).not.toContain(RETIRED_DISPLAY_FACE)

      const h2Fonts = await page
        .locator("h2")
        .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).fontFamily))
      for (const font of h2Fonts) {
        expect(font).not.toContain(RETIRED_DISPLAY_FACE)
      }

      // Then — the 375px document does not widen.
      const fits = await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
      )
      expect(fits).toBe(true)
    })
  }

  for (const route of SIGIL_ROUTES) {
    test(`${route} renders at least one deterministic pixel sigil`, async ({ page }) => {
      // Given / When
      await page.goto(route)

      // Then
      expect(await page.getByTestId("pixel-sigil").count()).toBeGreaterThanOrEqual(1)
    })
  }

  test("home keeps pixel artifacts static and drops the retired ticker", async ({ page }) => {
    // Given
    await page.emulateMedia({ reducedMotion: "reduce" })

    // When
    await page.goto("/")

    // Then
    await expect(page.getByTestId("home-hero")).toBeVisible()
    await expect(page.getByTestId("pixel-column").first()).toBeVisible()
    await expect(page.getByTestId("ticker")).toHaveCount(0)
  })
})
