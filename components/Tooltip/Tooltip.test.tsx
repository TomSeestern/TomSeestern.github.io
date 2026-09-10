import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactElement } from "react"
import { Tooltip } from "./Tooltip"
import { TooltipProvider } from "../Providers/TooltipProvider"

// Wrap Radix's Provider in a spy so we can assert structurally that Tooltip
// does not mount its own provider. Radix's Provider renders no DOM node, so a
// DOM-count assertion is not observable — the mock is the structural seam.
jest.mock("@radix-ui/react-tooltip", () => {
  const actual = jest.requireActual("@radix-ui/react-tooltip")
  return {
    __esModule: true,
    ...actual,
    Provider: jest.fn(actual.Provider),
  }
})

const providerSpy = (jest.requireMock("@radix-ui/react-tooltip") as { Provider: jest.Mock }).Provider

function renderInRootProvider(element: ReactElement) {
  return render(<TooltipProvider>{element}</TooltipProvider>)
}

describe("Tooltip", () => {
  beforeEach(() => {
    providerSpy.mockClear()
  })

  it("renders trigger", () => {
    // Given

    // When
    renderInRootProvider(
      <Tooltip explainer="Helpful explanation">
        <button type="button">Help</button>
      </Tooltip>
    )

    // Then
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument()
  })

  it("does not mount its own provider — the single root provider owns the context", () => {
    // Given a single root provider for the whole app

    // When a tooltip renders
    renderInRootProvider(
      <Tooltip explainer="Helpful explanation">
        <button type="button">Help</button>
      </Tooltip>
    )

    // Then exactly one provider is mounted (the root), not one per tooltip
    expect(providerSpy).toHaveBeenCalledTimes(1)
  })

  it("keeps explanation hidden before interaction", () => {
    // Given
    const explainer = "Helpful explanation"

    // When
    renderInRootProvider(
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
    renderInRootProvider(
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
    renderInRootProvider(
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
    renderInRootProvider(
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
