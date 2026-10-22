import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export type SectionHeadingTone = "light" | "night" | "crimson"

const eyebrowClasses: Record<SectionHeadingTone, string> = {
  light: "text-crimson",
  night: "text-gold-ink",
  crimson: "text-canvas",
}

const leadClasses: Record<SectionHeadingTone, string> = {
  light: "text-ink-muted",
  night: "text-night-muted",
  crimson: "text-canvas",
}

export interface SectionHeadingProps {
  eyebrow?: string
  title: string
  lead?: string
  action?: ReactNode
  id?: string
  tone?: SectionHeadingTone
  align?: "left" | "center"
  className?: string
}

/**
 * The shared section opener: pixel eyebrow, inscriptional H2, optional lead and
 * action. The heading owns the id used by the parent Section's aria-labelledby.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  id,
  tone = "light",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className
      )}
    >
      <div className={twMerge("max-w-3xl", align === "center" && "flex flex-col items-center")}>
        {eyebrow ? (
          <p className={twMerge("mb-3 font-pixel text-label uppercase tracking-[0.14em]", eyebrowClasses[tone])}>
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className="text-balance text-display-md">
          {title}
        </h2>
        {lead ? <p className={twMerge("mt-5 max-w-measure-lead text-body-lg", leadClasses[tone])}>{lead}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-3">{action}</div> : null}
    </div>
  )
}
