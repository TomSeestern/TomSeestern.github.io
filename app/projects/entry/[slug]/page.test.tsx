import { render, screen, within } from "@testing-library/react"

import { getMarkdownEntry } from "@/lib/markdown"
import Page from "./page"

jest.mock("react-markdown", () => {
  return function ReactMarkdown({ children }: { readonly children: string }) {
    return <div>{children}</div>
  }
})

// Only the filesystem reader is mocked; `parseFrontmatter` (and its Zod schema)
// resolves to the real implementation via requireActual. This keeps the test at
// the integration seam under test — raw frontmatter in, rendered template out.
jest.mock("@/lib/markdown", () => ({
  ...jest.requireActual("@/lib/markdown"),
  getMarkdownEntry: jest.fn(),
}))

const mockGetMarkdownEntry = jest.mocked(getMarkdownEntry)

type MarkdownReaderResult = ReturnType<typeof getMarkdownEntry>

function givenEntry(data: Record<string, unknown>): void {
  const fileContent = { data, content: "body" } as unknown as MarkdownReaderResult
  mockGetMarkdownEntry.mockReturnValue(fileContent)
}

describe("[slug] project entry page", () => {
  const params = Promise.resolve({ slug: "example-project" })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the hero and labelled metric rows for an enriched entry", async () => {
    // Given frontmatter carrying the full additive case-study shape
    givenEntry({
      title: "Enriched project",
      role: "Lead Developer",
      outcome: "Shipped to production",
      heroImage: "/img/hero.webp",
      metrics: [
        { label: "Users", value: "1200" },
        { label: "Uptime", value: "99.9%" },
      ],
    })

    // When the detail page renders
    render(await Page({ params }))

    // Then the hero appears exactly once …
    expect(screen.getAllByTestId("case-study-hero")).toHaveLength(1)

    // … and the meta section carries the role, outcome, and both metrics.
    const meta = screen.getByTestId("case-study-meta")
    expect(within(meta).getByText("Role")).toBeInTheDocument()
    expect(within(meta).getByText("Lead Developer")).toBeInTheDocument()
    expect(within(meta).getByText("Outcome")).toBeInTheDocument()
    expect(within(meta).getByText("Shipped to production")).toBeInTheDocument()
    expect(within(meta).getByText("Users")).toBeInTheDocument()
    expect(within(meta).getByText("1200")).toBeInTheDocument()
    expect(within(meta).getByText("Uptime")).toBeInTheDocument()
    expect(within(meta).getByText("99.9%")).toBeInTheDocument()
  })

  it("renders a legacy entry unchanged with no case-study containers", async () => {
    // Given frontmatter with only the pre-existing fields
    givenEntry({ title: "Legacy project" })

    // When the detail page renders
    render(await Page({ params }))

    // Then no empty hero or meta container is fabricated …
    expect(screen.queryByTestId("case-study-hero")).toBeNull()
    expect(screen.queryByTestId("case-study-meta")).toBeNull()

    // … and the original heading still renders.
    expect(screen.getByRole("heading", { level: 1, name: "Legacy project" })).toBeInTheDocument()
  })
})
