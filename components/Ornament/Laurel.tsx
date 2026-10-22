import { twMerge } from "tailwind-merge"

export interface LaurelProps {
  className?: string
}

/**
 * Pixel-stepped laurel, built from two mirrored paths. It uses currentColor so
 * the same ornament works on canvas, night, and crimson without a theme prop.
 */
export function Laurel({ className }: LaurelProps) {
  return (
    <svg
      data-testid="laurel"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 64"
      fill="currentColor"
      className={twMerge("size-12", className)}
    >
      <path d="M31 55c-9-4-15-12-15-22 0-6 2-11 5-15l4 4c-2 3-4 7-4 11 0 7 4 13 11 17l-1 5Zm2 0 1-5c7-4 11-10 11-17 0-4-2-8-4-11l4-4c3 4 5 9 5 15 0 10-6 18-17 22Z" />
      <path d="M28 38c-4-1-7-4-8-8l5-1c1 2 2 4 5 5l-2 4Zm8 0 2-4c2-1 4-3 5-5l5 1c-1 4-4 7-8 8l-4 4-4-4Z" />
    </svg>
  )
}
