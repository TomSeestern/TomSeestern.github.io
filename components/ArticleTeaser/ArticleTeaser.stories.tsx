import type { Meta, StoryObj } from "@storybook/nextjs"
import ArticleComponent from "./ArticleTeaser"

const meta: Meta<typeof ArticleComponent> = {
  title: "Components/Article",
  component: ArticleComponent,
  argTypes: {
    title: {
      control: {
        type: "text",
      },
      description: "Title of the article",
    },
    articleDate: {
      control: {
        type: "date",
      },
      description: "Date when the article was published",
    },
    articleContent: {
      control: {
        type: "text",
      },
      description: "The teaser text for the article",
    },
    authorImgSrc: {
      control: {
        type: "text",
      },
      description: "Source URL of the author's image",
    },
    authorName: {
      control: {
        type: "text",
      },
      description: "Name of the author",
    },
    fullArticleLink: {
      control: {
        type: "text",
      },
      description: "URL to the full article",
    },
    tags: {
      control: {
        type: "object",
      },
      description: "Content tags; the first renders as the card category chip",
    },
  },
  decorators: [
    (Story) => (
      <div className={"bg-slate-300"} style={{ width: "500px", padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ArticleComponent>

export const Default: Story = {
  args: {
    title: "Title of the article",
    articleDate: new Date(),
    articleContent: "This is a summary of the article content.",
    authorImgSrc: "https://placehold.co/400x400.png",
    authorName: "Author Name",
    fullArticleLink: "/link/to/article",
    tags: ["Tutorial"],
  },
}

export const WithLongTitle: Story = {
  args: {
    ...Default.args,
    title: "This is an excessively long title that should potentially break the layout",
  },
}

export const WithLongContent: Story = {
  args: {
    ...Default.args,
    title: "Long Content Title",
    articleContent: "This is a very long article content. ".repeat(100),
  },
}

export const WithShortContent: Story = {
  args: {
    ...Default.args,
    title: "Short Content Title",
    articleContent: "Short content",
  },
}
