import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArticleMeta } from "./ArticleMeta"

const meta: Meta<typeof ArticleMeta> = {
  title: "Cards/ArticleMeta",
  component: ArticleMeta,
  args: {
    date: new Date("2024-05-06T00:00:00Z"),
    readingTimeMinutes: 3,
    tags: ["C++", "Homelab"],
    author: "Tom Segbers",
  },
}

type Story = StoryObj<typeof ArticleMeta>

export const Default: Story = {
  render: (args) => (
    <div className="bg-canvas p-8">
      <ArticleMeta {...args} />
    </div>
  ),
}

export default meta
