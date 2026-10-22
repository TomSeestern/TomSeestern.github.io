import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb/Breadcrumb"
import { Home } from "@/components/Icon/Home"
import { PageHero } from "@/components/PageHero/PageHero"
import { PixelSigil } from "@/components/PixelSigil/PixelSigil"
import { Section } from "@/components/Section/Section"
import { getAllTags } from "@/lib/tags"

export const metadata: Metadata = {
  title: "Tags",
  description:
    "Browse every blog post and project by topic. A server-rendered index of all content tags on TomSegbers.de.",
  openGraph: {
    url: "https://tom.segbers.de/tags",
    siteName: "TomSegbers.de",
    title: "Tags | TomSegbers.de",
    description: "Browse every blog post and project by topic.",
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

export default function TagsIndex() {
  const tags = getAllTags()
  const totalEntries = new Set(tags.flatMap((tag) => tag.entries.map((entry) => entry.fullArticleLink))).size
  const alphabetised = [...tags].sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }))

  const groups = new Map<string, typeof alphabetised>()
  for (const tag of alphabetised) {
    const initial = tag.label.charAt(0).toUpperCase()
    const key = /[A-Z]/.test(initial) ? initial : "#"
    groups.set(key, [...(groups.get(key) ?? []), tag])
  }

  return (
    <>
      <div className="mx-auto w-full max-w-width-page px-4 pt-6 sm:px-6 lg:px-10">
        <Breadcrumb>
          <BreadcrumbItem href="/">
            <Home className="mr-2 size-3.5" />
            Home
          </BreadcrumbItem>
          <BreadcrumbItem>Tags</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <PageHero
        titleId="tags-title"
        eyebrow="Index"
        title="Tags"
        lead={`${tags.length} tags across ${totalEntries} blog posts and projects. Pick a topic to see everything filed under it.`}
        size="compact"
        aside={
          <div className="rounded-lg border border-rule bg-panel p-4">
            <div className="flex items-start justify-between gap-4">
              <PixelSigil slug="the-index" size="sm" className="size-8" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Contents</span>
            </div>
            <dl className="mt-5 space-y-3 border-t border-rule pt-3 font-body text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Tags</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{tags.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Entries</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{totalEntries}</dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section tone="canvas" labelledBy="tag-list-title" className="py-10 sm:py-14 lg:py-16">
        <h2 id="tag-list-title" className="sr-only">
          All tags
        </h2>
        <ul
          data-testid="tag-index-list"
          className="border-t border-rule pt-8 lg:columns-2 lg:gap-x-20 [&>li]:mb-8 [&>li]:break-inside-avoid"
        >
          {Array.from(groups.entries()).map(([initial, group]) => (
            <li key={initial} className="min-w-0">
              <h3 className="border-b border-rule pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">
                {initial}
              </h3>
              <ul className="divide-y divide-rule">
                {group.map((tag) => (
                  <li key={tag.slug}>
                    <Link
                      href={`/tags/${tag.slug}`}
                      className="focus-ring group flex min-h-12 items-baseline justify-between gap-4 py-3"
                    >
                      <span className="min-w-0 break-words font-body text-base text-ink group-hover:text-crimson">
                        {tag.label}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                        {tag.count} {tag.count === 1 ? "entry" : "entries"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
