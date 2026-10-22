"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import React from "react"

/**
 * Route-local tooltip provider.
 *
 * Radix's `Tooltip.Provider` shares open/skip-delay state across its subtree.
 * Only the project dossier uses tooltips, so the provider lives there instead
 * of in the root layout; pages without dossier tooltips do not pay for the
 * Radix client bundle.
 */
export function TooltipProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RadixTooltip.Provider delayDuration={200}>{children}</RadixTooltip.Provider>
}
