import { Breadcrumb, BreadcrumbItem } from "flowbite-react"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { HiHome } from "react-icons/hi"
import ReactMarkdown from "react-markdown"
import { getMarkdownEntry, getMarkdownSlugs } from "@/lib/markdown"

const CONTENT_DIR = "content/blog"

interface Params {
  params: {
    slug: string
  }
}

export default function Page({ params }: Params): JSX.Element {
  const fileContent = getMarkdownEntry(params.slug, CONTENT_DIR)

  if (!fileContent) {
    notFound()
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumb className="py-2">
          <BreadcrumbItem href="/" icon={HiHome}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
          <BreadcrumbItem className="truncate">{fileContent.data.title || "Content "}</BreadcrumbItem>
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

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const fileContent = getMarkdownEntry(params.slug, CONTENT_DIR)

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
      canonical: `https://tomsegbers.de/blog/entry/${params.slug}`,
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
