import { fireEvent, render, screen } from "@testing-library/react"
import { Alert } from "./Alert"

describe("Alert", () => {
  it("renders a success alert as a polite status region", () => {
    // Given / When
    render(<Alert variant="success">Saved</Alert>)

    // Then
    expect(screen.getByRole("status")).toHaveTextContent("Saved")
    expect(screen.getByRole("status")).toHaveClass("border-verdigris", "bg-panel")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("renders a failure alert as an assertive alert region", () => {
    // Given / When
    render(<Alert variant="failure">Something went wrong</Alert>)

    // Then
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong")
    expect(screen.getByRole("alert")).toHaveClass("border-danger", "bg-danger-surface")
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("defaults to the success variant", () => {
    // Given / When
    render(<Alert>Saved</Alert>)

    // Then
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("exposes a keyboard-reachable dismiss control that fires onDismiss", () => {
    // Given
    const onDismiss = jest.fn()
    render(<Alert onDismiss={onDismiss}>Saved</Alert>)

    // When
    const dismiss = screen.getByRole("button", { name: "Dismiss" })
    expect(dismiss).toHaveAttribute("type", "button")
    fireEvent.click(dismiss)

    // Then
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it("renders no dismiss control without an onDismiss handler", () => {
    // Given / When
    render(<Alert>Saved</Alert>)

    // Then
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument()
  })
})
