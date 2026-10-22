import type { Meta, StoryObj } from "@storybook/nextjs"
import type { MarkdownEntry } from "@/lib/markdown"
import { ArticleCard } from "./ArticleCard"

const entry: MarkdownEntry = {
  id: "2019-ebeltoft-cheesecake-recipe",
  title: "Memorable Ebeltoft Cheesecake",
  articleDate: new Date("2019-08-21T00:00:00Z"),
  articleContent: "A simple recipe from a sailing trip, and the two-day fridge wait that makes it work.",
  authorImgSrc: "/img/logo.png",
  authorName: "Tom Segbers",
  fullArticleLink: "/blog/entry/2019-ebeltoft-cheesecake-recipe",
  technologies: [],
  tags: ["Recipes", "Cheesecake"],
  featured: false,
  role: "",
  outcome: "",
  heroImage: "",
  metrics: [],
}

const meta: Meta<typeof ArticleCard> = {
  title: "Cards/ArticleCard",
  component: ArticleCard,
  args: {
    entry,
    index: 0,
  },
}

type Story = StoryObj<typeof ArticleCard>

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md bg-canvas p-8">
      <ArticleCard {...args} />
    </div>
  ),
}

export default meta
