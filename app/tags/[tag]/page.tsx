import { Metadata, ResolvingMetadata } from "next"
import { metadata as layoutMetadata } from "@/app/layout"
import { notFound } from "next/navigation"
import { HiHome } from "react-icons/hi"
import ArticleComponent from "@/components/ArticleTeaser/ArticleTeaser"
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb/Breadcrumb"
import ProjectTeaser from "@/components/ProjectTeaser/ProjectTeaser"
import { getAllTags, getTagBySlug } from "@/lib/tags"
import type { TaggedEntry } from "@/lib/tags"

interface Params {
  params: Promise<{
    tag: string
  }>
}

function renderEntry(entry: TaggedEntry) {
  if (entry.collection === "project") {
    return (
      <ProjectTeaser
        title={entry.title}
        imageUrl={entry.fullArticleLink}
        description={entry.articleContent}
        technologies={entry.technologies}
        ctaLink={entry.fullArticleLink}
        projectDate={entry.articleDate}
        featured={entry.featured}
      />
    )
  }

  return (
    <ArticleComponent
      title={entry.title}
      articleDate={entry.articleDate}
      articleContent={entry.articleContent}
      authorImgSrc={entry.authorImgSrc}
      authorName={entry.authorName}
      fullArticleLink={entry.fullArticleLink}
      tags={entry.tags}
    />
  )
}

export default async function TagArchive({ params }: Params): Promise<JSX.Element> {
  const { tag: slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    notFound()
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumb className="py-2">
          <BreadcrumbItem href="/">
            <HiHome className="mr-2 inline h-4 w-4" />
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/tags">Tags</BreadcrumbItem>
          <BreadcrumbItem>{tag.label}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <section className="bg-surface antialiased">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
          <header className="mx-auto max-w-measure-lead text-center">
            <h1 className="text-h1-sm text-foreground sm:text-h1">{tag.label}</h1>
            <p className="mt-4 text-body-lg font-light text-muted sm:text-xl">
              {tag.count === 1
                ? "1 blog post or project filed under this tag, newest first."
                : `${tag.count} blog posts and projects filed under this tag, newest first.`}
            </p>
          </header>
          <h2 className="sr-only">Tagged entries</h2>
          <div className="motion-rise mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {tag.entries.map((entry) => (
              <div key={entry.fullArticleLink} className="min-w-0">
                {renderEntry(entry)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams(): Promise<{ tag: string }[]> {
  return getAllTags().map((tag) => ({ tag: tag.slug }))
}

export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const { tag: slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    return {
      title: "Tag not found",
      description: "This tag does not exist.",
    }
  }

  const description = `Blog posts and projects filed under ${tag.label} on TomSegbers.de.`

  return {
    title: `Tag: ${tag.label}`,
    description,
    alternates: {
      canonical: new URL(`/tags/${tag.slug}`, layoutMetadata.metadataBase || "https://tom.segbers.de").toString(),
    },
    openGraph: {
      title: `Tag: ${tag.label} | TomSegbers.de`,
      description,
      type: "website",
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
      title: `Tag: ${tag.label} | TomSegbers.de`,
      description,
      images: ["/img/og-default.png"],
    },
  }
}
