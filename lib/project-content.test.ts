import fs from "fs"
import path from "path"
import { getAllProjects } from "./projects"

const PROJECT_DIRECTORY = path.join(process.cwd(), "content/projects")

function readProjectSource(projectId: string): string {
  return fs.readFileSync(path.join(PROJECT_DIRECTORY, `${projectId}.md`), "utf8")
}

describe("real project case files", () => {
  const projects = getAllProjects()

  it("keeps the published inventory complete and substantive", () => {
    // Given / When / Then
    expect(projects.length).toBeGreaterThanOrEqual(25)
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0)
      expect(project.articleContent.trim().length).toBeGreaterThan(60)
      expect(project.role.trim().length).toBeGreaterThan(0)
      expect(project.outcome.trim().length).toBeGreaterThan(0)
      expect(project.tags.length).toBeGreaterThan(0)
      expect(project.technologies.length).toBeGreaterThan(0)
    }
  })

  it("contains no published placeholder content", () => {
    // Given / When / Then
    for (const project of projects) {
      const source = readProjectSource(project.id)
      expect(source).not.toMatch(/#todo|to be inserted|to be included|lorem ipsum/i)
    }
  })

  it("publishes exactly the four intended featured case files with evidence", () => {
    // Given / When
    const featured = projects.filter((project) => project.featured)

    // Then
    expect(featured.map((project) => project.id).sort()).toEqual(
      [
        "2021-ai-drone-based-change-detection",
        "2024-layzr-creator-avatar-platform-acquired-by-jodel",
        "2026-hammer-robotics-mark-humanoid",
        "2021-paymenow-leveraging-tech-to-secure-payments-for-ebay-sellers",
      ].sort()
    )

    for (const project of featured) {
      expect(project.role.trim().length).toBeGreaterThan(0)
      expect(project.outcome.trim().length).toBeGreaterThan(0)
      expect(project.metrics.length).toBeGreaterThan(0)
    }
  })

  it("gives the new scan-derived case files a public link", () => {
    // Given / When
    const newIds = [
      "2024-layzr-creator-avatar-platform-acquired-by-jodel",
      "2026-hammer-robotics-mark-humanoid",
      "2026-everyfont-ever-generative-typeface-engine",
      "2026-closedloop-os-agent-orchestration",
    ]

    // Then
    for (const id of newIds) {
      const project = projects.find((entry) => entry.id === id)
      expect(project).toBeDefined()
      if (!project) {
        throw new Error(`Missing expected project: ${id}`)
      }
      expect(project.links.length).toBeGreaterThan(0)
    }
  })

  it("publishes the deferred case files with a real visual and evidence", () => {
    // Given / When
    const deferredIds = [
      "2026-fullsound-browser-engine-sound",
      "2026-audioforge-printable-audiobook-covers",
      "2026-foerderhebel-ai-grant-database",
    ]

    // Then
    for (const id of deferredIds) {
      const project = projects.find((entry) => entry.id === id)
      expect(project).toBeDefined()
      if (!project) {
        throw new Error(`Missing expected project: ${id}`)
      }
      expect(project.heroImage.trim().length).toBeGreaterThan(0)
      expect(project.metrics.length).toBeGreaterThan(0)
      expect(project.role.trim().length).toBeGreaterThan(0)
      expect(project.outcome.trim().length).toBeGreaterThan(0)
    }
  })
})
