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
    <a href={companyLink} className="flex items-center gap-3">
      <img className="h-12 w-12 shrink-0 rounded-full object-cover" src={companyLogoSrc} alt="" />
      <div>
        <p className="text-lg font-medium leading-tight text-gray-900 dark:text-white">{companyName}</p>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{companyDescription}</p>
      </div>
    </a>
  )
}
