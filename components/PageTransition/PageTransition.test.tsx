import { render, screen } from "@testing-library/react"
import PageTransition from "./PageTransition"

describe("PageTransition", () => {
  it("renders children inside main element", () => {
    render(
      <PageTransition>
        <h2>Page content</h2>
      </PageTransition>
    )
    expect(screen.getByRole("heading", { level: 2, name: "Page content" })).toBeInTheDocument()
  })

  it("renders as a main element with id main-content", () => {
    const { container } = render(
      <PageTransition>
        <p>Test</p>
      </PageTransition>
    )
    const main = container.querySelector("main")
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute("id", "main-content")
    expect(main).toHaveAttribute("tabindex", "-1")
  })
})
