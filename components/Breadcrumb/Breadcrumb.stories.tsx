import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb"

const meta: Meta<typeof Breadcrumb> = {
  title: "Primitives/Breadcrumb",
  component: Breadcrumb,
}

type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  render: () => (
    <div className="bg-canvas p-8">
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
        <BreadcrumbItem>Case file</BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
}

export default meta
