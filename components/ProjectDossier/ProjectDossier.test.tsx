import { render, screen } from "@testing-library/react"
import type { ReactElement } from "react"
import { ProjectDossier } from "./ProjectDossier"
import { TooltipProvider } from "../Providers/TooltipProvider"

function renderDossier(ui: ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>)
}

describe("ProjectDossier", () => {
  it("always renders year, stack, and subjects", () => {
    // Given / When
    renderDossier(<ProjectDossier year="2021" stack={["React", "AWS"]} subjects={["Payments", "C++"]} />)

    // Then
    const dossier = screen.getByTestId("project-dossier")
    expect(dossier).toHaveTextContent("2021")
    expect(dossier).toHaveTextContent("React")
    expect(dossier).toHaveTextContent("AWS")
    expect(screen.getByRole("link", { name: "C++" })).toHaveAttribute("href", "/tags/c-plus-plus")
  })

  it("shows optional role, outcome, and meaningful metrics", () => {
    // Given / When
    renderDossier(
      <ProjectDossier
        year="2021"
        stack={["React"]}
        subjects={["Payments"]}
        role="Lead Developer"
        outcome="Shipped to production"
        metrics={[
          { label: "Users", value: "1200" },
          { label: "", value: "ignored" },
        ]}
      />
    )

    // Then
    expect(screen.getByText("Role")).toBeInTheDocument()
    expect(screen.getByText("Lead Developer")).toBeInTheDocument()
    expect(screen.getByText("Outcome")).toBeInTheDocument()
    expect(screen.getByText("Shipped to production")).toBeInTheDocument()
    expect(screen.getByTestId("project-dossier-metrics")).toHaveTextContent("Users")
    expect(screen.queryByText("ignored")).not.toBeInTheDocument()
  })

  it("renders public evidence links and drops incomplete entries", () => {
    // Given / When
    renderDossier(
      <ProjectDossier
        year="2026"
        stack={["Python"]}
        subjects={["Robotics"]}
        links={[
          { label: "Live site", href: "https://example.com" },
          { label: " ", href: "https://ignored.example" },
        ]}
      />
    )

    // Then
    expect(screen.getByRole("link", { name: "Live site" })).toHaveAttribute("href", "https://example.com")
    expect(screen.queryByRole("link", { name: " " })).not.toBeInTheDocument()
  })

  it("omits empty optional blocks for a legacy entry", () => {
    // Given / When
    renderDossier(<ProjectDossier year="2010" stack={[]} subjects={[]} />)

    // Then
    expect(screen.queryByText("Role")).not.toBeInTheDocument()
    expect(screen.queryByText("Outcome")).not.toBeInTheDocument()
    expect(screen.queryByTestId("project-dossier-metrics")).not.toBeInTheDocument()
    expect(screen.getAllByText("Not listed")).toHaveLength(2)
  })
})
