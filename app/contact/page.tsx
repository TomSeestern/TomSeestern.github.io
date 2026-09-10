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
        url: "/img/logo.png",
        width: 512,
        height: 512,
        alt: "TomSegbers.de logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/logo.png"],
  },
}

export default function Contact() {
  return <ContactForm />
}
