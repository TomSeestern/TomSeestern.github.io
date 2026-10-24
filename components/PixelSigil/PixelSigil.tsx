import { twMerge } from "tailwind-merge"
import { createSigil, type SigilColor } from "@/lib/sigil"

export type PixelSigilSize = "sm" | "md" | "lg"

const sizeClasses: Record<PixelSigilSize, string> = {
  sm: "size-10",
  md: "size-16",
  lg: "size-24",
}

const fillClasses: Record<SigilColor, string> = {
  ink: "fill-ink",
  crimson: "fill-crimson",
  gold: "fill-gold",
}

export interface PixelSigilProps {
  slug: string
  size?: PixelSigilSize
  className?: string
}

/**
 * Deterministic project/article emblem. The 8×8 mirrored grid is serialised
 * into at most three paths, keeping each card's DOM cost flat.
 */
export function PixelSigil({ slug, size = "md", className }: PixelSigilProps) {
  const paths = createSigil(slug)

  return (
    <svg
      data-testid="pixel-sigil"
      data-slug={slug}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 64"
      shapeRendering="crispEdges"
      className={twMerge(sizeClasses[size], className)}
    >
      {paths.map((path) => (
        <path key={path.color} d={path.d} className={fillClasses[path.color]} />
      ))}
    </svg>
  )
}

export default PixelSigil
