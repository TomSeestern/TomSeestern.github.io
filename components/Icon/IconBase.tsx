import type { ReactNode, SVGProps } from "react"
import { twMerge } from "tailwind-merge"

export type IconProps = SVGProps<SVGSVGElement>

export interface IconBaseProps extends IconProps {
  children: ReactNode
}

/**
 * Shared icon surface. Every icon is decorative by default: the surrounding
 * link or button owns the accessible name, so the SVG is hidden from the
 * accessibility tree. Callers may override `aria-hidden` when an icon is the
 * only content, but the site never does that.
 */
export function IconBase({ children, className, ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={twMerge("size-5 shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  )
}
