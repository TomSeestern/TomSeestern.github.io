import Link from "next/link"

export default function NotFound() {
  return (
    <section className="mx-auto content-center items-center bg-surface dark:bg-surface-dark">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-accent dark:text-accent-dark lg:text-9xl">
            404
          </h1>
          <h2 className="mb-4 text-h2-sm text-foreground dark:text-foreground-dark md:text-h2">
            Something&apos;s missing.
          </h2>
          <p className="mb-4 text-lg font-light text-muted dark:text-muted-dark">
            Sorry, we can&apos;t find that page. <br /> You&apos;ll find plenty to explore on the home page.
          </p>
          <Link
            href="/"
            className="my-4 inline-flex rounded-lg bg-accent px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:focus-visible:ring-accent-soft-dark"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
