import React from "react"
import Image from "next/image"

export interface FooterProps {
  //    underline?: boolean
  //    href: string
}

export function Footer({ ...props }: FooterProps) {
  return (
    <footer className="rounded-lg bg-surface p-4 antialiased shadow dark:bg-surface-muted-dark sm:flex sm:items-center sm:justify-between sm:p-6 xl:p-8">
      <p className="mb-4 text-center text-sm text-muted dark:text-muted-dark sm:mb-0">
        © 2019-2024{" "}
        <a href="https://tomsegbers.de/" className="transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark" target="_blank">
          TomSegbers.de
        </a>
        . All rights reserved.
      </p>
      <div className="flex items-center justify-center space-x-1">
        <a
          href="https://linkedin.com/in/tomsegbers/"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/linkedin.svg"} alt="LinkedIn Logo" width={32} height={32} />
          <span className="sr-only">LinkedIn</span>
        </a>
        <a
          href="https://twitter.com/TomSegbers"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/twitter.svg"} alt="Twitter Logo" width={32} height={32}></Image>
          <span className="sr-only">Twitter</span>
        </a>
        <a
          href="https://www.github.com/TomSeestern/"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/github.svg"} alt="GitHub Logo" width={32} height={32}></Image>
          <span className="sr-only">GitHub</span>
        </a>
        <a
          href="/contact"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/mail.svg"} alt="Email" width={32} height={32}></Image>
          <span className="sr-only">Email</span>
        </a>
      </div>
    </footer>
  )
}
