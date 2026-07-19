import { render, screen } from "@testing-library/react"
import TimelineEntry from "./TimelineEntry"

describe("TimelineEntry", () => {
  const time = "2024"
  const title = "Senior Developer"
  const description = "Built reliable systems."
  const link = "/projects/reliable-systems"

  it("renders time", () => {
    // Given

    // When
    render(
      <TimelineEntry time={time} title={title} description={description} link={link}>
        <span>Optional detail</span>
      </TimelineEntry>
    )

    // Then
    expect(screen.getByText(time)).toBeInTheDocument()
  })

  it("renders title as a heading", () => {
    // Given

    // When
    render(
      <TimelineEntry time={time} title={title} description={description} link={link}>
        <span>Optional detail</span>
      </TimelineEntry>
    )

    // Then
    expect(screen.getByRole("heading", { name: title, level: 4 })).toBeInTheDocument()
  })

  it("links title to entry destination", () => {
    // Given

    // When
    render(
      <TimelineEntry time={time} title={title} description={description} link={link}>
        <span>Optional detail</span>
      </TimelineEntry>
    )

    // Then
    expect(screen.getByRole("link", { name: title })).toHaveAttribute("href", link)
  })

  it("renders description", () => {
    // Given

    // When
    render(
      <TimelineEntry time={time} title={title} description={description} link={link}>
        <span>Optional detail</span>
      </TimelineEntry>
    )

    // Then
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it("renders optional children", () => {
    // Given
    const childText = "Additional context"

    // When
    render(
      <TimelineEntry time={time} title={title} description={description} link={link}>
        <a href="/details">{childText}</a>
      </TimelineEntry>
    )

    // Then
    expect(screen.getByRole("link", { name: childText })).toHaveAttribute("href", "/details")
  })
})
