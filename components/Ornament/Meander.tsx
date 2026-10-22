import { twMerge } from "tailwind-merge"

export interface MeanderProps {
  className?: string
}

/** Greek-key divider. The SVG mask is decorative; the background token is ink. */
export function Meander({ className }: MeanderProps) {
  return <div data-testid="meander" aria-hidden="true" className={twMerge("meander h-2 w-full text-ink", className)} />
}
