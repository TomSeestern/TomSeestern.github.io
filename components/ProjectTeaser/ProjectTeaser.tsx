import { Button, Card, Tooltip } from "flowbite-react"
import React from "react"
import fs from "fs"
import path from "path"

/**
 * Interface for the ProjectTeaser props
 * @interface ProjectProps
 * @property {string} imageUrl - The URL of the project image
 * @property {string} title - The title of the project
 * @property {string} description - The description of the project
 * @property {string[]} technologies - An array of Technology names, must match the names of the icons in the public/icons folder
 * @property {string} ctaText - The text for the CTA
 * @property {string} ctaLink - The URL for the CTA
 * @property {string} buttonText - The text for the button
 * @property {string} buttonLink - The URL for the button
 */
export interface ProjectProps {
  imageUrl: string
  title: string
  description: string
  technologies: string[]
  ctaText: string
  ctaLink: string
  buttonText: string
  buttonLink: string
}

const ProjectTeaser: React.FC<ProjectProps> = ({
  imageUrl,
  title,
  description,
  technologies,
  ctaText,
  ctaLink,
  buttonText,
  buttonLink,
}) => {
  // Check if we have the icons for the technologies, if not, use a placeholder
  technologies = technologies.map((tech) => {
    const relativePath = path.join("icon", (tech + ".svg").replace(" ", "").toLowerCase().trim())
    const iconPath = path.join(process.cwd(), "public", relativePath)
    console.log("iconPath", iconPath)

    try {
      fs.accessSync(iconPath, fs.constants.F_OK)
      return relativePath.replaceAll("\\", "/") // File exists
    } catch (e) {
      return "https://placehold.co/400x400.png?name=" + tech.toString().toLowerCase().trim() // File does not exist
    }
  })

  return (
    <Card className="h-full w-full">
      <div className="flex h-full flex-col justify-between">
        <div className="">
          <h3 className="truncate text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <a
            href={ctaLink}
            title={ctaText}
            className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            {ctaText}
            {/* Todo: Add Link Icon */}
          </a>
        </div>
        {/* Using min-h-[4.5rem] here to force the component to keep 3 Lines of space even is text is not long enough */}
        <p className="line-clamp-3 min-h-[4.5rem] text-lg font-normal text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="flex min-h-[2rem] items-center gap-2.5">
          {technologies.map((tech, index) => (
            <div key={tech} className="rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Tooltip content={tech}>
                <img
                  data-tooltip-target={`tooltip-logo-${tech}`}
                  className="h-8 w-auto object-contain"
                  src={tech}
                  alt={"Tech Icon " + tech}
                />
              </Tooltip>
            </div>
          ))}
        </div>
        <Button
          href={buttonLink}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  )
}

export default React.memo(ProjectTeaser)
