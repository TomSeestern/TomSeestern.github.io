const WORDS_PER_MINUTE = 200

/**
 * Reading time in whole minutes, with a one-minute floor. The count uses the
 * rendered markdown source; code and punctuation are words as far as a reader
 * scanning the page is concerned.
 */
export function readingTimeMinutes(content: string): number {
  const words = content
    .replace(/[#*_>`~[\]()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

/** Display label used by detail metadata. */
export function readingTimeLabel(content: string): string {
  return `${readingTimeMinutes(content)} min read`
}
