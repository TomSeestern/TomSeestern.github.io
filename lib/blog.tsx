import path from "path"
import { getAllMarkdownEntries } from "./markdown"

/**
 * Loads every blog post from `content/blog/`, validates frontmatter, and
 * returns entries sorted newest-first. Thin wrapper around
 * `getAllMarkdownEntries` with the blog content directory and URL prefix
 * already supplied.
 *
 * @returns Readonly array of validated MarkdownEntry records representing
 *          all blog posts. Empty array if the directory contains no `.md` files.
 */
export function getAllBlogPosts() {
  return getAllMarkdownEntries(path.join(process.cwd(), "content/blog"), "/blog")
}
