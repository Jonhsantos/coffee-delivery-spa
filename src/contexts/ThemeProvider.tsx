import { useEffect, useState, type ReactNode } from 'react'
import { readStorage, STORAGE_KEYS, writeStorage } from '../services/storage'
import { themeSchema } from '../schemas/storageSchemas'
import type { Theme } from '../types/checkout'
import { ThemeContext } from './ThemeContext'

function initialTheme(): { theme: Theme; explicit: boolean } {
  const stored = readStorage(STORAGE_KEYS.theme)
  const parsed = themeSchema.safeParse(
    stored.status === 'ok' ? stored.value : null,
  )
  if (parsed.success) return { theme: parsed.data, explicit: true }
  return {
    theme: window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    explicit: false,
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState(initialTheme)
  const [storageFailed, setStorageFailed] = useState(false)
  useEffect(() => {
    document.documentElement.dataset.theme = preference.theme
  }, [preference.theme])
  useEffect(() => {
    if (preference.explicit || !window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = (event: MediaQueryListEvent) =>
      setPreference({
        theme: event.matches ? 'dark' : 'light',
        explicit: false,
      })
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [preference.explicit])
  function toggleTheme() {
    const next = preference.theme === 'light' ? 'dark' : 'light'
    setStorageFailed(!writeStorage(STORAGE_KEYS.theme, next))
    setPreference({ theme: next, explicit: true })
  }
  return (
    <ThemeContext.Provider value={{ theme: preference.theme, toggleTheme }}>
      {storageFailed && (
        <p role="status">Não foi possível salvar a preferência de tema.</p>
      )}
      {children}
    </ThemeContext.Provider>
  )
}
