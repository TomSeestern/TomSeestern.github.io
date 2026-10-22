import type { MarkdownEntry } from "./markdown"
import { getAdjacentEntries } from "./content"

function makeEntry(id: string, date: string): MarkdownEntry {
  return {
    id,
    title: id,
    articleDate: new Date(date),
    articleContent: "",
    authorImgSrc: "/img/placeholder.png",
    authorName: "Tom Segbers",
    fullArticleLink: `/entry/${id}`,
    technologies: [],
    tags: [],
    featured: false,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    links: [],
  }
}

describe("getAdjacentEntries", () => {
  const entries = [
    makeEntry("newest", "2024-01-01"),
    makeEntry("middle", "2023-01-01"),
    makeEntry("oldest", "2022-01-01"),
  ]

  it("returns the previous and next entries in newest-first order", () => {
    // Given / When
    const result = getAdjacentEntries(entries, "middle")

    // Then
    expect(result.previous?.id).toBe("newest")
    expect(result.next?.id).toBe("oldest")
  })

  it("wraps at both ends", () => {
    // Given / When
    const first = getAdjacentEntries(entries, "newest")
    const last = getAdjacentEntries(entries, "oldest")

    // Then
    expect(first.previous?.id).toBe("oldest")
    expect(first.next?.id).toBe("middle")
    expect(last.previous?.id).toBe("middle")
    expect(last.next?.id).toBe("newest")
  })

  it("breaks date ties by slug", () => {
    // Given
    const tied = [makeEntry("b", "2024-01-01"), makeEntry("a", "2024-01-01")]

    // When
    const result = getAdjacentEntries(tied, "a")

    // Then
    expect(result.next?.id).toBe("b")
  })

  it("returns no neighbours for an unknown id", () => {
    // Given / When
    const result = getAdjacentEntries(entries, "missing")

    // Then
    expect(result.previous).toBeUndefined()
    expect(result.next).toBeUndefined()
  })
})
