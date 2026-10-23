import type { Metadata } from "next"
import Image from "next/image"
import { Button } from "@/components/Button/Button"
import { ArrowRight } from "@/components/Icon/ArrowRight"
import { PageHero } from "@/components/PageHero/PageHero"
import PersonTeaser from "@/components/PersonTeaser/PersonTeaser"
import { Section } from "@/components/Section/Section"
import { SectionHeading } from "@/components/SectionHeading/SectionHeading"
import Testimonials from "@/components/Testimonials/Testimonials"
import TimelineEntry from "@/components/TimelineEntry/TimelineEntry"
import { formatYear } from "@/lib/format-date"
import { getAllProjects } from "@/lib/projects"
import { getTopTechnologies } from "@/lib/technologies"

export const metadata: Metadata = {
  title: "About me",
  description:
    "A short overview of Tom Segbers' formal education and work experience — from freelance IT developer to Founder & Tech Lead at LAYZR.gg.",
  openGraph: {
    url: "https://tomsegbers.de/about",
    siteName: "TomSegbers.de",
    title: "About me | TomSegbers.de",
    description:
      "Formal education and work experience of Tom Segbers — freelance developer, B.Sc. Applied Computer Science, Founder & Tech Lead.",
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

export default function About() {
  const projects = getAllProjects()
  const technologies = getTopTechnologies(projects, 8)
  const years = projects.map((project) => formatYear(project.articleDate)).sort()
  const firstYear = years[0] ?? "—"
  const lastYear = years[years.length - 1] ?? "—"
  const archiveSpan = firstYear === lastYear ? firstYear : `${firstYear}—${lastYear}`

  return (
    <>
      <PageHero
        titleId="about-title"
        eyebrow="Profile"
        title="About me"
        lead="Freelance developer, computer science graduate, and founder. The short version of a longer archive."
        size="compact"
        actions={
          <>
            <Button href="/projects" variant="primary">
              See the case files
            </Button>
            <Button href="/contact" variant="secondary">
              Start a conversation
            </Button>
          </>
        }
      />

      <Section tone="canvas" className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <figure className="lg:col-span-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-rule bg-canvas-deep">
              {/* Source is a ~26 KB pre-grayscaled WebP; serving it directly avoids a runtime filter on the LCP image. */}
              <Image
                src="/img/Tom_Segbers_Frontal_mono.webp"
                alt="Portrait of Tom Segbers"
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 480px, calc(100vw - 2rem)"
                className="object-cover object-[50%_36%]"
              />
              <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-40" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-night/90 px-4 py-3">
                <p className="font-display text-base font-semibold leading-none text-night-ink">Tom Segbers</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Portrait / 2026</p>
              </div>
            </div>
            <figcaption className="mt-3 flex items-center justify-between border-t border-rule pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
              <span>Systems &amp; interfaces</span>
              <span>01 / 01</span>
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-col justify-between gap-10 lg:col-span-8">
            <div>
              <p className="max-w-[22ch] font-display text-display-md text-ink">
                The archive runs from LEGO Mindstorms to payment rails.
              </p>
              <p className="mt-6 max-w-measure-lead font-body text-body-lg text-ink-muted">
                I started with LabVIEW and a robot that refused to follow a line, studied applied computer science,
                freelanced across web and desktop software, and founded a startup that connected streaming with
                blockchain. The work keeps returning to the same question: make the system legible, then make it hold.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="/projects"
                  className="focus-ring inline-flex min-h-11 items-center gap-2 font-body text-sm font-medium text-crimson hover:text-ink"
                >
                  Read the case files
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="/blog"
                  className="focus-ring inline-flex min-h-11 items-center gap-2 font-body text-sm font-medium text-ink-muted hover:text-ink"
                >
                  Read the journal
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            <dl className="grid grid-cols-2 border-t border-rule">
              <div className="border-b border-rule py-4 sm:border-r sm:pr-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Practice</dt>
                <dd className="mt-2 font-body text-xl font-medium leading-tight tracking-[-0.02em] text-ink">
                  Systems &amp; interfaces
                </dd>
              </div>
              <div className="border-b border-rule py-4 sm:pl-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Case files</dt>
                <dd className="mt-2 font-mono text-xl leading-none text-ink">{projects.length}</dd>
              </div>
              <div className="border-b border-rule py-4 sm:border-r sm:pr-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Education</dt>
                <dd className="mt-2 font-body text-xl font-medium leading-tight tracking-[-0.02em] text-ink">
                  B.Sc. Computer Science
                </dd>
              </div>
              <div className="border-b border-rule py-4 sm:pl-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">Archive span</dt>
                <dd className="mt-2 font-mono text-xl leading-none text-ink">{archiveSpan}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="canvas-deep" labelledBy="formal-positions-title" className="py-12 sm:py-16 lg:py-20">
        <SectionHeading
          id="formal-positions-title"
          eyebrow="I / Experience"
          title="Formal positions"
          lead="Education and work, in reverse chronological order."
        />
        <div id="timeline" data-testid="about-timeline" className="mt-8">
          <TimelineEntry
            time="2021 - 2024"
            title="Founder & Tech Lead @ LAYZR.gg"
            description="Founding a startup that connected streaming with blockchain."
            link="https://layzr.gg"
          >
            <PersonTeaser
              companyName="LAYZR.gg"
              companyLogoSrc="/img/layzrgg_logo.png"
              companyDescription="LAYZR.gg is a platform for fans to collect digital collectibles and build thier digital identity."
              companyLink="https://layzr.gg"
            />
          </TimelineEntry>
          <TimelineEntry
            time="2020-2021"
            title="HATtec: Bachelor and Working Student"
            description="Focusing on developing real-time AI solutions for my Bachelor Thesis."
            link="https://hattec.de"
          >
            <PersonTeaser
              companyName="HATtec GmbH"
              companyLogoSrc="/img/hattec_logo.jpg"
              companyDescription="Software Company developing autonomous Drone Software"
              companyLink="https://hattec.de"
            />
          </TimelineEntry>
          <TimelineEntry
            time="2018-2021"
            title="(B.SC.) Applied Computer Science"
            description="Completed my Bachelor of Applied Computer Science at the Ravensburg-Weingarten University of Applied Science."
            link="https://rwu.de"
          >
            <div className="space-y-2 border border-rule-strong bg-panel p-4">
              <p className="font-body text-body text-ink-muted">- Specialization in robotics and AI.</p>
              <p className="font-body text-body text-ink-muted">
                - Additional subjects in the areas of Deep Learning and Project Management.
              </p>
            </div>
          </TimelineEntry>
          <TimelineEntry
            time="2015-2020"
            title="Freelancer IT Developer & Consultant"
            description="Working as a Freelancer for various companies, see Projects for more details."
            link="/projects"
          >
            <PersonTeaser
              companyName="Various Companies"
              companyLogoSrc="/img/placeholder-company.svg"
              companyDescription="See Projects for more details"
              companyLink="/projects"
            />
            <a
              href="/projects"
              className="focus-ring inline-flex w-fit items-center gap-2 font-body text-sm font-medium text-crimson hover:text-ink"
            >
              See projects
              <ArrowRight className="size-4" />
            </a>
          </TimelineEntry>
        </div>
      </Section>

      <Section tone="panel" labelledBy="tools-title" className="py-12 sm:py-16 lg:py-20">
        <SectionHeading
          id="tools-title"
          eyebrow="II / Stack"
          title="Tools of the trade"
          lead="The technologies that recur most often across the project archive."
        />
        <div data-testid="about-tools" className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map((technology) => (
            <div key={technology.name} className="flex items-baseline justify-between gap-4 border-t border-rule py-3">
              <span className="min-w-0 break-words font-body text-body text-ink">{technology.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-crimson">
                {String(technology.count).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="canvas" className="py-12 sm:py-16 lg:py-20">
        <Testimonials />
      </Section>

      <Section tone="night" labelledBy="about-closing-title" className="py-12 sm:py-16 lg:py-20">
        <SectionHeading
          id="about-closing-title"
          eyebrow="III / Next"
          title="Let's build something that lasts."
          lead="If you have a system that needs to be clearer, faster, or more dependable, I would like to hear about it."
          tone="night"
          action={
            <>
              <Button href="/contact" variant="primary">
                Start a conversation
              </Button>
              <Button href="/projects" variant="secondary-night">
                View the work
              </Button>
            </>
          }
        />
      </Section>
    </>
  )
}
