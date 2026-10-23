import { render, screen } from "@testing-library/react"
import type { MarkdownEntry } from "@/lib/markdown"
import { ArticleCard } from "./ArticleCard"

function makeEntry(overrides: Partial<MarkdownEntry> = {}): MarkdownEntry {
  return {
    id: "2019-ebeltoft-cheesecake-recipe",
    title: "Ebeltoft Cheesecake: A Recipe from Cafe Moeslund",
    articleDate: new Date("2019-08-21T00:00:00Z"),
    articleContent: "A simple recipe from a sailing trip.",
    authorImgSrc: "/img/logo.png",
    authorName: "Tom Segbers",
    fullArticleLink: "/blog/entry/2019-ebeltoft-cheesecake-recipe",
    technologies: [],
    tags: ["Recipes", "Cheesecake"],
    featured: false,
    recentHighlight: false,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    links: [],
    ...overrides,
  }
}

describe("ArticleCard", () => {
  it("renders the absolute date, first tag, title, excerpt, and read action", () => {
    // Given / When
    render(<ArticleCard entry={makeEntry()} index={0} />)

    // Then
    expect(screen.getByTestId("article-card")).toHaveTextContent("Ebeltoft Cheesecake: A Recipe from Cafe Moeslund")
    expect(screen.getByText("21 AUG 2019")).toBeInTheDocument()
    expect(screen.getByTestId("article-tag")).toHaveTextContent("Recipes")
    expect(screen.getByRole("link", { name: /Read dispatch/i })).toHaveAttribute(
      "href",
      "/blog/entry/2019-ebeltoft-cheesecake-recipe"
    )
    expect(screen.queryByTestId("pixel-sigil")).not.toBeInTheDocument()
  })

  it("omits the tag chip when the entry has no tags", () => {
    // Given / When
    render(<ArticleCard entry={makeEntry({ tags: [] })} />)

    // Then
    expect(screen.queryByTestId("article-tag")).not.toBeInTheDocument()
  })
})
