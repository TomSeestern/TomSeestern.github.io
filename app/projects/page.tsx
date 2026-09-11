import Image from "next/image"
import React from "react"
import { Metadata } from "next"
import ProjectTeaser from "../../components/ProjectTeaser/ProjectTeaser"
import { getAllProjects, selectFeaturedProjects } from "../../lib/projects"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Showcasing my journey in technology and innovation. Explore projects spanning LabVIEW, robotics, AI, web development, and more — each representing real problem-solving and technical growth.",
  openGraph: {
    url: "https://tom.segbers.de/projects",
    siteName: "TomSegbers.de",
    title: "Projects | TomSegbers.de",
    description:
      "Showcasing my journey in technology and innovation — projects with real problem-solving and technical depth.",
    images: [
      {
        url: "/img/og-default.png",
        width: 1200,
        height: 630,
        alt: "TomSegbers.de — Tom Segbers, Senior Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/og-default.png"],
  },
}

export default function ProjectsArchive() {
  const projects = getAllProjects()
  const featuredProjectIds = new Set(selectFeaturedProjects(projects).map((project) => project.id))

  return (
    <>
      <section className="bg-surface antialiased">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-2xl space-y-6">
            <h1 className="mt-3 text-center text-h1-sm text-foreground sm:text-h1">
              Showcasing My Journey in Technology and Innovation
            </h1>
            <p className="mt-4 text-center text-body-lg font-light text-muted sm:text-xl">
              Here you can find some of my previous projects that have at least 3 months of development time and/or
              personal significance. Each project represents a unique blend of creativity, technical skill, and
              dedication.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href="/blog"
              title="View all Blog Posts"
              className="flex items-center rounded text-base font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
            >
              View Blog Posts
              <Image className={"ml-2 h-4 w-4"} src={"/icon/arrow-right.svg"} alt="" width={32} height={32} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-surface antialiased" aria-labelledby="project-archive-heading">
        <div className="mx-auto max-w-screen-xl px-4 pb-8 sm:px-6 sm:pb-16 lg:pb-24">
          <div className="max-w-measure-lead">
            <h2 id="project-archive-heading" className="text-h2-sm text-foreground sm:text-h2">
              All projects
            </h2>
            <p className="mt-3 text-body text-muted">
              {projects.length} projects, newest first. Entries marked “Selected” are highlighted in the home page
              featured set.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectTeaser
                key={project.id}
                title={project.title}
                imageUrl={project.fullArticleLink}
                description={project.articleContent}
                technologies={project.technologies}
                ctaLink={project.fullArticleLink}
                projectDate={project.articleDate}
                featured={featuredProjectIds.has(project.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
