import { render, screen } from "@testing-library/react"
import React from "react"

import CaseStudyMeta from "./CaseStudyMeta"

describe("CaseStudyMeta", () => {
  it("renders role and outcome as labelled meta rows when present", () => {
    // Given
    const props = { role: "Lead Developer", outcome: "Shipped to production", metrics: [] }

    // When
    render(<CaseStudyMeta {...props} />)

    // Then
    expect(screen.getByText("Role")).toBeInTheDocument()
    expect(screen.getByText("Lead Developer")).toBeInTheDocument()
    expect(screen.getByText("Outcome")).toBeInTheDocument()
    expect(screen.getByText("Shipped to production")).toBeInTheDocument()
  })

  it("renders each metric label and value", () => {
    // Given
    const metrics = [
      { label: "Users", value: "1200" },
      { label: "Uptime", value: "99.9%" },
    ]

    // When
    render(<CaseStudyMeta role="" outcome="" metrics={metrics} />)

    // Then
    expect(screen.getByText("Users")).toBeInTheDocument()
    expect(screen.getByText("1200")).toBeInTheDocument()
    expect(screen.getByText("Uptime")).toBeInTheDocument()
    expect(screen.getByText("99.9%")).toBeInTheDocument()
  })

  it("renders nothing when every case-study field is absent", () => {
    // Given
    const props = { role: "", outcome: "", metrics: [] }

    // When
    const { container } = render(<CaseStudyMeta {...props} />)

    // Then
    expect(container).toBeEmptyDOMElement()
  })

  it("renders only the present meta row when the other is absent", () => {
    // Given
    const props = { role: "Advisor", outcome: "", metrics: [] }

    // When
    render(<CaseStudyMeta {...props} />)

    // Then
    expect(screen.getByText("Role")).toBeInTheDocument()
    expect(screen.queryByText("Outcome")).not.toBeInTheDocument()
  })

  it("drops metrics that carry no proof instead of rendering empty rows", () => {
    // Given
    const metrics = [
      { label: "Users", value: "" },
      { label: "", value: "1200" },
      { label: "   ", value: "   " },
    ]

    // When
    const { container } = render(<CaseStudyMeta role="" outcome="" metrics={metrics} />)

    // Then
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText("Users")).not.toBeInTheDocument()
    expect(screen.queryByText("1200")).not.toBeInTheDocument()
  })

  it("keeps a metric when both label and value are present", () => {
    // Given
    const metrics = [
      { label: "Users", value: "" },
      { label: "Latency", value: "42ms" },
    ]

    // When
    render(<CaseStudyMeta role="" outcome="" metrics={metrics} />)

    // Then
    expect(screen.getByText("Latency")).toBeInTheDocument()
    expect(screen.getByText("42ms")).toBeInTheDocument()
    expect(screen.queryByText("Users")).not.toBeInTheDocument()
  })
})
