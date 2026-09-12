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
        © 2019-2026{" "}
        <a
          href="https://tomsegbers.de/"
          className="transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
          target="_blank"
        >
          TomSegbers.de
        </a>
        . All rights reserved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <a
          href="https://linkedin.com/in/tomsegbers/"
          className="inline-flex shrink-0 cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/linkedin.svg"} alt="" width={32} height={32} />
          <span className="sr-only">LinkedIn</span>
        </a>
        <a
          href="https://twitter.com/TomSegbers"
          className="inline-flex shrink-0 cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/twitter.svg"} alt="" width={32} height={32}></Image>
          <span className="sr-only">Twitter</span>
        </a>
        <a
          href="https://www.github.com/TomSegbers/"
          className="inline-flex shrink-0 cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/github.svg"} alt="" width={32} height={32}></Image>
          <span className="sr-only">GitHub</span>
        </a>
        <a
          href="/contact"
          className="inline-flex shrink-0 cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          <Image className={"h-4 w-4 dark:invert"} src={"/icon/mail.svg"} alt="" width={32} height={32}></Image>
          <span className="sr-only">Email</span>
        </a>
        {/* No legal/privacy icon exists in public/icon/, so these reuse the
            icon-link base class string as visible text links. */}
        <a
          href="/tags"
          className="inline-flex shrink-0 cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          Tags
        </a>
        <a
          href="/impressum"
          className="inline-flex shrink-0 cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          Impressum
        </a>
        <a
          href="/datenschutz"
          className="inline-flex shrink-0 cursor-pointer justify-center rounded-lg p-2 text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
        >
          Datenschutz
        </a>
      </div>
    </footer>
  )
}
