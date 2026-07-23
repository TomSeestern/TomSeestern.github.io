import path from "path"
import { getAllMarkdownEntries } from "./markdown"

/**
 * Loads every page entry from `content/pages/`, validates frontmatter, and
 * returns entries sorted newest-first. Thin wrapper around
 * `getAllMarkdownEntries` with the pages content directory and URL prefix
 * already supplied.
 *
 * @returns Readonly array of validated MarkdownEntry records representing
 *          all static pages. Empty array if the directory contains no `.md` files.
 */
export function getAllPages() {
  return getAllMarkdownEntries(path.join(process.cwd(), "content/pages"), "/")
}
