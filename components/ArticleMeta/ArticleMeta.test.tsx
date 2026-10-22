import { render, screen } from "@testing-library/react"
import { ArticleMeta } from "./ArticleMeta"

describe("ArticleMeta", () => {
  it("renders the absolute date, reading time, author, and tag links", () => {
    // Given / When
    render(
      <ArticleMeta
        date={new Date("2024-05-06T00:00:00Z")}
        readingTimeMinutes={3}
        tags={["C++", "Homelab"]}
        author="Tom Segbers"
      />
    )

    // Then
    expect(screen.getByTestId("article-meta")).toHaveTextContent("06 MAY 2024")
    expect(screen.getByText("3 min read")).toBeInTheDocument()
    expect(screen.getByText("By Tom Segbers")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "C++" })).toHaveAttribute("href", "/tags/c-plus-plus")
    expect(screen.getByRole("link", { name: "Homelab" })).toHaveAttribute("href", "/tags/homelab")
  })

  it("omits the tag group when there are no tags", () => {
    // Given / When
    render(<ArticleMeta date={new Date("2024-01-01")} readingTimeMinutes={1} tags={[]} author="Tom Segbers" />)

    // Then
    expect(screen.queryByTestId("article-meta-tag")).not.toBeInTheDocument()
  })
})
