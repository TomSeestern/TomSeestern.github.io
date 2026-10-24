import type { Metadata } from "next"
import { ArticleCard } from "@/components/ArticleCard/ArticleCard"
import { Button } from "@/components/Button/Button"
import { CapabilityIndex } from "@/components/CapabilityIndex/CapabilityIndex"
import { HomeHero } from "@/components/HomeHero/HomeHero"
import { ArrowRight } from "@/components/Icon/ArrowRight"
import { MonumentCard } from "@/components/MonumentCard/MonumentCard"
import { Section } from "@/components/Section/Section"
import { SectionHeading } from "@/components/SectionHeading/SectionHeading"
import { getAllBlogPosts } from "@/lib/blog"
import { formatYear } from "@/lib/format-date"
import { getAllProjects, selectFeaturedProjects } from "@/lib/projects"
import { getTopTechnologies } from "@/lib/technologies"

export const metadata: Metadata = {
  title: {
    absolute: "TomSegbers.de — Senior Developer",
  },
  description:
    "Personal portfolio of Tom Segbers — Senior Developer. Building reliable systems and solving hard problems. Explore projects, blog posts, and get in touch.",
  alternates: {
    canonical: "https://tomsegbers.de",
  },
  openGraph: {
    url: "https://tomsegbers.de/",
    siteName: "TomSegbers.de",
    title: "TomSegbers.de — Senior Developer",
    description:
      "Personal portfolio of Tom Segbers — Senior Developer. Building reliable systems and solving hard problems.",
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

export default function HomePage() {
  const projects = getAllProjects()
  const articles = getAllBlogPosts()
  const featuredProjects = selectFeaturedProjects(projects)
  const leadProject =
    featuredProjects.find((project) => project.recentHighlight) ??
    featuredProjects.find((project) => /payment|paymenow/.test(project.id)) ??
    featuredProjects[0]
  const technologies = getTopTechnologies(projects, 8)
  const latestArticles = articles.slice(0, 3)
  const [leadArticle, ...secondaryArticles] = latestArticles
  const years = projects.map((project) => formatYear(project.articleDate)).sort()
  const firstYear = years[0] ?? "—"
  const lastYear = years[years.length - 1] ?? "—"
  const archiveSpan = firstYear === lastYear ? firstYear : `${firstYear}—${lastYear}`

  return (
    <>
      <HomeHero
        projectCount={projects.length}
        dispatchCount={articles.length}
        archiveSpan={archiveSpan}
        leadProject={leadProject}
      />

      <Section
        id="selected-work"
        tone="canvas"
        labelledBy="selected-work-title"
        className="scroll-mt-20 py-14 sm:py-16 lg:py-24"
      >
        <SectionHeading
          id="selected-work-title"
          eyebrow="I / Case files"
          title="Selected work"
          lead="Four case files that show the range: humanoid robotics, a creator-platform exit, embedded vision, and agent orchestration."
          action={
            <Button href="/projects" variant="secondary" size="sm">
              All case files <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div data-testid="home-featured-grid" className="mt-9 grid gap-5 md:grid-cols-2 lg:gap-6">
          {featuredProjects.map((project, index) => (
            <MonumentCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Section>

      <Section tone="canvas-deep" labelledBy="practice-title" className="py-14 sm:py-16 lg:py-24">
        <SectionHeading
          id="practice-title"
          eyebrow="II / Capabilities"
          title="The practice"
          lead="I work across the layers that make a product trustworthy: data, interfaces, deployment, and the quiet decisions in between."
          action={
            <Button href="/about" variant="ghost" size="sm">
              About the practice <ArrowRight className="size-4" />
            </Button>
          }
        />
        <CapabilityIndex technologies={technologies} />
      </Section>

      <Section tone="canvas" labelledBy="dispatches-title" className="py-14 sm:py-16 lg:py-24">
        <SectionHeading
          id="dispatches-title"
          eyebrow="III / Dispatches"
          title="Latest dispatches"
          lead="Notes from the workbench: homelabs, automation, and the occasional recipe."
          action={
            <Button href="/blog" variant="secondary" size="sm">
              All dispatches <ArrowRight className="size-4" />
            </Button>
          }
        />
        <div data-testid="home-dispatches" className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {leadArticle ? (
            <ArticleCard entry={leadArticle} index={0} variant="feature" className="lg:row-span-2" />
          ) : null}
          {secondaryArticles.map((article, index) => (
            <ArticleCard key={article.id} entry={article} index={index + 1} />
          ))}
        </div>
      </Section>

      <Section tone="night" labelledBy="closing-title" className="py-14 sm:py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <SectionHeading
            id="closing-title"
            eyebrow="IV / Next"
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
          <p className="hidden border-t border-rule pt-4 font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-ink-muted lg:block">
            Bring the problem.
            <br />
            No pitch deck required.
          </p>
        </div>
      </Section>
    </>
  )
}
