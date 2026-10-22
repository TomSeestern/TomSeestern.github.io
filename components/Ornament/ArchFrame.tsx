import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export interface ArchFrameProps {
  children: ReactNode
  className?: string
}

/**
 * Structural arch: a rounded crown over a square base. This is a frame, not a
 * decorative leaf, so it does not hide its children from assistive technology.
 */
export function ArchFrame({ children, className }: ArchFrameProps) {
  return (
    <div data-testid="arch-frame" className={twMerge("arch-frame bg-panel", className)}>
      {children}
    </div>
  )
}
