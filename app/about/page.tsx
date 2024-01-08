import path from "path"
import TimelineEntry from "../../components/TimelineEntry/TimelineEntry"
import PersonTeaser from "../../components/PersonTeaser/PersonTeaser"
import Image from "next/image"
import React from "react"

export default function About() {
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div id="header" className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            About me
          </h2>
          <p className="text-xl font-medium leading-tight text-gray-500 dark:text-gray-400">
            A short overview about my recent Formal Education and Work Experience.
          </p>
          <span className="inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
            <svg
              aria-hidden="true"
              className="mr-1 h-3 w-3"
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
            <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Formal Positions:</h3>
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
                <div className="space-y-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <div className="flex flex-col items-start text-base font-medium text-gray-500 dark:text-gray-400">
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

                <div className="flex flex-row items-center gap-2 text-base font-medium text-gray-500 hover:underline dark:text-gray-400">
                  <a href="/projects" className="">
                    See Projects
                  </a>
                  <Image
                    className={"h-4 w-4"}
                    src={"/icon/arrow-right.svg"}
                    alt="arrow right"
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
