import { render, screen } from "@testing-library/react"
import { getAllProjects } from "../../lib/projects"

jest.mock("../../components/ProjectTeaser/ProjectTeaser", () => {
  return function ProjectTeaser({ title, ctaLink }: { readonly title: string; readonly ctaLink: string }) {
    return <a href={ctaLink}>{title}</a>
  }
})

jest.mock("../../lib/projects", () => ({
  getAllProjects: jest.fn(),
}))

import Articles from "./page"

const mockGetAllProjects = jest.mocked(getAllProjects)

const projects = [
  {
    id: "project-alpha",
    title: "Project Alpha",
    articleDate: new Date("2025-01-01"),
    articleContent: "Alpha description",
    authorImgSrc: "/img/alpha.png",
    authorName: "Tom",
    fullArticleLink: "/projects/entry/project-alpha",
    technologies: ["TypeScript", "Next.js"],
  },
  {
    id: "project-beta",
    title: "Project Beta",
    articleDate: new Date("2024-06-01"),
    articleContent: "Beta description",
    authorImgSrc: "/img/beta.png",
    authorName: "Tom",
    fullArticleLink: "/projects/entry/project-beta",
    technologies: ["Python"],
  },
  {
    id: "project-gamma",
    title: "Project Gamma",
    articleDate: new Date("2023-01-01"),
    articleContent: "Gamma description",
    authorImgSrc: "/img/gamma.png",
    authorName: "Tom",
    fullArticleLink: "/projects/entry/project-gamma",
    technologies: [],
  },
] as const

describe("Articles (projects)", () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  it("renders view-all anchor with focus-visible ring styles", () => {
    // Given
    mockGetAllProjects.mockReturnValue(projects)

    // When
    render(<Articles />)

    // Then
    const viewAllLink = screen.getByRole("link", { name: /view all projects/i })
    expect(viewAllLink).toHaveAttribute("href", "/projects")
    expect(viewAllLink.className).toMatch(/focus-visible:ring/)
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
