import * as RadixTooltip from "@radix-ui/react-tooltip"
import React from "react"
import { twMerge } from "tailwind-merge"

const tooltipContentClassName =
  "z-50 border-2 border-gold-ink bg-night px-3 py-2 font-body text-small text-night-ink shadow-pixel-sm"
const tooltipArrowClassName = "size-4 fill-night"

export interface TooltipProps extends RadixTooltip.TooltipProps {
  explainer: React.ReactElement | string
  children: React.ReactElement
  className?: string
  withArrow?: boolean
  side?: "top" | "right" | "bottom" | "left"
  intent?: "primary"
  size?: "md"
}

/**
 * Radix tooltip on the night surface. The trigger must be focusable and carry
 * its own accessible name; the site's icon usages wrap the glyph in a titled
 * focusable span with `sr-only` text rather than passing a bare `<img>`.
 */
export function Tooltip({
  children,
  explainer,
  open,
  defaultOpen,
  onOpenChange,
  side = "top",
  className,
  withArrow,
}: TooltipProps) {
  return (
    <RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content side={side} sideOffset={8} className={twMerge(tooltipContentClassName, className)}>
          {explainer}
          {withArrow ? <RadixTooltip.Arrow className={twMerge(tooltipArrowClassName, className)} /> : null}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
