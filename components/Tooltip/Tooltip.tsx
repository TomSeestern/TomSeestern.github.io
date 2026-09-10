import * as RadixTooltip from "@radix-ui/react-tooltip"
import React from "react"
import { twMerge } from "tailwind-merge"

const tooltipContentClassName = "bg-zinc-700 px-4 py-2.5 text-white"
const tooltipArrowClassName = "h-2 w-4 fill-zinc-700"

export interface TooltipProps extends RadixTooltip.TooltipProps {
  explainer: React.ReactElement | string
  children: React.ReactElement
  className?: string
  withArrow?: boolean
  side?: "top" | "right" | "bottom" | "left"
  intent?: "primary"
  size?: "md"
}

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
        <RadixTooltip.Content side={side} sideOffset={5} className={twMerge(tooltipContentClassName, className)}>
          {explainer}
          {withArrow ? <RadixTooltip.Arrow className={twMerge(tooltipArrowClassName, className)} /> : null}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
