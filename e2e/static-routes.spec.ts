import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

const missingRoute = "/__e2e_missing_static_route__"
const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL6zAAAAABJRU5ErkJggg==",
  "base64"
)

async function waitForMotionOpacity(page: Page): Promise<void> {
  await page.locator("main").evaluate(async (main) => {
    await new Promise<void>((resolve) => {
      const isSettled = () =>
        [...main.querySelectorAll<HTMLElement>("[style]")].every((element) => getComputedStyle(element).opacity === "1")

      if (isSettled()) {
        resolve()
        return
      }

      const observer = new MutationObserver(() => {
        if (isSettled()) {
          observer.disconnect()
          resolve()
        }
      })
      observer.observe(main, { attributes: true, attributeFilter: ["style"], subtree: true })
    })
  })
}

async function checkA11y(page: Page, routeName: string): Promise<void> {
  await expect(page.locator("main")).toHaveCSS("opacity", "1")
  await waitForMotionOpacity(page)
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations, `Accessibility violations on ${routeName}`).toEqual([])
}

function collectBrowserConsoleErrors(page: Page): readonly string[] {
  const consoleErrors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })

  return consoleErrors
}

function expectNoUnexpectedBrowserConsoleErrors(
  consoleErrors: readonly string[],
  expectedErrors: readonly string[] = []
): void {
  expect(consoleErrors.filter((error) => !expectedErrors.includes(error))).toEqual([])
}

async function interceptUnavailablePlaceholderImage(page: Page): Promise<void> {
  await page.route(/\/_next\/image\?.*placehold\.co/, (route) =>
    route.fulfill({ body: transparentPng, contentType: "image/png" })
  )
}

test.describe("static routes", () => {
  test("homepage renders hydrated primary content accessibly", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)

    // When
    await page.goto("/")
    await checkA11y(page, "homepage")

    // Then
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tom Segbers — Senior Developer")
    await expect(page.getByRole("heading", { level: 2, name: "My Recent Projects" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: "My Recent Blog Posts" })).toBeVisible()
    await expect(page.getByAltText("Tom Segbers Logo")).toBeVisible()
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("about page renders its section hierarchy and decorative image semantics", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)

    // When
    await interceptUnavailablePlaceholderImage(page)
    await page.goto("/about")
    await checkA11y(page, "about")

    // Then
    await expect(page.getByRole("heading", { level: 1, name: "About me" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: "Formal Positions:" })).toBeVisible()
    await expect(page.locator('img[alt=""]').first()).toBeVisible()
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("contact form returns test-safe success without a Resend request after hydration", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)
    const resendRequests: string[] = []
    page.on("request", (request) => {
      if (new URL(request.url()).hostname === "api.resend.com") {
        resendRequests.push(request.url())
      }
    })

    // When
    await page.goto("/contact")
    await checkA11y(page, "contact")
    await page.getByLabel("Your Name").fill("E2E Tester")
    await page.getByLabel("Your Email").fill("e2e@example.test")
    await page.getByLabel("Your Message").fill("This message must never reach Resend.")
    await page.getByRole("button", { name: "Send Message" }).click()

    // Then
    await expect(page.getByRole("heading", { level: 1, name: "Get in Touch" })).toBeVisible()
    await expect(page.getByText("Success! Email sent successfully.")).toBeVisible()
    expect(resendRequests).toEqual([])
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("missing route presents Next.js 404 page", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)

    // When
    const response = await page.goto(missingRoute)
    await checkA11y(page, "404")

    // Then
    expect(response?.status()).toBe(404)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("404")
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors, [
      "Failed to load resource: the server responded with a status of 404 (Not Found)",
    ])
  })
})
