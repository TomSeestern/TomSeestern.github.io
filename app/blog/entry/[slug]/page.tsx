import type { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { metadata as layoutMetadata } from "@/app/layout"
import { ArticleCard } from "@/components/ArticleCard/ArticleCard"
import { ArticleMeta } from "@/components/ArticleMeta/ArticleMeta"
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb/Breadcrumb"
import { Home } from "@/components/Icon/Home"
import { PageHero } from "@/components/PageHero/PageHero"
import { Section } from "@/components/Section/Section"
import { SectionHeading } from "@/components/SectionHeading/SectionHeading"
import { getAllBlogPosts } from "@/lib/blog"
import { formatDate } from "@/lib/format-date"
import { getMarkdownEntry, getMarkdownSlugs, parseFrontmatter } from "@/lib/markdown"
import { readingTimeMinutes } from "@/lib/reading-time"

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

  const frontmatter = parseFrontmatter(fileContent.data)
  const title = frontmatter.title || "Blog Post"
  const otherPosts = getAllBlogPosts()
    .filter((post) => post.id !== slug)
    .slice(0, 2)

  return (
    <>
      <div className="mx-auto w-full max-w-width-page px-4 pt-6 sm:px-6 lg:px-10">
        <Breadcrumb>
          <BreadcrumbItem href="/">
            <Home className="mr-2 size-3.5" />
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
          <BreadcrumbItem>{title}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <PageHero
        titleId="dispatch-title"
        eyebrow={`Dispatch · ${formatDate(frontmatter.articleDate)}`}
        title={title}
        lead={frontmatter.articleContent || undefined}
        size="compact"
      />

      <Section tone="canvas" className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-measure-article">
          <ArticleMeta
            date={frontmatter.articleDate}
            readingTimeMinutes={readingTimeMinutes(fileContent.content)}
            tags={frontmatter.tags}
            author={frontmatter.authorName}
          />

          <article
            data-testid="article-body"
            className="prose prose-lg mt-10 max-w-none font-prose prose-headings:font-display prose-headings:text-ink prose-p:text-ink-muted"
          >
            <ReactMarkdown components={{ h1: () => null }}>{fileContent.content}</ReactMarkdown>
          </article>

          <aside
            data-testid="author-card"
            className="mt-12 flex items-center gap-4 rounded-lg border border-rule bg-panel p-5"
          >
            <Image
              src={frontmatter.authorImgSrc}
              alt=""
              width={64}
              height={64}
              unoptimized
              className="size-12 shrink-0 rounded-sm border border-rule-strong bg-canvas object-contain p-1"
            />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Words by</p>
              <p className="mt-1 font-body text-sm font-medium text-ink">{frontmatter.authorName}</p>
              <p className="mt-1 font-body text-xs text-ink-muted">Senior developer, systems and interfaces.</p>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="panel" labelledBy="more-dispatches-title" className="py-12 sm:py-16 lg:py-20">
        <SectionHeading
          id="more-dispatches-title"
          eyebrow="II / Continue"
          title="More dispatches"
          lead="Two more notes from the workbench."
        />
        <div data-testid="more-dispatches" className="mt-8 grid gap-6 md:grid-cols-2">
          {otherPosts.map((post, index) => (
            <ArticleCard key={post.id} entry={post} index={index + 1} />
          ))}
        </div>
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
      description: "Blog post not found",
    }
  }

  const title = fileContent.data.title || "Blog Post"
  const description = fileContent.data.articleContent || ""

  return {
    title,
    description,
    alternates: {
      canonical: new URL(`/blog/entry/${slug}`, layoutMetadata.metadataBase || "https://tomsegbers.de").toString(),
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
