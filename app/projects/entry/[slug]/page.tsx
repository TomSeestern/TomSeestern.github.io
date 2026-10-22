import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { metadata as layoutMetadata } from "@/app/layout"
import { ArchiveRow } from "@/components/ArchiveRow/ArchiveRow"
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb/Breadcrumb"
import CaseStudyHero from "@/components/CaseStudyMeta/CaseStudyHero"
import { Home } from "@/components/Icon/Home"
import { PageHero } from "@/components/PageHero/PageHero"
import { ProjectCover } from "@/components/ProjectCover/ProjectCover"
import { ProjectDossier } from "@/components/ProjectDossier/ProjectDossier"
import { Section } from "@/components/Section/Section"
import { SectionHeading } from "@/components/SectionHeading/SectionHeading"
import { getAdjacentEntries } from "@/lib/content"
import { formatYear } from "@/lib/format-date"
import { getMarkdownEntry, getMarkdownSlugs, parseFrontmatter } from "@/lib/markdown"
import { getAllProjects } from "@/lib/projects"

const CONTENT_DIR = "content/projects"

interface Params {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: Params): Promise<JSX.Element> {
  const { slug } = await params
  const fileContent = getMarkdownEntry(slug, CONTENT_DIR)

  if (!fileContent) {
    notFound()
  }

  const frontmatter = parseFrontmatter(fileContent.data)
  const title = frontmatter.title || "Project"
  const projects = getAllProjects()
  const nextProject = getAdjacentEntries(projects, slug).next
  const nextIndex = nextProject ? projects.findIndex((project) => project.id === nextProject.id) : -1

  return (
    <>
      <div className="mx-auto w-full max-w-width-page px-4 pt-6 sm:px-6 lg:px-10">
        <Breadcrumb>
          <BreadcrumbItem href="/">
            <Home className="mr-2 size-3.5" />
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem>{title}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <PageHero
        titleId="project-title"
        eyebrow={`Case file · ${formatYear(frontmatter.articleDate)}`}
        title={title}
        lead={frontmatter.articleContent || undefined}
        size="compact"
      />

      <Section tone="canvas" className="py-10 sm:py-14 lg:py-16">
        <ProjectCover
          slug={slug}
          index={projects.findIndex((project) => project.id === slug)}
          className="mb-10 aspect-[16/7] rounded-lg border border-rule"
        />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-16">
          <article
            data-testid="project-body"
            className="prose prose-lg max-w-none font-prose prose-headings:font-display prose-headings:text-ink prose-p:text-ink-muted"
          >
            <CaseStudyHero src={frontmatter.heroImage} />
            <ReactMarkdown components={{ h1: () => null }}>{fileContent.content}</ReactMarkdown>
          </article>

          <ProjectDossier
            year={formatYear(frontmatter.articleDate)}
            stack={frontmatter.technologies}
            subjects={frontmatter.tags}
            role={frontmatter.role}
            outcome={frontmatter.outcome}
            metrics={frontmatter.metrics}
          />
        </div>
      </Section>

      <Section tone="panel" labelledBy="next-project-title" className="py-16 sm:py-24">
        <SectionHeading
          id="next-project-title"
          eyebrow="II / Next"
          title="Next project"
          lead="The archive is a loop; the next older case file is below."
          action={
            <a
              href="/projects"
              className="focus-ring inline-flex min-h-11 items-center rounded-md border border-rule-strong bg-panel px-5 py-2 font-body text-sm font-medium text-ink hover:border-ink hover:bg-canvas-deep"
            >
              Back to the archive
            </a>
          }
        />
        {nextProject ? (
          <ArchiveRow project={nextProject} index={nextIndex >= 0 ? nextIndex : 0} className="mt-8" />
        ) : null}
      </Section>
    </>
  )
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getMarkdownSlugs(CONTENT_DIR)
}

export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params
  const fileContent = getMarkdownEntry(slug, CONTENT_DIR)

  if (!fileContent) {
    return {
      title: "Not Found",
      description: "Project not found",
    }
  }

  const title = fileContent.data.title || "Project"
  const description = fileContent.data.articleContent || ""

  return {
    title,
    description,
    alternates: {
      canonical: new URL(`/projects/entry/${slug}`, layoutMetadata.metadataBase || "https://tom.segbers.de").toString(),
    },
    openGraph: {
      title,
      description,
      type: "article",
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
      title,
      description,
      images: ["/img/og-default.png"],
    },
  }
}
