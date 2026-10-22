import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export type PageHeroTone = "canvas" | "canvas-deep" | "panel" | "night" | "crimson"

const toneClasses: Record<PageHeroTone, string> = {
  canvas: "bg-canvas text-ink",
  "canvas-deep": "bg-canvas-deep text-ink",
  panel: "bg-panel text-ink",
  night: "bg-night text-night-ink",
  crimson: "bg-crimson text-canvas",
}

const eyebrowClasses: Record<PageHeroTone, string> = {
  canvas: "text-crimson",
  "canvas-deep": "text-crimson",
  panel: "text-crimson",
  night: "text-gold-ink",
  crimson: "text-canvas",
}

const leadClasses: Record<PageHeroTone, string> = {
  canvas: "text-ink-muted",
  "canvas-deep": "text-ink-muted",
  panel: "text-ink-muted",
  night: "text-night-muted",
  crimson: "text-canvas",
}

export interface PageHeroProps {
  eyebrow?: string
  title: ReactNode
  lead?: string
  actions?: ReactNode
  aside?: ReactNode
  tone?: PageHeroTone
  titleId?: string
  size?: "default" | "compact"
  className?: string
}

const sizeClasses = {
  default: {
    frame: "gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:items-end lg:gap-14 lg:px-10 lg:py-20",
    columns: "lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.6fr)]",
    title: "text-display-xl",
  },
  compact: {
    frame: "gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:items-end lg:gap-12 lg:px-10 lg:py-10",
    columns: "lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.32fr)]",
    title: "text-display-lg",
  },
} as const

/**
 * Page-level hero. The H1 is always the first heading in main. `compact` keeps
 * listing pages content-first; the optional aside is a short archival fact
 * panel, never a second column of prose competing with the reading order.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  aside,
  tone = "canvas",
  titleId,
  size = "default",
  className,
}: PageHeroProps) {
  const recipe = sizeClasses[size]

  return (
    <section
      data-testid="page-hero"
      data-tone={tone}
      data-size={size}
      aria-labelledby={titleId}
      className={twMerge("relative overflow-hidden", toneClasses[tone], className)}
    >
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 hidden opacity-[0.14] md:block" />
      <div
        className={twMerge(
          "mx-auto grid w-full max-w-width-page",
          recipe.frame,
          aside ? recipe.columns : "lg:grid-cols-1"
        )}
      >
        <div className="relative z-10">
          {eyebrow ? (
            <p className={twMerge("mb-4 font-pixel text-label uppercase tracking-[0.14em]", eyebrowClasses[tone])}>
              {eyebrow}
            </p>
          ) : null}
          <h1 id={titleId} className={twMerge("text-balance", recipe.title)}>
            {title}
          </h1>
          {lead ? <p className={twMerge("mt-5 max-w-measure-lead text-body-lg", leadClasses[tone])}>{lead}</p> : null}
          {actions ? <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
        {aside ? <div className="relative z-10">{aside}</div> : null}
      </div>
    </section>
  )
}
