import Image from "next/image"
import React from "react"
import ProjectTeaser from "../../components/ProjectTeaser/ProjectTeaser"
import { getAllProjects } from "../../lib/projects"

function Articles() {
  return (
    <>
      <section className="mx-auto my-8 max-w-2xl space-y-6 bg-white antialiased dark:bg-gray-900 lg:my-16">
        <div className="mx-auto max-w-screen-md px-4">
          <h2 className="mt-3 text-center text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Showcasing My Journey in Technology and Innovation
          </h2>
          <p className="mt-4 text-center text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            Here you can find some of my previous Projects that have at least 3 Months of development time and/or
            personal significance. Each project represents a unique blend of creativity, technical skill, and
            dedication.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <a
            href="/projects"
            title="View all projects"
            className="flex items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            View all projects
            <Image
              className={"ml-2 h-4 w-4"}
              src={"/icon/arrow-right.svg"}
              alt="Arrow right Icon"
              width={32}
              height={32}
            />
          </a>
          <a
            href="/blog"
            title="View all Projects"
            className="flex items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            View Blog posts
            <Image
              className={"ml-2 h-4 w-4"}
              src={"/icon/arrow-right.svg"}
              alt="Arrow right Icon"
              width={32}
              height={32}
            />
          </a>
        </div>
      </section>

      <section className="bg-white antialiased dark:bg-gray-900">
        {/* Grid of 3x3 cards, 1 collum on mobile*/}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {getAllProjects().map((article) => (
            <ProjectTeaser
              key={article.id}
              title={article.title}
              imageUrl={article.fullArticleLink}
              description={article.articleContent}
              technologies={article.technologies}
              ctaText={"Learn More"}
              ctaLink={article.fullArticleLink}
              buttonText={"Learn more"}
              buttonLink={article.fullArticleLink}
              projectDate={article.articleDate}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Articles
