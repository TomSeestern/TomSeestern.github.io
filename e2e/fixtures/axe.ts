import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"

/**
 * Shared axe conventions for the e2e suite (established in T04).
 *
 * `e2e/a11y.spec.ts` owns the full route × scheme allowlist scan. This module
 * exposes only the reusable primitives so other specs — currently the
 * single-mode contrast checks in `e2e/dark-mode.spec.ts` — reuse the
 * reduced-motion freeze, settled-render wait, and violation summarising instead
 * of forking that logic.
 */

/** A serious/critical axe violation flattened to a deterministic comparison row. */
export type ViolationSummary = {
  readonly rule: string
  readonly nodeCount: number
}

/**
 * Freeze animations before scanning. The home marquee uses
 * `motion-reduce:animate-none`, so a reduced-motion preference makes the layout
 * deterministic and keeps `color-contrast` node counts stable.
 */
export async function freezeAnimations(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" })
}

/** Wait until fonts are loaded and a stable frame is painted so axe reads settled colours. */
export async function waitForStableRender(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  )
}

/**
 * Run axe and return the serious/critical violations as a sorted
 * `{ rule, nodeCount }` summary. Pass `rules` to scope the scan, e.g.
 * `["color-contrast"]` for a contrast-only check.
 */
export async function scanSeriousViolations(
  page: Page,
  rules?: readonly string[]
): Promise<readonly ViolationSummary[]> {
  const builder = rules?.length ? new AxeBuilder({ page }).withRules([...rules]) : new AxeBuilder({ page })
  const analysis = await builder.analyze()

  return analysis.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map((violation) => ({ rule: violation.id, nodeCount: violation.nodes.length }))
    .sort((a, b) => a.rule.localeCompare(b.rule))
}
