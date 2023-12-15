import { Metadata } from "next"
import ArticleComponent from "../components/ArticleTeaser/ArticleTeaser"
import Image from "next/image"
import React from "react"

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
  const articles = [
    {
      id: 1,
      title: "How to quickly deploy a static website",
      articleDate: new Date("2023-12-01"),
      articleContent:
        "Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.",
      authorImgSrc: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png",
      authorName: "Michael Gouch",
      fullArticleLink: "#",
    },
    {
      id: 2,
      title: "Our first project with React",
      articleDate: new Date("2023-09-15"),
      articleContent:
        "Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.",
      authorImgSrc: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png",
      authorName: "Neil Sims",
      fullArticleLink: "#",
    },
    {
      id: 3,
      title: "Those HTML attributes you never use",
      articleDate: new Date("2023-06-01"),
      articleContent:
        "Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers influence both web designers and developers.",
      authorImgSrc: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png",
      authorName: "Roberta Casas",
      fullArticleLink: "#",
    },
  ]

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
        <div className="mx-auto grid max-w-screen-xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-16 lg:px-6 lg:py-16 ">
          <div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Our Blog</h2>
            <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              We use an agile approach to test assumptions and connect with the needs of your audience early and often.
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {articles.map((article, index) => (
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
