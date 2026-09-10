/**
 * Known accessibility violations — TEMPORARY ALLOWLIST, MUST SHRINK TO EMPTY.
 *
 * Every entry is a real axe `serious` / `critical` violation that exists in the
 * current UI and is owned by a later todo in the 2026 refresh plan. The axe spec
 * fails on any violation that is NOT listed here and also fails when a listed
 * violation no longer occurs (stale entry), so this list self-cleans and cannot
 * silently absorb a regression. Add a new entry only with a linked owning todo;
 * fix the regression instead.
 *
 * MUST be empty by Wave 6 (final gate F5). Do not ship this file non-empty.
 *
 * Seed source: `.omo/notepads/2026-refresh-restyle/baseline.md` §3 (axe baseline,
 * axe-core 4.10.3, captured 2026-09-10). Every current entry is `color-contrast`:
 *   home dark ×9, blog dark ×6, projects dark ×21, about light ×2.
 */
export type A11yScheme = "light" | "dark"

export type KnownViolation = {
  readonly route: string
  readonly scheme: A11yScheme
  readonly rule: string
  readonly nodeCount: number
}

export const KNOWN_VIOLATIONS: readonly KnownViolation[] = [
  { route: "/", scheme: "dark", rule: "color-contrast", nodeCount: 9 },
  { route: "/blog", scheme: "dark", rule: "color-contrast", nodeCount: 6 },
  { route: "/projects", scheme: "dark", rule: "color-contrast", nodeCount: 21 },
  { route: "/about", scheme: "light", rule: "color-contrast", nodeCount: 2 },
]
