import type { Meta, StoryObj } from "@storybook/nextjs"
import type { MarkdownEntry } from "@/lib/markdown"
import { ArchiveRow } from "./ArchiveRow"

const project: MarkdownEntry = {
  id: "iseeunet",
  title: "ISeeUNet: Real-Time Drone Change Detection",
  articleDate: new Date("2021-03-30T00:00:00Z"),
  articleContent: "A modified U-Net for real-time change detection on drone footage in scrubland environments.",
  authorImgSrc: "/img/logo.png",
  authorName: "Tom Segbers",
  fullArticleLink: "/projects/entry/iseeunet",
  technologies: ["Python", "Keras", "TensorFlow", "Unity"],
  tags: ["AI"],
  featured: true,
  role: "",
  outcome: "",
  heroImage: "",
  metrics: [],
  links: [],
}

const meta: Meta<typeof ArchiveRow> = {
  title: "Cards/ArchiveRow",
  component: ArchiveRow,
  args: {
    project,
    index: 0,
  },
}

type Story = StoryObj<typeof ArchiveRow>

export const Default: Story = {
  render: (args) => (
    <div className="bg-canvas p-8">
      <ArchiveRow {...args} />
    </div>
  ),
}

export default meta
