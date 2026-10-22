import type { Meta, StoryObj } from "@storybook/nextjs"
import Card from "./Card"

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  args: {
    children: <p className="font-body text-body">A card body with a short, honest description.</p>,
  },
}

type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm bg-canvas p-8">
      <Card {...args} />
    </div>
  ),
}

export const WithArchHeader: Story = {
  render: () => (
    <div className="max-w-sm bg-canvas p-8">
      <Card archHeader={<span className="font-pixel text-label uppercase tracking-[0.12em]">Case 01</span>}>
        <p className="font-body text-body">A project card with an arch header and stepped shadow.</p>
      </Card>
    </div>
  ),
}

export default meta
