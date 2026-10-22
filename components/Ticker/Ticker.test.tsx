import { render, screen } from "@testing-library/react"
import { Ticker } from "./Ticker"

describe("Ticker", () => {
  it("renders the visible track and a hidden duplicate", () => {
    // Given / When
    render(<Ticker items={["Selected work", "Case files"]} />)

    // Then
    expect(screen.getByTestId("ticker")).toHaveClass("bg-night", "text-night-ink")
    expect(screen.getByTestId("ticker-track")).toHaveTextContent("Selected work")
    expect(screen.getByTestId("ticker-duplicate")).toHaveAttribute("aria-hidden", "true")
    expect(screen.getAllByText("Selected work")).toHaveLength(2)
  })

  it("supports the crimson tone", () => {
    // Given / When
    render(<Ticker items={["One"]} tone="crimson" />)

    // Then
    expect(screen.getByTestId("ticker")).toHaveClass("bg-crimson", "text-canvas")
  })

  it("renders nothing for an empty item list", () => {
    // Given / When
    const { container } = render(<Ticker items={[]} />)

    // Then
    expect(container).toBeEmptyDOMElement()
  })
})
