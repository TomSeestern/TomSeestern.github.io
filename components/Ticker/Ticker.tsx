import { twMerge } from "tailwind-merge"

export type TickerTone = "night" | "crimson" | "canvas"

const toneClasses: Record<TickerTone, string> = {
  night: "border-ink bg-night text-night-ink",
  crimson: "border-ink bg-crimson text-canvas",
  canvas: "border-ink bg-canvas text-ink",
}

export interface TickerProps {
  items: readonly string[]
  tone?: TickerTone
  className?: string
}

function TickerTrack({ items, duplicate }: { items: readonly string[]; duplicate?: boolean }) {
  return (
    <div
      data-testid={duplicate ? "ticker-duplicate" : "ticker-track"}
      aria-hidden={duplicate ? "true" : undefined}
      className="flex shrink-0 items-center gap-6 pr-6 font-pixel text-label uppercase tracking-[0.12em]"
    >
      {items.map((item) => (
        <span key={item} className="flex items-center gap-6 whitespace-nowrap">
          {item}
          <span aria-hidden="true" className="text-gold-ink">
            ◆
          </span>
        </span>
      ))}
    </div>
  )
}

/**
 * CSS-only marquee. The second track is a visual duplicate and is hidden from
 * assistive technology; the first track remains readable when motion is
 * reduced or when the CSS animation is paused on hover/focus.
 */
export function Ticker({ items, tone = "night", className }: TickerProps) {
  if (items.length === 0) return null

  return (
    <div data-testid="ticker" className={twMerge("overflow-hidden border-y py-2.5", toneClasses[tone], className)}>
      <div className="ticker">
        <TickerTrack items={items} />
        <TickerTrack items={items} duplicate />
      </div>
    </div>
  )
}
