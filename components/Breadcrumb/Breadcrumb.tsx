import React from "react"
import { twMerge } from "tailwind-merge"

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  children: React.ReactNode
}

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {
  href?: string
  children: React.ReactNode
}

/**
 * Detail-route breadcrumb (D11 / T21). In-tree replacement for Flowbite's
 * `Breadcrumb`/`BreadcrumbItem`. A crumb without `href` is the current page and
 * is announced with `aria-current="page"`.
 */
export function Breadcrumb({ className, children, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={twMerge(className)} {...props}>
      <ol className="flex items-center">{children}</ol>
    </nav>
  )
}

export function BreadcrumbItem({ href, children, className, ...props }: BreadcrumbItemProps) {
  const isLink = typeof href !== "undefined"
  return (
    <li className={twMerge("group flex min-w-0 items-center", className)} {...props}>
      <svg
        aria-hidden="true"
        className="mx-1 size-4 shrink-0 text-muted group-first:hidden md:mx-2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      {isLink ? (
        <a
          href={href}
          className="flex min-w-0 items-center rounded text-sm font-medium text-muted transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          {children}
        </a>
      ) : (
        <span aria-current="page" className="flex min-w-0 items-center truncate text-sm font-medium text-muted">
          {children}
        </span>
      )}
    </li>
  )
}
