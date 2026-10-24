import { getAllBlogPosts } from "./blog"
import type { MarkdownEntry } from "./markdown"
import { getAllProjects } from "./projects"

/**
 * Tag pages below this entry count are `noindex` and excluded from the sitemap.
 * The site has ~120 tag routes for ~34 entries; thin pages that contain one
 * link add crawl noise and dilute the pages that matter. Raise this only if the
 * content volume grows enough that the tag archive becomes genuinely useful.
 */
export const MIN_INDEXABLE_TAG_ENTRIES = 3

/** Which content collection a tagged entry came from. */
export type TagCollection = "blog" | "project"

/**
 * A single entry filed under a canonical tag. It is the full {@link MarkdownEntry}
 * plus the collection it came from, so the tag archive can reuse the shared
 * `ArticleCard` / `MonumentCard` primitives without re-reading frontmatter.
 * `title`, `fullArticleLink`, and `articleDate` are inherited from the entry.
 */
export type TaggedEntry = MarkdownEntry & { readonly collection: TagCollection }

/** A frontmatter entry together with its source collection. */
export interface TagSource {
  readonly entry: MarkdownEntry
  readonly collection: TagCollection
}

/** A canonical tag: display label, URL slug, member count, and its entries. */
export interface TagSummary {
  readonly key: string
  readonly label: string
  readonly slug: string
  readonly count: number
  readonly entries: readonly TaggedEntry[]
}

/**
 * Spellings the camel-case splitter must not touch. `eBay` is the only tag in
 * the current corpus that needs protection; the list stays small on purpose.
 */
const PROTECTED_LABELS = new Map<string, string>([["ebay", "eBay"]])

/**
 * Turns a raw frontmatter tag into the label a reader should see.
 *
 * The content corpus contains joined compounds (`AndroidAppDevelopment`,
 * `FullStackWebDevelopment`, `ArtificialIntelligence`) next to their spaced
 * equivalents. Splitting at a lowercase→uppercase boundary followed by a
 * lowercase word humanises those without damaging acronym endings: `LabVIEW`,
 * `NodeJS`, `iOS` and `NFTs` stay intact because the uppercase run that follows
 * is not the start of a new word. The split is display-only; it does not invent
 * a claim, it only reveals the words already in the tag.
 *
 * @param rawTag - A tag exactly as authored in frontmatter.
 */
export function formatTagLabel(rawTag: string): string {
  const trimmed = rawTag.trim()
  const protectedLabel = PROTECTED_LABELS.get(trimmed.toLowerCase())
  if (protectedLabel) {
    return protectedLabel
  }
  return trimmed
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z][a-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
}

/**
 * Collapses a raw frontmatter tag into its grouping key.
 *
 * The key is the formatted label lowercased, with `_`/`-` separator runs folded
 * into a single space and internal whitespace collapsed. Folding separators and
 * camel boundaries merges punctuation variants of one concept — the content set
 * carries `Digital-Transformation` once and `Digital Transformation` twice, and
 * `ArtificialIntelligence` next to `Artificial Intelligence`. Those pairs must
 * not become two archive entries over one idea. Genuinely distinct keys still
 * collide on slug and throw.
 *
 * @param rawTag - A tag exactly as authored in frontmatter.
 */
export function normalizeTagKey(rawTag: string): string {
  return formatTagLabel(rawTag).replace(/[_-]+/g, " ").replace(/\s+/g, " ").toLowerCase()
}

/**
 * Derives a deterministic, URL-safe slug from a grouping key.
 *
 * `+` is mapped to `-plus` before the generic separator pass so `C++` becomes
 * `c-plus-plus` instead of collapsing to `c`. Every remaining run of characters
 * outside `[a-z0-9]` becomes a single `-`, then leading/trailing `-` are trimmed.
 *
 * @param key - A normalised grouping key from {@link normalizeTagKey}.
 */
export function tagSlug(key: string): string {
  return key
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Picks the canonical display label for a key: the most frequently occurring
 * original raw form, ties broken case-insensitively, then by code-unit order so
 * the result never depends on file-read order.
 */
function canonicalLabel(forms: ReadonlyMap<string, number>): string {
  const ranked = Array.from(forms.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].toLowerCase().localeCompare(b[0].toLowerCase()) || (a[0] < b[0] ? -1 : 1)
  )
  return formatTagLabel(ranked[0]?.[0] ?? "")
}

function compareNewestFirst(a: TaggedEntry, b: TaggedEntry): number {
  return b.articleDate.valueOf() - a.articleDate.valueOf()
}

/**
 * Builds the canonical tag index from tagged sources.
 *
 * Every source entry contributes at most one membership per key even when it
 * lists the same tag twice. Summaries are ordered by member count descending,
 * then label, then key. Entries within a summary are newest-first.
 *
 * @throws When two distinct keys slug to the same value — the error names both
 *         keys so a collision surfaces as a build failure instead of a silent
 *         merge of unrelated tags.
 */
export function buildTagIndex(sources: readonly TagSource[]): readonly TagSummary[] {
  const formsByKey = new Map<string, Map<string, number>>()
  const entriesByKey = new Map<string, TaggedEntry[]>()

  for (const source of sources) {
    const seenKeys = new Set<string>()
    for (const rawTag of source.entry.tags) {
      const key = normalizeTagKey(rawTag)
      if (key.length === 0 || seenKeys.has(key)) {
        continue
      }
      seenKeys.add(key)

      const forms = formsByKey.get(key) ?? new Map<string, number>()
      forms.set(rawTag, (forms.get(rawTag) ?? 0) + 1)
      formsByKey.set(key, forms)

      const members = entriesByKey.get(key) ?? []
      members.push({ ...source.entry, collection: source.collection })
      entriesByKey.set(key, members)
    }
  }

  const slugOwner = new Map<string, string>()
  const summaries: TagSummary[] = []

  for (const [key, forms] of Array.from(formsByKey.entries())) {
    const slug = tagSlug(key)
    const owner = slugOwner.get(slug)
    if (owner !== undefined && owner !== key) {
      throw new Error(
        `Tag slug collision: "${owner}" and "${key}" both map to "${slug}". ` +
          `Rename one of the two tags in content/ so the slugs stay unique.`
      )
    }
    slugOwner.set(slug, key)

    const entries = (entriesByKey.get(key) ?? []).slice().sort(compareNewestFirst)
    summaries.push({ key, label: canonicalLabel(forms), slug, count: entries.length, entries })
  }

  return summaries.sort(
    (a, b) =>
      b.count - a.count || a.label.toLowerCase().localeCompare(b.label.toLowerCase()) || a.key.localeCompare(b.key)
  )
}

/**
 * Reads both content collections and returns the canonical tag index over their
 * frontmatter `tags`. This runs at build time (`generateStaticParams`), so a slug
 * collision throws during `next build`.
 */
export function getAllTags(): readonly TagSummary[] {
  return buildTagIndex([
    ...getAllBlogPosts().map((entry) => ({ entry, collection: "blog" as const })),
    ...getAllProjects().map((entry) => ({ entry, collection: "project" as const })),
  ])
}

/**
 * Canonical tag index scoped to the project collection.
 *
 * The project archive's "Browse by subject" strip and its `Subjects` count
 * must describe projects only. Using the sitewide index there mixes in
 * blog-only tags and inflates shared counts (for example, a tag carried by one
 * project and one blog post would render as `(2)` on the projects page).
 */
export function getAllProjectTags(): readonly TagSummary[] {
  return buildTagIndex(getAllProjects().map((entry) => ({ entry, collection: "project" as const })))
}

/**
 * Looks a canonical tag up by its URL slug.
 *
 * @param slug - The slug segment from `/tags/<slug>`.
 * @returns The matching summary, or `undefined` when no tag has that slug
 *          (callers must render `notFound()`).
 */
export function getTagBySlug(slug: string): TagSummary | undefined {
  return getAllTags().find((tag) => tag.slug === slug)
}

/**
 * Resolves a retired tag slug that differs from the canonical one only by
 * separators.
 *
 * Camel-case keys used to slug without hyphens (`/tags/artificialintelligence`);
 * they now split into words (`/tags/artificial-intelligence`). The route uses
 * this to answer an old URL with a permanent redirect instead of a 404, so the
 * taxonomy repair does not break inbound links.
 *
 * @param slug - A possibly retired slug segment from `/tags/<slug>`.
 */
export function getTagByLegacySlug(slug: string): TagSummary | undefined {
  const compact = slug.replace(/-/g, "")
  if (compact.length === 0) {
    return undefined
  }
  return getAllTags().find((tag) => tag.slug.replace(/-/g, "") === compact)
}
