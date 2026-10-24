import { render, screen } from "@testing-library/react"
import BlogIndex from "./page"
import { getAllBlogPosts } from "../../lib/blog"
import { MarkdownEntry } from "../../lib/markdown"
import { getAllTags } from "../../lib/tags"

jest.mock("../../lib/blog", () => ({
  getAllBlogPosts: jest.fn(),
}))

jest.mock("../../lib/tags", () => ({
  getAllTags: jest.fn(),
}))

const mockGetAllBlogPosts = jest.mocked(getAllBlogPosts)
const mockGetAllTags = jest.mocked(getAllTags)

function makeBlogPost(id: string, overrides: Partial<MarkdownEntry> = {}): MarkdownEntry {
  return {
    id,
    title: "Untitled",
    articleDate: new Date("1990-01-01"),
    articleContent: "",
    authorImgSrc: "/img/placeholder.png",
    authorName: "Anonymous",
    fullArticleLink: `/blog/entry/${id}`,
    technologies: [],
    tags: [],
    featured: false,
    recentHighlight: false,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    links: [],
    ...overrides,
  }
}

const blogPosts: MarkdownEntry[] = [
  makeBlogPost("newest-post", {
    title: "Newest post",
    articleDate: new Date("2024-01-01"),
    articleContent: "Newest content",
    tags: ["Homelab"],
  }),
  makeBlogPost("middle-post", {
    title: "Middle post",
    articleDate: new Date("2020-01-01"),
    articleContent: "Middle content",
    tags: ["Automation"],
  }),
  makeBlogPost("oldest-post", {
    title: "Oldest post",
    articleDate: new Date("2019-01-01"),
    articleContent: "Oldest content",
    tags: ["Recipes"],
  }),
]

describe("BlogIndex", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllTags.mockReturnValue([
      { key: "homelab", label: "Homelab", slug: "homelab", count: 2, entries: [] },
      { key: "recipes", label: "Recipes", slug: "recipes", count: 1, entries: [] },
    ])
  })

  it("renders a featured article and the remaining dispatches as rows", () => {
    // Given
    mockGetAllBlogPosts.mockReturnValue(blogPosts)

    // When
    render(<BlogIndex />)

    // Then
    expect(screen.getByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "Latest entries" })).toBeInTheDocument()
    expect(screen.getByTestId("blog-grid")).toBeInTheDocument()
    expect(screen.getAllByTestId("article-card")).toHaveLength(1)
    expect(screen.getAllByTestId("article-row")).toHaveLength(2)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
  })

  it("renders absolute dates and tag-strip links", () => {
    // Given
    mockGetAllBlogPosts.mockReturnValue(blogPosts)

    // When
    render(<BlogIndex />)

    // Then
    expect(screen.getAllByText("01 JAN 2024").length).toBeGreaterThan(0)
    expect(screen.getByRole("link", { name: "Homelab" })).toHaveAttribute("href", "/tags/homelab")
    expect(screen.getByRole("link", { name: "Recipes" })).toHaveAttribute("href", "/tags/recipes")
    expect(screen.getByTestId("blog-topics")).toBeInTheDocument()
  })

  it("renders an empty state when there are no posts", () => {
    // Given
    mockGetAllBlogPosts.mockReturnValue([])

    // When
    render(<BlogIndex />)

    // Then
    expect(screen.getByText("No dispatches have been published yet.")).toBeInTheDocument()
  })
})
