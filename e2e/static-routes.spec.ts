import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { COPY } from "./fixtures/expectations"

const missingRoute = "/__e2e_missing_static_route__"
const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL6zAAAAABJRU5ErkJggg==",
  "base64"
)

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

    // Then
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(COPY.home.h1)
    await expect(page.getByRole("heading", { level: 2, name: COPY.home.featuredH2 })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: COPY.home.recentBlogH2 })).toBeVisible()
    await expect(page.getByAltText(COPY.home.logoAlt)).toBeVisible()
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("about page renders its section hierarchy and decorative image semantics", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)

    // When
    await interceptUnavailablePlaceholderImage(page)
    await page.goto("/about")

    // Then
    await expect(page.getByRole("heading", { level: 1, name: COPY.about.h1 })).toBeVisible()
    await expect(page.getByRole("heading", { level: 2, name: COPY.about.formalPositionsH2 })).toBeVisible()
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
    await page.getByLabel("Your Name").fill("E2E Tester")
    await page.getByLabel("Your Email").fill("e2e@example.test")
    await page.getByLabel("Your Message").fill("This message must never reach Resend.")
    await page.getByRole("button", { name: COPY.contact.submitButton }).click()

    // Then
    await expect(page.getByRole("heading", { level: 1, name: COPY.contact.h1 })).toBeVisible()
    await expect(page.getByText(COPY.contact.successMessage)).toBeVisible()
    expect(resendRequests).toEqual([])
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors)
  })

  test("missing route presents Next.js 404 page", async ({ page }) => {
    // Given
    const consoleErrors = collectBrowserConsoleErrors(page)

    // When
    const response = await page.goto(missingRoute)

    // Then
    expect(response?.status()).toBe(404)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(COPY.notFound.h1)
    expectNoUnexpectedBrowserConsoleErrors(consoleErrors, [
      "Failed to load resource: the server responded with a status of 404 (Not Found)",
    ])
  })
})
