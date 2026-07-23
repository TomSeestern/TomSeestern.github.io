import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

const inlineAlert = cva(
  [
    "relative",
    "flex",
    "items-start",
    "gap-3",
    "rounded-lg",
    "border",
    "p-4",
    "text-sm",
    "transition-colors",
    "duration-200",
  ],
  {
    variants: {
      color: {
        success: [
          "bg-green-50",
          "text-green-700",
          "border-green-200",
          "dark:bg-green-950/40",
          "dark:text-green-400",
          "dark:border-green-900",
        ],
        failure: [
          "bg-red-50",
          "text-red-600",
          "border-red-200",
          "dark:bg-red-950/40",
          "dark:text-red-400",
          "dark:border-red-900",
        ],
      },
    },
    defaultVariants: {
      color: "success",
    },
  }
)

export interface InlineAlertProps extends VariantProps<typeof inlineAlert> {
  children: ReactNode
  onDismiss?: () => void
  className?: string
}

export function InlineAlert({ children, color, onDismiss, className }: InlineAlertProps) {
  return (
    <div role="alert" className={twMerge(inlineAlert({ color }), className)}>
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg p-1.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:focus-visible:ring-accent-soft-dark"
        >
          <span className="sr-only">Dismiss</span>
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
