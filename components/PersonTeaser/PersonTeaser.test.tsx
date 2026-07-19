import { render, screen } from "@testing-library/react"
import PersonTeaser from "./PersonTeaser"

describe("PersonTeaser", () => {
  const companyName = "Example Company"
  const companyDescription = "Example description"
  const companyLink = "https://example.com"
  const companyLogoSrc = "/img/example-company.png"

  it("renders company name", () => {
    // Given

    // When
    render(
      <PersonTeaser
        companyName={companyName}
        companyLogoSrc={companyLogoSrc}
        companyDescription={companyDescription}
        companyLink={companyLink}
      />
    )

    // Then
    expect(screen.getByText(companyName)).toBeInTheDocument()
  })

  it("renders company description", () => {
    // Given

    // When
    render(
      <PersonTeaser
        companyName={companyName}
        companyLogoSrc={companyLogoSrc}
        companyDescription={companyDescription}
        companyLink={companyLink}
      />
    )

    // Then
    expect(screen.getByText(companyDescription)).toBeInTheDocument()
  })

  it("links complete teaser to company URL", () => {
    // Given

    // When
    render(
      <PersonTeaser
        companyName={companyName}
        companyLogoSrc={companyLogoSrc}
        companyDescription={companyDescription}
        companyLink={companyLink}
      />
    )

    // Then
    expect(screen.getByRole("link", { name: `${companyName} ${companyDescription}` })).toHaveAttribute(
      "href",
      companyLink
    )
  })

  it("renders company logo", () => {
    // Given

    // When
    render(
      <PersonTeaser
        companyName={companyName}
        companyLogoSrc={companyLogoSrc}
        companyDescription={companyDescription}
        companyLink={companyLink}
      />
    )

    // Then
    expect(screen.getByRole("img")).toBeInTheDocument()
  })

  it("keeps company logo decorative", () => {
    // Given

    // When
    render(
      <PersonTeaser
        companyName={companyName}
        companyLogoSrc={companyLogoSrc}
        companyDescription={companyDescription}
        companyLink={companyLink}
      />
    )

    // Then
    expect(screen.getByRole("img")).toHaveAttribute("alt", "")
  })
})
