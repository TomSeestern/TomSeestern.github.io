"use client"

import { Tooltip } from "../Tooltip/Tooltip"

export interface TechnologyTooltipProps {
  name: string
}

/**
 * Focusable technology chip inside the project dossier. The trigger is a real
 * tab stop with an explicit accessible name and redundant screen-reader text,
 * not a bare `<img>`; Radix attaches the hover/focus disclosure to this span.
 */
export function TechnologyTooltip({ name }: TechnologyTooltipProps) {
  return (
    <Tooltip explainer={`${name}: technology used on this case file.`} withArrow>
      <span
        data-testid="tech-tooltip-trigger"
        data-technology={name}
        role="button"
        tabIndex={0}
        aria-label={`${name} technology details`}
        className="focus-ring inline-flex min-h-7 items-center border border-rule-strong bg-transparent px-2.5 py-1 font-pixel text-[0.5625rem] uppercase tracking-[0.12em] text-ink"
      >
        <span className="sr-only">{name} technology details</span>
        <span aria-hidden="true">{name}</span>
      </span>
    </Tooltip>
  )
}
