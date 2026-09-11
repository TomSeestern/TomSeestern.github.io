"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import React, { useState } from "react"

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const

const navLinkBase =
  "block rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft md:p-0 md:text-sm"

/**
 * Site header (D11 / T21). In-tree replacement for Flowbite's `Navbar`
 * primitives. The mobile toggle owns the collapsed state, exposes it through
 * `aria-expanded`, and points at the navigation list through `aria-controls`,
 * so assistive tech can follow the disclosure relationship.
 */
export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-border-subtle bg-surface-elevated">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-width-page flex-wrap items-center justify-between px-4 py-2.5 sm:px-6"
      >
        <a
          href="/"
          className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
        >
          <Image
            src="/img/logo.png"
            className="mr-3 h-6 w-6 sm:h-9 sm:w-9"
            alt="Tom Segbers Logo"
            width={512}
            height={512}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-foreground">Tom Segbers</span>
        </a>
        <div className="flex items-center md:order-2">
          <a
            href="/contact"
            className="mr-2 rounded-lg bg-accent-hover px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-soft-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft-foreground-dark lg:px-5 lg:py-2.5"
          >
            Contact
          </a>
          <button
            type="button"
            aria-controls="site-nav"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex items-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft md:hidden"
          >
            <span className="sr-only">{isMenuOpen ? "Close main menu" : "Open main menu"}</span>
            <svg
              aria-hidden="true"
              className="size-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <ul
          id="site-nav"
          className={
            "mt-4 w-full flex-col md:mt-0 md:flex md:w-auto md:flex-row md:items-center md:gap-8 " +
            (isMenuOpen ? "flex" : "hidden")
          }
        >
          {navItems.map(({ href, label }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${navLinkBase} ${
                    isActive
                      ? "bg-accent-soft text-accent-soft-foreground md:bg-transparent md:text-accent"
                      : "text-muted hover:bg-surface-muted hover:text-foreground md:hover:bg-transparent md:hover:text-accent"
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
