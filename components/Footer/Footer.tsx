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
        © 2019-2022{" "}
        <a href="https://flowbite.com/" className="hover:underline" target="_blank">
          Flowbite.com
        </a>
        . All rights reserved.
      </p>
      <div className="flex items-center justify-center space-x-1">
        <a
          href="#"
          data-tooltip-target="tooltip-facebook"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/facebook.svg"} alt="Facebook Logo" width={32} height={32} />
          <span className="sr-only">Facebook</span>
        </a>
        <div
          id="tooltip-facebook"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Like us on Facebook
          <div className="tooltip-arrow" data-popper-arrow="" />
        </div>
        <a
          href="#"
          data-tooltip-target="tooltip-twitter"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/twitter.svg"} alt="Twitter Logo" width={32} height={32}></Image>
          <span className="sr-only">Twitter</span>
        </a>
        <div
          id="tooltip-twitter"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Follow us on Twitter
          <div className="tooltip-arrow" data-popper-arrow="" />
        </div>
        <a
          href="#"
          data-tooltip-target="tooltip-github"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/github.svg"} alt="Github Logo" width={32} height={32}></Image>
          <span className="sr-only">Github</span>
        </a>
        <div
          id="tooltip-github"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Star us on GitHub
          <div className="tooltip-arrow" data-popper-arrow="" />
        </div>
        <a
          href="#"
          data-tooltip-target="tooltip-dribbble"
          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <Image className={"h-4 w-4"} src={"/icon/dribble.svg"} alt="Dribble Logo" width={32} height={32}></Image>
          <span className="sr-only">Dribbble</span>
        </a>
        <div
          id="tooltip-dribbble"
          role="tooltip"
          className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
        >
          Follow us on Dribbble
          <div className="tooltip-arrow" data-popper-arrow="" />
        </div>
      </div>
    </footer>
  )
}
