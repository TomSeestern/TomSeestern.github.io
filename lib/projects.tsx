import path from "path"
import { getAllMarkdownEntries, MarkdownEntry } from "./markdown"

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

/** Curated "monument" projects the home featured set renders (T16). */
export const FEATURED_PROJECT_COUNT = 4

/**
 * Selects the home-page featured set ("monuments").
 *
 * Selection rule, in order:
 * 1. Projects whose frontmatter sets `featured: true` win, preserving the
 *    newest-first order `getAllProjects()` already returns.
 * 2. When fewer than `count` projects are flagged — the current state, since no
 *    content file sets the flag yet — fall back deterministically to the
 *    `count` most recent projects, so the home page always renders a full set
 *    instead of a short or empty one.
 *
 * @param projects - Full project list, newest-first.
 * @param count - How many monuments to select. Defaults to FEATURED_PROJECT_COUNT.
 * @returns Readonly array of at most `count` MarkdownEntry records.
 */
export function selectFeaturedProjects(
  projects: readonly MarkdownEntry[],
  count: number = FEATURED_PROJECT_COUNT
): readonly MarkdownEntry[] {
  const flagged = projects.filter((project) => project.featured)
  const selected = flagged.length >= count ? flagged : projects
  return selected.slice(0, count)
}
