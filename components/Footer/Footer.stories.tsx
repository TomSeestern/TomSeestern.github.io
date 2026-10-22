import type { Meta, StoryObj } from "@storybook/nextjs"
import { Footer } from "./Footer"

const meta: Meta<typeof Footer> = {
  title: "Chrome/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "night" },
  },
}

type Story = StoryObj<typeof Footer>

export const NightBand: Story = {
  render: () => <Footer />,
}

export default meta
