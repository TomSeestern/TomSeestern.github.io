import { render, screen } from "@testing-library/react"
import type { MarkdownEntry } from "@/lib/markdown"
import { MonumentCard } from "./MonumentCard"

function makeProject(overrides: Partial<MarkdownEntry> = {}): MarkdownEntry {
  return {
    id: "paymenow",
    title: "PayMeNow: Payment Status Application for eBay Sellers",
    articleDate: new Date("2021-12-31T00:00:00Z"),
    articleContent: "Payment status for eBay sellers.",
    authorImgSrc: "/img/logo.png",
    authorName: "Tom Segbers",
    fullArticleLink: "/projects/entry/paymenow",
    technologies: ["React", "AWS", "Lambda", "RDS"],
    tags: ["Payments"],
    featured: true,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    links: [],
    ...overrides,
  }
}

describe("MonumentCard", () => {
  it("renders the project identity, selected marker, year, and technologies", () => {
    // Given / When
    render(<MonumentCard project={makeProject()} index={0} />)

    // Then
    const card = screen.getByTestId("monument-card")
    expect(card).toHaveTextContent("PayMeNow")
    expect(screen.getByTestId("project-teaser")).toHaveAttribute("data-featured", "true")
    expect(screen.getByTestId("featured-badge")).toHaveTextContent("Selected")
    expect(screen.getByTestId("project-cover")).toBeInTheDocument()
    expect(screen.getByTestId("project-year")).toHaveTextContent("2021")
    expect(screen.getByText("React · AWS · Lambda")).toBeInTheDocument()
  })

  it("gives the primary title link the featured-project id and a real href", () => {
    // Given / When
    render(<MonumentCard project={makeProject()} index={0} />)

    // Then
    expect(screen.getByTestId("featured-project")).toHaveAttribute("href", "/projects/entry/paymenow")
  })

  it("renders a non-featured card without selected markers", () => {
    // Given / When
    render(<MonumentCard project={makeProject({ featured: false, id: "refundhero" })} index={1} />)

    // Then
    expect(screen.queryByTestId("featured-badge")).not.toBeInTheDocument()
    expect(screen.queryByTestId("featured-project")).not.toBeInTheDocument()
    expect(screen.getByTestId("project-teaser")).not.toHaveAttribute("data-featured")
  })
})
