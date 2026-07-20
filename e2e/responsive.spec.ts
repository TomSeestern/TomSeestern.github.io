import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

type ViewportCase = {
  readonly name: string
  readonly width: number
  readonly height: number
}

type ResponsiveRoute = {
  readonly name: string
  readonly resolvePath: (page: Page) => Promise<string>
  readonly gridSelector?: string
  readonly interceptPlaceholderImage?: boolean
}

const viewportCases = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 960 },
] as const satisfies readonly ViewportCase[]

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL6zAAAAABJRU5ErkJggg==",
  "base64"
)

async function interceptUnavailablePlaceholderImage(page: Page): Promise<void> {
  await page.route(/\/_next\/image\?.*placehold\.co/, (route) =>
    route.fulfill({ body: transparentPng, contentType: "image/png" })
  )
}

async function discoverDetailPath(page: Page, listingPath: string, selector: string): Promise<string> {
  await page.goto(listingPath)
  const detailLink = page.locator(selector).first()
  await expect(detailLink).toBeVisible()
  const href = await detailLink.getAttribute("href")
  expect(href).toMatch(/^\/(blog|projects)\/entry\/[^/]+$/)
  return href ?? ""
}

const responsiveRoutes = [
  { name: "home", resolvePath: async () => "/", gridSelector: "main .grid" },
  { name: "about", resolvePath: async () => "/about", interceptPlaceholderImage: true },
  { name: "blog", resolvePath: async () => "/blog", gridSelector: "main .grid" },
  {
    name: "blog detail",
    resolvePath: async (page) => discoverDetailPath(page, "/blog", 'h3 a[href^="/blog/entry/"]'),
  },
  { name: "projects", resolvePath: async () => "/projects", gridSelector: "main .grid" },
  {
    name: "project detail",
    resolvePath: async (page) => discoverDetailPath(page, "/projects", 'a[href^="/projects/entry/"]'),
  },
  { name: "contact", resolvePath: async () => "/contact" },
] as const satisfies readonly ResponsiveRoute[]

function collectBrowserErrors(page: Page): readonly string[] {
  const browserErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    browserErrors.push(error.message)
  })
  return browserErrors
}

async function expectDocumentFitsViewport(page: Page): Promise<void> {
  const geometry = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflowingElements: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => {
        const bounds = element.getBoundingClientRect()
        return bounds.right > document.documentElement.clientWidth || bounds.left < 0
      })
      .slice(0, 5)
      .map((element) => ({
        className: element.className,
        left: element.getBoundingClientRect().left,
        right: element.getBoundingClientRect().right,
        tagName: element.tagName,
      })),
  }))

  expect(geometry.scrollWidth, JSON.stringify(geometry.overflowingElements)).toBeLessThanOrEqual(geometry.clientWidth)
}

function expectGridColumnCount(page: Page, selector: string, expectedColumnCount: number): Promise<void> {
  return expect
    .poll(async () => {
      const grid = page.locator(selector).first()
      return grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)
    })
    .toBe(expectedColumnCount)
}

for (const route of responsiveRoutes) {
  for (const viewport of viewportCases) {
    test(`${route.name} remains usable at ${viewport.name}`, async ({ page }) => {
      // Given
      const browserErrors = collectBrowserErrors(page)
      if (route.interceptPlaceholderImage) {
        await interceptUnavailablePlaceholderImage(page)
      }
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      const path = await route.resolvePath(page)

      // When
      await page.goto(path)

      // Then
      await expect(page.locator("main")).toBeVisible()
      await expect(page.getByRole("heading").first()).toBeVisible()
      if (viewport.name === "mobile") {
        await expectDocumentFitsViewport(page)
        if (route.gridSelector) {
          await expectGridColumnCount(page, route.gridSelector, 1)
        }
      }
      if (viewport.name === "desktop" && route.gridSelector) {
        await expect
          .poll(async () => {
            const grid = page.locator(route.gridSelector ?? "").first()
            return grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)
          })
          .toBeGreaterThan(1)
      }
      expect(browserErrors).toEqual([])
    })
  }
}

test("mobile header exposes keyboard-operable navigation through its hamburger menu", async ({ page }) => {
  // Given
  const browserErrors = collectBrowserErrors(page)
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/")
  const navigation = page.getByRole("navigation")
  const toggle = page.getByRole("button", { name: /open main menu/i })
  const aboutLink = navigation.getByRole("link", { name: "About" })

  // When
  await toggle.focus()
  await page.keyboard.press("Enter")

  // Then
  await expect(aboutLink).toBeVisible()
  await aboutLink.focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/about$/)
  await expectDocumentFitsViewport(page)
  expect(browserErrors).toEqual([])
})
