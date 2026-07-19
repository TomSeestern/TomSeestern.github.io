import fs from "fs"
import path from "path"
import matter from "gray-matter"
import {z} from "zod"

const markdownFrontmatterSchema = z.object({
  title: z.string().default("Untitled").catch("Untitled"),
  articleDate: z.coerce.date().default(new Date("1990-01-01")).catch(new Date("1990-01-01")),
  articleContent: z.string().default("Failed to load content").catch("Failed to load content"),
  authorImgSrc: z.string().default("/img/placeholder.png").catch("/img/placeholder.png"),
  authorName: z.string().default("Anonymous").catch("Anonymous"),
  technologies: z.array(z.string()).default([]).catch([]),
})

export type MarkdownEntry = {
  readonly id: string
  readonly title: string
  readonly articleDate: Date
  readonly articleContent: string
  readonly authorImgSrc: string
  readonly authorName: string
  readonly fullArticleLink: string
  readonly technologies: string[]
}

export function getAllMarkdownEntries(dirPath: string, urlPrefix: string): readonly MarkdownEntry[] {
  return fs
    .readdirSync(dirPath, {withFileTypes: true})
    .filter((entry) => entry.isFile() && path.extname(entry.name) === ".md")
    .map((entry) => createMarkdownEntry(dirPath, urlPrefix, entry.name))
    .sort((left, right) => right.articleDate.valueOf() - left.articleDate.valueOf())
}

function createMarkdownEntry(dirPath: string, urlPrefix: string, filename: string): MarkdownEntry {
  const slug = path.basename(filename, ".md")
  const {data} = matter(fs.readFileSync(path.join(dirPath, filename), "utf8"))
  const frontmatter = markdownFrontmatterSchema.parse(data)

  return {
    id: slug,
    ...frontmatter,
    fullArticleLink: `${urlPrefix}/entry/${slug}`,
  }
}
