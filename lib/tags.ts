import { getAllBlogPosts } from "./blog"
import type { MarkdownEntry } from "./markdown"
import { getAllProjects } from "./projects"

/** Which content collection a tagged entry came from. */
export type TagCollection = "blog" | "project"

/**
 * A single entry filed under a canonical tag. It is the full {@link MarkdownEntry}
 * plus the collection it came from, so the tag archive can reuse the existing
 * `ArticleTeaser` / `ProjectTeaser` components without re-reading frontmatter.
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
 * Collapses a raw frontmatter tag into its grouping key.
 *
 * The key is the raw tag trimmed, with `_`/`-` separator runs folded into a
 * single space, internal whitespace collapsed, and lowercased. Folding `_`/`-`
 * is deliberately broader than a pure whitespace collapse: the content set
 * carries `Digital-Transformation` once and `Digital Transformation` twice for
 * one concept, and content is read-only. Without folding, those two keys slug
 * to the same `digital-transformation` and trip the collision assertion below,
 * breaking the build. Folding is a documented merge of punctuation variants,
 * not a silent one — genuinely distinct keys still collide and throw.
 *
 * @param rawTag - A tag exactly as authored in frontmatter.
 */
export function normalizeTagKey(rawTag: string): string {
  return rawTag.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ").toLowerCase()
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
  return ranked[0]?.[0] ?? ""
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
 * Looks a canonical tag up by its URL slug.
 *
 * @param slug - The slug segment from `/tags/<slug>`.
 * @returns The matching summary, or `undefined` when no tag has that slug
 *          (callers must render `notFound()`).
 */
export function getTagBySlug(slug: string): TagSummary | undefined {
  return getAllTags().find((tag) => tag.slug === slug)
}
