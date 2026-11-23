import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'refweir-theme'

const listeners = new Set<() => void>()
new MutationObserver(() => listeners.forEach((listener) => listener())).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme'],
})

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  const palette = { light: '#ecebe5', dark: '#131311' }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
    localStorage.setItem('refweir_theme', theme)
  } catch {
    // Storage unavailable (private mode etc.) — theme still applies for the session.
  }
}

export function toggleTheme() {
  setTheme(getSnapshot() === 'dark' ? 'light' : 'dark')
}
