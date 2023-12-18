import path from "path"
import fs from "fs"
import matter from "gray-matter"
import ProjectTeaser from "../../components/ProjectTeaser/ProjectTeaser"
import Image from "next/image"
import React from "react"

function Articles() {
  const postsDirectory = path.join(process.cwd(), "app/blog/entry/")
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
          fullArticleLink: "/blog/entry/" + filename.replace(/\.md?$/, ""),
          technologies: data.technologies || [],
        }
      }
    })
    .filter(Boolean) // Filter out undefined values (directories)
    .sort((a, b) => b.articleDate.valueOf() - a.articleDate.valueOf()) // Sort by date, newest first (descending)

  return (
    <>
      <section className="bg-white antialiased dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
          <div className="max-w-2xl space-y-6">
            <div>
              <p className="text-lg font-medium leading-none text-primary-600 dark:text-primary-500">
                Trusted Worldwide
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Trusted by over 100 companies and 10,000+ freelancers
              </h2>
              <p className="mt-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
                Our rigorous security and compliance standards are at the heart of all we do. We work tirelessly to
                protect you and your customers.
              </p>
            </div>
            <div className="space-y-4">
              <a
                href="#"
                title=""
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
                href="#"
                title=""
                className="flex items-center text-base font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                View all testimonials
                <Image
                  className={"ml-2 h-4 w-4"}
                  src={"/icon/arrow-right.svg"}
                  alt="Arrow right Icon"
                  width={32}
                  height={32}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white antialiased dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6">
          {/* Grid of 3x3 cards, 1 collum on mobile*/}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
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
        </div>
      </section>
    </>
  )
}

export default Articles
