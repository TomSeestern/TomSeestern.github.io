import { Metadata } from "next"
import Image from "next/image"
import React from "react"
import ProjectTeaser from "../../components/ProjectTeaser/ProjectTeaser"
import { getAllProjects } from "../../lib/projects"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Showcasing my journey in technology and innovation. Explore 21+ projects spanning LabVIEW, robotics, AI, web development, and more — each representing real problem-solving and technical growth.",
  openGraph: {
    url: "https://tom.segbers.de/projects",
    siteName: "TomSegbers.de",
    title: "Projects | TomSegbers.de",
    description:
      "Showcasing my journey in technology and innovation — 21+ projects with real problem-solving and technical depth.",
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

function Articles() {
  return (
    <>
      <section className="bg-surface antialiased dark:bg-surface-dark">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-2xl space-y-6">
            <h1 className="mt-3 text-center text-h1-sm text-foreground dark:text-foreground-dark sm:text-h1">
              Showcasing My Journey in Technology and Innovation
            </h1>
            <p className="mt-4 text-center text-base font-normal text-muted dark:text-muted-dark sm:text-xl">
              Here you can find some of my previous Projects that have at least 3 Months of development time and/or
              personal significance. Each project represents a unique blend of creativity, technical skill, and
              dedication.
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/projects"
              title="View all projects"
              className="flex items-center rounded text-base font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-accent-dark dark:focus-visible:ring-accent-soft-dark"
            >
              View all projects
              <Image
                className={"ml-2 size-4 dark:invert"}
                src={"/icon/arrow-right.svg"}
                alt=""
                width={32}
                height={32}
              />
            </a>
            <a
              href="/blog"
              title="View all Projects"
              className="flex items-center rounded text-base font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-accent-dark dark:focus-visible:ring-accent-soft-dark"
            >
              View Blog posts
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

      <section className="bg-surface antialiased dark:bg-surface-dark">
        {/* Grid of 3x3 cards, 1 collum on mobile*/}
        <div className="mx-auto max-w-screen-xl px-4 pb-8 sm:px-6 sm:pb-16 lg:pb-24">
          <h2 className="sr-only">Project archive</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {getAllProjects().map((article) => (
              <ProjectTeaser
                key={article.id}
                title={article.title}
                description={article.articleContent}
                technologies={article.technologies}
                ctaLink={article.fullArticleLink}
                projectDate={article.articleDate}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Articles
