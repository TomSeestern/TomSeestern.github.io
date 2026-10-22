import { render, screen } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
  it("renders children as an accessible link", () => {
    // Given
    const href = "/contact"

    // When
    render(<Button href={href}>Contact me</Button>)

    // Then
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute("href", href)
  })

  it("uses the light primary treatment by default", () => {
    // Given / When
    render(<Button href="/primary">Primary action</Button>)

    // Then
    expect(screen.getByRole("link", { name: "Primary action" })).toHaveClass("bg-ink", "text-canvas", "min-h-11")
  })

  it("supports the secondary, ghost, and pixel variants", () => {
    // Given / When
    render(
      <>
        <Button href="/secondary" variant="secondary">
          Secondary action
        </Button>
        <Button href="/ghost" variant="ghost">
          Ghost action
        </Button>
        <Button href="/pixel" variant="pixel">
          Pixel action
        </Button>
      </>
    )

    // Then
    expect(screen.getByRole("link", { name: "Secondary action" })).toHaveClass(
      "bg-transparent",
      "text-ink",
      "border-rule-strong"
    )
    expect(screen.getByRole("link", { name: "Ghost action" })).toHaveClass("bg-transparent", "text-ink")
    expect(screen.getByRole("link", { name: "Pixel action" })).toHaveClass("bg-gold", "text-canvas")
  })

  it("uses the 44px compact target and the large target on request", () => {
    // Given / When
    render(
      <>
        <Button href="/compact" size="sm">
          Compact action
        </Button>
        <Button href="/large" size="lg">
          Large action
        </Button>
      </>
    )

    // Then
    expect(screen.getByRole("link", { name: "Compact action" })).toHaveClass("min-h-11")
    expect(screen.getByRole("link", { name: "Large action" })).toHaveClass("min-h-12")
  })

  it("merges caller classes without dropping the recipe", () => {
    // Given / When
    render(
      <Button href="/merged" className="w-full">
        Full width
      </Button>
    )

    // Then
    expect(screen.getByRole("link", { name: "Full width" })).toHaveClass("w-full", "bg-ink")
  })
})
