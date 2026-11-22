import { createContext } from 'react'
import type { Theme } from '../types/checkout'

export const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: 'light', toggleTheme: () => {} })
