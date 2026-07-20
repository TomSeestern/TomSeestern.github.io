import { render, screen } from "@testing-library/react"
import { Footer } from "./Footer"

describe("Footer", () => {
  it("renders copyright attribution with the public site link", () => {
    // Given

    // When
    render(<Footer />)

    // Then
    expect(screen.getByText(/© 2019-2026/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "TomSegbers.de" })).toHaveAttribute("href", "https://tomsegbers.de/")
  })

  it("exposes LinkedIn social link with its real destination", () => {
    // Given

    // When
    render(<Footer />)

    // Then
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/tomsegbers/"
    )
  })

  it("exposes Twitter social link with its real destination", () => {
    // Given

    // When
    render(<Footer />)

    // Then
    expect(screen.getByRole("link", { name: /Twitter/ })).toHaveAttribute("href", "https://twitter.com/TomSegbers")
  })

  it("exposes GitHub social link with its real destination", () => {
    // Given

    // When
    render(<Footer />)

    // Then
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://www.github.com/TomSeestern/")
  })

  it("exposes Email contact link with its real destination", () => {
    // Given

    // When
    render(<Footer />)

    // Then
    expect(screen.getByRole("link", { name: /Email/ })).toHaveAttribute("href", "/contact")
  })

  it("does not regress social accessible names to obsolete labels", () => {
    // Given

    // When
    render(<Footer />)

    // Then
    expect(screen.queryByRole("link", { name: /Facebook Logo/ })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /Dribble Logo/ })).not.toBeInTheDocument()
  })
})
