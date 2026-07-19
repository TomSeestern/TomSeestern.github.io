import { render, screen } from "@testing-library/react"
import ArticleTeaser from "./ArticleTeaser"

describe("ArticleTeaser", () => {
  it("renders article content and both links to its full article", () => {
    // Given
    const fullArticleLink = "/blog/entry/test-article"

    // When
    render(
      <ArticleTeaser
        title="Test article"
        articleDate={new Date("2024-01-01T00:00:00.000Z")}
        articleContent="Article summary"
        authorImgSrc="/img/author.png"
        authorName="Tom Segbers"
        fullArticleLink={fullArticleLink}
      />,
    )

    // Then
    expect(screen.getByRole("heading", { name: "Test article" })).toBeInTheDocument()
    expect(screen.getByText("Article summary")).toBeInTheDocument()
    expect(screen.getByText("Tom Segbers")).toBeInTheDocument()
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      fullArticleLink,
      fullArticleLink,
    ])
  })
})
