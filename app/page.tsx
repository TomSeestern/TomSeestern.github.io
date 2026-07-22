import { Metadata } from "next"
import Image from "next/image"
import React from "react"
import ArticleComponent from "../components/ArticleTeaser/ArticleTeaser"
import { Button } from "../components/Button/Button"
import { HeroContainer, HeroH1, HeroItem, HeroP } from "../components/HeroStagger/HeroStagger"
import ProjectTeaser from "../components/ProjectTeaser/ProjectTeaser"
import { getAllBlogPosts } from "../lib/blog"
import { getAllProjects } from "../lib/projects"

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
  return (
    <>
      <section className="relative overflow-hidden bg-surface dark:bg-surface-dark">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24 xl:grid xl:grid-cols-12 xl:gap-8">
          <div className="col-span-8">
            <HeroContainer>
              <HeroH1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-foreground dark:text-foreground-dark md:text-5xl lg:text-6xl">
                Tom Segbers — Senior Developer
              </HeroH1>
              <HeroP className="mb-6 font-light text-muted dark:text-muted-dark md:text-lg lg:mb-8 lg:text-xl">
                Building reliable systems and solving hard problems.
              </HeroP>
              <HeroItem className="flex flex-col items-center gap-8 sm:flex-row">
                {/* Project Section */}
                <div className="mb-8 flex-1 text-muted dark:text-muted-dark sm:mb-0">
                  <h2 className="mb-3 text-xl font-semibold text-foreground dark:text-foreground-dark">
                    Latest Project: LAYZR.gg
                  </h2>
                  <p className="mb-4 line-clamp-3 min-h-teaser font-light ">
                    Dive into the details of my recent project, LAYZR.gg, where I explore digital collectibles and the
                    unique digital identity they provide.
                  </p>
                  <Button intent="primary" size="lg" href="/projects">
                    Learn More
                  </Button>
                </div>
                {/* Blog Section */}
                <div className="mb-0 flex-1 text-muted dark:text-muted-dark">
                  <h2 className="mb-3 text-xl font-semibold text-foreground dark:text-foreground-dark">
                    Recent Blog Posts
                  </h2>
                  <p className="mb-4 line-clamp-3 min-h-teaser font-light ">
                    Explore my latest thoughts and insights on Tech, AI and sometimes a bit about software development.
                    Mostly lessons learned from my projects.
                  </p>
                  <Button intent="secondary" size="lg" href="/blog">
                    Read the Blog
                  </Button>
                </div>
              </HeroItem>
            </HeroContainer>
          </div>
          <div className="absolute right-0 top-0 hidden h-full w-1/3 xl:block">
            <Image
              className="size-full object-cover"
              src="/img/Tom_Segbers_Frontal.webp"
              alt="Frontal image of Tom Segbers"
              height={1368}
              width={1091}
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-8 dark:bg-surface-dark sm:py-16 lg:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
              My Recent Projects
            </h2>
            <p className="font-light text-muted dark:text-muted-dark sm:text-xl">
              Learn more about the Projects that I worked on recently, how we diagnosed problems, implemented solutions
              and created Customer value!
            </p>
          </div>
        </div>
        <div data-testid="project-marquee" className="relative isolate flex overflow-hidden py-2">
          <div className="relative z-0 flex animate-marquee space-x-4 motion-reduce:animate-none">
            {getAllProjects().map((article) => (
              <div key={article.id} className="size-96">
                <ProjectTeaser
                  key={article.id}
                  title={article.title}
                  description={article.articleContent}
                  technologies={article.technologies}
                  ctaLink={article.fullArticleLink}
                  projectDate={article.articleDate}
                />
              </div>
            ))}
          </div>

          <div className="absolute z-0 flex animate-marquee2 space-x-4 px-2 motion-reduce:animate-none">
            {getAllProjects().map((article) => (
              <div key={article.id} className="size-96">
                <ProjectTeaser
                  key={article.id}
                  title={article.title}
                  description={article.articleContent}
                  technologies={article.technologies}
                  ctaLink={article.fullArticleLink}
                  projectDate={article.articleDate}
                />
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            data-testid="project-marquee-start-guard"
            className="absolute inset-y-0 left-0 z-marquee w-48 bg-surface-muted dark:bg-surface-dark sm:w-112"
          />
          <div
            aria-hidden="true"
            data-testid="project-marquee-end-guard"
            className="absolute inset-y-0 right-0 z-marquee w-48 bg-surface-muted dark:bg-surface-dark sm:w-112"
          />
        </div>
        <div className="mx-auto flex max-w-screen-xl justify-end px-4 pt-8 sm:px-6 sm:pt-16 lg:pt-24">
          <a
            href="/projects"
            title="View all Projects"
            className="flex items-center rounded text-base font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-accent-dark dark:hover:text-accent-light dark:focus-visible:ring-accent-soft-dark"
          >
            View all Projects
            <Image className={"ml-2 size-4 dark:invert"} src={"/icon/arrow-right.svg"} alt="" width={32} height={32} />
          </a>
        </div>
      </section>

      <section className="bg-surface dark:bg-surface-dark">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
          <div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
              My Recent Blog Posts
            </h2>
            <p className="font-light text-muted dark:text-muted-dark sm:text-xl">
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
              className="flex items-center rounded text-base font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-accent-dark dark:hover:text-accent-light dark:focus-visible:ring-accent-soft-dark"
            >
              View all Blog Posts
              <Image
                className={"ml-2 size-4 dark:invert"}
                src={"/icon/arrow-right.svg"}
                alt=""
                width={32}
                height={32}
              />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
