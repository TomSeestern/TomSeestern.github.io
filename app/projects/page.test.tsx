import { render, screen } from "@testing-library/react"
import { MarkdownEntry } from "../../lib/markdown"

jest.mock("../../components/ProjectTeaser/ProjectTeaser", () => {
  return function ProjectTeaser({
    title,
    ctaLink,
    featured,
  }: {
    readonly title: string
    readonly ctaLink: string
    readonly featured?: boolean
  }) {
    return (
      <a href={ctaLink} data-featured={featured ? "true" : undefined}>
        {title}
      </a>
    )
  }
})

jest.mock("../../lib/projects", () => ({
  getAllProjects: jest.fn(),
  selectFeaturedProjects: jest.fn(),
}))

import { getAllProjects, selectFeaturedProjects } from "../../lib/projects"
import Articles from "./page"

const mockGetAllProjects = jest.mocked(getAllProjects)
const mockSelectFeaturedProjects = jest.mocked(selectFeaturedProjects)

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
    authorImgSrc: "/img/alpha.png",
    authorName: "Tom",
    technologies: ["TypeScript", "Next.js"],
  }),
  makeProject("project-beta", {
    title: "Project Beta",
    articleDate: new Date("2024-06-01"),
    articleContent: "Beta description",
    authorImgSrc: "/img/beta.png",
    authorName: "Tom",
    technologies: ["Python"],
  }),
  makeProject("project-gamma", {
    title: "Project Gamma",
    articleDate: new Date("2023-01-01"),
    articleContent: "Gamma description",
    authorImgSrc: "/img/gamma.png",
    authorName: "Tom",
  }),
]

describe("Articles (projects)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSelectFeaturedProjects.mockReturnValue([])
  })

  it("renders page heading", () => {
    // Given
    mockGetAllProjects.mockReturnValue(projects)

    // When
    render(<Articles />)

    // Then
    expect(screen.getByRole("heading", { level: 1, name: /showcasing my journey/i })).toBeInTheDocument()
  })

  it("renders project cards from getAllProjects results", () => {
    // Given
    mockGetAllProjects.mockReturnValue(projects)

    // When
    render(<Articles />)

    // Then
    expect(mockGetAllProjects).toHaveBeenCalledTimes(1)

    const projectLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/projects/entry/"))

    expect(projectLinks).toHaveLength(3)
    expect(projectLinks.map((link) => link.getAttribute("href"))).toEqual(projects.map((p) => p.fullArticleLink))
    expect(projectLinks.map((link) => link.textContent)).toEqual(projects.map((p) => p.title))
  })

  it("marks the subset returned by selectFeaturedProjects as featured", () => {
    // Given — only the first project is selected for the featured marker.
    mockGetAllProjects.mockReturnValue(projects)
    mockSelectFeaturedProjects.mockReturnValue(projects.filter((project) => project.id === "project-alpha"))

    // When
    render(<Articles />)

    // Then
    expect(mockSelectFeaturedProjects).toHaveBeenCalledWith(projects)
    const featuredLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("data-featured") === "true")

    expect(featuredLinks).toHaveLength(1)
    expect(featuredLinks[0]).toHaveTextContent("Project Alpha")
  })

  it("renders blog link anchor with focus-visible ring styles", () => {
    // Given
    mockGetAllProjects.mockReturnValue(projects)

    // When
    render(<Articles />)

    // Then
    const blogLink = screen.getByRole("link", { name: /view blog posts/i })
    expect(blogLink).toHaveAttribute("href", "/blog")
    expect(blogLink.className).toMatch(/focus-visible:ring/)
  })

  it("renders empty grid when no projects returned", () => {
    // Given
    mockGetAllProjects.mockReturnValue([])

    // When
    render(<Articles />)

    // Then
    expect(mockGetAllProjects).toHaveBeenCalledTimes(1)

    const projectCardLinks = screen
      .queryAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/projects/entry/"))

    expect(projectCardLinks).toHaveLength(0)
  })
})
