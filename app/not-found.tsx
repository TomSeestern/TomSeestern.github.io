import { Button } from "@/components/Button/Button"
import { PixelColumn } from "@/components/PixelArt/PixelColumn"
import { Section } from "@/components/Section/Section"

export default function NotFound() {
  return (
    <Section
      tone="night"
      className="min-h-[70vh]"
      innerClassName="flex min-h-[70vh] items-center justify-center py-14 sm:py-20"
    >
      <div
        data-testid="not-found"
        className="grid w-full max-w-4xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">The archive ends here</p>
          <h1 className="mt-4 text-display-xl text-night-ink">404</h1>
          <h2 className="mt-3 text-display-md text-night-ink">Page not found</h2>
          <p className="mt-5 max-w-measure-lead font-body text-body-lg text-night-muted">
            The page you asked for is not in the archive. The index is still open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" variant="primary">
              Home
            </Button>
            <Button href="/projects" variant="secondary-night">
              Projects
            </Button>
            <Button href="/blog" variant="secondary-night">
              Blog
            </Button>
          </div>
        </div>

        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-rule bg-panel p-8">
          <PixelColumn className="h-48 w-24 text-ink/[0.16]" />
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">No such case file</p>
        </div>
      </div>
    </Section>
  )
}
