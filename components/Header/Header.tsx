"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Button } from "../Button/Button"
import { Close } from "../Icon/Close"
import { Menu } from "../Icon/Menu"

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const

const navLinkClasses =
  "focus-ring relative inline-flex min-h-11 items-center px-1 font-body text-sm font-medium tracking-[-0.01em] text-ink-muted transition-colors duration-150 hover:text-ink"
const activeNavLinkClasses =
  "text-ink after:absolute after:bottom-0 after:left-1 after:right-1 after:h-px after:bg-crimson"

/**
 * Sticky site header. The mobile control is a disclosure, not a modal: it owns
 * the `aria-controls`/`aria-expanded` relationship, closes on navigation, and
 * yields a 44px target on every viewport.
 */
export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <header data-testid="site-header" className="sticky top-0 z-40 border-b border-rule bg-canvas/95">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-width-page flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-10"
      >
        <Link
          href="/"
          aria-label="Tom Segbers — home"
          className="focus-ring flex min-h-11 items-center gap-2.5 rounded-sm"
        >
          <Image src="/icon/brand-mark.svg" alt="" width={32} height={32} unoptimized className="size-8 shrink-0" />
          <span className="font-display text-[15px] font-semibold leading-none tracking-[-0.03em] text-ink">
            tomsegbers
          </span>
        </Link>

        <div className="flex items-center gap-2 md:order-2">
          <div className="hidden sm:block md:hidden">
            <Button href="/contact" variant="primary" size="sm">
              Contact
            </Button>
          </div>
          <button
            type="button"
            aria-controls="site-nav"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="focus-ring inline-flex size-11 items-center justify-center rounded-md border border-rule-strong bg-panel text-ink transition-colors duration-150 hover:border-ink hover:bg-canvas-deep md:hidden"
          >
            <span className="sr-only">{isMenuOpen ? "Close main menu" : "Open main menu"}</span>
            {isMenuOpen ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <ul
          id="site-nav"
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } order-3 mt-2 w-full flex-col gap-1 border-t border-rule pt-3 md:order-1 md:mt-0 md:flex md:w-auto md:flex-row md:items-center md:gap-5 md:border-t-0 md:pt-0`}
        >
          {navItems.map(({ href, label }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="hidden md:order-2 md:block">
          <Button href="/contact" variant="primary" size="sm">
            Contact
          </Button>
        </div>
      </nav>
    </header>
  )
}
