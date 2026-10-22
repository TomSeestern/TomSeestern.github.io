import { render, screen } from "@testing-library/react"
import type { TagSummary } from "../../lib/tags"
import { getAllTags } from "../../lib/tags"
import TagsIndex from "./page"

jest.mock("../../lib/tags", () => ({
  getAllTags: jest.fn(),
}))

const mockGetAllTags = jest.mocked(getAllTags)

function makeTag(label: string, slug: string, count: number, links: string[]): TagSummary {
  return {
    key: slug,
    label,
    slug,
    count,
    entries: links.map((link) => ({
      id: link,
      title: link,
      articleDate: new Date("2024-01-01"),
      articleContent: "",
      authorImgSrc: "/img/logo.png",
      authorName: "Tom Segbers",
      fullArticleLink: link,
      technologies: [],
      tags: [label],
      featured: false,
      recentHighlight: false,
      role: "",
      outcome: "",
      heroImage: "",
      metrics: [],
      links: [],
      collection: "blog",
    })),
  }
}

describe("TagsIndex", () => {
  it("renders the exact count sentence and every tag with its entry count", () => {
    // Given
    mockGetAllTags.mockReturnValue([
      makeTag("TypeScript", "typescript", 2, ["/blog/entry/a", "/blog/entry/b"]),
      makeTag("React", "react", 1, ["/projects/entry/c"]),
    ])

    // When
    render(<TagsIndex />)

    // Then
    expect(screen.getByRole("heading", { level: 1, name: "Tags" })).toBeInTheDocument()
    expect(
      screen.getByText("2 tags across 3 blog posts and projects. Pick a topic to see everything filed under it.")
    ).toBeInTheDocument()
    expect(screen.getByTestId("tag-index-list")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /TypeScript/ })).toHaveAttribute("href", "/tags/typescript")
    expect(screen.getByRole("link", { name: /React/ })).toHaveAttribute("href", "/tags/react")
    expect(screen.getByText("2 entries")).toBeInTheDocument()
    expect(screen.getByText("1 entry")).toBeInTheDocument()
  })

  it("renders the index eyebrow", () => {
    // Given
    mockGetAllTags.mockReturnValue([])

    // When
    render(<TagsIndex />)

    // Then
    expect(screen.getByText("Index")).toBeInTheDocument()
    expect(screen.getByText("Contents")).toBeInTheDocument()
    expect(
      screen.getByText("0 tags across 0 blog posts and projects. Pick a topic to see everything filed under it.")
    ).toBeInTheDocument()
  })
})
