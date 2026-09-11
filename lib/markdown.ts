import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { z } from "zod"

/** Schema for blog and project frontmatter. Every field is defaulted AND caught,
 *  so parsing never throws and the additive case-study fields resolve to empty
 *  values for legacy files. */
export const markdownFrontmatterSchema = z.object({
  title: z.string().default("Untitled").catch("Untitled"),
  articleDate: z.coerce.date().default(new Date("1990-01-01")).catch(new Date("1990-01-01")),
  articleContent: z.string().default("Failed to load content").catch("Failed to load content"),
  authorImgSrc: z.string().default("/img/placeholder.png").catch("/img/placeholder.png"),
  authorName: z.string().default("Anonymous").catch("Anonymous"),
  technologies: z.array(z.string()).default([]).catch([]),
  tags: z.array(z.string()).default([]).catch([]),
  featured: z.boolean().default(false).catch(false),
  role: z.string().default("").catch(""),
  outcome: z.string().default("").catch(""),
  heroImage: z.string().default("").catch(""),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([])
    .catch([]),
})

/** Validated frontmatter shape, inferred from {@link markdownFrontmatterSchema}. */
export type MarkdownFrontmatter = z.infer<typeof markdownFrontmatterSchema>

/**
 * Parses raw gray-matter frontmatter into the typed {@link MarkdownFrontmatter}
 * shape. Detail routes use this to read the additive case-study fields
 * (`role`, `outcome`, `heroImage`, `metrics`) without duplicating the schema or
 * casting. Never throws for object input — every field has a safe fallback.
 *
 * @param data - Raw `.data` from a gray-matter result.
 */
export function parseFrontmatter(data: unknown): MarkdownFrontmatter {
  return markdownFrontmatterSchema.parse(data)
}

/** Parsed frontmatter + computed fields for a single markdown content file.
 *  All fields carry Zod `.default()` / `.catch()` fallbacks, so malformed
 *  frontmatter never breaks the build — missing values resolve to safe
 *  placeholders instead. */
export type MarkdownEntry = {
  readonly id: string
  readonly title: string
  readonly articleDate: Date
  readonly articleContent: string
  readonly authorImgSrc: string
  readonly authorName: string
  readonly fullArticleLink: string
  readonly technologies: string[]
  readonly tags: string[]
  readonly featured: boolean
  readonly role: string
  readonly outcome: string
  readonly heroImage: string
  readonly metrics: readonly { readonly label: string; readonly value: string }[]
}

/**
 * Reads every `.md` file in a content directory, parses frontmatter through
 * the Zod schema, and returns entries sorted newest-first.
 *
 * @param dirPath   — Absolute filesystem path (e.g. `path.join(process.cwd(), "content/blog")`).
 * @param urlPrefix — URL segment prepended to each entry's `fullArticleLink` (e.g. `"/blog"`).
 * @returns Readonly array of validated MarkdownEntry records, each with safe
 *          fallbacks for missing frontmatter fields. Empty array if the
 *          directory contains no `.md` files.
 */
export function getAllMarkdownEntries(dirPath: string, urlPrefix: string): readonly MarkdownEntry[] {
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && path.extname(entry.name) === ".md")
    .map((entry) => createMarkdownEntry(dirPath, urlPrefix, entry.name))
    .sort((left, right) => right.articleDate.valueOf() - left.articleDate.valueOf())
}

/**
 * Reads a single markdown file and parses its frontmatter with gray-matter.
 * Returns the parsed result (with `.data` and `.content`), or `null` if the
 * file does not exist or cannot be read.
 *
 * @param slug - File name without `.md` extension
 * @param dir  - Content directory path relative to the project root (e.g. "content/blog")
 */
export function getMarkdownEntry(slug: string, dir: string): matter.GrayMatterFile<string> | null {
  try {
    const filePath = path.join(process.cwd(), dir, slug + ".md")
    const fileContents = fs.readFileSync(filePath, "utf8")
    return matter(fileContents)
  } catch {
    return null
  }
}

/**
 * Lists all markdown slugs in a content directory.
 * Returns an array of `{ slug }` objects suitable for Next.js `generateStaticParams`.
 *
 * @param dir - Content directory path relative to the project root (e.g. "content/blog")
 */
export function getMarkdownSlugs(dir: string): { slug: string }[] {
  const postsDirectory = path.join(process.cwd(), dir)
  const filenames = fs.readdirSync(postsDirectory)
  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
  }))
}

function createMarkdownEntry(dirPath: string, urlPrefix: string, filename: string): MarkdownEntry {
  const slug = path.basename(filename, ".md")
  const { data } = matter(fs.readFileSync(path.join(dirPath, filename), "utf8"))
  const frontmatter = parseFrontmatter(data)

  return {
    id: slug,
    ...frontmatter,
    fullArticleLink: `${urlPrefix}/entry/${slug}`,
  }
}
