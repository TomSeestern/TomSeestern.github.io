import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG für TomSegbers.de.",
  alternates: {
    canonical: "https://tom.segbers.de/impressum",
  },
  openGraph: {
    url: "https://tom.segbers.de/impressum",
    siteName: "TomSegbers.de",
    title: "Impressum | TomSegbers.de",
    description: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG für TomSegbers.de.",
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

/** Renders an unfilled legal fact as a visible, greppable placeholder. */
function Placeholder({ label }: { label: string }) {
  return <span className="font-mono text-accent dark:text-accent-dark">TODO(Tom): {label}</span>
}

export default function Impressum() {
  return (
    <section className="bg-surface antialiased dark:bg-surface-dark">
      <div className="mx-auto max-w-screen-md px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <header className="mx-auto max-w-measure-lead text-center">
          <h1 className="text-h1-sm text-foreground dark:text-foreground-dark sm:text-h1">Impressum</h1>
          <p className="mt-4 text-body-lg font-light text-muted dark:text-muted-dark">
            Anbieterkennzeichnung und Angaben zum Verantwortlichen für diese Website.
          </p>
        </header>

        <div className="mt-12 space-y-10">
          <section aria-labelledby="impressum-angaben">
            <h2 id="impressum-angaben" className="text-h2-sm text-foreground dark:text-foreground-dark sm:text-h2">
              Angaben gemäß § 5 DDG
            </h2>
            <dl className="mt-6 space-y-4 text-body text-muted dark:text-muted-dark">
              <div>
                <dt className="font-medium text-foreground dark:text-foreground-dark">Name</dt>
                <dd className="mt-1">
                  <Placeholder label="Name der natürlichen oder juristischen Person" />
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground dark:text-foreground-dark">Anschrift</dt>
                <dd className="mt-1">
                  <Placeholder label="Anschrift (Straße, Hausnummer, PLZ, Ort, Land)" />
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground dark:text-foreground-dark">Kontakt</dt>
                <dd className="mt-1 space-y-1">
                  <p>
                    E-Mail: <Placeholder label="E-Mail-Adresse" />
                  </p>
                  <p>
                    Telefon: <Placeholder label="Telefonnummer" />
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground dark:text-foreground-dark">Vertretungsberechtigte/r</dt>
                <dd className="mt-1">
                  <Placeholder label="Vertretungsberechtigte/r (falls zutreffend)" />
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground dark:text-foreground-dark">
                  Umsatzsteuer-Identifikationsnummer (falls vorhanden)
                </dt>
                <dd className="mt-1">
                  <Placeholder label="USt-IdNr. gemäß § 27 a UStG (falls vorhanden)" />
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="impressum-mstv">
            <h2 id="impressum-mstv" className="text-h2-sm text-foreground dark:text-foreground-dark sm:text-h2">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <dl className="mt-6 space-y-4 text-body text-muted dark:text-muted-dark">
              <div>
                <dt className="font-medium text-foreground dark:text-foreground-dark">Name</dt>
                <dd className="mt-1">
                  <Placeholder label="Name der inhaltlich verantwortlichen Person" />
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground dark:text-foreground-dark">Anschrift</dt>
                <dd className="mt-1">
                  <Placeholder label="Anschrift der inhaltlich verantwortlichen Person" />
                </dd>
              </div>
            </dl>
          </section>

          <p className="text-small text-muted dark:text-muted-dark">
            Die mit <span className="font-mono text-accent dark:text-accent-dark">TODO(Tom): …</span> markierten Angaben
            sind noch nicht befüllt und müssen vor Veröffentlichung durch die verantwortliche Person ersetzt werden.
          </p>
        </div>
      </div>
    </section>
  )
}
