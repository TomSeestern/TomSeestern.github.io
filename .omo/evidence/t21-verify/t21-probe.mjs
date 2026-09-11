import { chromium } from "@playwright/test"

const BASE = "http://127.0.0.1:3031"
const out = {}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
page.setDefaultTimeout(60_000)

// Header disclosure (mobile)
await page.goto(`${BASE}/`, { waitUntil: "load" })
await page.waitForLoadState("networkidle")
const toggle = page.getByRole("button", { name: /menu/i })
await toggle.waitFor({ state: "visible" })
out.header = {
  initialAriaExpanded: await toggle.getAttribute("aria-expanded"),
  ariaControls: await toggle.getAttribute("aria-controls"),
  navHiddenBeforeOpen: await page.locator("#site-nav").isHidden(),
}
await toggle.click()
out.header.afterOpenAriaExpanded = await toggle.getAttribute("aria-expanded")
out.header.navVisibleAfterOpen = await page.locator("#site-nav").isVisible()
await toggle.click()
out.header.afterCloseAriaExpanded = await toggle.getAttribute("aria-expanded")

// Breadcrumb (detail route)
await page.goto(`${BASE}/blog/entry/2019-ebeltoft-cheesecake-recipe`, { waitUntil: "load" })
await page.waitForLoadState("networkidle")
const bc = page.getByRole("navigation", { name: "Breadcrumb" })
await bc.waitFor({ state: "visible" })
const lastCrumb = bc.locator("ol > li").last()
out.breadcrumb = {
  landmarkVisible: await bc.isVisible(),
  orderedListItems: await bc.locator("ol > li").count(),
  currentAriaCurrent: await lastCrumb.locator('[aria-current="page"]').getAttribute("aria-current"),
  currentText: (await lastCrumb.textContent())?.trim(),
  currentIsLink: (await lastCrumb.locator("a").count()) > 0,
}

// Alert (success role=status)
await page.goto(`${BASE}/contact`, { waitUntil: "load" })
await page.waitForLoadState("networkidle")
await page.fill('input[name="name"]', "Manual QA")
await page.fill('input[name="email"]', "qa@example.com")
await page.fill('textarea[name="message"]', "T21 manual QA")
await page.click('button[type="submit"]')
await page.waitForTimeout(1500)
const status = page.getByRole("status")
const failAlert = page.getByRole("alert")
out.alert = {
  statusCount: await status.count(),
  statusRole: (await status.count()) ? await status.getAttribute("role") : null,
  statusText: (await status.count()) ? (await status.textContent())?.replace(/\s+/g, " ").trim() : null,
  dismissButtonVisible: (await status.count()) ? await status.getByRole("button", { name: "Dismiss" }).isVisible() : false,
  failureAlertCount: await failAlert.count(),
  failureAlertText: (await failAlert.count()) ? (await failAlert.textContent())?.replace(/\s+/g, " ").trim() : null,
}

await browser.close()
console.log(JSON.stringify(out, null, 2))
