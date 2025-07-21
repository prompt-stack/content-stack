export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280
} as const

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(max-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  notDesktop: `(max-width: ${BREAKPOINTS.desktop - 1}px)`,
  
  // Ranges
  mobileOnly: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tabletOnly: `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`,
  desktopOnly: `(min-width: ${BREAKPOINTS.desktop}px) and (max-width: ${BREAKPOINTS.wide - 1}px)`,
  
  // Orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Features
  hover: '(hover: hover)',
  touch: '(hover: none) and (pointer: coarse)'
} as const

export type Breakpoint = keyof typeof BREAKPOINTS
export type MediaQuery = keyof typeof MEDIA_QUERIES