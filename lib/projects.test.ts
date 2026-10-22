import { MarkdownEntry } from "./markdown"
import { FEATURED_PROJECT_COUNT, getAllProjects, selectFeaturedProjects } from "./projects"

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
    links: [],
    ...overrides,
  }
}

describe("selectFeaturedProjects", () => {
  it("uses the flagged projects, newest-first, when at least four are flagged", () => {
    // Given — six projects; flagged ones are not the four most recent.
    const projects = [
      makeProject("recent-a", { articleDate: new Date("2025-04-01") }),
      makeProject("flagged-a", { articleDate: new Date("2025-03-01"), featured: true }),
      makeProject("recent-b", { articleDate: new Date("2025-02-01") }),
      makeProject("flagged-b", { articleDate: new Date("2025-01-01"), featured: true }),
      makeProject("flagged-c", { articleDate: new Date("2024-12-01"), featured: true }),
      makeProject("flagged-d", { articleDate: new Date("2024-11-01"), featured: true }),
    ]

    // When
    const selected = selectFeaturedProjects(projects)

    // Then — exactly the flagged ids, in list (newest-first) order.
    expect(selected.map((project) => project.id)).toEqual(["flagged-a", "flagged-b", "flagged-c", "flagged-d"])
  })

  it("falls back to the four most recent projects when fewer than four are flagged", () => {
    // Given — only two flagged; the fallback must ignore them and take the newest four.
    const projects = [
      makeProject("newest", { articleDate: new Date("2025-04-01") }),
      makeProject("second", { articleDate: new Date("2025-03-01"), featured: true }),
      makeProject("third", { articleDate: new Date("2025-02-01") }),
      makeProject("fourth", { articleDate: new Date("2025-01-01"), featured: true }),
      makeProject("fifth", { articleDate: new Date("2024-12-01") }),
    ]

    // When
    const selected = selectFeaturedProjects(projects)

    // Then
    expect(selected.map((project) => project.id)).toEqual(["newest", "second", "third", "fourth"])
  })

  it("falls back deterministically when no project is flagged", () => {
    // Given
    const projects = Array.from({ length: 6 }, (_, index) => makeProject(`project-${index}`))

    // When
    const selected = selectFeaturedProjects(projects)

    // Then
    expect(selected.map((project) => project.id)).toEqual(["project-0", "project-1", "project-2", "project-3"])
  })

  it("caps the flagged selection at the requested count", () => {
    // Given — six flagged projects.
    const projects = Array.from({ length: 6 }, (_, index) => makeProject(`flagged-${index}`, { featured: true }))

    // When
    const selected = selectFeaturedProjects(projects)

    // Then
    expect(selected).toHaveLength(FEATURED_PROJECT_COUNT)
    expect(selected.map((project) => project.id)).toEqual(["flagged-0", "flagged-1", "flagged-2", "flagged-3"])
  })

  it("returns every available project when the list is shorter than the count", () => {
    // Given
    const projects = [makeProject("only-one")]

    // When
    const selected = selectFeaturedProjects(projects)

    // Then
    expect(selected.map((project) => project.id)).toEqual(["only-one"])
  })

  it("ships exactly four explicit featured projects from the real content set", () => {
    // Given — the committed project frontmatter is the source of truth.
    const projects = getAllProjects()
    const flagged = projects.filter((project) => project.featured)

    // When
    const selected = selectFeaturedProjects(projects)

    // Then — the fallback is not doing the selection.
    expect(flagged).toHaveLength(FEATURED_PROJECT_COUNT)
    expect(selected).toHaveLength(FEATURED_PROJECT_COUNT)
    expect(selected.every((project) => project.featured)).toBe(true)
    expect(new Set(selected.map((project) => project.id)).size).toBe(FEATURED_PROJECT_COUNT)
  })
})
