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
 * axe-core 4.10.3, captured 2026-09-10). D13 (T07) removed dark mode, so the
 * former dark entries (home ×9, blog ×6, projects ×21) no longer exist.
 *
 * T13 (warm parchment palette) resolved the two former `/about` light entries —
 * the page is now clean. Two new entries appeared: on the blog/project detail
 * pages the Flowbite `BreadcrumbItem` current-page span carries the library
 * default `text-gray-500` (#6b7280), which passes on white but is 4.22:1 on the
 * darker parchment surface `#F5EFE1` (below the 4.5:1 text minimum). That class
 * is Flowbite component theming, which T15 owns (T13 must not touch component
 * files); T15 must recolor the breadcrumb to a warm token and delete these rows.
 */
export type A11yScheme = "light"

export type KnownViolation = {
  readonly route: string
  readonly scheme: A11yScheme
  readonly rule: string
  readonly nodeCount: number
}

export const KNOWN_VIOLATIONS: readonly KnownViolation[] = [
  {
    route: "/blog/entry/2019-ebeltoft-cheesecake-recipe",
    scheme: "light",
    rule: "color-contrast",
    nodeCount: 1,
  },
  {
    route: "/projects/entry/2020-soudest-backend-nodejs",
    scheme: "light",
    rule: "color-contrast",
    nodeCount: 1,
  },
]
