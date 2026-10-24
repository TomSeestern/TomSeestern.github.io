import { render, screen } from "@testing-library/react"
import { TechnologyTooltip } from "./TechnologyTooltip"
import { TooltipProvider } from "../Providers/TooltipProvider"

describe("TechnologyTooltip", () => {
  it("renders a focusable trigger with an accessible name and sr-only text", () => {
    // Given / When
    render(
      <TooltipProvider>
        <TechnologyTooltip name="React" />
      </TooltipProvider>
    )

    // Then
    const trigger = screen.getByTestId("tech-tooltip-trigger")
    expect(trigger).toHaveAttribute("tabindex", "0")
    expect(trigger).toHaveAttribute("role", "button")
    expect(trigger).toHaveAttribute("aria-label", "React technology details")
    expect(trigger).toHaveTextContent("React technology details")
    expect(trigger.querySelector(".sr-only")).toHaveTextContent("React technology details")
  })
})
