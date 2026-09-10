import { Metadata } from "next"
import Image from "next/image"
import React from "react"
import ArticleComponent from "../components/ArticleTeaser/ArticleTeaser"
import FeaturedSet from "../components/FeaturedSet/FeaturedSet"
import FounderArc from "../components/FounderArc/FounderArc"
import { getAllBlogPosts } from "../lib/blog"
import { getAllProjects, selectFeaturedProjects } from "../lib/projects"

export const metadata: Metadata = {
  title: {
    absolute: "TomSegbers.de — Senior Developer",
  },
  description:
    "Personal portfolio of Tom Segbers — Senior Developer. Building reliable systems and solving hard problems. Explore projects, blog posts, and get in touch.",
  openGraph: {
    url: "https://tom.segbers.de/",
    siteName: "TomSegbers.de",
    title: "TomSegbers.de — Senior Developer",
    description:
      "Personal portfolio of Tom Segbers — Senior Developer. Building reliable systems and solving hard problems.",
    images: [
      {
        url: "/img/logo.png",
        width: 512,
        height: 512,
        alt: "TomSegbers.de logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/logo.png"],
  },
}

export default function Web() {
  const featuredProjects = selectFeaturedProjects(getAllProjects())

  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-20 lg:py-28">
          <h1 className="max-w-measure-display text-h2-sm leading-none text-foreground sm:text-h1">
            Tom Segbers — Senior Developer
          </h1>
          <p className="mt-6 max-w-measure-lead text-body-lg font-light text-muted sm:text-xl">
            Building reliable systems and solving hard problems.
          </p>
        </div>
      </section>

      <FeaturedSet projects={featuredProjects} />

      <FounderArc />

      <section className="bg-surface">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
          <div>
            <h2 className="mb-4 text-h2-sm text-foreground sm:text-h2">My Recent Blog Posts</h2>
            <p className="text-body-lg font-light text-muted">
              These are some of my recent Blog Posts. I write about a variety of topics, including AI, Tech, and more.
            </p>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {getAllBlogPosts()
              .slice(0, 4)
              .map((article) => (
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
          <div className="mt-8 flex justify-end">
            <a
              href="/blog"
              title="View all Blog Posts"
              className="flex items-center rounded text-base font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
            >
              View all Blog Posts
              <Image className={"ml-2 h-4 w-4"} src={"/icon/arrow-right.svg"} alt="" width={32} height={32} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
