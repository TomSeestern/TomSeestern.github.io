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

  it("uses primary styling by default", () => {
    // Given
    const href = "/primary"

    // When
    render(<Button href={href}>Primary action</Button>)

    // Then
    expect(screen.getByRole("link", { name: "Primary action" })).toHaveClass("bg-accent-light", "text-foreground-dark")
  })

  it("uses secondary styling when requested", () => {
    // Given
    const href = "/secondary"

    // When
    render(
      <Button href={href} intent="secondary">
        Secondary action
      </Button>
    )

    // Then
    expect(screen.getByRole("link", { name: "Secondary action" })).toHaveClass("bg-transparent", "text-accent-light")
  })

  it("uses compact sizing when size is sm", () => {
    // Given
    const href = "/compact"

    // When
    render(
      <Button href={href} size="sm">
        Compact action
      </Button>
    )

    // Then
    expect(screen.getByRole("link", { name: "Compact action" })).toHaveClass("min-w-20", "min-h-10", "text-sm")
  })

  it("underlines its link text when underline is enabled", () => {
    // Given
    const href = "/underlined"

    // When
    render(
      <Button href={href} underline>
        Underlined action
      </Button>
    )

    // Then
    expect(screen.getByRole("link", { name: "Underlined action" })).toHaveClass("underline")
  })
})
