import React from "react"
import Image from "next/image"

export interface FooterProps {
  //    underline?: boolean
  //    href: string
}

export function Footer({ ...props }: FooterProps) {
  return (
    <footer className="rounded-lg bg-white p-4 antialiased shadow dark:bg-gray-800 sm:flex sm:items-center sm:justify-between sm:p-6 xl:p-8">
      <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:mb-0">
        © 2019-2024{" "}
        <a href="https://tomsegbers.de/" className="hover:underline" target="_blank">
          TomSegbers.de
        </a>
        . All rights reserved.
      </p>
      <div className="flex items-center justify-center space-x-1">
        <a
          href="https://linkedin.com/in/tomsegbers/"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/linkedin.svg"} alt="Facebook Logo" width={32} height={32} />
          <span className="sr-only">Facebook</span>
        </a>
        <a
          href="https://twitter.com/TomSegbers"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/twitter.svg"} alt="Twitter Logo" width={32} height={32}></Image>
          <span className="sr-only">Twitter</span>
        </a>
        <a
          href="https://www.github.com/TomSeestern/"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/github.svg"} alt="Github Logo" width={32} height={32}></Image>
          <span className="sr-only">Github</span>
        </a>
        <a
          href="/contact"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/mail.svg"} alt="Dribble Logo" width={32} height={32}></Image>
          <span className="sr-only">Email</span>
        </a>
      </div>
    </footer>
  )
}
