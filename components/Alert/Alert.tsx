import React from "react"
import { twMerge } from "tailwind-merge"

export type AlertVariant = "success" | "failure"

export interface AlertProps {
  variant?: AlertVariant
  onDismiss?: () => void
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<AlertVariant, string> = {
  success: "border-accent-soft bg-surface-elevated text-foreground",
  failure: "border-accent-secondary bg-surface-elevated text-accent-secondary",
}

/**
 * In-tree status/error surface (D11 / T21). A success alert is a polite
 * `role="status"` live region; a failure alert is an assertive `role="alert"`
 * so a submission error is announced immediately. `onDismiss` adds a
 * keyboard-reachable control labelled "Dismiss".
 */
export function Alert({ variant = "success", onDismiss, className, children }: AlertProps) {
  return (
    <div
      role={variant === "failure" ? "alert" : "status"}
      className={twMerge("flex items-center gap-2 rounded-lg border p-4 text-sm", variantClasses[variant], className)}
    >
      <div className="flex-1">{children}</div>
      {onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="-m-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg p-1.5 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
