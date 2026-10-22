import { twMerge } from "tailwind-merge"

export interface PixelDustProps {
  className?: string
}

/** Deterministic pixel scatter; one path keeps the DOM budget flat. */
export function PixelDust({ className }: PixelDustProps) {
  return (
    <svg
      data-testid="pixel-dust"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 32"
      fill="currentColor"
      className={twMerge("h-8 w-16", className)}
    >
      <path d="M0 4h4v4H0zM8 4h4v4H8zM16 4h4v4h-4zM40 4h4v4h-4zM56 4h4v4h-4zM4 16h4v4H4zM20 16h4v4h-4zM32 16h4v4h-4zM48 16h4v4h-4zM12 24h4v4h-4zM28 24h4v4h-4zM52 24h4v4h-4z" />
    </svg>
  )
}
