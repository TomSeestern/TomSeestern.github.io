import { render, screen } from "@testing-library/react"
import About from "./page"
import type { MarkdownEntry } from "../../lib/markdown"
import { getAllProjects } from "../../lib/projects"

jest.mock("../../lib/projects", () => ({
  getAllProjects: jest.fn(),
}))

const mockGetAllProjects = jest.mocked(getAllProjects)

function makeProject(): MarkdownEntry {
  return {
    id: "paymenow",
    title: "PayMeNow",
    articleDate: new Date("2021-12-31"),
    articleContent: "",
    authorImgSrc: "/img/logo.png",
    authorName: "Tom Segbers",
    fullArticleLink: "/projects/entry/paymenow",
    technologies: ["React", "TypeScript", "AWS"],
    tags: [],
    featured: true,
    recentHighlight: false,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    links: [],
  }
}

describe("About", () => {
  beforeEach(() => {
    mockGetAllProjects.mockReturnValue([makeProject()])
  })

  it("renders a single H1 and the formal-position timeline", () => {
    // Given / When
    render(<About />)

    // Then
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("heading", { level: 1, name: "About me" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "Formal positions" })).toBeInTheDocument()
    expect(screen.getByTestId("about-timeline")).toBeInTheDocument()
    expect(screen.getAllByTestId("timeline-entry")).toHaveLength(5)
    expect(screen.getByRole("heading", { level: 3, name: "Founder & CEO @ Hammer Robotics" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3, name: "Co-Founder & CTO @ LAYZR.gg" })).toBeInTheDocument()
  })

  it("renders the portrait and the tools band without illustrative testimonials", () => {
    // Given / When
    render(<About />)

    // Then
    expect(screen.getByRole("img", { name: "Portrait of Tom Segbers" })).toBeInTheDocument()
    expect(screen.getByTestId("about-tools")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "Tools of the trade" })).toBeInTheDocument()
    expect(screen.queryByText("Illustrative examples — not real client testimonials.")).not.toBeInTheDocument()
  })

  it("uses the local placeholder asset and never the remote placeholder host", () => {
    // Given / When
    const { container } = render(<About />)

    // Then
    const logoImages = screen.getAllByTestId("company-logo")
    expect(logoImages.some((image) => image.getAttribute("src")?.includes("placeholder-company.svg"))).toBe(true)
    expect(container.innerHTML).not.toContain(["placehold", "co"].join("."))
  })

  it("renders the closing CTA", () => {
    // Given / When
    render(<About />)

    // Then
    expect(screen.getByRole("heading", { level: 2, name: "Let's build something that lasts." })).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: "Start a conversation" }).length).toBeGreaterThanOrEqual(1)
  })
})
