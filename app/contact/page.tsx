import type { Metadata } from "next"
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

export default function Contact() {
  return <ContactForm />
}
