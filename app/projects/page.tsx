import matter from "gray-matter"
import Image from "next/image"
import React from "react"
import fs from "fs"
import path from "path"
import ProjectTeaser from "../../components/ProjectTeaser/ProjectTeaser"

function Articles() {
  const postsDirectory = path.join(process.cwd(), "app/projects/entry/")
  const filenames = fs.readdirSync(postsDirectory)

  const articles = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename)

      // Check if filePath is a file, not a directory
      if (fs.statSync(filePath).isFile()) {
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data } = matter(fileContents)

        console.log("File read: ", filePath, " Tech: ", data.technologies)

        return {
          id: filename.replace(/\.md?$/, ""),
          title: data.title || "Untitled",
          articleDate: new Date(data.articleDate || "1990-01-01"),
          articleContent: data.articleContent || "Failed to load content",
          authorImgSrc: data.authorImgSrc || "/img/placeholder.png",
          authorName: data.authorName || "Anonymous",
          fullArticleLink: "/projects/entry/" + filename.replace(/\.md?$/, ""),
          technologies: data.technologies || [],
        }
      } else {
        return null
      }
    })
    .filter(Boolean) // Filter out undefined values (directories)
    .sort((a, b) => b.articleDate.valueOf() - a.articleDate.valueOf()) // Sort by date, newest first (descending)

  return (
    <>
      <section className="mx-auto max-w-2xl space-y-6 bg-white antialiased dark:bg-gray-900">
        <div className="mx-auto max-w-screen-md px-4 pt-8 lg:pt-16">
          <h2 className="mt-3 text-center text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Showcasing My Journey in Technology and Innovation
          </h2>
          <p className="mt-4 text-center text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            Each project represents a unique blend of creativity, technical skill, and dedication. Discover how I
            approach challenges and innovate solutions.
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
            href="/projects"
            title="View all Projects"
            className="flex items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            View Projects
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
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
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Articles
