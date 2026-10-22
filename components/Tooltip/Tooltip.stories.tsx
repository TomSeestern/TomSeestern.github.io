import type { Meta, StoryObj } from "@storybook/nextjs"
import { TooltipProvider } from "../Providers/TooltipProvider"
import { Tooltip } from "./Tooltip"

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-48 items-center justify-center bg-canvas p-8">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

type Story = StoryObj<typeof Tooltip>

export const Open: Story = {
  args: {
    explainer: "TypeScript",
    open: true,
    withArrow: true,
    children: (
      <button type="button" className="focus-ring border-2 border-ink bg-panel px-4 py-2 font-pixel text-label">
        TypeScript
      </button>
    ),
  },
}

export default meta
