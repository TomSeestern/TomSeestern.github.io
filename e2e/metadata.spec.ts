import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

/**
 * Social-share metadata contract (T23).
 *
 * Every public route must declare a resolvable OpenGraph and Twitter image, and
 * the declared `og:image:width` / `og:image:height` must match the ACTUAL bytes
 * the route serves. A mislabelled asset (e.g. a 512×512 logo advertised as
 * 1200×630) breaks unfurled previews silently, so the dimensions are decoded
 * from the PNG IHDR rather than trusted from the meta tags.
 *
 * The assertion is deliberately shape-agnostic: it locks "declared dimensions
 * equal real dimensions" for whatever asset is wired today, then the explicit
 * 1200×630 assertion below pins the purpose-built card (T23).
 */

const ROUTES = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/projects",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/projects/entry/2020-soudest-backend-nodejs",
] as const

/** The purpose-built OG card dimensions (OpenGraph "rich card" 1.91:1). */
const OG_WIDTH = 1200
const OG_HEIGHT = 630

/** Path of the single purpose-built OG asset wired across every route. */
const OG_ASSET_PATH = "/img/og-default.png"

/** Canonical public origin used by page metadata and the sitemap. */
const PUBLIC_ORIGIN = "https://tomsegbers.de"

async function metaContent(page: Page, selector: string): Promise<string | null> {
  return page.locator(selector).first().getAttribute("content")
}

/** Dimensions decoded from the PNG IHDR chunk (width/height are the 3rd/4th u32). */
function readPngDimensions(buffer: Buffer): { width: number; height: number } {
  const signature = buffer.subarray(0, 8).toString("hex")
  expect(signature, "response body is not a PNG").toBe("89504e470d0a1a0a")
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

test.describe("social-share metadata", () => {
  for (const route of ROUTES) {
    test(`${route} declares a resolvable 1200x630 OG and Twitter image`, async ({ page }) => {
      // Given
      await page.goto(route)

      // When — read the declared share metadata.
      const ogImage = await metaContent(page, 'meta[property="og:image"]')
      const twitterImage = await metaContent(page, 'meta[name="twitter:image"]')
      const twitterCard = await metaContent(page, 'meta[name="twitter:card"]')
      const declaredWidth = Number(await metaContent(page, 'meta[property="og:image:width"]'))
      const declaredHeight = Number(await metaContent(page, 'meta[property="og:image:height"]'))

      // Then — the tags exist and point at the single purpose-built card.
      expect(ogImage, `og:image missing on ${route}`).toBeTruthy()
      expect(twitterImage, `twitter:image missing on ${route}`).toBeTruthy()
      expect(twitterCard).toBe("summary_large_image")

      const ogPath = new URL(ogImage as string, page.url()).pathname
      const twitterPath = new URL(twitterImage as string, page.url()).pathname
      expect(ogPath).toBe(OG_ASSET_PATH)
      expect(twitterPath).toBe(OG_ASSET_PATH)

      // Then — the declared dimensions are the real, decoded dimensions.
      expect({ width: declaredWidth, height: declaredHeight }).toEqual({ width: OG_WIDTH, height: OG_HEIGHT })

      const response = await page.request.get(new URL(ogPath, page.url()).toString())
      expect(response.status(), `OG asset ${ogPath} did not resolve`).toBe(200)
      const dimensions = readPngDimensions(await response.body())
      expect(dimensions).toEqual({ width: OG_WIDTH, height: OG_HEIGHT })
    })
  }

  test("canonical link and og:url stay on their route", async ({ page }) => {
    test.setTimeout(120_000)
    for (const route of ROUTES) {
      // Given
      await page.goto(route)

      // When — optional tags, so query the DOM directly instead of waiting on a locator.
      const canonical = await page.evaluate(
        () => document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null
      )
      const ogUrl = await page.evaluate(
        () => document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? null
      )

      // Then — at least one canonical signal exists and neither drifts off-route.
      expect(canonical ?? ogUrl, `no canonical signal on ${route}`).toBeTruthy()
      const routePath = new URL(route, page.url()).pathname
      if (canonical) {
        const canonicalUrl = new URL(canonical, page.url())
        expect(canonicalUrl.origin, `canonical origin drifted on ${route}`).toBe(PUBLIC_ORIGIN)
        expect(canonicalUrl.pathname, `canonical drifted on ${route}`).toBe(routePath)
      }
      if (ogUrl) {
        const ogUrlValue = new URL(ogUrl, page.url())
        expect(ogUrlValue.origin, `og:url origin drifted on ${route}`).toBe(PUBLIC_ORIGIN)
        expect(ogUrlValue.pathname, `og:url drifted on ${route}`).toBe(routePath)
      }
    }
  })
})
