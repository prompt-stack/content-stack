import { useMediaQuery } from './useMediaQuery'
import { MEDIA_QUERIES } from '@/lib/breakpoints'

interface BreakpointFlags {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isNotDesktop: boolean
  isTouchDevice: boolean
  canHover: boolean
}

export function useBreakpoint(): BreakpointFlags {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile)
  const isTablet = useMediaQuery(MEDIA_QUERIES.tablet)
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop)
  const isNotDesktop = useMediaQuery(MEDIA_QUERIES.notDesktop)
  const isTouchDevice = useMediaQuery(MEDIA_QUERIES.touch)
  const canHover = useMediaQuery(MEDIA_QUERIES.hover)

  return {
    isMobile,
    isTablet,
    isDesktop,
    isNotDesktop,
    isTouchDevice,
    canHover
  }
}