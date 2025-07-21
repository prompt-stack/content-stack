/**
 * @file hooks/useMediaQuery.ts
 * @purpose Hook for MediaQuery management
 * @layer hook
 * @deps none
 * @used-by [useBreakpoint]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  // Initialize with false to avoid hydration mismatch
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add event listener
    // Use addEventListener for modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
    }

    // Clean up
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        // Fallback for older browsers
        media.removeListener(listener)
      }
    }
  }, [query, matches])

  return matches
}
