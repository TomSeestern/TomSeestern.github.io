import type { MarkdownEntry } from "./markdown"

export interface AdjacentEntries {
  readonly previous: MarkdownEntry | undefined
  readonly next: MarkdownEntry | undefined
}

function compareNewestFirst(left: MarkdownEntry, right: MarkdownEntry): number {
  return right.articleDate.valueOf() - left.articleDate.valueOf() || left.id.localeCompare(right.id)
}

/**
 * Returns the neighbouring entries in the canonical newest-first order. The
 * sequence wraps at both ends so a detail page always has a next destination.
 * Ties on date break by slug, which keeps the order deterministic.
 */
export function getAdjacentEntries(entries: readonly MarkdownEntry[], currentId: string): AdjacentEntries {
  const ordered = [...entries].sort(compareNewestFirst)
  const index = ordered.findIndex((entry) => entry.id === currentId)
  if (index === -1) return { previous: undefined, next: undefined }

  return {
    previous: ordered[(index - 1 + ordered.length) % ordered.length],
    next: ordered[(index + 1) % ordered.length],
  }
}
