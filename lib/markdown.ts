import matter from "gray-matter"
import { z } from "zod"
import fs from "fs"
import path from "path"

const markdownFrontmatterSchema = z.object({
  title: z.string().default("Untitled").catch("Untitled"),
  articleDate: z.coerce.date().default(new Date("1990-01-01")).catch(new Date("1990-01-01")),
  articleContent: z.string().default("Failed to load content").catch("Failed to load content"),
  authorImgSrc: z.string().default("/img/placeholder.png").catch("/img/placeholder.png"),
  authorName: z.string().default("Anonymous").catch("Anonymous"),
  technologies: z.array(z.string()).default([]).catch([]),
  tags: z.array(z.string()).default([]).catch([]),
})

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

/**
 * Estimates reading time for a markdown content string.
 * Assumes 200 words per minute, always returns at least "1 min read".
 */
export function getReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
  return `${minutes} min read`
}

/**
 * Converts a string into a URL-safe slug by lowercasing,
 * stripping non-word characters, and collapsing whitespace.
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function createMarkdownEntry(dirPath: string, urlPrefix: string, filename: string): MarkdownEntry {
  const slug = path.basename(filename, ".md")
  const { data } = matter(fs.readFileSync(path.join(dirPath, filename), "utf8"))
  const frontmatter = markdownFrontmatterSchema.parse(data)

  return {
    id: slug,
    ...frontmatter,
    fullArticleLink: `${urlPrefix}/entry/${slug}`,
  }
}
