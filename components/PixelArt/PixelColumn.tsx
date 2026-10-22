import { twMerge } from "tailwind-merge"

export interface PixelColumnProps {
  className?: string
}

/**
 * A classical column reduced to a 24×48 pixel grid. It is used as a low-contrast
 * watermark, never as a repeating section ornament: one structural nod to the
 * archive's Roman bones without turning the page into a costume.
 */
export function PixelColumn({ className }: PixelColumnProps) {
  return (
    <svg
      data-testid="pixel-column"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 48"
      shapeRendering="crispEdges"
      className={twMerge("text-ink", className)}
      fill="currentColor"
    >
      <rect x="2" y="0" width="20" height="3" />
      <rect x="0" y="3" width="24" height="2" />
      <rect x="5" y="5" width="3" height="29" />
      <rect x="10" y="5" width="4" height="29" />
      <rect x="16" y="5" width="3" height="29" />
      <rect x="0" y="34" width="24" height="3" />
      <rect x="2" y="37" width="20" height="4" />
      <rect x="5" y="41" width="14" height="4" />
      <rect x="18" y="0" width="3" height="2" className="fill-crimson" />
    </svg>
  )
}

export default PixelColumn
