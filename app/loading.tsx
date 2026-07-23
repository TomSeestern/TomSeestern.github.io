export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-accent-soft border-t-accent" />
        <p className="text-sm text-muted dark:text-muted-dark">Loading...</p>
      </div>
    </div>
  )
}
