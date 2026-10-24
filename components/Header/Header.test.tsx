import { fireEvent, render, screen } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { Header } from "./Header"

const mockUsePathname = jest.mocked(usePathname)

describe("Header", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/")
  })

  it("links the brand to the homepage", () => {
    // Given / When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "tomsegbers — Tom Segbers, home" })).toHaveAttribute("href", "/")
  })

  it("renders the site header landmark", () => {
    // Given / When
    render(<Header />)

    // Then
    expect(screen.getByTestId("site-header")).toBeInTheDocument()
  })

  it("links About navigation to about page", () => {
    // Given / When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about")
  })

  it("links Projects navigation to projects page", () => {
    // Given / When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects")
  })

  it("links Blog navigation to blog page", () => {
    // Given / When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog")
  })

  it("renders contact calls to action pointing to the contact page", () => {
    // Given / When
    render(<Header />)

    // Then
    expect(
      screen.getAllByRole("link", { name: "Contact" }).every((link) => link.getAttribute("href") === "/contact")
    ).toBe(true)
  })

  it("exposes the mobile toggle as a disclosure for the navigation list", () => {
    // Given
    render(<Header />)

    // When
    const toggle = screen.getByRole("button", { name: "Open main menu" })

    // Then — the toggle is wired to the list and starts collapsed.
    expect(toggle).toHaveAttribute("aria-controls", "site-nav")
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("list", { name: "" })).toHaveAttribute("id", "site-nav")
  })

  it("flips aria-expanded and the visible label when the toggle is activated", () => {
    // Given
    render(<Header />)
    const toggle = screen.getByRole("button", { name: "Open main menu" })

    // When
    fireEvent.click(toggle)

    // Then
    expect(screen.getByRole("button", { name: "Close main menu" })).toHaveAttribute("aria-expanded", "true")
  })

  it("closes the mobile menu after a navigation link is activated", () => {
    // Given
    render(<Header />)
    fireEvent.click(screen.getByRole("button", { name: "Open main menu" }))

    // When
    fireEvent.click(screen.getByRole("link", { name: "About" }))

    // Then
    expect(screen.getByRole("button", { name: "Open main menu" })).toHaveAttribute("aria-expanded", "false")
  })

  it("closes the mobile menu on Escape", () => {
    // Given
    render(<Header />)
    fireEvent.click(screen.getByRole("button", { name: "Open main menu" }))

    // When
    fireEvent.keyDown(document, { key: "Escape" })

    // Then
    expect(screen.getByRole("button", { name: "Open main menu" })).toHaveAttribute("aria-expanded", "false")
  })

  it("marks the active route in the navigation with aria-current", () => {
    // Given
    mockUsePathname.mockReturnValue("/about")

    // When
    render(<Header />)

    // Then
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Projects" })).not.toHaveAttribute("aria-current")
  })
})
