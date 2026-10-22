import type { Metadata } from "next"
import { GitHub } from "@/components/Icon/GitHub"
import { LinkedIn } from "@/components/Icon/LinkedIn"
import { Mail } from "@/components/Icon/Mail"
import { Twitter } from "@/components/Icon/Twitter"
import { PageHero } from "@/components/PageHero/PageHero"
import { Section } from "@/components/Section/Section"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tom Segbers — collaboration ideas, project proposals, or just to say hello.",
  alternates: {
    canonical: "https://tom.segbers.de/contact",
  },
  openGraph: {
    url: "https://tom.segbers.de/contact",
    siteName: "TomSegbers.de",
    title: "Contact | TomSegbers.de",
    description: "Get in touch with Tom Segbers — collaboration ideas, project proposals, or just to say hello.",
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

const socialLinks = [
  { href: "https://linkedin.com/in/tomsegbers/", label: "LinkedIn", Icon: LinkedIn },
  { href: "https://twitter.com/TomSegbers", label: "Twitter", Icon: Twitter },
  { href: "https://www.github.com/TomSegbers/", label: "GitHub", Icon: GitHub },
  { href: "mailto:website@tomsegbers.de", label: "Email", Icon: Mail },
] as const

export default function Contact() {
  return (
    <>
      <PageHero
        titleId="contact-title"
        eyebrow="Correspondence"
        title="Get in touch"
        lead="Whether you have a collaboration idea, a project proposal, or just want to say hello, I'd love to hear from you. Drop me a message, and I'll get back to you soon."
        size="compact"
      />

      <Section tone="canvas" className="py-10 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-16">
          <ContactForm />

          <aside
            data-testid="contact-side-panel"
            className="rounded-lg border border-rule bg-panel p-6 text-ink lg:sticky lg:top-24"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Direct</p>
            <p className="mt-3 text-balance font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink">
              One inbox, no forms lost in a queue.
            </p>
            <p className="mt-3 font-body text-sm text-ink-muted">
              A short note about the problem, the constraints, and the outcome you need is enough to start.
            </p>

            <h2 className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Elsewhere</h2>
            <ul className="mt-3 space-y-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="focus-ring inline-flex min-h-11 w-full items-center gap-3 rounded-md border border-rule-strong bg-canvas px-3 py-2 font-body text-sm text-ink transition-colors duration-150 hover:border-ink hover:bg-canvas-deep"
                  >
                    <Icon className="size-4 text-crimson" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-rule pt-4 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-ink-muted">
              No cookies. No tracking.
            </p>
          </aside>
        </div>
      </Section>
    </>
  )
}
