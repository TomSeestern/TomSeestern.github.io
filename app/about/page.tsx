import path from "path"
import TimelineEntry from "../../components/TimelineEntry/TimelineEntry"
import PersonTeaser from "../../components/PersonTeaser/PersonTeaser"

export default function About() {
  return (
    <section className="bg-white antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6 lg:py-24">
        <div id="header" className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            About me
          </h2>
          <p className="text-xl font-medium leading-tight text-gray-500 dark:text-gray-400">
            A short overview about my recent Projects and Achievements
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
            Last updated on 03.01.2023
          </span>
        </div>
        <div id="timeline" className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 lg:mt-16">
          <div className="space-y-8">
            <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Positions:</h3>
            <div>
              <TimelineEntry
                time="2021 - 2024"
                title="Founder & Tech Lead @ LAYZR.gg"
                description="Founding a new startup in the gaming industry. "
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
                title="HATtec: Software Engineer Intern"
                description="Working as a Software Engineer Intern at HATtec GmbH."
                link="https://hattec.de"
              >
                <PersonTeaser
                  companyName="HATtec GmbH"
                  companyLogoSrc="https://placehold.co/512x512?text=HATtec"
                  companyDescription="Software Company developing autonomous Drone Software"
                  companyLink="https://hattec.de"
                />
              </TimelineEntry>
              <TimelineEntry
                time="2018-2021"
                title="B.A. Applied Computer Science"
                description=""
                link="https://rwu.de"
              >
                <div className="space-y-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <p className="text-base font-medium text-gray-500 dark:text-gray-400">Sponsors:</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <img
                      className="h-7 w-auto object-contain"
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/spotify-grayscale.svg"
                      alt=""
                    />
                    <img
                      className="h-5 w-auto object-contain"
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/microsoft-grayscale.svg"
                      alt=""
                    />
                    <img
                      className="h-5 w-auto object-contain"
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/slack-grayscale.svg"
                      alt=""
                    />
                    <img
                      className="h-7 w-auto object-contain"
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/customers/salesforce-grayscale.svg"
                      alt=""
                    />
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
              </TimelineEntry>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
