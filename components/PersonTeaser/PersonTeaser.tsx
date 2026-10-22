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
      className="focus-ring flex items-center gap-3 rounded-md border border-rule bg-canvas p-3 transition-colors duration-150 hover:border-rule-strong"
    >
      <Image
        data-testid="company-logo"
        className="size-10 shrink-0 rounded-sm border border-rule-strong bg-panel object-contain p-1"
        src={companyLogoSrc}
        alt=""
        width={48}
        height={48}
        unoptimized
      />
      <div className="min-w-0">
        <p className="font-body text-sm font-medium leading-tight text-ink">{companyName}</p>
        <p className="mt-1 font-body text-xs text-ink-muted">{companyDescription}</p>
      </div>
    </a>
  )
}
