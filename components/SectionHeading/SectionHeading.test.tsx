import { render, screen } from "@testing-library/react"
import { SectionHeading } from "./SectionHeading"

describe("SectionHeading", () => {
  it("renders a pixel eyebrow, display heading, lead, and action", () => {
    // Given / When
    render(
      <SectionHeading
        id="work-title"
        eyebrow="Selected Work"
        title="Four monuments"
        lead="A short lead."
        action={<a href="/projects">All work</a>}
      />
    )

    // Then
    expect(screen.getByText("Selected Work")).toHaveClass("font-pixel", "text-crimson")
    expect(screen.getByRole("heading", { level: 2, name: "Four monuments" })).toHaveAttribute("id", "work-title")
    expect(screen.getByText("A short lead.")).toHaveClass("text-ink-muted")
    expect(screen.getByRole("link", { name: "All work" })).toHaveAttribute("href", "/projects")
  })

  it("uses night-safe supporting colours", () => {
    // Given / When
    render(<SectionHeading eyebrow="Archive" title="The archive" tone="night" lead="Night lead." />)

    // Then
    expect(screen.getByText("Archive")).toHaveClass("text-gold-ink")
    expect(screen.getByText("Night lead.")).toHaveClass("text-night-muted")
  })

  it("centres the heading when requested", () => {
    // Given / When
    const { container } = render(<SectionHeading title="Centred" align="center" />)

    // Then
    expect(container.firstChild).toHaveClass("md:items-center", "md:text-center")
  })
})
