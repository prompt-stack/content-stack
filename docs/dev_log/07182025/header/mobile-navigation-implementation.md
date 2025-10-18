# Mobile Navigation Implementation Plan

## Current Issue
Right now when the screen gets small, we hide navigation text and eventually hide items, but there's no way to access the full navigation on mobile. We need a proper mobile menu system.

## Mobile Navigation Strategy

### 1. **Navigation Pattern: Slide-in Drawer**
We'll use a slide-in drawer pattern that includes:
- Hamburger menu button (visible only on mobile)
- Full-screen overlay
- Slide-in panel from left with all navigation items
- User info at top of mobile menu
- All nav items with full text
- Settings and actions at bottom

### 2. **Breakpoint System**

```typescript
// lib/breakpoints.ts
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
  notDesktop: `(max-width: ${BREAKPOINTS.desktop - 1}px)`
} as const
```

### 3. **Hook for Responsive Behavior**

```typescript
// hooks/useMediaQuery.ts
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])
  
  return matches
}

// hooks/useBreakpoint.ts
export function useBreakpoint() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile)
  const isTablet = useMediaQuery(MEDIA_QUERIES.tablet)
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop)
  
  return { isMobile, isTablet, isDesktop }
}
```

## Mobile Menu Components

### 1. **MobileMenu Component**

```typescript
// components/MobileMenu.tsx
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  user: User | null
}

export function MobileMenu({ isOpen, onClose, navItems, user }: MobileMenuProps) {
  // Lock body scroll when menu is open
  useBodyScrollLock(isOpen)
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          'mobile-menu-backdrop',
          isOpen && 'mobile-menu-backdrop--open'
        )}
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div 
        className={clsx(
          'mobile-menu',
          isOpen && 'mobile-menu--open'
        )}
      >
        {/* Header with close button */}
        <div className="mobile-menu-header">
          <div className="mobile-menu-brand">
            <i className="fas fa-layer-group" />
            <span>Content Stack</span>
          </div>
          <button 
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="fas fa-times" />
          </button>
        </div>
        
        {/* User info */}
        {user && (
          <div className="mobile-menu-user">
            <div className="mobile-menu-email">{user.email}</div>
            <span className={`tier-badge tier-badge--${user.tier}`}>
              {user.tier} Plan
            </span>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="mobile-menu-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                clsx('mobile-menu-link', isActive && 'mobile-menu-link--active')
              }
              onClick={onClose}
            >
              <i className={`fas fa-${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Actions */}
        <div className="mobile-menu-actions">
          <button className="mobile-menu-link">
            <i className="fas fa-cog" />
            <span>Settings</span>
          </button>
          <button className="mobile-menu-link">
            <i className="fas fa-crown" />
            <span>Manage Subscription</span>
          </button>
          <button className="mobile-menu-link">
            <i className="fas fa-sign-out-alt" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
```

### 2. **Updated Header Component**

```typescript
export function Header() {
  const { isMobile, isTablet } = useBreakpoint()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            {/* Hamburger button for mobile */}
            {isTablet && (
              <button
                className="hamburger-button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <i className="fas fa-bars" />
              </button>
            )}
            
            {/* Brand */}
            <a href="/" className="header-brand">
              <i className="fas fa-layer-group header-brand-icon" />
              <span className="header-brand-text">Content Stack</span>
            </a>
            
            {/* Desktop Navigation */}
            {!isTablet && (
              <nav className="header-nav">
                {/* existing nav */}
              </nav>
            )}
            
            {/* Actions */}
            <div className="header-actions">
              {/* existing actions */}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        user={user}
      />
    </>
  )
}
```

## CSS Classes

### Mobile Menu Styles

```css
/* Hamburger Button */
.hamburger-button {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.25rem;
  padding: 0.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .hamburger-button {
    display: block;
  }
}

/* Mobile Menu Backdrop */
.mobile-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  z-index: 999;
}

.mobile-menu-backdrop--open {
  opacity: 1;
  visibility: visible;
}

/* Mobile Menu Panel */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: var(--surface-base);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mobile-menu--open {
  transform: translateX(0);
}

/* Mobile Menu Sections */
.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.mobile-menu-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
}

.mobile-menu-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  padding: 0.5rem;
  cursor: pointer;
}

.mobile-menu-user {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.mobile-menu-email {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.mobile-menu-nav {
  flex: 1;
  padding: 0.5rem;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.mobile-menu-link:hover {
  background: var(--surface-hover);
}

.mobile-menu-link--active {
  background: var(--primary-alpha);
  color: var(--primary);
}

.mobile-menu-actions {
  padding: 0.5rem;
  border-top: 1px solid var(--border);
}
```

## Utilities

### Body Scroll Lock Hook

```typescript
// hooks/useBodyScrollLock.ts
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isLocked])
}
```

## Implementation Steps

1. **Create breakpoint utilities** - Consistent responsive behavior
2. **Create useMediaQuery hook** - React to screen size changes
3. **Create MobileMenu component** - Full mobile navigation
4. **Update Header component** - Add hamburger button
5. **Add mobile menu styles** - Slide-in drawer animation
6. **Implement body scroll lock** - Prevent background scrolling
7. **Add theme support** - Ensure mobile menu respects theme
8. **Test on devices** - Real device testing

## Benefits

1. **Full Navigation Access** - All nav items accessible on mobile
2. **Native Feel** - Slide-in drawer is familiar mobile pattern
3. **Accessible** - Keyboard navigation, ARIA labels
4. **Smooth** - Hardware-accelerated animations
5. **Flexible** - Easy to add more mobile-specific features

## Future Enhancements

1. **Swipe Gestures** - Swipe to open/close menu
2. **Bottom Navigation** - Alternative mobile nav pattern
3. **Progressive Disclosure** - Nested menu items
4. **Offline Indicator** - Show connection status
5. **Mobile-First Features** - Camera, location, etc.