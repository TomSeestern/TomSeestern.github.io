import type { Metadata, ResolvingMetadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { metadata as layoutMetadata } from "@/app/layout"
import { ArticleCard } from "@/components/ArticleCard/ArticleCard"
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb/Breadcrumb"
import { Home } from "@/components/Icon/Home"
import { MonumentCard } from "@/components/MonumentCard/MonumentCard"
import { PageHero } from "@/components/PageHero/PageHero"
import { PixelSigil } from "@/components/PixelSigil/PixelSigil"
import { Section } from "@/components/Section/Section"
import { getAllTags, getTagByLegacySlug, getTagBySlug } from "@/lib/tags"
import type { TaggedEntry } from "@/lib/tags"

interface Params {
  params: Promise<{
    tag: string
  }>
}

function renderEntry(entry: TaggedEntry, index: number) {
  if (entry.collection === "project") {
    return <MonumentCard project={entry} index={index} />
  }

  return <ArticleCard entry={entry} index={index} />
}

export default async function TagArchive({ params }: Params): Promise<JSX.Element> {
  const { tag: slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    const legacy = getTagByLegacySlug(slug)
    if (legacy) {
      permanentRedirect(`/tags/${legacy.slug}`)
    }
    notFound()
  }

  return (
    <>
      <div className="mx-auto w-full max-w-width-page px-4 pt-6 sm:px-6 lg:px-10">
        <Breadcrumb>
          <BreadcrumbItem href="/">
            <Home className="mr-2 size-3.5" />
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/tags">Tags</BreadcrumbItem>
          <BreadcrumbItem>{tag.label}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <PageHero
        titleId="tag-title"
        eyebrow="Filed under"
        title={tag.label}
        lead={
          tag.count === 1
            ? "1 blog post or project filed under this tag, newest first."
            : `${tag.count} blog posts and projects filed under this tag, newest first.`
        }
        size="compact"
        aside={
          <div className="rounded-lg border border-rule bg-panel p-4">
            <div className="flex items-start justify-between gap-4">
              <PixelSigil slug={`tag-${tag.slug}`} size="sm" className="size-8" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Filed</span>
            </div>
            <p className="mt-5 border-t border-rule pt-3 font-body text-sm text-ink-muted">Entries</p>
            <p className="mt-1 font-mono text-2xl leading-none text-ink">{tag.count}</p>
          </div>
        }
      />

      <Section tone="canvas" labelledBy="tagged-entries-title" className="py-10 sm:py-14 lg:py-16">
        <h2 id="tagged-entries-title" className="sr-only">
          Tagged entries
        </h2>
        <div data-testid="tag-grid" className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {tag.entries.length > 0 ? (
            tag.entries.map((entry, index) => (
              <div key={`${entry.collection}-${entry.fullArticleLink}`} className="min-w-0">
                {renderEntry(entry, index)}
              </div>
            ))
          ) : (
            <p
              data-testid="tag-empty"
              className="border border-rule-strong bg-panel p-6 font-body text-body text-ink-muted"
            >
              No entries are filed under this tag yet.
            </p>
          )}
        </div>
      </Section>
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
