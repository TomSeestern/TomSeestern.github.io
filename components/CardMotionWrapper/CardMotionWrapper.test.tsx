import { render, screen } from "@testing-library/react"
import { CardMotionWrapper } from "./CardMotionWrapper"

describe("CardMotionWrapper", () => {
  it("renders children inside the wrapper", () => {
    // When
    render(
      <CardMotionWrapper>
        <p>Hello card</p>
      </CardMotionWrapper>
    )

    // Then
    expect(screen.getByText("Hello card")).toBeInTheDocument()
  })

  it("passes className to the wrapper element", () => {
    // When
    const { container } = render(
      <CardMotionWrapper className="test-class">
        <p>Test</p>
      </CardMotionWrapper>
    )

    // Then
    expect(container.firstChild).toHaveClass("test-class")
  })
})
