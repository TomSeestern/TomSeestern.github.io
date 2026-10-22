import { twMerge } from "tailwind-merge"
import { normalizeTagKey, tagSlug } from "@/lib/tags"
import { TagChip } from "../TagChip/TagChip"
import { TooltipProvider } from "../Providers/TooltipProvider"
import { TechnologyTooltip } from "../TechnologyTooltip/TechnologyTooltip"

export interface ProjectDossierMetric {
  readonly label: string
  readonly value: string
}

export interface ProjectDossierProps {
  year: string
  stack: readonly string[]
  subjects: readonly string[]
  role?: string
  outcome?: string
  metrics?: readonly ProjectDossierMetric[]
  className?: string
}

function nonEmpty(value: string | undefined): string {
  return value?.trim() ?? ""
}

function meaningfulMetrics(metrics: readonly ProjectDossierMetric[]): readonly ProjectDossierMetric[] {
  return metrics.filter((metric) => metric.label.trim().length > 0 && metric.value.trim().length > 0)
}

/**
 * Sticky case-file facts. Year, stack, and subjects are always present; role,
 * outcome, and metrics appear only when the frontmatter actually carries them,
 * so legacy entries do not get empty evidence containers.
 */
export function ProjectDossier({ year, stack, subjects, role, outcome, metrics = [], className }: ProjectDossierProps) {
  const roleText = nonEmpty(role)
  const outcomeText = nonEmpty(outcome)
  const measuredProof = meaningfulMetrics(metrics)

  return (
    <aside
      data-testid="project-dossier"
      aria-label="Project dossier"
      className={twMerge("sticky top-24 rounded-lg border border-rule bg-panel p-6 text-ink lg:top-28", className)}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Case file</p>
      <h2 className="mt-3 text-h3 text-ink">Dossier</h2>

      <dl className="mt-6 space-y-5 font-body text-sm">
        <div className="border-t border-rule pt-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Year</dt>
          <dd className="mt-1 text-sm text-ink">{year}</dd>
        </div>

        <div className="border-t border-rule pt-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Stack</dt>
          <dd className="mt-2">
            {stack.length > 0 ? (
              <TooltipProvider>
                <ul className="flex flex-wrap gap-2">
                  {stack.map((technology) => (
                    <li key={technology}>
                      <TechnologyTooltip name={technology} />
                    </li>
                  ))}
                </ul>
              </TooltipProvider>
            ) : (
              <span className="text-ink-muted">Not listed</span>
            )}
          </dd>
        </div>

        <div className="border-t border-rule pt-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Subjects</dt>
          <dd className="mt-2">
            {subjects.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <li key={subject}>
                    <TagChip label={subject} variant="link" href={`/tags/${tagSlug(normalizeTagKey(subject))}`} />
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-ink-muted">Not listed</span>
            )}
          </dd>
        </div>

        {roleText ? (
          <div className="border-t border-rule pt-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Role</dt>
            <dd className="mt-1 text-sm text-ink">{roleText}</dd>
          </div>
        ) : null}

        {outcomeText ? (
          <div className="border-t border-rule pt-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Outcome</dt>
            <dd className="mt-1 text-sm text-ink">{outcomeText}</dd>
          </div>
        ) : null}
      </dl>

      {measuredProof.length > 0 ? (
        <div data-testid="project-dossier-metrics" className="mt-6 border-t border-rule pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-crimson">Evidence</p>
          <dl className="mt-3 grid grid-cols-2 gap-4">
            {measuredProof.map((metric) => (
              <div key={`${metric.label}-${metric.value}`}>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{metric.label}</dt>
                <dd className="mt-1 text-h3-sm text-ink">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </aside>
  )
}

export default ProjectDossier
