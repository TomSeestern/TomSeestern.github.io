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
    h1: "Tom Segbers — Senior Developer",
    positioning: "Building reliable systems and solving hard problems.",
    featuredH2: "Selected Work",
    founderArcH2: "Background",
    recentBlogH2: "My Recent Blog Posts",
    logoAlt: "Tom Segbers Logo",
  },
  about: {
    h1: "About me",
    formalPositionsH2: "Formal Positions:",
  },
  contact: {
    h1: "Get in Touch",
    submitButton: "Send Message",
    successMessage: "Success! Email sent successfully.",
  },
  notFound: {
    h1: "404",
  },
} as const

/** Posts published under `content/blog/` (asserted as an exact count). */
export const BLOG_POST_COUNT = 3

/** Project entries expected under `content/projects/` (asserted as a floor). */
export const MIN_PROJECT_COUNT = 21

/**
 * Curated "monument" projects the home featured set renders (T16). Mirrors
 * `FEATURED_PROJECT_COUNT` in `lib/projects.tsx`; the e2e spec asserts the
 * rendered link count matches this.
 */
export const FEATURED_PROJECT_COUNT = 4

/**
 * Upper bound for `document.querySelectorAll("*").length` on `/`. The retired
 * marquee rendered 42 cards (~2× the whole site's node budget); this floor keeps
 * the home page from regressing back to a node-bloated layout.
 */
export const MAX_HOME_DOM_NODES = 1500
