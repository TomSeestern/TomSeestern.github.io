import { Metadata } from "next"
import Image from "next/image"
import React from "react"
import PersonTeaser from "../../components/PersonTeaser/PersonTeaser"
import TimelineEntry from "../../components/TimelineEntry/TimelineEntry"

export const metadata: Metadata = {
  title: "About me",
  description:
    "A short overview of Tom Segbers' formal education and work experience — from freelance IT developer to Founder & Tech Lead at LAYZR.gg.",
  openGraph: {
    url: "https://tom.segbers.de/about",
    siteName: "TomSegbers.de",
    title: "About me | TomSegbers.de",
    description:
      "Formal education and work experience of Tom Segbers — freelance developer, B.Sc. Applied Computer Science, Founder & Tech Lead.",
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

export default function About() {
  return (
    <section className="bg-surface antialiased dark:bg-surface-dark">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <div id="header" className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-h1-sm text-foreground dark:text-foreground-dark sm:text-h1">About me</h1>
          <p className="text-xl font-medium leading-tight text-muted dark:text-muted-dark">
            A short overview about my recent Formal Education and Work Experience.
          </p>
          <span className="inline-flex items-center rounded bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-soft-foreground dark:bg-accent-soft-dark dark:text-accent-soft-foreground-dark">
            <svg
              aria-hidden="true"
              className="mr-1 size-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Last updated on 09.01.2023
          </span>
        </div>
        <div id="timeline" className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 lg:mt-16">
          <div className="space-y-8">
            <h2 className="gold-hairline text-center text-h2-sm text-foreground dark:text-foreground-dark sm:text-h2">
              Formal Positions:
            </h2>
            <div>
              <TimelineEntry
                time="2021 - 2024"
                title="Founder & Tech Lead @ LAYZR.gg"
                description="Founding a new startup at the intersection of streaming and blockchain."
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
                description="Completed my Bachelor of Applied Computer Science at the Ravensburg-Weingarten University of Applied
                  Science."
                link="https://rwu.de"
              >
                <div className="space-y-4 rounded-sm bg-muted-surface p-4 dark:bg-muted-surface-dark">
                  <div className="flex flex-col items-start text-base font-medium text-muted dark:text-muted-dark">
                    <p> - Specialization in robotics and AI. </p>
                    <p> - Additional subjects in the areas of Deep Learning and Project Management. </p>
                  </div>
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
                  companyLogoSrc="https://placehold.co/512x512?text=Various"
                  companyDescription="See Projects for more details"
                  companyLink="/projects"
                />

                <div className="flex flex-row items-center gap-2 text-base font-medium text-muted dark:text-muted-dark">
                  <a
                    href="/projects"
                    className="rounded transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
                  >
                    See Projects
                  </a>
                  <Image
                    className={"size-4 dark:invert"}
                    src={"/icon/arrow-right.svg"}
                    alt=""
                    width={32}
                    height={32}
                  ></Image>
                </div>
              </TimelineEntry>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
