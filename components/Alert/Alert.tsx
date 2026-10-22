import React from "react"
import { Close } from "../Icon/Close"
import { twMerge } from "tailwind-merge"

export type AlertVariant = "success" | "failure"

export interface AlertProps {
  variant?: AlertVariant
  onDismiss?: () => void
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<AlertVariant, string> = {
  success: "border-verdigris bg-panel text-ink",
  failure: "border-danger bg-danger-surface text-danger",
}

/**
 * In-tree status/error surface. A success alert is a polite `role="status"`
 * live region; a failure alert is an assertive `role="alert"` so a submission
 * error is announced immediately. `onDismiss` adds a keyboard-reachable
 * control labelled "Dismiss".
 */
export function Alert({ variant = "success", onDismiss, className, children }: AlertProps) {
  return (
    <div
      role={variant === "failure" ? "alert" : "status"}
      className={twMerge("flex items-center gap-3 border p-4 font-body text-small", variantClasses[variant], className)}
    >
      <div className="flex-1">{children}</div>
      {onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="focus-ring -m-1.5 inline-flex size-10 shrink-0 items-center justify-center border border-current p-1.5 transition-colors duration-150 hover:bg-canvas-deep"
        >
          <Close className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
