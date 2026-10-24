import type { Metadata } from "next"
import { Section } from "@/components/Section/Section"

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zur Verarbeitung personenbezogener Daten auf TomSegbers.de gemäß Art. 13 DSGVO.",
  alternates: {
    canonical: "https://tomsegbers.de/datenschutz",
  },
  openGraph: {
    url: "https://tomsegbers.de/datenschutz",
    siteName: "TomSegbers.de",
    title: "Datenschutzerklärung | TomSegbers.de",
    description: "Informationen zur Verarbeitung personenbezogener Daten auf TomSegbers.de gemäß Art. 13 DSGVO.",
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
  return <span className="font-mono text-crimson">TODO(Tom): {label}</span>
}

export default function Datenschutz() {
  return (
    <Section tone="canvas" lang="de" className="antialiased" innerClassName="max-w-screen-md py-8 sm:py-16 lg:py-24">
      <div className="hyphens-auto break-words font-prose">
        <header className="mx-auto max-w-measure-lead text-center">
          <h1 className="hyphens-auto break-words text-h2-sm text-ink sm:text-h1">Datenschutzerklärung</h1>
          <p className="mt-4 text-body-lg font-light text-ink-muted">
            Informationen zur Verarbeitung personenbezogener Daten nach Art. 13 DSGVO.
          </p>
        </header>

        <div className="mt-12 space-y-10">
          <section aria-labelledby="datenschutz-verantwortlicher">
            <h2 id="datenschutz-verantwortlicher" className="text-h2-sm text-ink sm:text-h2">
              Verantwortlicher
            </h2>
            <p className="mt-4 text-body text-ink-muted">
              Verantwortlicher im Sinne der DSGVO ist die im Impressum genannte Person. Die dort noch offenen Angaben
              sind zu befüllen:
            </p>
            <dl className="mt-6 space-y-4 text-body text-ink-muted">
              <div>
                <dt className="font-medium text-ink">Name</dt>
                <dd className="mt-1">
                  <Placeholder label="Name des Verantwortlichen" />
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Anschrift</dt>
                <dd className="mt-1">
                  <Placeholder label="Anschrift des Verantwortlichen" />
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Kontakt</dt>
                <dd className="mt-1 space-y-1">
                  <p>
                    E-Mail: <Placeholder label="E-Mail-Adresse des Verantwortlichen" />
                  </p>
                  <p>
                    Telefon: <Placeholder label="Telefonnummer des Verantwortlichen" />
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Datenschutzbeauftragte/r (falls benannt)</dt>
                <dd className="mt-1">
                  <Placeholder label="Datenschutzbeauftragte/r (falls vorhanden)" />
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="datenschutz-hosting">
            <h2 id="datenschutz-hosting" className="text-h2-sm text-ink sm:text-h2">
              Hosting
            </h2>
            <p className="mt-4 text-body text-ink-muted">
              Diese Website wird bei Vercel gehostet. Beim Aufruf der Website verarbeitet der Hosting-Anbieter als
              Auftragsverarbeiter technisch notwendige Verbindungsdaten (z.&nbsp;B. IP-Adresse, Zeitpunkt des Zugriffs,
              angeforderte Ressource und User-Agent), um die Website auszuliefern und ihre Sicherheit und Stabilität zu
              gewährleisten. Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse an
              einem sicheren und funktionsfähigen Betrieb). Umfang und Bedingungen der Verarbeitung durch den
              Hosting-Anbieter sind in dessen eigener Datenschutzerklärung beschrieben.
            </p>
            <p className="mt-4 text-body text-ink-muted">
              Ein Auftragsverarbeitungsvertrag mit dem Hosting-Anbieter sowie Angaben zu Übermittlungen in Drittländer
              sind zu prüfen bzw. zu ergänzen:{" "}
              <Placeholder label="Auftragsverarbeitungsvertrag mit Vercel und Angaben zur Drittlandübermittlung" />
            </p>
          </section>

          <section aria-labelledby="datenschutz-kontaktformular">
            <h2 id="datenschutz-kontaktformular" className="text-h2-sm text-ink sm:text-h2">
              Kontaktformular und E-Mail-Versand
            </h2>
            <p className="mt-4 text-body text-ink-muted">
              Über das Kontaktformular können Sie eine Nachricht an den Verantwortlichen senden. Verarbeitet werden die
              von Ihnen eingegebenen Angaben:
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-6 text-body text-ink-muted">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Nachricht</li>
            </ul>
            <p className="mt-4 text-body text-ink-muted">
              Der Versand der Formularnachricht erfolgt über den E-Mail-Dienst <strong>Resend</strong> (Resend, Inc.,
              US-amerikanischer Anbieter). Die eingegebenen Daten werden dabei an Resend übermittelt und auf der
              Infrastruktur des Anbieters verarbeitet, um die E-Mail zuzustellen. Dabei kann eine Verarbeitung
              personenbezogener Daten in den USA stattfinden. Angaben zu den eingesetzten Auftragsverarbeitungsverträgen
              und Garantien für Drittlandübermittlungen sind zu ergänzen:{" "}
              <Placeholder label="Auftragsverarbeitung und Drittlandgarantien für Resend" />
            </p>
            <p className="mt-4 text-body text-ink-muted">
              Rechtsgrundlage für die Verarbeitung ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (Verarbeitung zur
              Durchführung vorvertraglicher Maßnahmen bzw. zur Erfüllung eines Vertrags) sowie Art.&nbsp;6 Abs.&nbsp;1
              lit.&nbsp;f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
            </p>
            <p className="mt-4 text-body text-ink-muted">
              Zur Abwehr von Missbrauch findet eine Ratenbegrenzung statt. Dabei wird die IP-Adresse des aufrufenden
              Geräts für 15 Minuten ausschließlich im Arbeitsspeicher des Servers verarbeitet, um maximal 5 Anfragen pro
              Zeitfenster zuzulassen. Die IP-Adresse wird nicht dauerhaft gespeichert, nicht mit der Nachricht
              zusammengeführt und nicht an Dritte weitergegeben. Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f
              DSGVO (berechtigtes Interesse an der Abwehr von Missbrauch).
            </p>
            <p className="mt-4 text-body text-ink-muted">
              Speicherdauer: <Placeholder label="Speicherdauer der Kontaktanfragen und E-Mails" />
            </p>
          </section>

          <section aria-labelledby="datenschutz-cookies">
            <h2 id="datenschutz-cookies" className="text-h2-sm text-ink sm:text-h2">
              Cookies, Analyse und Tracking
            </h2>
            <p className="mt-4 text-body text-ink-muted">
              Diese Website setzt keine Cookies zu Analyse- oder Marketingzwecken. Es findet kein Web-Analytics-Dienst
              statt, es werden keine Tracking-Pixel oder vergleichbare Technologien eingesetzt, und es werden keine
              Nutzungsprofile erstellt. Es gibt keine Einwilligungsverwaltung, weil keine einwilligungspflichtigen
              Verarbeitungen stattfinden.
            </p>
          </section>

          <section aria-labelledby="datenschutz-rechte">
            <h2 id="datenschutz-rechte" className="text-h2-sm text-ink sm:text-h2">
              Ihre Rechte als betroffene Person
            </h2>
            <p className="mt-4 text-body text-ink-muted">
              Sie haben nach der DSGVO folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-6 text-body text-ink-muted">
              <li>Recht auf Auskunft (Art.&nbsp;15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art.&nbsp;16 DSGVO)</li>
              <li>Recht auf Löschung (Art.&nbsp;17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art.&nbsp;18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art.&nbsp;20 DSGVO)</li>
              <li>Widerspruchsrecht gegen die Verarbeitung (Art.&nbsp;21 DSGVO)</li>
            </ul>
            <p className="mt-4 text-body text-ink-muted">
              Um diese Rechte auszuüben, genügt eine Kontaktaufnahme über die im Impressum bzw. oben genannten
              Kontaktdaten.
            </p>
          </section>

          <section aria-labelledby="datenschutz-beschwerde">
            <h2 id="datenschutz-beschwerde" className="text-h2-sm text-ink sm:text-h2">
              Beschwerderecht bei einer Aufsichtsbehörde
            </h2>
            <p className="mt-4 text-body text-ink-muted">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
              personenbezogenen Daten zu beschweren (Art.&nbsp;77 DSGVO). Zuständig ist in der Regel die
              Aufsichtsbehörde Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
              Verstoßes.
            </p>
          </section>
        </div>
      </div>
    </Section>
  )
}
