import Link from "next/link"
import type { ComponentType, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export interface BreadcrumbItemProps {
  href?: string
  icon?: ComponentType<{ className?: string }>
  children: ReactNode
  className?: string
}

export interface BreadcrumbsProps {
  children: ReactNode
  className?: string
}

export function Breadcrumbs({ children, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center text-sm text-muted dark:text-muted-dark">{children}</ol>
    </nav>
  )
}

export function BreadcrumbItem({ href, icon: Icon, children, className }: BreadcrumbItemProps) {
  return (
    <li
      className={twMerge(
        "flex items-center",
        "after:mx-2 after:text-muted after:content-['/'] dark:after:text-muted-dark",
        "last:after:hidden",
        className
      )}
    >
      {href ? (
        <Link
          href={href}
          className="text-muted transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
        >
          {Icon ? <Icon className="mr-1 size-4 shrink-0" aria-hidden="true" /> : null}
          {children}
        </Link>
      ) : (
        <span aria-current="page" className="font-medium text-foreground dark:text-foreground-dark">
          {Icon ? <Icon className="mr-1 size-4 shrink-0" aria-hidden="true" /> : null}
          {children}
        </span>
      )}
    </li>
  )
}
