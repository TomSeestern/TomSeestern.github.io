import React from "react"
import { Meta, Story } from "@storybook/react"
import ProjectTeaser, { ProjectProps } from "./ProjectTeaser"

export default {
  title: "Components/ProjectTeaser",
  component: ProjectTeaser,
  argTypes: {
    imageUrl: { control: "text", description: "The URL of the project image" },
    title: { control: "text", description: "The title of the project" },
    description: { control: "text", description: "The description of the project" },
    technologies: { control: "array", description: "An array of Technology names" },
    ctaLink: { control: "text", description: "The URL for the CTA" },
  },
  decorators: [
    (Story) => (
      <div className={"bg-slate-100"} style={{ width: "500px", padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} as Meta

const Template: Story<ProjectProps> = (args) => <ProjectTeaser {...args} />

export const Default = Template.bind({})
Default.args = {
  imageUrl: "https://placehold.co/800x400.png",
  title: "Title of the project",
  description: "This is a summary of the project.",
  technologies: [
    "React",
    // Add more technologies as needed
  ],
  ctaLink: "/link/to/all-projects",
  projectDate: new Date("2024-01-01"),
}
