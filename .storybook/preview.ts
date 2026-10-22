import type { Preview } from "@storybook/nextjs"

import "../styles/tailwind.css"

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "#EFE6D2" },
        { name: "night", value: "#14110D" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
