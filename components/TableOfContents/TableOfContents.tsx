"use client"

import { useEffect, useRef, useState } from "react"

interface Heading {
  readonly id: string
  readonly text: string
  readonly level: 2 | 3
}

interface TocProps {
  readonly headings: readonly Heading[]
}

function scrollToHeading(id: string, event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })
}

function TocLink({ heading, activeId }: { heading: Heading; activeId: string }) {
  const isActive = activeId === heading.id
  const indent = heading.level === 3 ? "pl-6" : "pl-3"
  return (
    <li>
      <a
        href={`#${heading.id}`}
        onClick={(e) => scrollToHeading(heading.id, e)}
        className={`block border-l-2 py-1.5 text-sm transition-colors duration-200 ${indent} ${
          isActive
            ? "border-accent font-medium text-accent dark:border-accent-dark dark:text-accent-dark"
            : "border-transparent text-muted hover:border-border hover:text-foreground dark:text-muted-dark dark:hover:border-border-dark dark:hover:text-foreground-dark"
        }`}
      >
        {heading.text}
      </a>
    </li>
  )
}

export function TableOfContents({ headings }: TocProps) {
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length === 0) return
        const topEntry = intersecting.reduce((closest, entry) =>
          entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest
        )
        setActiveId(topEntry.target.id)
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    observerRef.current = observer
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const nav = (
    <nav aria-label="Table of contents">
      <p className="mb-3 pl-3 text-xs font-semibold uppercase tracking-wider text-muted dark:text-muted-dark">
        On this page
      </p>
      <ul className="space-y-0">
        {headings.map((heading) => (
          <TocLink key={heading.id} heading={heading} activeId={activeId} />
        ))}
      </ul>
    </nav>
  )

  return (
    <>
      <details className="order-first mb-6 lg:hidden">
        <summary className="cursor-pointer rounded-sm bg-surface-muted px-3 py-2 text-sm font-medium text-foreground dark:bg-surface-muted-dark dark:text-foreground-dark">
          Table of Contents
        </summary>
        <div className="mt-2 rounded-sm bg-surface p-2 dark:bg-surface-dark">{nav}</div>
      </details>
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:w-64 lg:shrink-0 lg:self-start">{nav}</aside>
    </>
  )
}
