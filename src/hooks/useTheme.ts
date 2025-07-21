/**
 * @file hooks/useTheme.ts
 * @purpose Hook for Theme management
 * @layer hook
 * @deps none
 * @used-by [Header, MobileMenu]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface UseThemeReturn {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const THEME_KEY = 'content-stack-theme'

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get saved theme from localStorage
    const saved = localStorage.getItem(THEME_KEY)
    return (saved as Theme) || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

  // Determine resolved theme based on preference and system
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(prefersDark ? 'dark' : 'light')
      } else {
        setResolvedTheme(theme as ResolvedTheme)
      }
    }

    updateResolvedTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateResolvedTheme)

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark-theme')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark-theme')
      root.setAttribute('data-theme', 'light')
    }
  }, [resolvedTheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  }
}
