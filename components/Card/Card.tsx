import React from "react"
import { twMerge } from "tailwind-merge"

/**
 * In-tree replacement for `flowbite-react`'s `Card`.
 *
 * The library's Card is a `'use client'` component that resolves its classes
 * through a `ThemeProvider` context and a prop-normalisation layer. This site
 * mounts no `ThemeProvider`, so none of that machinery can affect the output —
 * it is dead weight on the main thread (~241 KB of client JS, measured as the
 * heaviest chunk on `/`, `/blog`, `/projects`, `/contact`).
 *
 * The rendered markup is byte-identical to the library's: same opening
 * `<div>` with the same merged classes, same inner wrapper. See
 * `.omo/evidence/task-F5-2026-refresh-restyle-ci-analysis.txt`.
 */

const CARD_ROOT_CLASSES =
  "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col"
const CARD_CHILDREN_CLASSES = "flex h-full flex-col justify-center gap-4 p-6"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className, ...restProps }, ref) => (
  <div data-testid="flowbite-card" ref={ref} className={twMerge(CARD_ROOT_CLASSES, className)} {...restProps}>
    <div className={CARD_CHILDREN_CLASSES}>{children}</div>
  </div>
))

Card.displayName = "Card"

export default Card
