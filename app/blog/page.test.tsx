import { render, screen } from "@testing-library/react"
import Articles from "./page"

import { getAllBlogPosts } from "../../lib/blog"

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

const mockGetAllBlogPosts = jest.mocked(getAllBlogPosts)

const blogPosts = [
  {
    id: "newest-post",
    title: "Newest post",
    articleDate: new Date("2024-01-01"),
    articleContent: "Newest content",
    authorImgSrc: "/img/newest.png",
    authorName: "Tom",
    fullArticleLink: "/blog/entry/newest-post",
  },
  {
    id: "middle-post",
    title: "Middle post",
    articleDate: new Date("2020-01-01"),
    articleContent: "Middle content",
    authorImgSrc: "/img/middle.png",
    authorName: "Tom",
    fullArticleLink: "/blog/entry/middle-post",
  },
  {
    id: "oldest-post",
    title: "Oldest post",
    articleDate: new Date("2019-01-01"),
    articleContent: "Oldest content",
    authorImgSrc: "/img/oldest.png",
    authorName: "Tom",
    fullArticleLink: "/blog/entry/oldest-post",
  },
] as const

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
