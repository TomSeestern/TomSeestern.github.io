import { render, screen } from "@testing-library/react"
import Impressum from "./page"

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
    retentionPeriod: "sechs Monate",
  }),
}))

describe("Impressum", () => {
  it("renders the supplied provider details and no placeholder", () => {
    // Given / When
    render(<Impressum />)

    // Then
    expect(document.body.textContent).not.toContain("TODO(")
    // The name and address appear twice: § 5 DDG and § 18 Abs. 2 MStV.
    expect(screen.getAllByText("Test Person")).toHaveLength(2)
    expect(screen.getAllByText(/c\/o Teststrasse 1/)).toHaveLength(2)
    expect(screen.getAllByText(/test@example\.com/)).toHaveLength(1)
  })

  it("omits the phone and VAT rows when the facts do not carry them", () => {
    // Given / When
    render(<Impressum />)

    // Then
    expect(screen.queryByText(/Telefon/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Umsatzsteuer/)).not.toBeInTheDocument()
  })

  it("keeps a single H1", () => {
    // Given / When
    render(<Impressum />)

    // Then
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("heading", { level: 1, name: "Impressum" })).toBeInTheDocument()
  })
})
