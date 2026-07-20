import Image from "next/image"
import React from "react"

export type PersonTeaserProps = {
  companyName: string
  companyLogoSrc: string
  companyDescription: string
  companyLink: string
}

export default function PersonTeaser({
  companyName,
  companyLogoSrc,
  companyDescription,
  companyLink,
}: Readonly<PersonTeaserProps>) {
  return (
    <a
      href={companyLink}
      className="flex items-center gap-3 rounded-lg transition-colors duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:bg-muted-surface-dark dark:focus-visible:ring-accent-soft-dark"
    >
      <Image
        className="h-12 w-12 shrink-0 rounded-full object-cover"
        src={companyLogoSrc}
        alt=""
        width={48}
        height={48}
      />
      <div>
        <p className="text-lg font-medium leading-tight text-foreground dark:text-foreground-dark">{companyName}</p>
        <p className="text-sm font-normal text-muted dark:text-muted-dark">{companyDescription}</p>
      </div>
    </a>
  )
}
