import { render, screen } from "@testing-library/react"
import Page, { generateMetadata } from "./page"

jest.mock("react-markdown", () => {
  return function ReactMarkdown({ children }: { readonly children: string }) {
    return <div>{children}</div>
  }
})

describe("[slug] blog entry page", () => {
  const slug = "2019-ebeltoft-cheesecake-recipe"
  const params = Promise.resolve({ slug })

  it("renders the dispatch header, metadata, body, author card, and onward reading", async () => {
    // Given / When
    render(await Page({ params }))

    // Then
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Memorable Ebeltoft Cheesecake – A Sweet Souvenir"
    )
    const meta = screen.getByTestId("article-meta")
    expect(meta).toHaveTextContent("21 AUG 2019")
    expect(meta).toHaveTextContent(/\d+ min read/)
    expect(screen.getByRole("link", { name: "Recipes" })).toHaveAttribute("href", "/tags/recipes")
    expect(screen.getByTestId("article-body")).not.toBeEmptyDOMElement()
    expect(screen.getByTestId("author-card")).toHaveTextContent("Tom Segbers")
    expect(screen.getByTestId("more-dispatches")).toBeInTheDocument()
    expect(screen.getAllByTestId("article-card")).toHaveLength(2)
  })

  it("generates canonical link tag metadata", async () => {
    const metadata = await generateMetadata({ params }, {} as never)
    expect(metadata.alternates?.canonical).toBe(`https://tom.segbers.de/blog/entry/${slug}`)
  })
})
