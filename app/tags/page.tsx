import { Metadata } from "next"
import Link from "next/link"
import { HiHome } from "react-icons/hi"
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb/Breadcrumb"
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

function entryCountLabel(count: number): string {
  return count === 1 ? "1 entry" : `${count} entries`
}

export default function TagsIndex() {
  const tags = getAllTags()
  const totalEntries = new Set(tags.flatMap((tag) => tag.entries.map((entry) => entry.fullArticleLink))).size

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumb className="py-2">
          <BreadcrumbItem href="/">
            <HiHome className="mr-2 inline h-4 w-4" />
            Home
          </BreadcrumbItem>
          <BreadcrumbItem>Tags</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <section className="bg-surface">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
          <header className="mx-auto max-w-measure-lead text-center">
            <h1 className="text-h1-sm text-foreground sm:text-h1">Tags</h1>
            <p className="mt-4 text-body-lg font-light text-muted sm:text-xl">
              {tags.length} tags across {totalEntries} blog posts and projects. Pick a topic to see everything filed
              under it.
            </p>
          </header>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={`/tags/${tag.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-body font-medium text-accent-soft-foreground transition-colors duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
                >
                  <span>{tag.label}</span>
                  <span aria-hidden="true" className="text-caption font-semibold tabular-nums">
                    {tag.count}
                  </span>
                  <span className="sr-only">{entryCountLabel(tag.count)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
