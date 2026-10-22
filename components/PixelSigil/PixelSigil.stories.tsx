import type { Meta, StoryObj } from "@storybook/nextjs"
import { PixelSigil } from "./PixelSigil"

const meta: Meta<typeof PixelSigil> = {
  title: "Primitives/PixelSigil",
  component: PixelSigil,
  args: {
    slug: "paymenow",
    size: "lg",
  },
}

type Story = StoryObj<typeof PixelSigil>

export const Default: Story = {
  render: (args) => (
    <div className="bg-canvas p-8">
      <PixelSigil {...args} />
    </div>
  ),
}

export default meta
