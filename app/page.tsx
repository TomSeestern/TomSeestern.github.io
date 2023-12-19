import { Metadata } from "next"
import Image from "next/image"
import React from "react"
import path from "path"
import fs from "fs"
import matter from "gray-matter"
import ProjectTeaser from "../components/ProjectTeaser/ProjectTeaser"
import ArticleComponent from "../components/ArticleTeaser/ArticleTeaser"

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
              Discover new product and best possibilities
            </h1>
            <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value
              and drive economic growth.
            </p>
            <div className="items-center gap-16 sm:flex">
              <div className="mb-8 text-gray-500 dark:text-gray-400 sm:mb-0">
                <Image
                  className="mb-3 h-7 w-7 rounded-full"
                  src="/icon/calender.svg"
                  alt="Calender Icon"
                  width={512}
                  height={512}
                />

                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">28 November 2021</h2>
                <p className="mb-4 font-light">
                  Join us at FlowBite 2021 to understand what’s next as the global tech and startup ecosystem, rethinks
                  the future of everything.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Conference
                  <Image
                    className="-mr-1 ml-2 h-5 w-5"
                    src="/icon/arrow-right.svg"
                    alt="Arrow right Icon"
                    width={512}
                    height={512}
                  />
                </a>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                <Image
                  className="mb-3 h-7 w-7 rounded-full"
                  src="/icon/speaker.svg"
                  alt="Speaker Icon"
                  width={512}
                  height={512}
                />
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">25+ top notch speakers</h2>
                <p className="mb-4 font-light">
                  Here you will find keynote speakers, who all are able to talk about Recruiting. Click on the
                  individual keynote speakers and read more about them and their keynotes.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  <Image className="-ml-1 mr-2 h-5 w-5" src="/icon/list.svg" alt="List Icon" width={512} height={512} />
                  View list
                </a>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 hidden h-full w-1/3 xl:block">
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
              My Recent Projects
            </h2>
            <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              We use an agile approach to test assumptions and connect with the needs of your audience early and often.
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
