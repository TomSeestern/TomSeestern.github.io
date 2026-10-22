import { render, screen } from "@testing-library/react"
import type { MarkdownEntry } from "../../../lib/markdown"
import type { TaggedEntry, TagSummary } from "../../../lib/tags"
import { getAllTags, getTagByLegacySlug, getTagBySlug } from "../../../lib/tags"
import TagArchive from "./page"

const permanentRedirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`)
})

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND")
  }),
  permanentRedirect: (url: string) => permanentRedirect(url),
}))

jest.mock("../../../lib/tags", () => ({
  getAllTags: jest.fn(),
  getTagBySlug: jest.fn(),
  getTagByLegacySlug: jest.fn(),
}))

const mockGetTagBySlug = jest.mocked(getTagBySlug)
const mockGetTagByLegacySlug = jest.mocked(getTagByLegacySlug)
const mockGetAllTags = jest.mocked(getAllTags)

function makeEntry(collection: "blog" | "project", overrides: Partial<MarkdownEntry> = {}): TaggedEntry {
  return {
    id: collection === "project" ? "paymenow" : "dispatch",
    title: collection === "project" ? "PayMeNow" : "A dispatch",
    articleDate: new Date(collection === "project" ? "2021-12-31" : "2024-01-01"),
    articleContent: collection === "project" ? "A project." : "A dispatch body.",
    authorImgSrc: "/img/logo.png",
    authorName: "Tom Segbers",
    fullArticleLink: collection === "project" ? "/projects/entry/paymenow" : "/blog/entry/dispatch",
    technologies: collection === "project" ? ["React"] : [],
    tags: ["TypeScript"],
    featured: collection === "project",
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    collection,
    ...overrides,
  }
}

function makeTag(entries: readonly TaggedEntry[]): TagSummary {
  return {
    key: "typescript",
    label: "TypeScript",
    slug: "typescript",
    count: entries.length,
    entries,
  }
}

describe("TagArchive", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllTags.mockReturnValue([])
  })

  it("renders the mixed article and project grid for a tag", async () => {
    // Given
    mockGetTagBySlug.mockReturnValue(makeTag([makeEntry("project"), makeEntry("blog")]))
    const params = Promise.resolve({ tag: "typescript" })

    // When
    render(await TagArchive({ params }))

    // Then
    expect(screen.getByRole("heading", { level: 1, name: "TypeScript" })).toBeInTheDocument()
    expect(screen.getByText("Filed under")).toBeInTheDocument()
    expect(screen.getByText("2 blog posts and projects filed under this tag, newest first.")).toBeInTheDocument()
    expect(screen.getByTestId("tag-grid")).toBeInTheDocument()
    expect(screen.getByTestId("monument-card")).toBeInTheDocument()
    expect(screen.getByTestId("article-card")).toBeInTheDocument()
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" })
    expect(breadcrumb.querySelector('[aria-current="page"]')).toHaveTextContent("TypeScript")
  })

  it("renders an explicit empty branch for a tag with no entries", async () => {
    // Given
    mockGetTagBySlug.mockReturnValue(makeTag([]))
    const params = Promise.resolve({ tag: "empty" })

    // When
    render(await TagArchive({ params }))

    // Then
    expect(screen.getByTestId("tag-empty")).toHaveTextContent("No entries are filed under this tag yet.")
    expect(screen.getByText("0 blog posts and projects filed under this tag, newest first.")).toBeInTheDocument()
  })

  it("calls notFound for an unknown tag slug", async () => {
    // Given
    mockGetTagBySlug.mockReturnValue(undefined)
    mockGetTagByLegacySlug.mockReturnValue(undefined)
    const params = Promise.resolve({ tag: "missing" })

    // When / Then
    await expect(TagArchive({ params })).rejects.toThrow("NEXT_NOT_FOUND")
  })

  it("permanently redirects a retired camel-case slug to the canonical tag", async () => {
    // Given
    mockGetTagBySlug.mockReturnValue(undefined)
    mockGetTagByLegacySlug.mockReturnValue(makeTag([makeEntry("blog")]))
    const params = Promise.resolve({ tag: "artificialintelligence" })

    // When / Then
    await expect(TagArchive({ params })).rejects.toThrow("NEXT_REDIRECT:/tags/typescript")
  })
})
