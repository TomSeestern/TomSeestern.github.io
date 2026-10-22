import React from "react"
import { ArrowRight } from "../Icon/ArrowRight"
import { twMerge } from "tailwind-merge"

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  children: React.ReactNode
}

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {
  href?: string
  children: React.ReactNode
}

/**
 * Detail-route breadcrumb. A crumb without `href` is the current page and is
 * announced with `aria-current="page"`. The separators are decorative icons;
 * the navigation landmark and ordered-list semantics are unchanged.
 */
export function Breadcrumb({ className, children, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={twMerge(className)} {...props}>
      <ol className="flex min-w-0 flex-wrap items-center">{children}</ol>
    </nav>
  )
}

export function BreadcrumbItem({ href, children, className, ...props }: BreadcrumbItemProps) {
  const isLink = typeof href !== "undefined"
  return (
    <li className={twMerge("group flex min-w-0 items-center", className)} {...props}>
      <ArrowRight className="mx-1.5 size-3 shrink-0 text-rule-strong group-first:hidden" />
      {isLink ? (
        <a
          href={href}
          className="focus-ring flex min-w-0 items-center font-pixel text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted transition-colors duration-150 hover:text-crimson"
        >
          {children}
        </a>
      ) : (
        <span
          aria-current="page"
          className="flex min-w-0 items-center truncate font-pixel text-[0.625rem] uppercase tracking-[0.1em] text-ink"
        >
          {children}
        </span>
      )}
    </li>
  )
}
