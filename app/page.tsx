import { Metadata } from "next"

import { Button } from "components/Button/Button"
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
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              Next.js Enterprise Boilerplate
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              Jumpstart your enterprise project with our feature-packed, high-performance Next.js boilerplate!
              Experience rapid UI development, AI-powered code reviews, and an extensive suite of tools for a smooth and
              enjoyable development process.
            </p>
            <Button href="https://github.com/Blazity/next-enterprise" className="mr-3">
              Get started
            </Button>
            <Button
              href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
              intent="secondary"
            >
              Deploy Now
            </Button>
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
