import { Home } from "lucide-react"
import { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MarkdownAsync } from "react-markdown"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { BreadcrumbItem, Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs"
import { getMarkdownEntry, getMarkdownSlugs, getReadingTime } from "@/lib/markdown"

const CONTENT_DIR = "content/projects"
const SITE_URL = "https://tom.segbers.de"

interface Params {
  readonly params: Promise<{ slug: string }>
}

export default async function Page({ params }: Params): Promise<JSX.Element> {
  const { slug } = await params
  const fileContent = getMarkdownEntry(slug, CONTENT_DIR)

  if (!fileContent) {
    notFound()
  }

  const readingTime = getReadingTime(fileContent.content)
  const canonicalUrl = `${SITE_URL}/projects/entry/${slug}`

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumbs className="py-2">
          <BreadcrumbItem href="/" icon={Home}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem className="truncate">{fileContent.data.title || "Content "}</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        {fileContent.data.tags && fileContent.data.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {fileContent.data.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/projects?tag=${tag}`}
                className="inline-flex items-center rounded bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-soft-foreground transition-colors duration-200 hover:bg-accent-soft-contrast dark:bg-accent-soft-dark dark:text-accent-soft-foreground-dark"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <article className="prose prose-lg max-w-none font-body dark:prose-invert">
          <h1 className="mb-2 text-h1-sm text-foreground dark:text-foreground-dark sm:text-h1">
            {fileContent.data.title || "Project"}
          </h1>

          <p className="mb-8 text-sm text-muted dark:text-muted-dark">
            {readingTime}
            {fileContent.data.articleDate &&
              ` · ${new Date(fileContent.data.articleDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
          </p>

          <MarkdownAsync
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeSlug,
              rehypeAutolinkHeadings,
              [
                rehypePrettyCode,
                { theme: { dark: "github-dark-dimmed", light: "github-light" }, keepBackground: false },
              ],
            ]}
            components={{ h1: () => null }}
          >
            {fileContent.content}
          </MarkdownAsync>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              headline: fileContent.data.title || "Project",
              datePublished: (fileContent.data.articleDate as Date)?.toISOString?.() ?? undefined,
              author: { "@type": "Person", name: fileContent.data.authorName || "Tom Segbers" },
              image: `${SITE_URL}/img/logo.png`,
              url: canonicalUrl,
            }),
          }}
        />
      </div>
    </>
  )
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getMarkdownSlugs(CONTENT_DIR)
}

export async function generateMetadata({ params }: Params, _parent: ResolvingMetadata): Promise<Metadata> {
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
      canonical: `https://tom.segbers.de/projects/entry/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
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
      title,
      description,
      images: ["/img/logo.png"],
    },
  }
}
