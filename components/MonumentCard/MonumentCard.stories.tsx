import type { Meta, StoryObj } from "@storybook/nextjs"
import type { MarkdownEntry } from "@/lib/markdown"
import { MonumentCard } from "./MonumentCard"

const project: MarkdownEntry = {
  id: "paymenow",
  title: "PayMeNow: Payment Status Application for eBay Sellers",
  articleDate: new Date("2021-12-31T00:00:00Z"),
  articleContent:
    "A React and AWS application that makes payment status and outstanding seller actions clear and traceable.",
  authorImgSrc: "/img/logo.png",
  authorName: "Tom Segbers",
  fullArticleLink: "/projects/entry/paymenow",
  technologies: ["React", "BootstrapCSS", "AWS-Amplify", "Lambda"],
  tags: ["eBay", "Payments"],
  featured: true,
  role: "",
  outcome: "",
  heroImage: "",
  metrics: [],
}

const meta: Meta<typeof MonumentCard> = {
  title: "Cards/MonumentCard",
  component: MonumentCard,
  args: {
    project,
    index: 0,
  },
}

type Story = StoryObj<typeof MonumentCard>

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md bg-canvas p-8">
      <MonumentCard {...args} />
    </div>
  ),
}

export default meta
