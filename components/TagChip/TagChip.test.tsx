import { render, screen } from "@testing-library/react"
import { TagChip } from "./TagChip"

describe("TagChip", () => {
  it("renders a static outline chip by default", () => {
    // Given / When
    render(<TagChip label="TypeScript" />)

    // Then
    const chip = screen.getByTestId("tag-chip")
    expect(chip).toHaveTextContent("TypeScript")
    expect(chip).toHaveClass("border-rule-strong", "text-ink")
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("renders a linked chip with a focus ring", () => {
    // Given / When
    render(<TagChip label="React" href="/tags/react" />)

    // Then
    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute("href", "/tags/react")
    expect(screen.getByRole("link", { name: "React" })).toHaveClass("focus-ring")
  })

  it("supports the solid and link variants", () => {
    // Given / When
    render(
      <>
        <TagChip label="Solid" variant="solid" testId="solid-chip" />
        <TagChip label="Link" variant="link" testId="link-chip" href="/tags/link" />
      </>
    )

    // Then
    expect(screen.getByTestId("solid-chip")).toHaveClass("bg-ink", "text-canvas")
    expect(screen.getByTestId("link-chip")).toHaveClass("text-crimson", "underline")
  })
})
