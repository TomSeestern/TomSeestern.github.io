import { render, screen } from "@testing-library/react"
import { Header } from "./Header"

describe("Header", () => {
  it("links site brand to homepage", () => {
    // Given

    // When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: /Tom Segbers Logo Tom Segbers/ })).toHaveAttribute("href", "/")
  })

  it("provides logo alternative text", () => {
    // Given

    // When
    render(<Header />)

    // Then
    expect(screen.getByRole("img", { name: "Tom Segbers Logo" })).toBeInTheDocument()
  })

  it("links About navigation to about page", () => {
    // Given

    // When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about")
  })

  it("links Projects navigation to projects page", () => {
    // Given

    // When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects")
  })

  it("links Blog navigation to blog page", () => {
    // Given

    // When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog")
  })

  it("renders contact call to action pointing to contact page", () => {
    // Given

    // When
    render(<Header />)

    // Then
    expect(screen.getAllByRole("link", { name: "Contact" })[0]).toHaveAttribute("href", "/contact")
  })
})
