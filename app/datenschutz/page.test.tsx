import { render, screen } from "@testing-library/react"
import Datenschutz from "./page"

jest.mock("@/lib/legal-facts", () => ({
  readLegalFacts: () => ({
    name: "Test Person",
    street: "c/o Teststrasse 1",
    postalCode: "12345",
    city: "Teststadt",
    country: "Deutschland",
    email: "test@example.com",
    mstvResponsible: {
      name: "Test Person",
      street: "c/o Teststrasse 1",
      postalCode: "12345",
      city: "Teststadt",
      country: "Deutschland",
    },
    retentionPeriod: "sechs Monate nach der letzten Nachricht",
  }),
}))

describe("Datenschutz", () => {
  it("names the controller and renders the stated retention period", () => {
    // Given / When
    render(<Datenschutz />)

    // Then
    expect(document.body.textContent).not.toContain("TODO(")
    expect(screen.getByText("Test Person")).toBeInTheDocument()
    expect(screen.getByText(/sechs Monate nach der letzten Nachricht/)).toBeInTheDocument()
  })

  it("points at the providers' published safeguards instead of an unfilled claim", () => {
    // Given / When
    render(<Datenschutz />)

    // Then
    expect(screen.getByText(/vercel\.com\/legal\/dpa/)).toBeInTheDocument()
    expect(screen.getByText(/resend\.com\/legal\/dpa/)).toBeInTheDocument()
  })

  it("discloses the rate limiter's IP processing", () => {
    // Given / When
    render(<Datenschutz />)

    // Then
    expect(screen.getByText(/Ratenbegrenzung/)).toBeInTheDocument()
    expect(screen.getByText(/15 Minuten/)).toBeInTheDocument()
  })

  it("keeps a single H1", () => {
    // Given / When
    render(<Datenschutz />)

    // Then
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  })
})
