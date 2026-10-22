import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRight } from "../Icon"
import { ArchFrame, Laurel, Meander, PixelDust } from "../Ornament"
import { SectionHeading } from "../SectionHeading/SectionHeading"
import { TagChip } from "../TagChip/TagChip"
import { Ticker } from "../Ticker/Ticker"
import { Button } from "../Button/Button"

const swatches = [
  ["canvas", "bg-canvas"],
  ["canvas-deep", "bg-canvas-deep"],
  ["panel", "bg-panel"],
  ["ink", "bg-ink"],
  ["ink-muted", "bg-ink-muted"],
  ["night", "bg-night"],
  ["night-soft", "bg-night-soft"],
  ["night-ink", "bg-night-ink"],
  ["night-muted", "bg-night-muted"],
  ["crimson", "bg-crimson"],
  ["crimson-hover", "bg-crimson-hover"],
  ["gold", "bg-gold"],
  ["gold-ink", "bg-gold-ink"],
  ["verdigris", "bg-verdigris"],
  ["rule", "bg-rule"],
  ["rule-strong", "bg-rule-strong"],
  ["danger", "bg-danger"],
  ["danger-surface", "bg-danger-surface"],
] as const

const meta: Meta = {
  title: "Design System/COLOSSUS",
  parameters: {
    layout: "fullscreen",
  },
}

type Story = StoryObj

export const DesignSystem: Story = {
  render: () => (
    <div data-testid="design-system" className="min-h-screen bg-canvas px-4 py-10 text-ink sm:px-8">
      <header className="mx-auto max-w-width-page border-b-2 border-ink pb-8">
        <p className="font-pixel text-label uppercase tracking-[0.14em] text-crimson">Foundation / 01</p>
        <h1 className="mt-3 text-display-lg">Colossus</h1>
        <p className="mt-4 max-w-measure-lead text-body-lg text-ink-muted">
          A Roman forum rebuilt as an 8-bit arcade. The palette, type, frames, and controls below are the shipping
          grammar.
        </p>
      </header>

      <main className="mx-auto max-w-width-page space-y-16 py-12">
        <section aria-labelledby="palette-title">
          <SectionHeading id="palette-title" eyebrow="Palette" title="Travertine and ink" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {swatches.map(([name, className]) => (
              <div key={name} className="border-2 border-ink bg-panel p-2">
                <div className={`h-16 border-2 border-ink ${className}`} />
                <p className="mt-2 break-words font-pixel text-[0.625rem] uppercase tracking-[0.08em]">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="type-title">
          <SectionHeading id="type-title" eyebrow="Type" title="Inscription and pixels" />
          <div className="mt-8 space-y-5 border-2 border-ink bg-panel p-6">
            <p className="font-display text-display-lg">Ave, builder</p>
            <p className="font-pixel text-label uppercase tracking-[0.14em] text-crimson">Case File / 2026</p>
            <p className="max-w-measure-article font-prose text-body-lg">
              Long-form prose uses the system serif stack at a 68-character measure. It is for reading, not for display.
            </p>
            <p className="font-body text-body text-ink-muted">Interface copy uses the system sans stack.</p>
          </div>
        </section>

        <section aria-labelledby="controls-title">
          <SectionHeading id="controls-title" eyebrow="Controls" title="Buttons and labels" />
          <div className="mt-8 flex flex-wrap items-center gap-3 border-2 border-ink bg-panel p-6">
            <Button href="#" variant="primary">
              Primary <ArrowRight className="size-4" />
            </Button>
            <Button href="#" variant="secondary">
              Secondary
            </Button>
            <Button href="#" variant="ghost">
              Ghost
            </Button>
            <Button href="#" variant="pixel" size="sm">
              Pixel
            </Button>
            <Button href="#" variant="primary" size="lg">
              Large
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <TagChip label="TypeScript" variant="solid" />
            <TagChip label="Next.js" />
            <TagChip label="React" variant="link" href="/tags/react" />
          </div>
        </section>

        <section aria-labelledby="frames-title">
          <SectionHeading id="frames-title" eyebrow="Frames" title="Stone and signal" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <ArchFrame className="flex min-h-48 flex-col justify-end p-6">
              <Laurel className="mb-4 size-14 text-crimson" />
              <p className="font-pixel text-label uppercase tracking-[0.12em]">Arch frame</p>
            </ArchFrame>
            <div className="border-2 border-ink bg-night p-6 text-night-ink">
              <PixelDust className="mb-4 text-gold-ink" />
              <p className="font-pixel text-label uppercase tracking-[0.12em]">Pixel dust</p>
            </div>
            <div className="border-2 border-ink bg-crimson p-6 text-canvas">
              <Meander className="mb-4 text-canvas" />
              <p className="font-pixel text-label uppercase tracking-[0.12em]">Meander</p>
            </div>
          </div>
        </section>

        <Ticker items={["Selected work", "Case files", "Dispatches", "Systems and interfaces"]} />
      </main>
    </div>
  ),
}

export default meta
