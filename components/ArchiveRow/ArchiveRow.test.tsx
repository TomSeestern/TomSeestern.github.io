import { render, screen } from "@testing-library/react"
import type { MarkdownEntry } from "@/lib/markdown"
import { ArchiveRow } from "./ArchiveRow"

function makeProject(overrides: Partial<MarkdownEntry> = {}): MarkdownEntry {
  return {
    id: "iseeunet",
    title: "ISeeUNet: Real-Time Drone Change Detection",
    articleDate: new Date("2021-03-30T00:00:00Z"),
    articleContent: "A modified U-Net for real-time change detection.",
    authorImgSrc: "/img/logo.png",
    authorName: "Tom Segbers",
    fullArticleLink: "/projects/entry/iseeunet",
    technologies: ["Python", "Keras", "TensorFlow", "Unity"],
    tags: ["AI"],
    featured: true,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    ...overrides,
  }
}

describe("ArchiveRow", () => {
  it("renders a compact project row with the stable ids", () => {
    // Given / When
    render(<ArchiveRow project={makeProject()} index={1} />)

    // Then
    expect(screen.getByTestId("project-teaser")).toHaveAttribute("data-featured", "true")
    expect(screen.getByTestId("featured-badge")).toHaveTextContent("Selected")
    expect(screen.getByTestId("featured-project")).toHaveAttribute("href", "/projects/entry/iseeunet")
    expect(screen.getByText("Python · Keras · TensorFlow · Unity")).toBeInTheDocument()
    expect(screen.getByText("2021")).toBeInTheDocument()
  })

  it("omits selected markers for a non-featured row", () => {
    // Given / When
    render(<ArchiveRow project={makeProject({ featured: false })} index={2} />)

    // Then
    expect(screen.queryByTestId("featured-badge")).not.toBeInTheDocument()
    expect(screen.queryByTestId("featured-project")).not.toBeInTheDocument()
  })
})
