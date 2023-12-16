import React from "react"
import { Meta, Story } from "@storybook/react"
import ProjectTeaser, { ProjectProps } from "./ProjectTeaser"

export default {
  title: "Components/ProjectTeaser",
  component: ProjectTeaser,
  argTypes: {
    imageUrl: { control: "text", description: "The URL of the project image" },
    title: { control: "text", description: "The title of the project" },
    previewLink: { control: "text", description: "The URL for the live preview of the project" },
    description: { control: "text", description: "The description of the project" },
    technologies: { control: "object", description: "An array of Technology objects" },
    caseStudyLink: { control: "text", description: "The URL for the case study of the project" },
    ctaText: { control: "text", description: "The text for the CTA" },
    ctaLink: { control: "text", description: "The URL for the CTA" },
    buttonText: { control: "text", description: "The text for the button" },
    buttonLink: { control: "text", description: "The URL for the button" },
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
    {
      iconLink: "https://placehold.co/400x400.png",
      name: "Technology Name",
    },
    // Add more technologies as needed
  ],
  ctaText: "View all projects",
  ctaLink: "/link/to/all-projects",
  buttonText: "View case study",
  buttonLink: "/link/to/case-study",
}
