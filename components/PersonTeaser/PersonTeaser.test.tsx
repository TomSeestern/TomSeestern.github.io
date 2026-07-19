import { render, screen } from "@testing-library/react"
import PersonTeaser from "./PersonTeaser"

describe("PersonTeaser", () => {
  it("renders company details as one linked teaser with decorative logo", () => {
    // Given
    const companyLink = "https://example.com"

    // When
    render(
      <PersonTeaser
        companyName="Example Company"
        companyLogoSrc="/img/example-company.png"
        companyDescription="Example description"
        companyLink={companyLink}
      />,
    )

    // Then
    expect(screen.getByRole("link", { name: "Example Company Example description" })).toHaveAttribute("href", companyLink)
    expect(screen.getByText("Example Company")).toBeInTheDocument()
    expect(screen.getByText("Example description")).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute("alt", "")
  })
})
