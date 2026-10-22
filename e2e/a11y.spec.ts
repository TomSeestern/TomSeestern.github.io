import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { KNOWN_VIOLATIONS } from "./fixtures/a11y-known-violations"

/**
 * Colour schemes every public route is scanned in.
 *
 * COLOSSUS ships a single dark mode, so this is the only scheme. The empty
 * allowlist lives in `e2e/fixtures/a11y-known-violations.ts`; the integrity
 * test below fails if an entry references a route/scheme this matrix no longer
 * scans.
 */
export const SCHEMES = ["dark"] as const

/** Public routes covered by the axe scan. */
export const A11Y_ROUTES = [
  "/",
  "/about",
  "/blog",
  "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  "/projects",
  "/projects/entry/2020-soudest-backend-nodejs",
  "/tags",
  "/tags/c-plus-plus",
  "/contact",
  "/impressum",
  "/datenschutz",
] as const

type Scheme = (typeof SCHEMES)[number]
type Route = (typeof A11Y_ROUTES)[number]

type AxeAnalysis = Awaited<ReturnType<AxeBuilder["analyze"]>>

type ViolationSummary = {
  readonly rule: string
  readonly nodeCount: number
}

function summarizeViolations(analysis: AxeAnalysis): readonly ViolationSummary[] {
  return analysis.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map((violation) => ({ rule: violation.id, nodeCount: violation.nodes.length }))
    .sort((a, b) => a.rule.localeCompare(b.rule))
}

function allowlistedViolations(route: Route, scheme: Scheme): readonly ViolationSummary[] {
  return KNOWN_VIOLATIONS.filter((entry) => entry.route === route && entry.scheme === scheme)
    .map((entry) => ({ rule: entry.rule, nodeCount: entry.nodeCount }))
    .sort((a, b) => a.rule.localeCompare(b.rule))
}

/**
 * Wait until fonts are loaded and a stable frame has been painted so axe reads
 * settled colours instead of a mid-hydration state.
 */
async function waitForStableRender(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  )
}

test.describe("accessibility (axe)", () => {
  test("allowlist references only scanned route/scheme combinations", () => {
    // Guards against stale allowlist entries whose route/scheme is no longer
    // scanned.
    for (const entry of KNOWN_VIOLATIONS) {
      expect(A11Y_ROUTES).toContain(entry.route)
      expect(SCHEMES).toContain(entry.scheme)
    }
  })

  for (const scheme of SCHEMES) {
    test.describe(`${scheme} scheme`, () => {
      test.beforeEach(async ({ page }) => {
        // Freeze motion so axe reads a deterministic layout.
        await page.emulateMedia({ reducedMotion: "reduce" })
      })

      for (const route of A11Y_ROUTES) {
        test(`${route} has only allowlisted serious/critical violations`, async ({ page }) => {
          test.setTimeout(90_000)

          // Given
          await page.goto(route)

          // When
          await waitForStableRender(page)
          const analysis = await new AxeBuilder({ page }).analyze()

          // Then — exact match: no unallowlisted violation, no stale entry.
          const actual = summarizeViolations(analysis)
          const expected = allowlistedViolations(route, scheme)

          expect(
            actual,
            `axe ${scheme} ${route}: unallowlisted serious/critical violations found, or ` +
              `allowlist is stale (a violation that no longer occurs must be removed)`
          ).toEqual(expected)
        })
      }
    })
  }
})
