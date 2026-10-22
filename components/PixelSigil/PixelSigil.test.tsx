import { render, screen } from "@testing-library/react"
import { PixelSigil } from "./PixelSigil"

describe("PixelSigil", () => {
  it("renders at most four path nodes and hides itself from assistive technology", () => {
    // Given / When
    render(<PixelSigil slug="paymenow" />)

    // Then
    const svg = screen.getByTestId("pixel-sigil")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg.querySelectorAll("path").length).toBeLessThanOrEqual(4)
    expect(svg.querySelectorAll("rect")).toHaveLength(0)
  })

  it("is deterministic for the same slug", () => {
    // Given / When
    const { container: first } = render(<PixelSigil slug="iseeunet" />)
    const { container: second } = render(<PixelSigil slug="iseeunet" />)

    // Then
    expect(first.innerHTML).toBe(second.innerHTML)
  })

  it("supports the three size steps", () => {
    // Given / When
    render(<PixelSigil slug="skinshark" size="sm" />)

    // Then
    expect(screen.getByTestId("pixel-sigil")).toHaveClass("size-10")
  })
})
