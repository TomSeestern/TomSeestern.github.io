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
      <p className="w-auto shrink-0 text-sm font-medium text-muted dark:text-muted-dark sm:w-32 sm:text-right">
        {time}
      </p>
      <div className="hidden w-px bg-border-subtle dark:bg-border-subtle-dark sm:block sm:shrink-0" />
      <div className="flex-1 space-y-4 pb-8 sm:pb-12">
        <h3 className="text-h3-sm text-foreground dark:text-foreground-dark">
          <a
            href={link}
            className="transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
          >
            {title}
          </a>
        </h3>
        <p className="text-base font-normal text-muted dark:text-muted-dark">{description}</p>
        {children}
      </div>
    </div>
  )
}

export default TimelineEntry
