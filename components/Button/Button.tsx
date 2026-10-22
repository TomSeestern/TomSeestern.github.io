import { cva, type VariantProps } from "class-variance-authority"
import React from "react"
import { twMerge } from "tailwind-merge"

/**
 * Shared button recipe. `Button` renders an anchor; `buttonStyles` is exported
 * for the contact form's real `<button>` so both surfaces keep the same focus,
 * touch-target, and pressed-state contract.
 */
export const buttonStyles = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-md",
    "border",
    "font-body",
    "font-medium",
    "tracking-[-0.01em]",
    "transition-colors",
    "duration-150",
    "disabled:pointer-events-none",
    "disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        primary: ["border-ink", "bg-ink", "text-canvas", "hover:bg-white", "focus-ring-accent"],
        secondary: [
          "border-rule-strong",
          "bg-transparent",
          "text-ink",
          "hover:border-ink",
          "hover:bg-panel",
          "focus-ring",
        ],
        "secondary-night": [
          "border-rule-strong",
          "bg-transparent",
          "text-ink",
          "hover:border-ink",
          "hover:bg-panel",
          "focus-ring",
        ],
        ghost: [
          "border-transparent",
          "bg-transparent",
          "text-ink",
          "underline",
          "decoration-crimson",
          "decoration-2",
          "underline-offset-4",
          "hover:bg-panel",
          "focus-ring",
        ],
        pixel: ["border-gold", "bg-gold", "text-canvas", "hover:bg-ink", "hover:text-canvas", "focus-ring-accent"],
      },
      size: {
        sm: ["min-h-11", "px-4", "py-2", "text-[0.8125rem]"],
        md: ["min-h-11", "px-5", "py-2.5", "text-sm"],
        lg: ["min-h-12", "px-6", "py-3", "text-sm"],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonStyles> {
  href: string
}

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <a className={twMerge(buttonStyles({ variant, size }), className)} {...props}>
      {children}
    </a>
  )
}
