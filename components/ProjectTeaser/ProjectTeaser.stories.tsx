import type { Meta, StoryObj } from "@storybook/nextjs"
import ProjectTeaser from "./ProjectTeaser"
import { TooltipProvider } from "../Providers/TooltipProvider"

const meta: Meta<typeof ProjectTeaser> = {
  title: "Components/ProjectTeaser",
  component: ProjectTeaser,
  argTypes: {
    imageUrl: { control: "text", description: "The URL of the project image" },
    title: { control: "text", description: "The title of the project" },
    description: { control: "text", description: "The description of the project" },
    technologies: { control: "object", description: "An array of Technology names" },
    ctaLink: { control: "text", description: "The URL for the CTA" },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className={"bg-slate-100"} style={{ width: "500px", padding: "1rem" }}>
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProjectTeaser>

export const Default: Story = {
  args: {
    imageUrl: "https://placehold.co/800x400.png",
    title: "Title of the project",
    description: "This is a summary of the project.",
    technologies: [
      "React",
      // Add more technologies as needed
    ],
    ctaLink: "/link/to/all-projects",
    projectDate: new Date("2024-01-01"),
  },
}
