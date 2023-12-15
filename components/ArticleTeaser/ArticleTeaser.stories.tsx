import React from "react"
import { Meta, Story } from "@storybook/react"
import ArticleComponent, { ArticleProps } from "./ArticleTeaser"

export default {
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
  },
  decorators: [
    (Story) => (
      <div className={"bg-slate-300"} style={{ width: "500px", padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} as Meta

const Template: Story<ArticleProps> = (args) => <ArticleComponent {...args} />

export const Default = Template.bind({})
Default.args = {
  title: "Title of the article",
  articleDate: new Date(),
  articleContent: "This is a summary of the article content.",
  authorImgSrc: "https://placehold.co/400x400.png",
  authorName: "Author Name",
  fullArticleLink: "/link/to/article",
}

export const WithLongTitle = Template.bind({})
WithLongTitle.args = {
  ...Default.args,
  title: "This is an excessively long title that should potentially break the layout",
}

export const WithLongContent = Template.bind({})
WithLongContent.args = {
  ...Default.args,
  title: "Long Content Title",
  articleContent: "This is a very long article content. ".repeat(100),
}

export const WithShortContent = Template.bind({})
WithShortContent.args = {
  ...Default.args,
  title: "Short Content Title",
  articleContent: "Short content",
}
