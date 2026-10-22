/**
 * Known accessibility violations — must stay empty.
 *
 * The COLOSSUS restyle resolved the previous contrast debt and the single dark
 * mode has no alternate-scheme entries. The axe spec fails on any unlisted
 * serious/critical violation and on stale entries, so this file remains the
 * explicit contract that the public routes are clean. Do not add an entry
 * without a linked owning task; fix the regression instead.
 */
export type A11yScheme = "dark"

export type KnownViolation = {
  readonly route: string
  readonly scheme: A11yScheme
  readonly rule: string
  readonly nodeCount: number
}

export const KNOWN_VIOLATIONS: readonly KnownViolation[] = []
