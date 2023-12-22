import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react"
import Image from "next/image"
import React from "react"

export function Header() {
  return (
    <Navbar fluid={true} rounded={true}>
      <NavbarBrand href="/">
        <Image
          src="/img/logo.png"
          className="mr-3 h-6 w-6 sm:h-9 sm:w-9"
          alt="Tom Segbers Logo"
          width={512}
          height={512}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Tom Segbers</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <a
          href="/contact"
          className="mr-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:px-5 lg:py-2.5"
        >
          Contact
        </a>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="about">About</NavbarLink>
        <NavbarLink href="projects">Projects</NavbarLink>
        <NavbarLink href="blog">Blog</NavbarLink>
        <NavbarLink href="contact">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}
