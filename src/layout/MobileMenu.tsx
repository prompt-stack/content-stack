/**
 * @layer layout
 * @description Mobile navigation menu with slide-out drawer
 * @dependencies Box (primitive)
 * @cssFile /styles/layout/mobile-menu.css
 * @className .mobile-menu
 * 
 * This is a LAYOUT component that provides responsive navigation
 * for mobile viewports with body scroll locking and theme controls.
 */

import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useTheme } from '@/hooks/useTheme'
import type { User } from '@/hooks/useUser'

interface NavItem {
  path: string
  label: string
  icon: string
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  user: User | null
  onSettingsClick: () => void
  onSubscriptionClick: () => void
  onLogoutClick: () => void
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  navItems, 
  user,
  onSettingsClick,
  onSubscriptionClick,
  onLogoutClick
}: MobileMenuProps) {
  // Lock body scroll when menu is open
  useBodyScrollLock(isOpen)
  const { resolvedTheme, setTheme } = useTheme()

  const handleActionClick = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          'mobile-menu-backdrop',
          isOpen && 'mobile-menu-backdrop--open'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div 
        className={clsx(
          'mobile-menu',
          isOpen && 'mobile-menu--open'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
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
            <span className={clsx('tier-badge', `tier-badge--${user.tier}`)}>
              {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Plan
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
        
        {/* Theme Toggle */}
        <div className="mobile-menu-theme">
          <div className="mobile-menu-theme-label">THEME</div>
          <div className="theme-toggle">
            <button
              className={clsx(
                'theme-option',
                resolvedTheme === 'light' && 'theme-option--active'
              )}
              onClick={() => setTheme('light')}
            >
              <i className="fas fa-sun" />
              <span>Light</span>
            </button>
            <button
              className={clsx(
                'theme-option',
                resolvedTheme === 'dark' && 'theme-option--active'
              )}
              onClick={() => setTheme('dark')}
            >
              <i className="fas fa-moon" />
              <span>Dark</span>
            </button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mobile-menu-actions">
          <button 
            className="mobile-menu-link"
            onClick={() => handleActionClick(onSettingsClick)}
          >
            <i className="fas fa-cog" />
            <span>Settings</span>
          </button>
          <button 
            className="mobile-menu-link"
            onClick={() => handleActionClick(onSubscriptionClick)}
          >
            <i className="fas fa-crown" />
            <span>Manage Subscription</span>
          </button>
          <button 
            className="mobile-menu-link"
            onClick={() => handleActionClick(onLogoutClick)}
          >
            <i className="fas fa-sign-out-alt" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}