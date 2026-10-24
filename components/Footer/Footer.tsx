import Image from "next/image"
import Link from "next/link"
import { GitHub } from "../Icon/GitHub"
import { LinkedIn } from "../Icon/LinkedIn"
import { Mail } from "../Icon/Mail"
import { Twitter } from "../Icon/Twitter"
import { PixelColumn } from "../PixelArt/PixelColumn"

const socialLinks = [
  { href: "https://linkedin.com/in/tomsegbers/", label: "LinkedIn", Icon: LinkedIn },
  { href: "https://twitter.com/TomSegbers", label: "Twitter", Icon: Twitter },
  { href: "https://www.github.com/TomSegbers/", label: "GitHub", Icon: GitHub },
  { href: "/contact", label: "Email", Icon: Mail },
] as const

const navigationLinks = [
  ["/", "Home"],
  ["/about", "About"],
  ["/projects", "Projects"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
] as const

const indexLinks = [
  ["/tags", "Tags"],
  ["/impressum", "Impressum"],
  ["/datenschutz", "Datenschutz"],
] as const

const footerLinkClasses =
  "focus-ring-inverse inline-flex min-h-9 items-center font-body text-small text-night-muted transition-colors duration-150 hover:text-ink"

/**
 * Terminal footer: brand, navigation, index, and the unchanged social
 * destinations. It is a plain content region, not a second navigation
 * landmark, so the header remains the only named nav in the page skeleton.
 */
export function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative mt-auto overflow-hidden border-t border-rule bg-night text-night-ink"
    >
      <PixelColumn className="pointer-events-none absolute -right-4 top-10 hidden h-44 w-24 text-ink/[0.045] lg:block" />
      <div className="mx-auto grid w-full max-w-width-page gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10 lg:py-16">
        <div>
          <Link href="/" className="focus-ring-inverse flex items-center gap-2.5">
            <Image src="/icon/brand-mark.svg" alt="" width={32} height={32} unoptimized className="size-8 shrink-0" />
            <span className="font-display text-[15px] font-semibold leading-none tracking-[-0.03em] text-night-ink">
              tomsegbers
            </span>
            {/* WCAG 2.5.3 — see the matching note in Header.tsx. */}
            <span className="sr-only">— Tom Segbers, home</span>
          </Link>
          <p className="mt-4 max-w-measure-card font-body text-small text-night-muted">
            Senior developer building reliable systems and clear interfaces.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-crimson">
            No cookies. No tracking.
          </p>
        </div>

        <div>
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">Navigate</h2>
          <ul className="mt-4 space-y-1">
            {navigationLinks.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={footerLinkClasses}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">Index</h2>
          <ul className="mt-4 space-y-1">
            {indexLinks.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={footerLinkClasses}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">Elsewhere</h2>
          <ul className="mt-4 space-y-1">
            {socialLinks.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className={footerLinkClasses}
                >
                  <Icon className="mr-2 size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-night-soft">
        <div className="mx-auto flex w-full max-w-width-page flex-col gap-2 px-4 py-6 font-body text-small text-night-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>
            © 2019-2026{" "}
            <a
              href="https://tomsegbers.de/"
              className="focus-ring-inverse underline decoration-rule-strong decoration-2 underline-offset-4 hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              TomSegbers.de
            </a>
            . All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            Built with care. No cookies, no tracking.
          </p>
        </div>
      </div>
    </footer>
  )
}
