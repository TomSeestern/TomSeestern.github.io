import type { Metadata } from "next"
import { ArticleCard } from "@/components/ArticleCard/ArticleCard"
import { Button } from "@/components/Button/Button"
import { ArrowRight } from "@/components/Icon/ArrowRight"
import { PageHero } from "@/components/PageHero/PageHero"
import { PixelSigil } from "@/components/PixelSigil/PixelSigil"
import { Section } from "@/components/Section/Section"
import { SectionHeading } from "@/components/SectionHeading/SectionHeading"
import { TagChip } from "@/components/TagChip/TagChip"
import { getAllBlogPosts } from "@/lib/blog"
import { formatDate } from "@/lib/format-date"
import type { MarkdownEntry } from "@/lib/markdown"
import { getAllTags } from "@/lib/tags"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on technology, homelabs, and software engineering. Personal blog by Tom Segbers covering AI, self-hosting, automation, and lessons learned from real projects.",
  alternates: {
    canonical: "https://tomsegbers.de/blog",
  },
  openGraph: {
    url: "https://tomsegbers.de/blog",
    siteName: "TomSegbers.de",
    title: "Blog | TomSegbers.de",
    description: "Thoughts on technology, homelabs, and software engineering by Tom Segbers.",
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

function ArticleRow({ entry, index }: { entry: MarkdownEntry; index: number }) {
  const [firstTag] = entry.tags

  return (
    <article
      data-testid="article-row"
      className="group relative grid gap-3 border-t border-rule py-6 transition-colors duration-150 hover:bg-canvas-deep sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase leading-4 tracking-widest text-ink-muted">
          {formatDate(entry.articleDate)}
        </p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          {firstTag ? <TagChip label={firstTag} testId="article-tag" /> : null}
        </div>
        <h3 className="mt-2 text-h3 text-ink transition-colors duration-150 group-hover:text-crimson">
          <a
            href={entry.fullArticleLink}
            className="focus-ring rounded-sm decoration-crimson decoration-2 underline-offset-4 after:absolute after:inset-0"
          >
            {entry.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-2 max-w-measure-card font-body text-sm text-ink-muted">{entry.articleContent}</p>
      </div>

      <ArrowRight aria-hidden="true" className="hidden size-4 self-start text-crimson sm:block" />
    </article>
  )
}

export default function BlogIndex() {
  const articles = getAllBlogPosts()
  const [featured, ...rest] = articles
  const allTags = getAllTags()
  const tags = allTags.slice(0, 10)

  return (
    <>
      <PageHero
        titleId="blog-title"
        eyebrow="Journal"
        title="Blog"
        lead={`Thoughts on technology, homelabs, and software engineering. ${articles.length} dispatches, newest first.`}
        size="compact"
        aside={
          <div className="rounded-lg border border-rule bg-panel p-4">
            <div className="flex items-start justify-between gap-4">
              <PixelSigil slug="journal" size="sm" className="size-8" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Summary</span>
            </div>
            <dl className="mt-5 space-y-3 border-t border-rule pt-3 font-body text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Dispatches</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{articles.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Topics</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{allTags.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Newest</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                  {featured ? formatDate(featured.articleDate) : "—"}
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section tone="panel" labelledBy="topics-title" className="py-4 sm:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
            <h2 id="topics-title" className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">
              Topics
            </h2>
            <ul data-testid="blog-topics" className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <TagChip label={tag.label} href={`/tags/${tag.slug}`} />
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/tags"
            className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-2 font-body text-sm font-medium text-ink-muted hover:text-ink"
          >
            All tags
            <ArrowRight className="size-4" />
          </a>
        </div>
      </Section>

      <Section tone="canvas" labelledBy="latest-entries-title" className="py-10 sm:py-12 lg:py-16">
        <SectionHeading
          id="latest-entries-title"
          eyebrow={`I / ${articles.length} dispatches`}
          title="Latest entries"
          lead="The newest dispatch leads; the rest follow in chronological order."
          action={
            <Button href="/tags" variant="secondary" size="sm">
              Browse by tag <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div data-testid="blog-grid" className="mt-8 grid gap-0 md:grid-cols-2">
          {featured ? <ArticleCard entry={featured} index={0} variant="feature" className="md:col-span-2" /> : null}

          {rest.length > 0 ? (
            <div className="mt-6 divide-y divide-rule border-b border-rule md:col-span-2">
              {rest.map((entry, index) => (
                <ArticleRow key={entry.id} entry={entry} index={index + 1} />
              ))}
            </div>
          ) : null}

          {!featured ? (
            <p className="border border-rule-strong bg-panel p-6 font-body text-body text-ink-muted md:col-span-2">
              No dispatches have been published yet.
            </p>
          ) : null}
        </div>
      </Section>
    </>
  )
}
