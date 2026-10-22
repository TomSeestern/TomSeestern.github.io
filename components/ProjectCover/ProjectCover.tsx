import { twMerge } from "tailwind-merge"

export type ProjectCoverVariant = "payments" | "vision" | "marketplace" | "refund" | "archive"

const variantLabels: Record<ProjectCoverVariant, string> = {
  payments: "Payment rails",
  vision: "Embedded vision",
  marketplace: "Marketplace",
  refund: "Public service",
  archive: "Case file",
}

function coverVariant(slug: string): ProjectCoverVariant {
  if (/paymenow|payment/.test(slug)) return "payments"
  if (/drone|change-detection/.test(slug)) return "vision"
  if (/skinshark|skin-trading/.test(slug)) return "marketplace"
  if (/refund|train-ticket/.test(slug)) return "refund"
  return "archive"
}

function PaymentRailsArt() {
  return (
    <>
      <rect x="36" y="58" width="164" height="104" rx="2" className="fill-panel stroke-ink" strokeWidth="3" />
      <rect x="36" y="78" width="164" height="17" className="fill-crimson" />
      <rect x="49" y="119" width="58" height="8" className="fill-ink" />
      <rect x="49" y="134" width="34" height="6" className="fill-ink-muted" />
      <circle cx="286" cy="84" r="31" className="fill-gold stroke-ink" strokeWidth="3" />
      <path d="M271 84h30M286 69v30" className="stroke-ink" strokeWidth="3" />
      <path d="M223 164h133v42H223z" className="fill-canvas stroke-ink" strokeWidth="3" />
      <path d="M238 179h48M238 191h72" className="stroke-crimson" strokeWidth="4" />
      <path d="M212 112h-18m18 0-8-8m8 8-8 8" className="stroke-gold" strokeWidth="4" />
      <path d="M164 112h28" className="stroke-gold" strokeWidth="4" strokeDasharray="5 6" />
    </>
  )
}

function EmbeddedVisionArt() {
  return (
    <>
      <path
        d="M20 48h360M20 96h360M20 144h360M20 192h360M92 26v190M188 26v190M284 26v190"
        className="stroke-night-muted/20"
        strokeWidth="1"
      />
      <rect x="44" y="155" width="62" height="40" className="fill-rule-strong" />
      <rect x="106" y="127" width="44" height="68" className="fill-rule-strong/80" />
      <rect x="238" y="136" width="74" height="59" className="fill-rule-strong/60" />
      <rect x="312" y="160" width="46" height="35" className="fill-gold/50" />
      <rect x="184" y="72" width="86" height="56" className="stroke-gold" strokeWidth="2" strokeDasharray="5 6" />
      <path d="M184 100h86M227 72v56" className="stroke-gold/60" strokeWidth="1" />
      <path d="M189 44h58v12h-58z" className="fill-canvas stroke-ink" strokeWidth="2" />
      <path d="M179 56h78M199 44l-20 12 20 12M237 44l20 12-20 12" className="stroke-crimson" strokeWidth="3" />
      <path d="M166 166h118" className="stroke-crimson" strokeWidth="4" strokeDasharray="3 8" />
    </>
  )
}

function MarketplaceArt() {
  return (
    <>
      <path d="M250 54l72 58-31 70-72-40z" className="fill-gold/20" />
      <path d="M318 82l40 26-24 54-42-32z" className="fill-crimson/70" />
      <rect x="62" y="54" width="128" height="128" className="fill-canvas stroke-ink" strokeWidth="3" />
      <rect x="62" y="54" width="128" height="30" className="fill-rule-strong" />
      <rect x="76" y="92" width="28" height="24" className="fill-ink" />
      <rect x="148" y="92" width="28" height="24" className="fill-ink" />
      <rect x="76" y="124" width="28" height="42" className="fill-crimson" />
      <rect x="148" y="124" width="28" height="42" className="fill-crimson" />
      <rect x="111" y="124" width="30" height="54" className="fill-gold" />
      <path d="M64 198h126M64 206h86" className="stroke-ink" strokeWidth="3" />
      <path d="M244 168h90v34h-90z" className="fill-canvas stroke-ink" strokeWidth="2" />
      <path d="M254 185h36M302 178v16" className="stroke-crimson" strokeWidth="3" />
    </>
  )
}

function RefundArt() {
  return (
    <>
      <rect x="54" y="64" width="206" height="112" rx="2" className="fill-canvas stroke-ink" strokeWidth="3" />
      <path d="M54 96h206M88 64v112" className="stroke-ink" strokeWidth="2" strokeDasharray="4 6" />
      <path d="M104 82h70M104 114h118M104 130h84M104 146h56" className="stroke-ink" strokeWidth="4" />
      <circle cx="292" cy="108" r="35" className="fill-gold stroke-ink" strokeWidth="3" />
      <path d="M279 108h26M292 95v26" className="stroke-ink" strokeWidth="3" />
      <path d="M254 156c22 34 72 34 94 0" className="stroke-crimson" strokeWidth="5" />
      <path d="M348 156l-7-1 2 7" className="fill-crimson" />
      <path d="M278 66h50v18h-50z" className="fill-crimson" />
      <path d="M288 75h30" className="stroke-canvas" strokeWidth="2" />
    </>
  )
}

function ArchiveArt() {
  return (
    <>
      <path d="M92 178V84c0-46 36-58 108-58s108 12 108 58v94" className="stroke-rule" strokeWidth="5" />
      <path d="M122 178V92c0-31 26-40 78-40s78 9 78 40v86" className="stroke-rule" strokeWidth="2" />
      <path d="M166 178v-64h68v64M200 114v64" className="stroke-gold" strokeWidth="4" />
      <path d="M70 178h260" className="stroke-canvas" strokeWidth="3" />
      <path d="M144 196h112" className="stroke-crimson" strokeWidth="4" />
    </>
  )
}

const artByVariant = {
  payments: PaymentRailsArt,
  vision: EmbeddedVisionArt,
  marketplace: MarketplaceArt,
  refund: RefundArt,
  archive: ArchiveArt,
} satisfies Record<ProjectCoverVariant, () => JSX.Element>

export interface ProjectCoverProps {
  slug: string
  index?: number
  className?: string
}

/**
 * Project-specific case-file cover. These are hand-built vector diagrams, not
 * random emblems: the payment card, drone scan, skin marketplace, and refund
 * ticket each show the shape of the work. One accent colour, everything else
 * monochrome, so four covers can sit together without becoming a colour wall.
 */
export function ProjectCover({ slug, index = 0, className }: ProjectCoverProps) {
  const variant = coverVariant(slug)
  const Art = artByVariant[variant]
  const figure = String(index + 1).padStart(2, "0")

  return (
    <div
      data-testid="project-cover"
      data-variant={variant}
      className={twMerge("relative aspect-[16/10] w-full overflow-hidden bg-night text-night-ink", className)}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 400 240"
        className="size-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <Art />
      </svg>
      <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-30" />
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.14em] text-night-ink/80">
        {variantLabels[variant]} / Fig. {figure}
      </span>
    </div>
  )
}

export default ProjectCover
