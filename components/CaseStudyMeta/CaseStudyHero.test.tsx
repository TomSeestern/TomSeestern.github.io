import { render, screen } from "@testing-library/react"
import React from "react"

import CaseStudyHero from "./CaseStudyHero"

describe("CaseStudyHero", () => {
  it("renders the hero image when a source is present", () => {
    // Given
    const src = "/img/hero.webp"

    // When
    render(<CaseStudyHero src={src} />)

    // Then
    const hero = screen.getByTestId("case-study-hero")
    expect(hero).toBeInTheDocument()
    const image = hero.querySelector("img")
    expect(image).toHaveAttribute("src", expect.stringContaining(encodeURIComponent(src)))
    expect(image).toHaveAttribute("alt", "")
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
