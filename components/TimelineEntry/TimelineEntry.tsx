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
    <div data-testid="timeline-entry" className="grid gap-3 border-t border-rule py-7 sm:grid-cols-[8rem_1fr] sm:gap-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson sm:pt-1">{time}</p>
      <div className="space-y-3 sm:border-l sm:border-rule sm:pl-7">
        <h3 className="text-h3-sm text-ink">
          <a
            href={link}
            className="focus-ring rounded-sm decoration-crimson decoration-2 underline-offset-4 hover:text-crimson hover:underline"
          >
            {title}
          </a>
        </h3>
        <p className="max-w-measure-lead font-body text-sm leading-6 text-ink-muted">{description}</p>
        {children}
      </div>
    </div>
  )
}

export default TimelineEntry
