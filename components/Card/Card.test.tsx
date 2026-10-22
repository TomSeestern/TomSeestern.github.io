import { render, screen } from "@testing-library/react"
import React from "react"
import Card from "./Card"

describe("Card", () => {
  it("renders a token-driven panel with the card test id", () => {
    // Given / When
    render(<Card>Card body</Card>)

    // Then
    const card = screen.getByTestId("card")
    expect(card).toHaveClass("border", "border-rule", "bg-panel", "rounded-lg")
    expect(card).toHaveTextContent("Card body")
  })

  it("forwards the ref and caller props", () => {
    // Given
    const ref = React.createRef<HTMLDivElement>()

    // When
    render(
      <Card ref={ref} aria-label="Project">
        Project
      </Card>
    )

    // Then
    expect(ref.current).toBe(screen.getByTestId("card"))
    expect(screen.getByLabelText("Project")).toBeInTheDocument()
  })

  it("renders an optional arch header above the body", () => {
    // Given / When
    render(<Card archHeader={<span>Case 01</span>}>Body</Card>)

    // Then
    expect(screen.getByText("Case 01")).toBeInTheDocument()
    expect(screen.getByTestId("card").querySelector(":scope > div")).toHaveClass("border-b")
  })

  it("keeps caller classes and inner padding overrides", () => {
    // Given / When
    render(
      <Card className="bg-night" innerClassName="p-2">
        Body
      </Card>
    )

    // Then
    expect(screen.getByTestId("card")).toHaveClass("bg-night")
    expect(screen.getByTestId("card").querySelector(":scope > div")).toHaveClass("p-2")
  })
})
