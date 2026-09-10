import type { Page } from "@playwright/test"

import type { A11yScheme } from "./a11y-known-violations"

/**
 * Wait until the inline theme script has applied the expected scheme to
 * `<html class="dark">`. Under parallel load `next dev` can compile on demand,
 * so wait explicitly instead of racing the default assertion timeout.
 */
export async function waitForScheme(page: Page, scheme: A11yScheme): Promise<void> {
  await page.waitForFunction(
    (expectDark) => document.documentElement.classList.contains("dark") === expectDark,
    scheme === "dark",
    { timeout: 30_000 }
  )
}
