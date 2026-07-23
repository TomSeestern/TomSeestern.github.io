"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface text-foreground">
        <h1 className="text-h1">TomSegbers.de</h1>
        <p className="text-muted">{error.message || "Something went critically wrong."}</p>
        <button
          onClick={() => reset()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:focus-visible:ring-accent-soft-dark"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
