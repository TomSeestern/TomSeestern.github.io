import { render, screen } from "@testing-library/react"
import Page, { generateMetadata } from "./page"

jest.mock("react-markdown", () => {
  return function ReactMarkdown({ children }: { readonly children: string }) {
    return <div>{children}</div>
  }
})

describe("[slug] page", () => {
  const slug = "2019-ebeltoft-cheesecake-recipe"
  const params = Promise.resolve({ slug })

  it("renders <h1> title of blog entry", async () => {
    render(await Page({ params }))
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("Memorable Ebeltoft Cheesecake – A Sweet Souvenir")
  })

  it("generates canonical link tag metadata", async () => {
    const metadata = await generateMetadata({ params }, {} as any)
    expect(metadata.alternates?.canonical).toBe(`https://tom.segbers.de/blog/entry/${slug}`)
  })
})
