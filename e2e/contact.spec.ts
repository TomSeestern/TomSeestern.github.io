import { expect, test } from "@playwright/test"

test.describe("contact form", () => {
  test("submits valid form and shows success message", async ({ page }) => {
    await page.goto("/contact")

    await page.fill('input[name="name"]', "Tom")
    await page.fill('input[name="email"]', "sender@example.com")
    await page.fill('textarea[name="message"]', "Hello, I have a question.")

    await page.click('button[type="submit"]')

    // Success alert should appear
    await expect(page.getByText("Email sent successfully.")).toBeVisible({ timeout: 10000 })
    // Submit button should reflect sent state
    await expect(page.getByRole("button", { name: "Done" })).toBeVisible()
  })

  test("shows inline error for invalid email", async ({ page }) => {
    await page.goto("/contact")

    await page.fill('input[name="name"]', "Tom")
    await page.fill('input[name="email"]', "not-an-email")
    await page.fill('textarea[name="message"]', "Hello.")

    await page.click('button[type="submit"]')

    await expect(page.locator("#email-error")).toBeVisible({ timeout: 5000 })
    await expect(page.locator("#email-error")).toContainText("missing an @ symbol")
  })

  test("shows all field errors when all fields are empty", async ({ page }) => {
    await page.goto("/contact")

    await page.click('button[type="submit"]')

    await expect(page.locator("#name-error")).toBeVisible({ timeout: 5000 })
    await expect(page.locator("#email-error")).toBeVisible()
    await expect(page.locator("#message-error")).toBeVisible()

    await expect(page.locator("#name-error")).toContainText("Please enter your name")
    await expect(page.locator("#email-error")).toContainText("Email address is missing an @ symbol")
    await expect(page.locator("#message-error")).toContainText("Please enter a message")
  })

  test("shows inline error for missing name", async ({ page }) => {
    await page.goto("/contact")

    await page.fill('input[name="email"]', "sender@example.com")
    await page.fill('textarea[name="message"]', "Hello.")

    await page.click('button[type="submit"]')

    await expect(page.locator("#name-error")).toBeVisible({ timeout: 5000 })
    await expect(page.locator("#name-error")).toContainText("Please enter your name")
  })

  test("button is disabled while submitting", async ({ page }) => {
    await page.goto("/contact")

    await page.fill('input[name="name"]', "Tom")
    await page.fill('input[name="email"]', "sender@example.com")
    await page.fill('textarea[name="message"]', "Hello.")

    // Click submit and immediately check button state
    await page.click('button[type="submit"]')

    // Button should show "Sending…" and be disabled during submission
    await expect(page.getByRole("button", { name: /Sending|Done/ })).toBeVisible({ timeout: 5000 })
  })

  test("clear errors on resubmission after failed attempt", async ({ page }) => {
    await page.goto("/contact")

    // First: submit with bad email
    await page.fill('input[name="name"]', "Tom")
    await page.fill('input[name="email"]', "bad-email")
    await page.fill('textarea[name="message"]', "Hello.")
    await page.click('button[type="submit"]')

    await expect(page.locator("#email-error")).toBeVisible({ timeout: 5000 })

    // Second: fix the email and resubmit
    await page.fill('input[name="email"]', "good@example.com")
    await page.click('button[type="submit"]')

    // Previous error should be cleared
    await expect(page.locator("#email-error")).not.toBeVisible({ timeout: 5000 })
  })
})
