import React from "react"
import {Button} from "flowbite-react"

/**
 * Interface for the Technology object
 * @interface Technology
 * @property {string} iconLink - The URL of the technology icon
 * @property {string} name - The name of the technology
 */
interface Technology {
  iconLink: string
  name: string
}

/**
 * Interface for the ProjectComponent props
 * @interface ProjectProps
 * @property {string} imageUrl - The URL of the project image
 * @property {string} title - The title of the project
 * @property {string} description - The description of the project
 * @property {Technology[]} technologies - An array of Technology objects
 * @property {string} ctaText - The text for the CTA
 * @property {string} ctaLink - The URL for the CTA
 * @property {string} buttonText - The text for the button
 * @property {string} buttonLink - The URL for the button
 */
export interface ProjectProps {
  imageUrl: string
  title: string
  description: string
  technologies: Technology[]
  ctaText: string
  ctaLink: string
  buttonText: string
  buttonLink: string
}

const ProjectComponent: React.FC<ProjectProps> = ({
  imageUrl,
  title,
  description,
  technologies,
  ctaText,
  ctaLink,
  buttonText,
  buttonLink,
}) => {
  return (
    <article className="space-y-4">
      <img className="h-12 w-auto object-contain" src={imageUrl} alt="" />
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <a
          href={ctaLink}
          title={ctaText}
          className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          {ctaText}
          {/* SVG code omitted for brevity */}
        </a>
      </div>
      <p className="text-lg font-normal text-gray-500 dark:text-gray-400">{description}</p>
      <div className="flex items-center gap-2.5">
        {technologies.map((tech, index) => (
          <div key={tech.name} className="rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-800">
            <img
              data-tooltip-target={`tooltip-logo-${tech.name}`}
              className="h-8 w-auto object-contain"
              src={tech.iconLink}
              alt=""
            />
            <div
              id={`tooltip-logo-${tech.name}`}
              role="tooltip"
              className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
            >
              {tech.name}
              <div className="tooltip-arrow" data-popper-arrow="" />
            </div>
          </div>
        ))}
      </div>
      <Button
        href={buttonLink}
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      >
        {buttonText}
      </Button>
    </article>
  )
}

export default React.memo(ProjectComponent)
