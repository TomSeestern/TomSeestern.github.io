import { cva } from "class-variance-authority"
import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

const surfaceCardRoot = cva([
  "flex",
  "flex-col",
  "rounded-lg",
  "border",
  "border-border",
  "dark:border-border-dark",
  "bg-surface",
  "dark:bg-surface-dark",
  "shadow-sm",
])

const surfaceCardContent = cva(["flex", "h-full", "flex-col", "justify-center", "gap-4", "p-6"])

export interface SurfaceCardProps {
  children: ReactNode
  className?: string
}

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <article className={twMerge(surfaceCardRoot(), className)}>
      <div className={surfaceCardContent()}>{children}</div>
    </article>
  )
}
