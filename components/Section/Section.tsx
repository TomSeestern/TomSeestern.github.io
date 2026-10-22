import type { HTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export type SectionTone = "canvas" | "canvas-deep" | "panel" | "night" | "crimson"

const toneClasses: Record<SectionTone, string> = {
  canvas: "bg-canvas text-ink",
  "canvas-deep": "bg-canvas-deep text-ink",
  panel: "bg-panel text-ink",
  night: "bg-night text-night-ink",
  crimson: "bg-crimson text-canvas",
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone
  labelledBy?: string
  innerClassName?: string
  children: ReactNode
}

/**
 * Full-bleed colour band with one shared page gutter. The outer element owns
 * the surface; the inner wrapper owns the 80rem frame so a section can run to
 * the viewport edge without duplicating layout code on every page.
 */
export function Section({ tone = "canvas", labelledBy, innerClassName, className, children, ...props }: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={twMerge("relative border-t border-rule", toneClasses[tone], className)}
      {...props}
    >
      <div className={twMerge("mx-auto w-full max-w-width-page px-4 sm:px-6 lg:px-10", innerClassName)}>{children}</div>
    </section>
  )
}
