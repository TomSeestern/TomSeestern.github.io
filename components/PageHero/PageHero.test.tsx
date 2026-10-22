import { render, screen } from "@testing-library/react"
import { PageHero } from "./PageHero"

describe("PageHero", () => {
  it("renders the page H1, eyebrow, lead, and actions", () => {
    // Given / When
    render(
      <PageHero
        titleId="page-title"
        eyebrow="Portfolio"
        title="The work"
        lead="Selected case files."
        actions={<a href="#work">Jump to work</a>}
      />
    )

    // Then
    expect(screen.getByRole("heading", { level: 1, name: "The work" })).toHaveAttribute("id", "page-title")
    expect(screen.getByText("Portfolio")).toHaveClass("font-pixel")
    expect(screen.getByText("Selected case files.")).toHaveClass("text-ink-muted")
    expect(screen.getByRole("link", { name: "Jump to work" })).toHaveAttribute("href", "#work")
  })

  it("exposes an optional aside and a night tone", () => {
    // Given / When
    render(<PageHero title="Night page" tone="night" aside={<span data-testid="hero-aside">Sigil</span>} />)

    // Then
    const hero = screen.getByTestId("page-hero")
    expect(hero).toHaveClass("bg-night", "text-night-ink")
    expect(screen.getByTestId("hero-aside")).toBeInTheDocument()
  })

  it("keeps the H1 as the only level-one heading in the hero", () => {
    // Given / When
    render(<PageHero title="Only one" />)

    // Then
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  })
})
