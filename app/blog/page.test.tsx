import { render, screen } from "@testing-library/react"
import { getAllBlogPosts } from "../../lib/blog"
import { MarkdownEntry } from "../../lib/markdown"

jest.mock("../../components/ArticleTeaser/ArticleTeaser", () => {
  return function ArticleTeaser({
    title,
    fullArticleLink,
  }: {
    readonly title: string
    readonly fullArticleLink: string
  }) {
    return <a href={fullArticleLink}>{title}</a>
  }
})

jest.mock("../../lib/blog", () => ({
  getAllBlogPosts: jest.fn(),
}))

import Articles from "./page"

const mockGetAllBlogPosts = jest.mocked(getAllBlogPosts)

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
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    ...overrides,
  }
}

const blogPosts: MarkdownEntry[] = [
  makeBlogPost("newest-post", {
    title: "Newest post",
    articleDate: new Date("2024-01-01"),
    articleContent: "Newest content",
    authorImgSrc: "/img/newest.png",
    authorName: "Tom",
  }),
  makeBlogPost("middle-post", {
    title: "Middle post",
    articleDate: new Date("2020-01-01"),
    articleContent: "Middle content",
    authorImgSrc: "/img/middle.png",
    authorName: "Tom",
  }),
  makeBlogPost("oldest-post", {
    title: "Oldest post",
    articleDate: new Date("2019-01-01"),
    articleContent: "Oldest content",
    authorImgSrc: "/img/oldest.png",
    authorName: "Tom",
  }),
]

describe("Articles", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders getAllBlogPosts results in returned order", () => {
    // Given
    mockGetAllBlogPosts.mockReturnValue(blogPosts)

    // When
    render(<Articles />)

    // Then
    expect(mockGetAllBlogPosts).toHaveBeenCalledTimes(1)
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
      blogPosts.map((post) => post.fullArticleLink)
    )
  })
})
