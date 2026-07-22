"use client"

import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const

export function Header() {
  const pathname = usePathname()

  return (
    <Navbar fluid={true} rounded={true}>
      <NavbarBrand href="/">
        <Image src="/img/logo.png" className="mr-3 size-6 sm:size-9" alt="Tom Segbers Logo" width={512} height={512} />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-foreground dark:text-foreground-dark">
          Tom Segbers
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Link
          href="/contact"
          className="mr-2 rounded-lg bg-accent-hover px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-soft-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft-foreground-dark dark:bg-accent dark:hover:bg-accent-hover dark:focus-visible:ring-accent-soft-foreground lg:px-5 lg:py-2.5"
        >
          Contact
        </Link>
        <DarkThemeToggle className="mr-2" />
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        {navItems.map(({ href, label }) => {
          const isActive = pathname.startsWith(href)
          return (
            <NavbarLink key={href} href={href} active={isActive} aria-current={isActive ? "page" : undefined}>
              {label}
            </NavbarLink>
          )
        })}
      </NavbarCollapse>
    </Navbar>
  )
}
