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
}

const viewportCases = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 960 },
] as const satisfies readonly ViewportCase[]

async function discoverDetailPath(page: Page, listingPath: string, selector: string): Promise<string> {
  await page.goto(listingPath)
  const detailLink = page.locator(selector).first()
  await expect(detailLink).toBeVisible()
  const href = await detailLink.getAttribute("href")
  expect(href).toMatch(/^\/(blog|projects)\/entry\/[^/]+$/)
  return href ?? ""
}

const responsiveRoutes: readonly ResponsiveRoute[] = [
  { name: "home", resolvePath: async () => "/", gridSelector: '[data-testid="home-featured-grid"]' },
  { name: "about", resolvePath: async () => "/about" },
  { name: "blog", resolvePath: async () => "/blog", gridSelector: '[data-testid="blog-grid"]' },
  {
    name: "blog detail",
    resolvePath: async (page) => discoverDetailPath(page, "/blog", 'h3 a[href^="/blog/entry/"]'),
  },
  { name: "projects", resolvePath: async () => "/projects", gridSelector: '[data-testid="featured-projects-grid"]' },
  {
    name: "project detail",
    resolvePath: async (page) => discoverDetailPath(page, "/projects", 'a[href^="/projects/entry/"]'),
  },
  { name: "contact", resolvePath: async () => "/contact" },
  { name: "datenschutz", resolvePath: async () => "/datenschutz" },
  { name: "impressum", resolvePath: async () => "/impressum" },
]

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

test("mobile header renders navigation and hamburger toggle", async ({ page }) => {
  // Given
  const browserErrors = collectBrowserErrors(page)
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/")

  // Then
  await expect(page.getByRole("navigation")).toBeVisible()
  await expect(page.getByRole("button", { name: /menu/i })).toBeVisible()
  await expect(page.getByTestId("site-header").getByRole("link", { name: /Tom Segbers/ })).toBeVisible()
  await expectDocumentFitsViewport(page)
  expect(browserErrors).toEqual([])
})

/** WCAG 2.2 SC 2.5.5 (AAA) / project rule R15.3 target for primary controls. */
const MIN_PRIMARY_TOUCH_TARGET_PX = 44

/** WCAG 2.2 SC 2.5.8 (AA) target-size floor for the remaining controls. */
const MIN_WCAG_TARGET_SIZE_PX = 24

/** Mobile routes covered by the generic target-size audit. */
const TOUCH_TARGET_AUDIT_ROUTES = ["/", "/blog", "/contact"] as const

type TouchTargetViolation = {
  readonly tag: string
  readonly label: string
  readonly width: number
  readonly height: number
}

async function expectTouchTargetAtLeast(page: Page, selector: string, minimumPx: number, label: string): Promise<void> {
  const box = await page.locator(selector).first().boundingBox()
  expect(box, `${label} must be visible`).not.toBeNull()
  if (!box) {
    return
  }
  expect(box.width, `${label} width`).toBeGreaterThanOrEqual(minimumPx)
  expect(box.height, `${label} height`).toBeGreaterThanOrEqual(minimumPx)
}

async function collectUndersizedTargets(page: Page, minimumPx: number): Promise<readonly TouchTargetViolation[]> {
  return page.evaluate((minPx) => {
    const interactiveSelector = 'a[href], button, input, textarea, select, [role="button"]'
    const elements = Array.from(document.querySelectorAll<HTMLElement>(interactiveSelector))
    const violations: Array<{ tag: string; label: string; width: number; height: number }> = []

    for (const element of elements) {
      const style = getComputedStyle(element)
      if (style.display === "none" || style.visibility === "hidden") {
        continue
      }

      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        continue
      }

      // Skip link is visually hidden until focused — a keyboard-only control.
      if (element.matches('a[href="#main-content"]')) {
        continue
      }

      // Inline links inside prose are exempt from target-size rules (WCAG 2.5.5).
      if (element.tagName === "A" && element.closest("p")) {
        continue
      }

      if (rect.width < minPx || rect.height < minPx) {
        violations.push({
          tag: element.tagName.toLowerCase(),
          label: (element.getAttribute("aria-label") ?? element.textContent ?? "").trim().slice(0, 40),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        })
      }
    }

    return violations
  }, minimumPx)
}

test.describe("touch targets", () => {
  test("contact form primary controls meet the 44px touch target", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/contact")

    await expectTouchTargetAtLeast(page, 'button[type="submit"]', MIN_PRIMARY_TOUCH_TARGET_PX, "contact submit button")
    await expectTouchTargetAtLeast(
      page,
      'textarea[name="message"]',
      MIN_PRIMARY_TOUCH_TARGET_PX,
      "contact message field"
    )
  })

  for (const route of TOUCH_TARGET_AUDIT_ROUTES) {
    test(`${route} interactive controls meet the WCAG 2.2 target-size floor`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(route)

      const violations = await collectUndersizedTargets(page, MIN_WCAG_TARGET_SIZE_PX)
      expect(violations, `undersized targets on ${route}: ${JSON.stringify(violations)}`).toEqual([])
    })
  }
})
