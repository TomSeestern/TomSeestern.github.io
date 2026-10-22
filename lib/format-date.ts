const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

const YEAR_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  timeZone: "UTC",
})

/** Absolute, timezone-stable display date; uppercase to match the pixel labels. */
export function formatDate(date: Date): string {
  return DATE_FORMATTER.format(date).toUpperCase()
}

/** Four-digit UTC year for cards and case-file eyebrows. */
export function formatYear(date: Date): string {
  return YEAR_FORMATTER.format(date)
}
