import { Metadata, ResolvingMetadata } from "next"
import { metadata as layoutMetadata } from "@/app/layout"
import { notFound } from "next/navigation"
import { HiHome } from "react-icons/hi"
import ReactMarkdown from "react-markdown"
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb/Breadcrumb"
import { getMarkdownEntry, getMarkdownSlugs } from "@/lib/markdown"

const CONTENT_DIR = "content/blog"

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

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumb className="py-2">
          <BreadcrumbItem href="/">
            <HiHome className="mr-2 inline h-4 w-4" />
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
          <BreadcrumbItem>{fileContent.data.title || "Content "}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h1 className="text-h1-sm sm:text-h1">{fileContent.data.title || "Blog Post"}</h1>
          <ReactMarkdown components={{ h1: () => null }}>{fileContent.content}</ReactMarkdown>
        </article>
      </div>
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
      description: "Blog post not found",
    }
  }

  const title = fileContent.data.title || "Blog Post"
  const description = fileContent.data.articleContent || ""

  return {
    title,
    description,
    alternates: {
      canonical: new URL(`/blog/entry/${slug}`, layoutMetadata.metadataBase || "https://tom.segbers.de").toString(),
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
