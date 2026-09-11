import { render, screen } from "@testing-library/react"
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb"

describe("Breadcrumb", () => {
  it("renders a labelled navigation landmark wrapping an ordered list", () => {
    // Given / When
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
        <BreadcrumbItem>Post</BreadcrumbItem>
      </Breadcrumb>
    )

    // Then
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" })
    expect(nav.querySelector("ol")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
  })

  it("renders section crumbs as links", () => {
    // Given / When
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
      </Breadcrumb>
    )

    // Then
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog")
  })

  it("marks the current crumb with aria-current and renders it as text", () => {
    // Given / When
    render(
      <Breadcrumb>
        <BreadcrumbItem>Current page</BreadcrumbItem>
      </Breadcrumb>
    )

    // Then
    const current = screen.getByText("Current page")
    expect(current).toHaveAttribute("aria-current", "page")
    expect(current.tagName).toBe("SPAN")
  })

  it("hides the decorative separators from assistive technology", () => {
    // Given / When
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Post</BreadcrumbItem>
      </Breadcrumb>
    )

    // Then
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2)
  })

  it("truncates the current crumb so long titles cannot overflow", () => {
    // Given
    const longTitle = "A very long page title that must truncate instead of overflowing the viewport"

    // When
    render(
      <Breadcrumb>
        <BreadcrumbItem>{longTitle}</BreadcrumbItem>
      </Breadcrumb>
    )

    // Then
    expect(screen.getByText(longTitle)).toHaveClass("truncate")
  })
})
