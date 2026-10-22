import React from "react"
import { twMerge } from "tailwind-merge"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Optional band above the body, used for a sigil or arch illustration. */
  archHeader?: React.ReactNode
  innerClassName?: string
}

/**
 * Terminal panel: a 1px rule, a flat near-black surface, and a restrained
 * border hover. Cards are layout primitives, never links; titles and actions
 * stay separately focusable so a card never becomes a nested-anchor puzzle.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, archHeader, innerClassName, ...restProps }, ref) => (
    <div
      data-testid="card"
      ref={ref}
      className={twMerge(
        "flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-panel text-ink transition-colors duration-200 hover:border-rule-strong",
        className
      )}
      {...restProps}
    >
      {archHeader ? <div className="border-b border-rule bg-canvas-deep/60 px-5 py-3 sm:px-6">{archHeader}</div> : null}
      <div className={twMerge("flex h-full flex-col gap-4 p-5 sm:p-6", innerClassName)}>{children}</div>
    </div>
  )
)

Card.displayName = "Card"

export default Card
