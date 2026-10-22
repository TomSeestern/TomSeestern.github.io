import { render, screen } from "@testing-library/react"
import { coverKeyForSlug, projectCoverLabels } from "./art"
import { ProjectCover } from "./ProjectCover"

const projectCases = [
  ["2010-Journey-Into-Coding-with-LabVIEW-and-LEGO-Mindstorms", "labview", "LabVIEW / Maze"],
  ["2011-first-competition-with-wenzelbots-team", "wenzelbots-2011", "Robotics / Competition"],
  ["2012-elevating-robot-competition-performance", "wenzelbots-2012", "Robotics / Control"],
  ["2012-journey-into-cpp-desktop-application-development", "cpp-qt", "C++ / Desktop"],
  ["2013-journey-into-sqf-development", "sqf", "Arma 3 / Missions"],
  ["2014-altis-life-roleplay-gamemode", "altis", "Altis Life / Economy"],
  ["2015-arma-3-freelance-development-journey", "arma-freelance", "Arma 3 / Servers"],
  ["2016-from-c-plusplus-to-time-tracking-app-journey", "time-tracker", "Qt / Time tracking"],
  ["2017-insights-assembly-language-and-microcontroller-projects", "assembly", "Assembly / Hardware"],
  ["2018-data-analytics-municipal-administration", "azure-warehouse", "Azure / Data warehouse"],
  ["2019-ezb-nowcasting-inflation-project", "ecb-classifier", "ECB / Classification"],
  ["2019-hackathon-zeppelin-systems-classification", "zeppelin", "Sensors / Bulk goods"],
  ["2019-navigating-unknown-terrain-with-botboost", "botboost", "ROS / Navigation"],
  ["2019-process-automation-in-proptech", "proptech", "PropTech / Data flow"],
  ["2020-digitizing-train-ticket-refunds-2020", "refund", "Public service / Refunds"],
  ["2020-multimodal-travel-planning-app-development", "soudest-android", "Android / Routing"],
  ["2020-soudest-backend-nodejs", "soudest-backend", "Node.js / API"],
  ["2020-soudest-multimodal-travel-planner-frontend", "soudest-frontend", "React / Comparison"],
  ["2021-ai-drone-based-change-detection", "vision", "Embedded vision / Change"],
  ["2021-paymenow-leveraging-tech-to-secure-payments-for-ebay-sellers", "payments", "Payment rails / Status"],
  ["2021-skinshark-nft-minecraft-skin-trading", "marketplace", "Marketplace / Ownership"],
  ["2024-layzr-creator-avatar-platform-acquired-by-jodel", "creator", "Creator economy / Avatars"],
  ["2026-audioforge-printable-audiobook-covers", "audioforge", "3D print / Audiobooks"],
  ["2026-closedloop-os-agent-orchestration", "agents", "Agent orchestration / SOPs"],
  ["2026-everyfont-ever-generative-typeface-engine", "type", "Type engine / Babel"],
  ["2026-foerderhebel-ai-grant-database", "foerderhebel", "Grants / Discovery"],
  ["2026-fullsound-browser-engine-sound", "fullsound", "Audio / Engine simulation"],
  ["2026-hammer-robotics-mark-humanoid", "robotics", "Humanoid robotics / Mark I"],
] as const

describe("ProjectCover", () => {
  it.each(projectCases)("maps %s to the %s cover", (slug, variant, label) => {
    // Given / When
    const { container } = render(<ProjectCover slug={slug} index={0} />)

    // Then
    const cover = screen.getByTestId("project-cover")
    expect(cover).toHaveAttribute("data-variant", variant)
    expect(screen.getByText(`${label} / Fig. 01`)).toBeInTheDocument()
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("gives every project a distinct cover key", () => {
    // Given / When
    const keys = projectCases.map(([, key]) => key)

    // Then
    expect(projectCases).toHaveLength(28)
    expect(new Set(keys).size).toBe(projectCases.length)
    expect(keys).not.toContain("archive")
  })

  it("falls back to the archive plate for an unknown project", () => {
    // Given / When
    render(<ProjectCover slug="an-unknown-project" />)

    // Then
    expect(screen.getByTestId("project-cover")).toHaveAttribute("data-variant", "archive")
    expect(screen.getByText(`${projectCoverLabels.archive} / Fig. 01`)).toBeInTheDocument()
    expect(coverKeyForSlug("an-unknown-project")).toBe("archive")
  })
})
