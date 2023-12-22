import matter from "gray-matter"
import { Metadata } from "next"
import React from "react"
import fs from "fs"
import path from "path"
import ArticleComponent from "../components/ArticleTeaser/ArticleTeaser"
import ProjectTeaser from "../components/ProjectTeaser/ProjectTeaser"

export const metadata: Metadata = {
  title: "Next.js Enterprise Boilerplate",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://next-enterprise.vercel.app/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/project-logo.png",
      },
    ],
  },
}

export default function Web() {
  const postsDirectory = path.join(process.cwd(), "app/blog/entry/")
  const filenames = fs.readdirSync(postsDirectory)

  const articles = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename)

      // Check if filePath is a file, not a directory
      if (fs.statSync(filePath).isFile()) {
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data } = matter(fileContents)

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
      <section className="relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl gap-8 px-4 py-8 lg:py-16 xl:grid xl:grid-cols-12">
          <div className="col-span-8">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Exploring Innovation and Creativity in Technology
            </h1>
            <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              Welcome to my digital space where I share insights and developments on my latest tech projects and
              thought-provoking articles on various tech topics.
            </p>
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              {/* Project Section */}
              <div className="mb-8 flex-1 text-gray-500 dark:text-gray-400 sm:mb-0">
                {/* TODO: Replace with your project image and details */}
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Latest Project: LAYZR.gg</h2>
                <p className="mb-4 line-clamp-3 min-h-[4.5rem] font-light ">
                  Dive into the details of my recent project, LAYZR.gg, where I explore digital collectibles and the
                  unique digital identity they provide.
                </p>
                <a
                  href="/projects"
                  className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Learn More
                </a>
              </div>
              {/* Blog Section */}
              <div className="mb-0 flex-1 text-gray-500 dark:text-gray-400">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Recent Blog Posts</h2>
                <p className="mb-4 line-clamp-3 min-h-[4.5rem] font-light ">
                  Explore my latest thoughts and insights on Tech, AI and sometimes a bit about software development.
                  Mostly lessons learned from my projects.
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  Read the Blog
                </a>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 hidden h-full w-1/3 xl:block">
            {/* TODO: Replace with a relevant personal image*/}
            <img
              className="h-full w-full object-cover"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/conference-speaker.jpg"
              alt="Conference speaker"
            />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="relative flex overflow-hidden py-8">
          <div className="flex animate-marquee space-x-8">
            {articles.map((article, index) => (
              <div key={article.id} className="max-w-sm">
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
              </div>
            ))}
          </div>

          <div className="absolute flex animate-marquee2 space-x-8 px-4">
            {articles.map((article, index) => (
              <div key={article.id} className="max-w-sm">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-16 lg:px-6 lg:py-16 ">
          <div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              My Recent Blog Posts
            </h2>
            <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              These are some of my recent Blog Posts. I write about a variety of topics, including AI, Tech, and more.
            </p>
          </div>
          <div className="my-8 md:grid md:grid-cols-2 md:gap-16 md:gap-y-4">
            {articles.slice(0, 3).map((article, index) => (
              <ArticleComponent
                key={article.id}
                title={article.title}
                articleDate={article.articleDate}
                articleContent={article.articleContent}
                authorImgSrc={article.authorImgSrc}
                authorName={article.authorName}
                fullArticleLink={article.fullArticleLink}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
