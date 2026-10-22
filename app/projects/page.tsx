import type { Metadata } from "next"
import { ArchiveRow } from "@/components/ArchiveRow/ArchiveRow"
import { Button } from "@/components/Button/Button"
import { ArrowRight } from "@/components/Icon/ArrowRight"
import { MonumentCard } from "@/components/MonumentCard/MonumentCard"
import { PageHero } from "@/components/PageHero/PageHero"
import { PixelSigil } from "@/components/PixelSigil/PixelSigil"
import { Section } from "@/components/Section/Section"
import { SectionHeading } from "@/components/SectionHeading/SectionHeading"
import { TagChip } from "@/components/TagChip/TagChip"
import { formatYear } from "@/lib/format-date"
import { getAllProjects } from "@/lib/projects"
import { getAllProjectTags } from "@/lib/tags"

export const metadata: Metadata = {
  title: "The work",
  description:
    "Case files and experiments from Tom Segbers: payment infrastructure, embedded vision, creator platforms, humanoid robotics, automation, and more.",
  openGraph: {
    url: "https://tomsegbers.de/projects",
    siteName: "TomSegbers.de",
    title: "The work | TomSegbers.de",
    description: "Selected case files and the complete project archive.",
    images: [
      {
        url: "/img/og-default.png",
        width: 1200,
        height: 630,
        alt: "TomSegbers.de — Tom Segbers, Senior Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/og-default.png"],
  },
}

interface YearGroup {
  readonly year: string
  readonly projects: ReturnType<typeof getAllProjects>
}

export default function ProjectsArchive() {
  const projects = getAllProjects()
  const subjectTags = getAllProjectTags()
  const tags = subjectTags.slice(0, 12)
  const featured = projects.filter((project) => project.featured)
  const archiveProjects = projects.filter((project) => !project.featured)
  const years = projects.map((project) => formatYear(project.articleDate)).sort()
  const firstYear = years[0] ?? "—"
  const lastYear = years[years.length - 1] ?? "—"
  const span = firstYear === lastYear ? firstYear : `${firstYear}—${lastYear}`
  const selectedLead =
    featured.length === 1 ? "One selected project leads" : `${featured.length} selected projects lead`

  const groups: YearGroup[] = []
  for (const project of archiveProjects) {
    const year = formatYear(project.articleDate)
    const current = groups[groups.length - 1]
    if (current?.year === year) {
      groups[groups.length - 1] = { year, projects: [...current.projects, project] }
    } else {
      groups.push({ year, projects: [project] })
    }
  }

  return (
    <>
      <PageHero
        titleId="projects-title"
        eyebrow="Archive"
        title="The work"
        lead={`Case files and experiments from ${firstYear} to ${lastYear}. ${selectedLead}; the complete ledger follows by year.`}
        size="compact"
        actions={
          <>
            <Button href="#selected-work" variant="primary">
              Selected work
            </Button>
            <Button href="#archive" variant="secondary">
              Jump to the archive
            </Button>
          </>
        }
        aside={
          <div className="rounded-lg border border-rule bg-panel p-4">
            <div className="flex items-start justify-between gap-4">
              <PixelSigil slug="the-work" size="sm" className="size-8" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Index</span>
            </div>
            <dl className="mt-5 space-y-3 border-t border-rule pt-3 font-body text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Case files</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{projects.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Span</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{span}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Subjects</dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{subjectTags.length}</dd>
              </div>
            </dl>
          </div>
        }
      />

      {tags.length > 0 ? (
        <Section tone="panel" labelledBy="browse-subject-title" className="py-4 sm:py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-8">
            <div className="shrink-0">
              <h2 id="browse-subject-title" className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">
                Browse by subject
              </h2>
              <p className="mt-1 font-body text-small text-ink-muted">The index</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <TagChip label={`${tag.label} (${tag.count})`} href={`/tags/${tag.slug}`} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <Section
        id="selected-work"
        tone="canvas"
        labelledBy="selected-title"
        className="scroll-mt-20 py-10 sm:py-12 lg:py-16"
      >
        <SectionHeading
          id="selected-title"
          eyebrow="I / Case files"
          title="Selected case files"
          lead="Four case files that show the range: payment infrastructure, embedded vision, a creator-platform exit, and humanoid robotics."
          action={
            <Button href="#archive" variant="ghost" size="sm">
              Skip to archive <ArrowRight className="size-4" />
            </Button>
          }
        />
        <div data-testid="featured-projects-grid" className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-7">
          {featured.map((project) => (
            <MonumentCard key={project.id} project={project} index={projects.indexOf(project)} />
          ))}
        </div>
      </Section>

      <Section tone="canvas-deep" labelledBy="archive-title" className="py-10 sm:py-12 lg:py-16">
        <div id="archive" className="scroll-mt-20">
          <SectionHeading
            id="archive-title"
            eyebrow="II / Ledger"
            title="The archive"
            lead={`${archiveProjects.length} earlier entries, grouped by year. Selected case files stay above; the ledger below is chronological.`}
            action={
              <Button href="/blog" variant="ghost" size="sm">
                Read the journal <ArrowRight className="size-4" />
              </Button>
            }
          />

          <div data-testid="projects-grid" className="mt-8 space-y-12">
            {groups.length === 0 ? (
              <p className="border border-rule-strong bg-panel p-6 font-body text-body text-ink-muted">
                No projects have been published yet.
              </p>
            ) : (
              groups.map((group) => (
                <div key={group.year} data-testid={`project-year-${group.year}`}>
                  <p className="mb-3 border-b border-rule pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">
                    {group.year}
                  </p>
                  <div>
                    {group.projects.map((project) => (
                      <ArchiveRow key={project.id} project={project} index={projects.indexOf(project)} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      <Section tone="night" labelledBy="projects-closing-title" className="py-10 sm:py-12 lg:py-16">
        <SectionHeading
          id="projects-closing-title"
          eyebrow="III / Next"
          title="Have a project in mind?"
          lead="Tell me what is fragile, slow, or unclear. I will tell you how I would approach it."
          tone="night"
          action={
            <>
              <Button href="/contact" variant="primary">
                Start a conversation
              </Button>
              <Button href="/about" variant="secondary-night">
                About the practice
              </Button>
            </>
          }
        />
      </Section>
    </>
  )
}
