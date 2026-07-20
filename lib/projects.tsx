import path from "path"
import { getAllMarkdownEntries } from "./markdown"

/**
 * Loads every project entry from `content/projects/`, validates frontmatter,
 * and returns entries sorted newest-first. Thin wrapper around
 * `getAllMarkdownEntries` with the projects content directory and URL prefix
 * @returns Readonly array of MarkdownEntry — All project entries. Empty array
 *          if the directory contains no `.md` files.
 */
export function getAllProjects() {
  return getAllMarkdownEntries(path.join(process.cwd(), "content/projects"), "/projects")
}
