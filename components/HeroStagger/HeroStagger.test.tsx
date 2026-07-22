import { render, screen } from "@testing-library/react"
import { HeroContainer, HeroH1, HeroItem, HeroP } from "./HeroStagger"

describe("HeroContainer", () => {
  it("renders children", () => {
    render(
      <HeroContainer>
        <p>Hero content</p>
      </HeroContainer>
    )
    expect(screen.getByText("Hero content")).toBeInTheDocument()
  })

  it("passes className to the wrapper", () => {
    const { container } = render(
      <HeroContainer className="custom-hero">
        <p>Test</p>
      </HeroContainer>
    )
    expect(container.firstChild).toHaveClass("custom-hero")
  })
})

describe("HeroH1", () => {
  it("renders as an h1 element", () => {
    render(<HeroH1>Main Title</HeroH1>)
    expect(screen.getByRole("heading", { level: 1, name: "Main Title" })).toBeInTheDocument()
  })
})

describe("HeroP", () => {
  it("renders children in a paragraph", () => {
    render(<HeroP>Subtitle text</HeroP>)
    expect(screen.getByText("Subtitle text")).toBeInTheDocument()
  })
})

describe("HeroItem", () => {
  it("renders children", () => {
    render(
      <HeroItem>
        <button>Click</button>
      </HeroItem>
    )
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument()
  })
})
