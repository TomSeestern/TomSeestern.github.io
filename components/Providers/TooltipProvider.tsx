"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import React from "react"

/**
 * Single root Tooltip provider for the whole app.
 *
 * Radix's `Tooltip.Provider` shares open/skip-delay state across every tooltip
 * in the tree. Wrapping the app once (in `app/layout.tsx`) replaces the
 * per-instance provider each `Tooltip` used to mount — the home marquee alone
 * rendered ~168 nested providers, each paying its own context/hydration cost.
 *
 * `delayDuration=200` preserves the previous hover delay; every tooltip now
 * shares one provider instead of one per icon.
 */
export function TooltipProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RadixTooltip.Provider delayDuration={200}>{children}</RadixTooltip.Provider>
}
