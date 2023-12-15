import React, { ReactNode } from "react"

interface TimelineEntryProps {
  time: string
  title: string
  description: string
  link: string
  children: ReactNode
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ time, title, description, link, children }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <p className="w-auto shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-32 sm:text-right">
        {time}
      </p>
      <div className="hidden w-px bg-gray-200 dark:bg-gray-700 sm:block sm:shrink-0" />
      <div className="flex-1 space-y-4 pb-8 sm:pb-12">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
          <a href={link} className="hover:underline">
            {title}
          </a>
        </h4>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">{description}</p>
        {children}
      </div>
    </div>
  )
}

export default TimelineEntry
