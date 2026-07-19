import { fireEvent, render, screen } from "@testing-library/react"
import { Tooltip } from "./Tooltip"

describe("Tooltip", () => {
  it("renders trigger", () => {
    // Given

    // When
    render(
      <Tooltip explainer="Helpful explanation">
        <button type="button">Help</button>
      </Tooltip>
    )

    // Then
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument()
  })

  it("keeps explanation hidden before interaction", () => {
    // Given
    const explainer = "Helpful explanation"

    // When
    render(
      <Tooltip explainer={explainer}>
        <button type="button">Help</button>
      </Tooltip>
    )

    // Then
    expect(screen.queryByText(explainer)).not.toBeInTheDocument()
  })

  it("reveals explanation when controlled open state is true", () => {
    // Given
    const explainer = "Helpful explanation"

    // When
    render(
      <Tooltip explainer={explainer} open>
        <button type="button">Help</button>
      </Tooltip>
    )

    // Then
    expect(screen.getByRole("tooltip")).toHaveTextContent(explainer)
  })

  it("reveals explanation when trigger receives keyboard focus", () => {
    // Given
    const explainer = "Helpful explanation"
    render(
      <Tooltip explainer={explainer}>
        <button type="button">Help</button>
      </Tooltip>
    )

    // When
    fireEvent.focus(screen.getByRole("button", { name: "Help" }))

    // Then
    expect(screen.getByRole("tooltip")).toHaveTextContent(explainer)
  })

  it("associates visible tooltip with trigger through accessibility attributes", () => {
    // Given
    render(
      <Tooltip explainer="Helpful explanation" open>
        <button type="button">Help</button>
      </Tooltip>
    )

    // When
    const trigger = screen.getByRole("button", { name: "Help" })

    // Then
    expect(trigger).toHaveAttribute("aria-describedby")
    expect(screen.getByRole("tooltip")).toHaveAttribute("id", trigger.getAttribute("aria-describedby"))
  })
})
