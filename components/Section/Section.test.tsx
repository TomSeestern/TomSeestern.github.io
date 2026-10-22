import { render, screen } from "@testing-library/react"
import { Section } from "./Section"

describe("Section", () => {
  it("renders a full-bleed canvas band by default", () => {
    // Given / When
    const { container } = render(
      <Section>
        <p>Body</p>
      </Section>
    )

    // Then
    const section = container.querySelector("section")
    expect(section).toHaveClass("bg-canvas", "text-ink")
    expect(section?.querySelector("div")).toHaveClass("max-w-width-page")
  })

  it("applies a night tone and exposes its labelling relationship", () => {
    // Given / When
    render(
      <Section tone="night" labelledBy="section-title">
        <h2 id="section-title">A heading</h2>
      </Section>
    )

    // Then
    const region = screen.getByRole("region", { name: "A heading" })
    expect(region).toHaveClass("bg-night", "text-night-ink")
    expect(region).toHaveAttribute("aria-labelledby", "section-title")
  })

  it("accepts caller classes and inner layout classes", () => {
    // Given / When
    const { container } = render(
      <Section className="border-y-2" innerClassName="max-w-3xl">
        <p>Body</p>
      </Section>
    )

    // Then
    expect(container.querySelector("section")).toHaveClass("border-y-2")
    expect(container.querySelector("section > div")).toHaveClass("max-w-3xl")
  })
})
