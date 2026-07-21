import { formatDistanceToNow } from "date-fns"
import React from "react"
import { render, screen } from "@testing-library/react"
import { getIconPath } from "../../lib/icon-map"

jest.mock("../../lib/icon-map", () => ({
  getIconPath: jest.fn(),
}))

import ProjectTeaser from "./ProjectTeaser"

const mockGetIconPath = getIconPath as jest.MockedFunction<typeof getIconPath>
const projectDate = new Date("2024-01-01T00:00:00.000Z")
const baseProps = {
  title: "Test Project",
  description: "A test project description",
  technologies: ["React", "TypeScript"],
  ctaLink: "/projects/test",
  projectDate,
}

describe("ProjectTeaser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2025-01-01T00:00:00.000Z"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders project title as a level-three heading", () => {
    // Given
    mockGetIconPath.mockReturnValue(null)

    // When
    render(<ProjectTeaser {...baseProps} />)

    // Then
    expect(screen.getByRole("heading", { level: 3, name: baseProps.title })).toBeInTheDocument()
  })

  it("renders description as a project link", () => {
    // Given
    mockGetIconPath.mockReturnValue(null)

    // When
    render(<ProjectTeaser {...baseProps} />)

    // Then
    expect(screen.getByRole("link", { name: baseProps.description })).toHaveAttribute("href", baseProps.ctaLink)
  })

  it("renders a learn-more link with the project URL", () => {
    // Given
    mockGetIconPath.mockReturnValue(null)

    // When
    render(<ProjectTeaser {...baseProps} />)

    // Then
    expect(screen.getByRole("link", { name: /learn more/i })).toHaveAttribute("href", baseProps.ctaLink)
  })

  it("renders relative project date", () => {
    // Given
    mockGetIconPath.mockReturnValue(null)
    const expectedDate = formatDistanceToNow(projectDate, { addSuffix: true })

    // When
    render(<ProjectTeaser {...baseProps} />)

    // Then
    expect(screen.getByText(expectedDate)).toBeInTheDocument()
  })

  it("renders icon image for technology with mapped path", () => {
    // Given
    mockGetIconPath.mockImplementation((technology) => (technology === "React" ? "/icon/react.svg" : null))

    // When
    const { container } = render(<ProjectTeaser {...baseProps} />)

    // Then
    expect(container.querySelector('img[src="/icon/react.svg"]')).toBeInTheDocument()
  })

  it("renders text fallback for technology without mapped icon", () => {
    // Given
    mockGetIconPath.mockImplementation((technology) => (technology === "React" ? "/icon/react.svg" : null))

    // When
    render(<ProjectTeaser {...baseProps} />)

    // Then
    expect(screen.getAllByText("TypeScript")).not.toHaveLength(0)
    expect(screen.queryByRole("img", { name: "Tech Icon TypeScript" })).not.toBeInTheDocument()
  })

  it("looks up every listed technology through icon map", () => {
    // Given
    mockGetIconPath.mockReturnValue(null)

    // When
    render(<ProjectTeaser {...baseProps} />)

    // Then
    expect(mockGetIconPath).toHaveBeenNthCalledWith(1, "React")
    expect(mockGetIconPath).toHaveBeenNthCalledWith(2, "TypeScript")
  })

  it("renders no technology icons or fallbacks for empty technologies", () => {
    // Given
    mockGetIconPath.mockReturnValue("/icon/react.svg")

    // When
    render(<ProjectTeaser {...baseProps} technologies={[]} />)

    // Then
    expect(mockGetIconPath).not.toHaveBeenCalled()
    expect(screen.queryByRole("img", { name: /tech icon/i })).not.toBeInTheDocument()
    expect(screen.queryByText("React")).not.toBeInTheDocument()
  })

  it("keeps long project title visible and applies truncation class", () => {
    // Given
    mockGetIconPath.mockReturnValue(null)
    const longTitle = "A project title long enough to require visual truncation in compact card layouts"

    // When
    render(<ProjectTeaser {...baseProps} title={longTitle} />)

    // Then
    expect(screen.getByRole("heading", { level: 3, name: longTitle })).toHaveClass("truncate")
  })

  it("keeps card hover elevation classes", () => {
    // Given
    mockGetIconPath.mockReturnValue(null)

    // When
    const { container } = render(<ProjectTeaser {...baseProps} />)

    // Then — motion wrapper scales on hover; inner Card keeps hover:z-50
    const motionWrapper = container.querySelector(".h-full.w-full")
    expect(motionWrapper).toBeInTheDocument()
    // The Card (child of motion div) still has hover:z-50 for z-index elevation
    const card = motionWrapper!.querySelector(".transition-colors")
    expect(card).toHaveClass("hover:z-50")
  })
})
