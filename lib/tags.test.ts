import { MarkdownEntry } from "./markdown"
import { buildTagIndex, getAllTags, getTagBySlug, normalizeTagKey, tagSlug, TagSource } from "./tags"

function makeEntry(id: string, overrides: Partial<MarkdownEntry> = {}): MarkdownEntry {
  return {
    id,
    title: `Title ${id}`,
    articleDate: new Date("2024-01-01"),
    articleContent: "",
    authorImgSrc: "/img/placeholder.png",
    authorName: "Anonymous",
    fullArticleLink: `/blog/entry/${id}`,
    technologies: [],
    tags: [],
    featured: false,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    ...overrides,
  }
}

function source(entry: MarkdownEntry, collection: TagSource["collection"]): TagSource {
  return { entry, collection }
}

describe("normalizeTagKey", () => {
  it("lowercases, trims, and collapses internal whitespace", () => {
    // Given / When / Then
    expect(normalizeTagKey("  Arma   3  ")).toBe("arma 3")
  })

  it("folds underscore and hyphen separator runs into a single space", () => {
    // Given / When / Then
    expect(normalizeTagKey("Digital-Transformation")).toBe("digital transformation")
    expect(normalizeTagKey("Data_Warehousing")).toBe("data warehousing")
  })
})

describe("tagSlug", () => {
  it("maps C++ to a URL-safe slug without dropping the pluses", () => {
    // Given / When / Then
    expect(tagSlug(normalizeTagKey("C++"))).toBe("c-plus-plus")
  })

  it("maps multi-word and separator tags to lower-kebab-case", () => {
    // Given / When / Then
    expect(tagSlug(normalizeTagKey("Arma 3"))).toBe("arma-3")
    expect(tagSlug(normalizeTagKey("AWS-Amplify"))).toBe("aws-amplify")
    expect(tagSlug(normalizeTagKey("NodeJS"))).toBe("nodejs")
    expect(tagSlug(normalizeTagKey("Data-Warehousing"))).toBe("data-warehousing")
  })

  it("trims leading and trailing separators", () => {
    // Given / When / Then
    expect(tagSlug("  .NET ")).toBe("net")
  })
})

describe("buildTagIndex", () => {
  it("groups case variants under one key and uses the most frequent raw form as the label", () => {
    // Given — "LabVIEW" appears twice, "labview" once.
    const sources = [
      source(makeEntry("a", { tags: ["LabVIEW"] }), "project"),
      source(makeEntry("b", { tags: ["LabVIEW"] }), "project"),
      source(makeEntry("c", { tags: ["labview"] }), "project"),
    ]

    // When
    const [tag] = buildTagIndex(sources)

    // Then
    expect(tag).toMatchObject({ key: "labview", label: "LabVIEW", slug: "labview", count: 3 })
  })

  it("breaks count ties deterministically, independent of source order", () => {
    // Given — one occurrence of each casing, supplied in both orders.
    const lowerFirst = [
      source(makeEntry("a", { tags: ["labview"] }), "project"),
      source(makeEntry("b", { tags: ["LabVIEW"] }), "project"),
    ]
    const upperFirst = [
      source(makeEntry("b", { tags: ["LabVIEW"] }), "project"),
      source(makeEntry("a", { tags: ["labview"] }), "project"),
    ]

    // When
    const [fromLowerFirst] = buildTagIndex(lowerFirst)
    const [fromUpperFirst] = buildTagIndex(upperFirst)

    // Then — the case-insensitive tie resolves to a stable code-unit order.
    expect(fromLowerFirst?.label).toBe(fromUpperFirst?.label)
    expect(fromLowerFirst?.label).toBe("LabVIEW")
  })

  it("aggregates across both collections and tags each entry with its source", () => {
    // Given — the same tag on a blog post and a project.
    const sources = [
      source(makeEntry("post", { tags: ["Automation"] }), "blog"),
      source(makeEntry("project", { tags: ["automation"] }), "project"),
    ]

    // When
    const [tag] = buildTagIndex(sources)

    // Then
    expect(tag?.count).toBe(2)
    expect(tag?.entries.map((entry) => entry.collection).sort()).toEqual(["blog", "project"])
  })

  it("carries title, fullArticleLink, and articleDate on each aggregated entry", () => {
    // Given
    const sources = [
      source(
        makeEntry("post", {
          title: "Tagged post",
          tags: ["React"],
          fullArticleLink: "/blog/entry/post",
          articleDate: new Date("2023-05-01"),
        }),
        "blog"
      ),
    ]

    // When
    const [tag] = buildTagIndex(sources)

    // Then
    expect(tag?.entries[0]).toMatchObject({
      title: "Tagged post",
      fullArticleLink: "/blog/entry/post",
      articleDate: new Date("2023-05-01"),
    })
  })

  it("sorts a tag's entries newest-first", () => {
    // Given — oldest, newest, middle in read order.
    const sources = [
      source(makeEntry("oldest", { tags: ["React"], articleDate: new Date("2019-01-01") }), "blog"),
      source(makeEntry("newest", { tags: ["React"], articleDate: new Date("2024-01-01") }), "blog"),
      source(makeEntry("middle", { tags: ["React"], articleDate: new Date("2022-01-01") }), "blog"),
    ]

    // When
    const [tag] = buildTagIndex(sources)

    // Then
    expect(tag?.entries.map((entry) => entry.id)).toEqual(["newest", "middle", "oldest"])
  })

  it("counts an entry once when it repeats the same key in one tag list", () => {
    // Given — "React" and "react" collapse to one key on one entry.
    const sources = [source(makeEntry("post", { tags: ["React", "react"] }), "blog")]

    // When
    const [tag] = buildTagIndex(sources)

    // Then
    expect(tag?.count).toBe(1)
  })

  it("ignores empty and whitespace-only tags", () => {
    // Given
    const sources = [source(makeEntry("post", { tags: ["", "   "] }), "blog")]

    // When
    const index = buildTagIndex(sources)

    // Then
    expect(index).toEqual([])
  })

  it("orders the index by descending member count", () => {
    // Given — Robotics on two entries, React on one.
    const sources = [
      source(makeEntry("a", { tags: ["Robotics", "React"] }), "project"),
      source(makeEntry("b", { tags: ["Robotics"] }), "project"),
    ]

    // When
    const index = buildTagIndex(sources)

    // Then
    expect(index.map((tag) => tag.key)).toEqual(["robotics", "react"])
  })

  it("throws, naming both keys, when two distinct keys share a slug", () => {
    // Given — a period is not a folded separator, so these stay distinct keys
    // yet both slug to "build-tools".
    const sources = [
      source(makeEntry("a", { tags: ["Build.Tools"] }), "project"),
      source(makeEntry("b", { tags: ["Build Tools"] }), "project"),
    ]

    // When / Then
    expect(() => buildTagIndex(sources)).toThrow(/build-tools/)
    expect(() => buildTagIndex(sources)).toThrow(/build\.tools/)
    expect(() => buildTagIndex(sources)).toThrow(/build tools/)
  })
})

describe("getAllTags / getTagBySlug", () => {
  it("resolves C++ through its URL-safe slug", () => {
    // Given / When
    const tag = getTagBySlug("c-plus-plus")

    // Then
    expect(tag?.label).toBe("C++")
    expect(tag?.slug).toBe("c-plus-plus")
    expect(tag?.count).toBeGreaterThan(0)
  })

  it("returns undefined for an unknown slug instead of throwing", () => {
    // Given / When / Then
    expect(getTagBySlug("definitely-not-a-tag")).toBeUndefined()
  })

  it("indexes every tagged entry under exactly one canonical slug", () => {
    // Given / When
    const index = getAllTags()
    const slugs = index.map((tag) => tag.slug)

    // Then — slugs are unique and non-empty, and every summary has members.
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.every((slug) => slug.length > 0)).toBe(true)
    expect(index.every((tag) => tag.count === tag.entries.length && tag.count > 0)).toBe(true)
  })
})
