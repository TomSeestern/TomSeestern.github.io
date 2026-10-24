import type { Metadata } from "next"
import { Section } from "@/components/Section/Section"
import { readLegalFacts } from "@/lib/legal-facts"

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

export default function Datenschutz() {
  // Throws LegalFactsError during static generation if a fact is missing.
  const facts = readLegalFacts()

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
            <p className="mt-4 text-body text-ink-muted">Verantwortlicher im Sinne der DSGVO ist:</p>
            <dl className="mt-6 space-y-4 text-body text-ink-muted">
              <div>
                <dt className="font-medium text-ink">Name</dt>
                <dd className="mt-1">{facts.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Anschrift</dt>
                <dd className="mt-1">
                  {facts.street}
                  <br />
                  {facts.postalCode} {facts.city}
                  <br />
                  {facts.country}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Kontakt</dt>
                <dd className="mt-1 space-y-1">
                  <p>E-Mail: {facts.email}</p>
                  {facts.phone ? <p>Telefon: {facts.phone}</p> : null}
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
              Eine Verarbeitung kann auch in den USA stattfinden. Angaben zur Auftragsverarbeitung und zu den Garantien
              für Drittlandübermittlungen ergeben sich aus der aktuellen Datenschutzerklärung von Vercel und dem dort
              veröffentlichten Data Processing Addendum (vercel.com/legal/privacy-policy, vercel.com/legal/dpa).
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
              personenbezogener Daten in den USA stattfinden. Angaben zur Auftragsverarbeitung und zu den Garantien für
              Drittlandübermittlungen ergeben sich aus der aktuellen Datenschutzerklärung von Resend und dem dort
              veröffentlichten Data Processing Addendum (resend.com/legal/privacy-policy, resend.com/legal/dpa).
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
            <p className="mt-4 text-body text-ink-muted">Speicherdauer: {facts.retentionPeriod}</p>
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
