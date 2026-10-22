import Link from "next/link"
import type { MarkdownEntry } from "@/lib/markdown"
import { Button } from "../Button/Button"
import { ArrowRight } from "../Icon/ArrowRight"
import { ArrowUpRight } from "../Icon/ArrowUpRight"
import { PixelColumn } from "../PixelArt/PixelColumn"
import { PixelSigil } from "../PixelSigil/PixelSigil"

export interface HomeHeroProps {
  projectCount: number
  dispatchCount: number
  leadProject?: MarkdownEntry
}

const statClasses = "font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted"

/**
 * Terminal-first home hero. The proposition is the headline; the case-file
 * window carries real archive data. A single pixel column sits behind the
 * window as a low-contrast structural watermark, not as a section costume.
 */
export function HomeHero({ projectCount, dispatchCount, leadProject }: HomeHeroProps) {
  return (
    <section data-testid="home-hero" aria-labelledby="home-title" className="relative overflow-hidden bg-canvas">
      <div aria-hidden="true" className="hero-glow absolute inset-0 hidden md:block" />
      <div aria-hidden="true" className="bg-grid absolute inset-0 hidden opacity-30 md:block" />

      <div className="relative mx-auto w-full max-w-width-page px-4 py-12 sm:px-6 sm:pt-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-center lg:gap-16">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-rule-strong bg-panel/70 px-3 py-1.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-verdigris" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Senior developer / Systems &amp; interfaces
              </span>
            </div>

            <h1 id="home-title" className="mt-6 max-w-[11ch] text-display-xl">
              Systems that hold.
            </h1>

            <p className="mt-6 max-w-measure-lead font-body text-body-lg text-ink-muted">
              I&apos;m Tom Segbers. I build payment infrastructure, embedded vision, and product systems whose
              interfaces explain themselves.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href="#selected-work" variant="primary">
                View selected work
                <ArrowRight className="size-4" />
              </Button>
              <Button href="/contact" variant="secondary">
                Start a conversation
              </Button>
            </div>
          </div>

          <div className="relative min-w-0">
            <div aria-hidden="true" className="absolute -inset-10 -z-10 hidden bg-crimson/10 blur-3xl lg:block" />
            <div className="relative z-10 overflow-hidden rounded-xl border border-rule bg-panel shadow-none lg:shadow-glow">
              <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
                <div aria-hidden="true" className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rule-strong" />
                  <span className="size-2 rounded-full bg-rule-strong" />
                  <span className="size-2 rounded-full bg-rule-strong" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  portfolio / 2026
                </span>
                <PixelSigil slug="tom-segbers" size="sm" className="size-4" />
              </div>

              <div className="p-5 font-mono text-[12px] leading-6 text-ink-muted sm:p-6">
                <p>
                  <span className="text-crimson">$</span> whoami
                </p>
                <p className="text-ink">Tom Segbers / Senior developer</p>

                <p className="mt-3">
                  <span className="text-crimson">$</span> cat focus.json
                </p>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-ink">{`{
  "focus": ["systems", "interfaces"],
  "archive": "2010—2021",
  "caseFiles": ${projectCount}
}`}</pre>

                {leadProject ? (
                  <div className="mt-5 border-t border-rule pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                      Selected case file
                    </p>
                    <Link
                      href={leadProject.fullArticleLink}
                      className="focus-ring mt-2 inline-flex max-w-full items-start gap-2 font-body text-sm font-medium leading-5 text-ink decoration-crimson decoration-2 underline-offset-4 hover:text-crimson hover:underline"
                    >
                      <span className="line-clamp-2">{leadProject.title}</span>
                      <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" />
                    </Link>
                    <p className="mt-2 line-clamp-2 font-body text-xs leading-5 text-ink-muted">
                      {leadProject.articleContent}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Status bar: the archive's real counts live on the artefact they
                  describe, like a TUI footer. `grid-flow-col` with two rows keeps
                  each dt/dd pair in one column without wrapper divs. */}
              <dl
                data-testid="home-archive-status"
                className="grid grid-flow-col grid-rows-2 border-t border-rule bg-canvas-deep/60 [&>*:nth-child(n+3)]:border-l [&>*:nth-child(n+3)]:border-rule"
              >
                <dt className={`${statClasses} px-4 pt-3 sm:px-5`}>Case files</dt>
                <dd className="px-4 pb-3 font-mono text-sm leading-none text-ink sm:px-5">
                  {String(projectCount).padStart(2, "0")}
                </dd>
                <dt className={`${statClasses} px-4 pt-3 sm:px-5`}>Dispatches</dt>
                <dd className="px-4 pb-3 font-mono text-sm leading-none text-ink sm:px-5">
                  {String(dispatchCount).padStart(2, "0")}
                </dd>
                <dt className={`${statClasses} px-4 pt-3 sm:px-5`}>Archive</dt>
                <dd className="px-4 pb-3 font-mono text-sm leading-none text-ink sm:px-5">2010—2021</dd>
              </dl>
            </div>

            <PixelColumn className="pointer-events-none absolute -bottom-10 -right-8 z-0 hidden h-44 w-24 text-ink/[0.08] sm:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
