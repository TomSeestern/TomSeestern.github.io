import { Breadcrumb, BreadcrumbItem } from "flowbite-react"
import { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HiHome } from "react-icons/hi"
import { MarkdownAsync } from "react-markdown"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { TableOfContents } from "@/components/TableOfContents/TableOfContents"
import { getMarkdownEntry, getMarkdownSlugs, getReadingTime, toSlug } from "@/lib/markdown"

const CONTENT_DIR = "content/blog"
const SITE_URL = "https://tom.segbers.de"

interface Params {
  readonly params: Promise<{ slug: string }>
}

function extractHeadings(content: string): { id: string; text: string; level: 2 | 3 }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: { id: string; text: string; level: 2 | 3 }[] = []
  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]!.length as 2 | 3
    const text = match[2]!.trim()
    headings.push({ id: toSlug(text), text, level })
  }
  return headings
}

export default async function Page({ params }: Params): Promise<JSX.Element> {
  const { slug } = await params
  const fileContent = getMarkdownEntry(slug, CONTENT_DIR)
  if (!fileContent) notFound()

  const title = fileContent.data.title || "Blog Post"
  const readingTime = getReadingTime(fileContent.content)
  const headings = extractHeadings(fileContent.content)
  const canonicalUrl = `${SITE_URL}/blog/entry/${slug}`

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumb className="py-2">
          <BreadcrumbItem href="/" icon={HiHome}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
          <BreadcrumbItem className="truncate">{title}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="mx-auto min-h-screen px-4 py-8 sm:px-6 sm:py-16 lg:flex lg:max-w-6xl lg:gap-8 lg:py-24">
        <div className="flex-1">
          {fileContent.data.tags && fileContent.data.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {fileContent.data.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="inline-flex items-center rounded bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-soft-foreground transition-colors duration-200 hover:bg-accent-soft-contrast dark:bg-accent-soft-dark dark:text-accent-soft-foreground-dark"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <h1 className="mb-2 text-h1-sm text-foreground dark:text-foreground-dark sm:text-h1">{title}</h1>

          <p className="mb-8 text-sm text-muted dark:text-muted-dark">
            {readingTime}
            {fileContent.data.articleDate &&
              ` · ${new Date(fileContent.data.articleDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
          </p>

          <article className="prose prose-lg max-w-none dark:prose-invert">
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
        </div>

        <TableOfContents headings={headings} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: title,
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
  if (!fileContent) return { title: "Not Found", description: "Blog post not found" }

  const title = fileContent.data.title || "Blog Post"
  const description = fileContent.data.articleContent || ""

  return {
    title,
    description,
    alternates: { canonical: `https://tom.segbers.de/blog/entry/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: "/img/logo.png", width: 512, height: 512, alt: "TomSegbers.de logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/img/logo.png"],
    },
  }
}
