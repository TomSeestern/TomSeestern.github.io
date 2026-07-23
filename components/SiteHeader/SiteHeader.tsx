"use client"

import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { ThemeToggle } from "../ThemeToggle/ThemeToggle"

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isOpen) return
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const navListClassName = twMerge(
    "order-3 w-full flex-col md:order-2 md:w-auto md:flex md:flex-row md:items-center md:gap-4",
    isOpen ? "flex" : "hidden"
  )

  return (
    <header className="w-full rounded-none">
      <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-between">
        <Link
          href="/"
          className="order-1 flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:focus-visible:ring-accent-soft-dark"
        >
          <Image
            src="/img/logo.png"
            className="mr-3 size-6 sm:size-9"
            alt="Tom Segbers Logo"
            width={512}
            height={512}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-foreground dark:text-foreground-dark">
            Tom Segbers
          </span>
        </Link>

        <div className="order-2 flex items-center gap-2 md:order-3">
          <Link
            href="/contact"
            className="rounded-lg bg-accent-hover px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-soft-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft-foreground-dark dark:bg-accent dark:hover:bg-accent-hover dark:focus-visible:ring-accent-soft-foreground lg:px-5 lg:py-2.5"
          >
            Contact
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:focus-visible:ring-accent-soft-dark md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        <ul id="mobile-nav" className={navListClassName}>
          {navItems.map(({ href, label }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={twMerge(
                    "block py-2 text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-foreground-dark dark:hover:text-accent-dark dark:focus-visible:ring-accent-soft-dark md:py-0",
                    isActive && "font-medium text-accent dark:text-accent-dark"
                  )}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
