import { render, screen } from "@testing-library/react"
import { ProjectCover } from "./ProjectCover"

describe("ProjectCover", () => {
  it.each([
    ["2021-paymenow-leveraging-tech-to-secure-payments-for-ebay-sellers", "payments", "Payment rails"],
    ["2021-ai-drone-based-change-detection", "vision", "Embedded vision"],
    ["2021-skinshark-nft-minecraft-skin-trading", "marketplace", "Marketplace"],
    ["2020-digitizing-train-ticket-refunds-2020", "refund", "Public service"],
    ["an-unknown-project", "archive", "Case file"],
  ])("maps %s to the %s cover", (slug, variant, label) => {
    // Given / When
    const { container } = render(<ProjectCover slug={slug} index={0} />)

    // Then
    const cover = screen.getByTestId("project-cover")
    expect(cover).toHaveAttribute("data-variant", variant)
    expect(screen.getByText(`${label} / Fig. 01`)).toBeInTheDocument()
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })
})
