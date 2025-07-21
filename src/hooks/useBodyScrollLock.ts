import { useEffect } from 'react'

export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return

    // Save original body styles
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    // Get scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // Apply styles to prevent scroll
    document.body.style.overflow = 'hidden'
    
    // Prevent layout shift by adding padding equivalent to scrollbar width
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Cleanup function to restore original styles
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isLocked])
}