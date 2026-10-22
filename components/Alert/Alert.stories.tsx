import type { Meta, StoryObj } from "@storybook/nextjs"
import { Alert } from "./Alert"

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  args: {
    children: "Message saved.",
    variant: "success",
  },
  argTypes: {
    variant: {
      options: ["success", "failure"],
      control: { type: "select" },
    },
  },
}

type Story = StoryObj<typeof Alert>

export const Success: Story = {
  render: (args) => (
    <div className="max-w-xl bg-canvas p-8">
      <Alert {...args} />
    </div>
  ),
}

export const FailureWithDismiss: Story = {
  render: () => (
    <div className="max-w-xl bg-canvas p-8">
      <Alert variant="failure" onDismiss={() => undefined}>
        The message could not be sent. Please try again.
      </Alert>
    </div>
  ),
}

export default meta
