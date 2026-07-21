import { Card } from "flowbite-react"
import React from "react"
import { Tooltip } from "../Tooltip/Tooltip"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { getIconPath } from "../../lib/icon-map"
import { CardMotionWrapper } from "../CardMotionWrapper/CardMotionWrapper"

/**
 * Interface for the ProjectTeaser props
 * @interface ProjectProps
 * @property {string} title - The title of the project
 * @property {string} description - The description of the project
 * @property {string[]} technologies - An array of Technology names, must match the names of the icons in the public/icons folder
 * @property {string} ctaLink - The URL for the CTA
 * @property {Date} projectDate - The date of the project, only Year should be used others might be inaccurate
 */
export interface ProjectProps {
  readonly title: string
  readonly description: string
  readonly technologies: readonly string[]
  readonly ctaLink: string
  readonly projectDate: Date
}

const ProjectTeaser: React.FC<ProjectProps> = ({ title, description, technologies, ctaLink, projectDate }) => {
  return (
    <CardMotionWrapper className="h-full w-full">
      <Card className="h-full w-full transition-colors duration-200 hover:z-50 hover:bg-surface-muted dark:hover:bg-muted-surface-dark">
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="">
            <Link
              className="rounded transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
              href={ctaLink}
            >
              <h3 className="truncate text-h3-sm text-foreground dark:text-foreground-dark">{title}</h3>
            </Link>
          </div>
          {/* Using min-h-teaser here to force the component to keep 3 Lines of space even is text is not long enough */}
          <p className="line-clamp-3 min-h-teaser text-lg font-normal text-muted dark:text-muted-dark">
            <Link
              href={ctaLink}
              className="rounded transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:text-foreground-dark dark:focus-visible:ring-accent-soft-dark"
            >
              {description}
            </Link>
          </p>
          <div className="flex min-h-8 items-center gap-2.5">
            {technologies.map((tech) => {
              const iconPath = getIconPath(tech)
              return (
                <div key={tech} className="rounded-lg p-1 hover:bg-surface-muted dark:hover:bg-muted-surface-dark">
                  <Tooltip explainer={tech}>
                    {iconPath ? (
                      <img className="h-8 w-auto object-contain" src={iconPath} alt="" />
                    ) : (
                      <span className="text-sm text-muted dark:text-muted-dark">{tech}</span>
                    )}
                  </Tooltip>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted dark:text-muted-dark">
              {formatDistanceToNow(projectDate, { addSuffix: true })}
            </span>
            <Link
              href={ctaLink}
              className="inline-flex items-center rounded font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-accent-dark dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
            >
              Learn more
              <Image
                className={"ml-2 h-4 w-4 dark:invert"}
                src={"/icon/arrow-right.svg"}
                alt=""
                width={32}
                height={32}
              />
            </Link>
          </div>
        </div>
      </Card>
    </CardMotionWrapper>
  )
}

export default React.memo(ProjectTeaser)
