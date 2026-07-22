import { cva, type VariantProps } from "class-variance-authority"

import { twMerge } from "tailwind-merge"

const button = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "border",
    "border-accent-light",
    "transition-colors",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "focus-visible:ring-accent-soft",
    "dark:focus-visible:ring-accent-soft-dark",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-accent-light", "text-foreground", "hover:enabled:bg-accent-hover"],
        secondary: [
          "bg-transparent",
          "text-accent",
          "dark:text-accent-light",
          "hover:enabled:bg-accent-light",
          "hover:enabled:text-foreground",
        ],
      },
      size: {
        sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "py-1.5", "px-4"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "py-2.5", "px-6"],
      },
      underline: { true: ["underline"], false: [] },
    },
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof button> {
  underline?: boolean
  href: string
}

export function Button({ className, intent, size, underline, ...props }: ButtonProps) {
  return (
    <a className={twMerge(button({ intent, size, className, underline }))} {...props}>
      {props.children}
    </a>
  )
}
