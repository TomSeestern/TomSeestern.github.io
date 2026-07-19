import { render, screen } from "@testing-library/react"
import { Tooltip } from "./Tooltip"

describe("Tooltip", () => {
  it("renders its trigger without rendering explainer content before interaction", () => {
    // Given
    const explainer = "Helpful explanation"

    // When
    render(
      <Tooltip explainer={explainer}>
        <button type="button">Help</button>
      </Tooltip>,
    )

    // Then
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument()
    expect(screen.queryByText(explainer)).not.toBeInTheDocument()
  })
})
