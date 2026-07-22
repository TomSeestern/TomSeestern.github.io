import { render, screen } from "@testing-library/react"
import ArticleTeaser from "./ArticleTeaser"

const publishedArticleDate = new Date("2024-01-01T00:00:00.000Z")
const fullArticleLink = "/blog/entry/test-article"

function renderArticleTeaser(overrides: Partial<React.ComponentProps<typeof ArticleTeaser>> = {}) {
  const props = {
    title: "Test article",
    articleDate: publishedArticleDate,
    articleContent: "Article summary",
    authorImgSrc: "/img/author.png",
    authorName: "Tom Segbers",
    fullArticleLink,
    ...overrides,
  }

  return render(<ArticleTeaser {...props} />)
}

describe("ArticleTeaser", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2024-01-03T00:00:00.000Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders title in its heading", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByRole("heading", { name: "Test article" })).toBeInTheDocument()
  })

  it("renders teaser content", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByText("Article summary")).toBeInTheDocument()
  })

  it("renders author name", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByText("Tom Segbers")).toBeInTheDocument()
  })

  it("renders author image with descriptive alt text and source", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByAltText("Author's Picture")).toHaveAttribute(
      "src",
      expect.stringContaining(encodeURIComponent("/img/author.png"))
    )
  })

  it("uses fallback author image when author image source is missing", () => {
    // Given
    // When
    renderArticleTeaser({ authorImgSrc: undefined })

    // Then
    expect(screen.getByAltText("Author's Picture")).toHaveAttribute(
      "src",
      expect.stringContaining(encodeURIComponent("/img/placeholder.png"))
    )
  })

  it("links title to full article URL", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByRole("link", { name: "Test article" })).toHaveAttribute("href", fullArticleLink)
  })

  it("links read-more control to full article URL", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByRole("link", { name: /read more/i })).toHaveAttribute("href", fullArticleLink)
  })

  it("renders relative publish date with suffix", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByText("2 days ago")).toBeInTheDocument()
  })

  it("renders long title without changing its link destination", () => {
    // Given
    const longTitle =
      "A title long enough to verify article teaser preserves complete link text even when visual CSS truncates it"

    // When
    renderArticleTeaser({ title: longTitle })

    // Then
    expect(screen.getByRole("link", { name: longTitle })).toHaveAttribute("href", fullArticleLink)
  })

  it("renders special characters in title and content verbatim", () => {
    // Given
    const title = "Tom's <TypeScript> & café"
    const articleContent = "Use <strong> carefully & keep 100% coverage."

    // When
    renderArticleTeaser({ title, articleContent })

    // Then
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
    expect(screen.getByText(articleContent)).toBeInTheDocument()
  })

  it("applies dark-mode text contract to title, content, and author", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByRole("heading", { name: "Test article" })).toHaveClass("dark:text-foreground-dark")
    expect(screen.getByText("2 days ago")).toHaveClass("dark:text-muted-dark")
    expect(screen.getByText("Article summary")).toHaveClass("dark:text-muted-dark")
    expect(screen.getByText("Tom Segbers")).toHaveClass("dark:text-foreground-dark")
  })

  it("marks read-more link for dark mode", () => {
    // Given
    // When
    renderArticleTeaser()

    // Then
    expect(screen.getByRole("link", { name: /read more/i })).toHaveClass("dark:text-accent-dark")
  })
})
