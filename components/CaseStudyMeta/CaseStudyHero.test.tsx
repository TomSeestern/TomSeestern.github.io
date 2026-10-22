import { render, screen } from "@testing-library/react"
import React from "react"

import CaseStudyHero from "./CaseStudyHero"

describe("CaseStudyHero", () => {
  it("renders the hero image when a source is present", () => {
    // Given
    const src = "/img/hero.webp"

    // When
    render(<CaseStudyHero src={src} title="Enriched project" year="2021" index={4} />)

    // Then
    const hero = screen.getByTestId("case-study-hero")
    expect(hero).toBeInTheDocument()
    expect(hero).toHaveTextContent("Evidence / Case file")
    expect(hero).toHaveTextContent("Enriched project")
    expect(hero).toHaveTextContent("2021")
    expect(hero).toHaveTextContent("Fig. 05")
    const image = hero.querySelector("img")
    expect(image).toHaveAttribute("src", expect.stringContaining(encodeURIComponent(src)))
    expect(image).toHaveAttribute("alt", "")
    expect(image).toHaveClass("object-contain")
  })

  it("renders nothing when the source is empty", () => {
    // Given
    const src = ""

    // When
    const { container } = render(<CaseStudyHero src={src} />)

    // Then
    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when the source is only whitespace", () => {
    // Given
    const src = "   "

    // When
    const { container } = render(<CaseStudyHero src={src} />)

    // Then
    expect(container).toBeEmptyDOMElement()
  })
})
