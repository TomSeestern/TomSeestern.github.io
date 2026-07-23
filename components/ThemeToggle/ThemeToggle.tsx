"use client"

import { Moon, Sun } from "lucide-react"
import { twMerge } from "tailwind-merge"

// Must match the key used by the inline theme script in app/layout.tsx
const STORAGE_KEY = "flowbite-theme-mode"

export interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  function handleToggle() {
    const isDark = document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", !isDark)
    try {
      localStorage.setItem(STORAGE_KEY, !isDark ? "dark" : "light")
    } catch {
      // localStorage may be unavailable in private browsing mode
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      data-testid="theme-toggle"
      className={twMerge(
        "inline-flex items-center justify-center rounded-lg p-2.5 text-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-muted-dark dark:hover:bg-muted-surface-dark dark:focus-visible:ring-accent-soft-dark",
        className
      )}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="block size-5 dark:hidden" aria-hidden="true" />
    </button>
  )
}
