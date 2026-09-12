import { render, screen } from "@testing-library/react"
import React from "react"

import Testimonials from "./Testimonials"

describe("Testimonials", () => {
  it("shows an unmissable visible Example label adjacent to the quotes", () => {
    // Given / When
    render(<Testimonials />)

    // Then
    expect(screen.getByText("Example")).toBeVisible()
    expect(screen.getByText("Illustrative examples — not real client testimonials.")).toBeVisible()
  })

  it("renders every example as a blockquote with a cite attribution", () => {
    // Given / When
    render(<Testimonials />)

    // Then
    const quotes = screen.getAllByTestId("illustrative-example")
    expect(quotes).toHaveLength(3)
    for (const quote of quotes) {
      expect(quote.querySelector("blockquote")).not.toBeNull()
      expect(quote.querySelector("figcaption cite")).not.toBeNull()
    }
  })

  it("attributes each example to a generic role, never a named entity", () => {
    // Given / When
    render(<Testimonials />)

    // Then
    expect(screen.getByText("Example — Product Lead")).toBeInTheDocument()
    expect(screen.getByText("Example — Engineering Manager")).toBeInTheDocument()
    expect(screen.getByText("Example — Startup Founder")).toBeInTheDocument()
  })

  it("uses exactly one h2 for the section without skipping the outline", () => {
    // Given / When
    render(<Testimonials />)

    // Then
    expect(screen.getByRole("heading", { level: 2, name: "Illustrative feedback" })).toBeInTheDocument()
  })
})
