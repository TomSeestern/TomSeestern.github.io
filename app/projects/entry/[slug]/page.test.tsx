import { render, screen, within } from "@testing-library/react"
import { TooltipProvider } from "@/components/Providers/TooltipProvider"
import type { MarkdownEntry } from "@/lib/markdown"
import { getMarkdownEntry } from "@/lib/markdown"
import { getAllProjects } from "@/lib/projects"
import Page from "./page"

jest.mock("react-markdown", () => {
  return function ReactMarkdown({ children }: { readonly children: string }) {
    return <div>{children}</div>
  }
})

jest.mock("@/lib/markdown", () => ({
  ...jest.requireActual("@/lib/markdown"),
  getMarkdownEntry: jest.fn(),
}))

jest.mock("@/lib/projects", () => ({
  getAllProjects: jest.fn(),
}))

const mockGetMarkdownEntry = jest.mocked(getMarkdownEntry)
const mockGetAllProjects = jest.mocked(getAllProjects)

type MarkdownReaderResult = ReturnType<typeof getMarkdownEntry>

function givenEntry(data: Record<string, unknown>): void {
  const fileContent = { data, content: "body" } as unknown as MarkdownReaderResult
  mockGetMarkdownEntry.mockReturnValue(fileContent)
}

function makeProject(id: string, overrides: Partial<MarkdownEntry> = {}): MarkdownEntry {
  return {
    id,
    title: id,
    articleDate: new Date("2021-01-01"),
    articleContent: "",
    authorImgSrc: "/img/logo.png",
    authorName: "Tom Segbers",
    fullArticleLink: `/projects/entry/${id}`,
    technologies: [],
    tags: [],
    featured: false,
    role: "",
    outcome: "",
    heroImage: "",
    metrics: [],
    ...overrides,
  }
}

describe("[slug] project entry page", () => {
  const params = Promise.resolve({ slug: "example-project" })

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllProjects.mockReturnValue([
      makeProject("example-project", { articleDate: new Date("2021-01-01") }),
      makeProject("older-project", { title: "Older project", articleDate: new Date("2020-01-01") }),
    ])
  })

  it("renders the case-file hero, dossier, and optional evidence", async () => {
    // Given
    givenEntry({
      title: "Enriched project",
      articleDate: "2021-06-01",
      articleContent: "A short case-file lead.",
      technologies: ["React", "AWS"],
      tags: ["Payments"],
      role: "Lead Developer",
      outcome: "Shipped to production",
      heroImage: "/img/hero.webp",
      metrics: [
        { label: "Users", value: "1200" },
        { label: "Uptime", value: "99.9%" },
      ],
    })

    // When
    render(<TooltipProvider>{await Page({ params })}</TooltipProvider>)

    // Then
    expect(screen.getByRole("heading", { level: 1, name: "Enriched project" })).toBeInTheDocument()
    expect(screen.getByTestId("case-study-hero")).toBeInTheDocument()
    expect(screen.getByTestId("project-body")).toHaveTextContent("body")
    expect(screen.queryByTestId("case-study-meta")).not.toBeInTheDocument()

    const dossier = screen.getByTestId("project-dossier")
    expect(within(dossier).getByText("2021")).toBeInTheDocument()
    expect(within(dossier).getByText("React")).toBeInTheDocument()
    expect(within(dossier).getByText("Payments")).toBeInTheDocument()
    expect(within(dossier).getByText("Lead Developer")).toBeInTheDocument()
    expect(within(dossier).getByText("Shipped to production")).toBeInTheDocument()
    expect(within(dossier).getByText("Users")).toBeInTheDocument()
    expect(within(dossier).getByText("1200")).toBeInTheDocument()
  })

  it("renders a legacy entry with no empty hero or meta containers", async () => {
    // Given
    givenEntry({ title: "Legacy project", articleDate: "2010-01-01" })

    // When
    render(<TooltipProvider>{await Page({ params })}</TooltipProvider>)

    // Then
    expect(screen.queryByTestId("case-study-hero")).not.toBeInTheDocument()
    expect(screen.queryByTestId("case-study-meta")).not.toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1, name: "Legacy project" })).toBeInTheDocument()
    expect(screen.getByTestId("project-dossier")).toHaveTextContent("2010")
  })

  it("keeps the breadcrumb current crumb text equal to the H1 and links to the next project", async () => {
    // Given
    givenEntry({ title: "Legacy project", articleDate: "2021-01-01" })

    // When
    render(<TooltipProvider>{await Page({ params })}</TooltipProvider>)

    // Then
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" })
    const currentCrumb = breadcrumb.querySelector('[aria-current="page"]')
    expect(currentCrumb).toHaveTextContent("Legacy project")
    expect(screen.getByRole("heading", { level: 2, name: "Next project" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Older project" })).toHaveAttribute("href", "/projects/entry/older-project")
    expect(screen.getByRole("link", { name: "Back to the archive" })).toHaveAttribute("href", "/projects")
  })
})
