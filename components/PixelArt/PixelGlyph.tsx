import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export type PixelGlyphName = "systems" | "interfaces" | "delivery" | "product"

export interface PixelGlyphProps {
  name: PixelGlyphName
  className?: string
}

const glyphs: Record<PixelGlyphName, ReactNode> = {
  systems: (
    <>
      <rect x="2" y="2" width="5" height="5" />
      <rect x="9" y="2" width="5" height="5" />
      <rect x="2" y="9" width="5" height="5" />
      <rect x="9" y="9" width="5" height="5" />
    </>
  ),
  interfaces: (
    <>
      <rect x="1" y="3" width="14" height="1" />
      <rect x="1" y="12" width="14" height="1" />
      <rect x="1" y="3" width="1" height="10" />
      <rect x="14" y="3" width="1" height="10" />
      <rect x="3" y="5" width="2" height="2" />
      <rect x="6" y="5" width="2" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="3" y="9" width="8" height="2" />
    </>
  ),
  delivery: (
    <>
      <rect x="2" y="7" width="10" height="2" />
      <rect x="9" y="3" width="2" height="2" />
      <rect x="11" y="5" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
      <rect x="11" y="9" width="2" height="2" />
      <rect x="9" y="11" width="2" height="2" />
      <rect x="2" y="7" width="2" height="2" />
    </>
  ),
  product: (
    <>
      <rect x="7" y="1" width="2" height="14" />
      <rect x="1" y="4" width="2" height="2" />
      <rect x="3" y="6" width="2" height="2" />
      <rect x="11" y="6" width="2" height="2" />
      <rect x="13" y="4" width="2" height="2" />
      <rect x="1" y="10" width="2" height="2" />
      <rect x="3" y="8" width="2" height="2" />
      <rect x="11" y="8" width="2" height="2" />
      <rect x="13" y="10" width="2" height="2" />
    </>
  ),
}

/**
 * Small semantic pixel glyphs for capability cards. They are intentionally
 * block-built and monochrome so the pixel language reads as a system detail,
 * not an illustration.
 */
export function PixelGlyph({ name, className }: PixelGlyphProps) {
  return (
    <svg
      data-testid="pixel-glyph"
      data-glyph={name}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={twMerge("size-4 text-crimson", className)}
      fill="currentColor"
    >
      {glyphs[name]}
    </svg>
  )
}

export default PixelGlyph
