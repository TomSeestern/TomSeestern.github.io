import type { MetadataRoute } from "next"
import { getAllBlogPosts } from "./blog"
import { getAllProjects } from "./projects"
import { getAllTags, MIN_INDEXABLE_TAG_ENTRIES } from "./tags"

/**
 * Fixed routes with no content-derived timestamp.
 *
 * `lastModified` is deliberately omitted: it used to be `new Date()`, so every
 * rebuild claimed the whole site had changed and search engines learned to
 * discount the field. Only blog and project entries carry a real date now.
 */
const STATIC_ROUTES: readonly {
  readonly path: string
  readonly changeFrequency: "weekly" | "monthly" | "yearly"
  readonly priority: number
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tags", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.3 },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3 },
]

/**
 * Build the sitemap for a given public origin.
 *
 * Extracted from the route so it can be asserted without invoking Next. Two
 * consecutive calls with the same content return deeply equal output — that
 * property is what keeps `lastmod` meaningful.
 *
 * Tag pages below {@link MIN_INDEXABLE_TAG_ENTRIES} are omitted because they
 * are also `noindex`; listing a `noindex` URL in the sitemap sends contradictory
 * signals.
 */
export function createSitemapEntries(baseUrl: string): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((entry) => ({
    url: `${baseUrl}/blog/entry/${entry.id}`,
    lastModified: entry.articleDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((entry) => ({
    url: `${baseUrl}/projects/entry/${entry.id}`,
    lastModified: entry.articleDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const tagRoutes: MetadataRoute.Sitemap = getAllTags()
    .filter((tag) => tag.count >= MIN_INDEXABLE_TAG_ENTRIES)
    .map((tag) => ({
      url: `${baseUrl}/tags/${tag.slug}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }))

  return [...staticRoutes, ...blogRoutes, ...projectRoutes, ...tagRoutes]
}
