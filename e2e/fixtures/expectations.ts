/**
 * Single source of truth for e2e copy and count expectations.
 *
 * CONTENT COUPLING: every value below mirrors rendered site content — page
 * text in `app/**`, the markdown corpus in `content/blog/*.md`, and
 * `content/projects/*.md`. When that content changes, update THIS FILE in the
 * same pull request as the content change. Specs must import from here and
 * never inline a copy or count literal: one edit point keeps the suite honest,
 * reviewable, and greppable.
 */

/** Exact user-visible copy asserted by the e2e suite. */
export const COPY = {
  home: {
    h1: "Systems that hold.",
    positioning:
      "I'm Tom Segbers. I build payment infrastructure, embedded vision, and product systems whose interfaces explain themselves.",
    featuredH2: "Selected work",
    practiceH2: "The practice",
    recentBlogH2: "Latest dispatches",
    closing: "Let's build something that lasts.",
  },
  about: {
    h1: "About me",
    eyebrow: "Profile",
    formalPositionsH2: "Formal positions",
    toolsH2: "Tools of the trade",
    examplesH2: "Illustrative examples",
    closing: "Let's build something that lasts.",
  },
  contact: {
    h1: "Get in touch",
    eyebrow: "Correspondence",
    submitButton: "Send Message",
    successMessage: "Success! Email sent successfully.",
  },
  notFound: {
    h1: "404",
    h2: "Page not found",
  },
  projects: {
    h1: "The work",
    eyebrow: "Archive",
    browseBySubject: "Browse by subject",
    archiveH2: "The archive",
    closingH2: "Have a project in mind?",
    closingCta: "Start a conversation",
    selectedBadge: "Selected",
  },
  projectDetail: {
    caseFileEyebrow: "CASE FILE",
    stackLabel: "Stack",
    subjectsLabel: "Subjects",
    nextProject: "Next project",
    backToArchive: "Back to the archive",
  },
  blog: {
    h1: "Blog",
    eyebrow: "Journal",
    latestEntries: "Latest entries",
  },
  blogDetail: {
    dispatchEyebrow: "DISPATCH",
    moreDispatches: "More dispatches",
  },
  tags: {
    h1: "Tags",
    eyebrow: "Index",
    archiveEyebrow: "Filed under",
  },
  microcopy: {
    readMore: "Read dispatch",
    learnMore: "View case file",
    allBlogPosts: "All dispatches",
  },
} as const

/** Posts published under `content/blog/` (asserted as an exact count). */
export const BLOG_POST_COUNT = 3

/** Project entries expected under `content/projects/` (asserted as a floor). */
export const MIN_PROJECT_COUNT = 28

/** Published project case files shown in the home archive status. */
export const PROJECT_CASE_FILE_COUNT = 28

/**
 * Curated "monument" projects the home featured set renders. Mirrors
 * `FEATURED_PROJECT_COUNT` in `lib/projects.tsx`; the e2e spec asserts the
 * rendered link count matches this.
 */
export const FEATURED_PROJECT_COUNT = 4

/**
 * Upper bound for `document.querySelectorAll("*").length` on `/`. The
 * terminal rebuild adds one hero window, a status line, and a four-row
 * capability ledger while removing the portrait, ticker, lead-card variant,
 * and article sigils. The Playwright dev server injects its own
 * script/title/meta nodes; this bound is measured against that dev surface with
 * modest headroom, not the old 1800 ceiling that let the retired marquee
 * through. The v4 status bar and ledger use grid placement instead of per-cell
 * wrapper divs: measured 608 locally after that trim (CI dev surface ran 656
 * with the wrappers, so the trim keeps the ceiling valid rather than raising it).
 */
export const MAX_HOME_DOM_NODES = 650
