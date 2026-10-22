import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  args: {
    variant: "primary",
    size: "md",
    children: "Button",
    href: "#",
  },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "ghost", "pixel"],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
  },
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: (args) => <Button {...args} />,
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 bg-canvas p-8">
      <Button href="#" variant="primary">
        Primary
      </Button>
      <Button href="#" variant="secondary">
        Secondary
      </Button>
      <Button href="#" variant="ghost">
        Ghost
      </Button>
      <Button href="#" variant="pixel">
        Pixel
      </Button>
    </div>
  ),
}

export default meta
