import Link from "next/link"
import { twMerge } from "tailwind-merge"

export type TagChipVariant = "solid" | "outline" | "link"

const variantClasses: Record<TagChipVariant, string> = {
  solid: "border-ink bg-ink text-canvas",
  outline: "border-rule-strong bg-transparent text-ink",
  link: "border-transparent bg-transparent text-crimson underline decoration-crimson decoration-2 underline-offset-4",
}

export interface TagChipProps {
  label: string
  href?: string
  variant?: TagChipVariant
  testId?: string
  className?: string
}

/**
 * Small taxonomy chip. The link variant owns its own focus ring; the static
 * variant stays a span so it never becomes a fake interactive control.
 */
export function TagChip({ label, href, variant = "outline", testId = "tag-chip", className }: TagChipProps) {
  const classes = twMerge(
    "inline-flex min-h-8 items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
    variantClasses[variant],
    className
  )

  if (href) {
    // A topic strip can hold ten links; eagerly prefetching every archive adds
    // measurable RSC parsing and main-thread work to listing pages.
    return (
      <Link href={href} prefetch={false} data-testid={testId} className={twMerge(classes, "focus-ring")}>
        {label}
      </Link>
    )
  }

  return (
    <span data-testid={testId} className={classes}>
      {label}
    </span>
  )
}
