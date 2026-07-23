import { Home } from "lucide-react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { BreadcrumbItem, Breadcrumbs } from "@/components/Breadcrumbs/Breadcrumbs"
import { getMarkdownEntry } from "@/lib/markdown"

const CONTENT_DIR = "content/pages"
const SLUG = "now"

export default function Page(): JSX.Element {
  const fileContent = getMarkdownEntry(SLUG, CONTENT_DIR)

  if (!fileContent) {
    notFound()
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumbs className="py-2">
          <BreadcrumbItem href="/" icon={Home}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem className="truncate">{fileContent.data.title || "Now"}</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <article className="prose prose-lg max-w-none font-body dark:prose-invert">
          <h1 className="text-h1-sm sm:text-h1">{fileContent.data.title || "Now"}</h1>
          <ReactMarkdown components={{ h1: () => null }}>{fileContent.content}</ReactMarkdown>
        </article>
      </div>
    </>
  )
}

export function generateMetadata(): Metadata {
  const fileContent = getMarkdownEntry(SLUG, CONTENT_DIR)

  if (!fileContent) {
    return {
      title: "Not Found",
      description: "Page not found",
    }
  }

  const title = fileContent.data.title || "Now"
  const description = fileContent.data.articleContent || ""

  return {
    title,
    description,
    alternates: {
      canonical: "https://tom.segbers.de/now",
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
