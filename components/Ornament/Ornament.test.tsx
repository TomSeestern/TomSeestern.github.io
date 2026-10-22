import { render, screen } from "@testing-library/react"
import { ArchFrame, Laurel, Meander, PixelDust } from "."

describe("ornaments", () => {
  it("renders the meander as a decorative divider", () => {
    // Given / When
    render(<Meander />)

    // Then
    const meander = screen.getByTestId("meander")
    expect(meander).toHaveAttribute("aria-hidden", "true")
    expect(meander).toHaveClass("meander")
  })

  it("renders the laurel as two currentColor paths", () => {
    // Given / When
    render(<Laurel className="text-gold" />)

    // Then
    const laurel = screen.getByTestId("laurel")
    expect(laurel).toHaveAttribute("aria-hidden", "true")
    expect(laurel).toHaveClass("text-gold")
    expect(laurel.querySelectorAll("path")).toHaveLength(2)
  })

  it("renders pixel dust as one decorative path", () => {
    // Given / When
    render(<PixelDust />)

    // Then
    const dust = screen.getByTestId("pixel-dust")
    expect(dust).toHaveAttribute("aria-hidden", "true")
    expect(dust.querySelectorAll("path")).toHaveLength(1)
  })

  it("keeps arch-frame content in the accessibility tree", () => {
    // Given / When
    render(
      <ArchFrame>
        <p>Framed content</p>
      </ArchFrame>
    )

    // Then
    expect(screen.getByTestId("arch-frame")).toContainElement(screen.getByText("Framed content"))
    expect(screen.getByTestId("arch-frame")).not.toHaveAttribute("aria-hidden")
  })
})
