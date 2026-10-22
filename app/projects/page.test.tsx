import { render, screen } from "@testing-library/react"
import { MarkdownEntry } from "../../lib/markdown"

jest.mock("../../lib/tags", () => ({
  getAllTags: jest.fn(() => []),
}))

jest.mock("../../lib/projects", () => ({
  getAllProjects: jest.fn(),
}))

import { getAllProjects } from "../../lib/projects"
import ProjectsArchive from "./page"

const mockGetAllProjects = jest.mocked(getAllProjects)

function makeProject(id: string, overrides: Partial<MarkdownEntry> = {}): MarkdownEntry {
  return {
    id,
    title: "Untitled",
    articleDate: new Date("1990-01-01"),
    articleContent: "",
    authorImgSrc: "/img/placeholder.png",
    authorName: "Anonymous",
    fullArticleLink: `/projects/entry/${id}`,
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

const projects: MarkdownEntry[] = [
  makeProject("project-alpha", {
    title: "Project Alpha",
    articleDate: new Date("2025-01-01"),
    articleContent: "Alpha description",
    technologies: ["TypeScript", "Next.js"],
    featured: true,
  }),
  makeProject("project-beta", {
    title: "Project Beta",
    articleDate: new Date("2024-06-01"),
    articleContent: "Beta description",
    technologies: ["Python"],
  }),
  makeProject("project-gamma", {
    title: "Project Gamma",
    articleDate: new Date("2023-01-01"),
    articleContent: "Gamma description",
  }),
]

describe("ProjectsArchive", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the archive hero and the complete project grid", () => {
    // Given
    mockGetAllProjects.mockReturnValue(projects)

    // When
    render(<ProjectsArchive />)

    // Then
    expect(screen.getByRole("heading", { level: 1, name: "The work" })).toBeInTheDocument()
    expect(mockGetAllProjects).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId("projects-grid")).toBeInTheDocument()
    expect(screen.getAllByTestId("project-teaser")).toHaveLength(3)
    expect(screen.getByText("Project Alpha")).toBeInTheDocument()
    expect(screen.getByText("Project Beta")).toBeInTheDocument()
    expect(screen.getByText("Project Gamma")).toBeInTheDocument()
  })

  it("marks only the explicitly featured project", () => {
    // Given
    mockGetAllProjects.mockReturnValue(projects)

    // When
    render(<ProjectsArchive />)

    // Then
    expect(screen.getAllByTestId("featured-badge")).toHaveLength(1)
    expect(screen.getByTestId("featured-project")).toHaveAttribute("href", "/projects/entry/project-alpha")
    expect(screen.getByTestId("featured-projects-grid")).toHaveTextContent("Project Alpha")
    expect(screen.getByTestId("project-year-2024")).toBeInTheDocument()
    expect(screen.getByTestId("project-year-2023")).toBeInTheDocument()
  })

  it("renders the closing CTA and archive headings", () => {
    // Given
    mockGetAllProjects.mockReturnValue(projects)

    // When
    render(<ProjectsArchive />)

    // Then
    expect(screen.getByRole("heading", { level: 2, name: "The archive" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "Have a project in mind?" })).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: "Start a conversation" }).length).toBeGreaterThanOrEqual(1)
  })

  it("renders an empty state instead of an empty grid", () => {
    // Given
    mockGetAllProjects.mockReturnValue([])

    // When
    render(<ProjectsArchive />)

    // Then
    expect(screen.getByText("No projects have been published yet.")).toBeInTheDocument()
  })
})
