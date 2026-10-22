import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProjectDossier } from "./ProjectDossier"
import { TooltipProvider } from "../Providers/TooltipProvider"

const meta: Meta<typeof ProjectDossier> = {
  title: "Cards/ProjectDossier",
  component: ProjectDossier,
  args: {
    year: "2021",
    stack: ["React", "BootstrapCSS", "AWS"],
    subjects: ["eBay", "Payments"],
    role: "Full-stack developer",
    outcome: "Seller payment state made traceable.",
    metrics: [{ label: "Project", value: "MVP" }],
  },
}

type Story = StoryObj<typeof ProjectDossier>

export const Default: Story = {
  render: (args) => (
    <TooltipProvider>
      <div className="bg-canvas p-8">
        <ProjectDossier {...args} />
      </div>
    </TooltipProvider>
  ),
}

export default meta
