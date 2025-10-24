/**
 * @file layout/Header.tsx
 * @purpose Application header with navigation and user controls
 * @layer layout
 * @deps Button (primitive), MobileMenu (layout)
 * @used-by [Layout]
 * @css /styles/layout/header.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Button } from '@/components/Button'
import { MobileMenu } from './MobileMenu'
import { useUser } from '@/hooks/useUser'
import { useTheme } from '@/hooks/useTheme'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface UserInfoSectionProps {
  email: string
  tier: 'free' | 'pro' | 'enterprise'
}

function UserInfoSection({ email, tier }: UserInfoSectionProps) {
  const tierColors = {
    free: 'tier-badge--free',
    pro: 'tier-badge--pro',
    enterprise: 'tier-badge--enterprise'
  }

  return (
    <div className="user-info-section">
      <div className="user-email">{email}</div>
      <span className={clsx('tier-badge', tierColors[tier])}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
      </span>
    </div>
  )
}

interface ThemeToggleSectionProps {
  currentTheme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
}

function ThemeToggleSection({ currentTheme, onThemeChange }: ThemeToggleSectionProps) {
  const themeOptions = [
    { value: 'light' as const, icon: 'sun', label: 'Light' },
    { value: 'dark' as const, icon: 'moon', label: 'Dark' }
  ]

  return (
    <div className="theme-section">
      <label className="theme-label">THEME</label>
      <div className="theme-toggle">
        {themeOptions.map(option => (
          <button
            key={option.value}
            className={clsx(
              'theme-option',
              currentTheme === option.value && 'theme-option--active'
            )}
            onClick={() => onThemeChange(option.value)}
          >
            <i className={`fas fa-${option.icon}`} />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { resolvedTheme, setTheme } = useTheme()
  const { isTablet } = useBreakpoint()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.menu-dropdown')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  const navItems = [
    { path: '/inbox', label: 'Inbox', icon: 'inbox' },
    { path: '/playground', label: 'Playground', icon: 'flask' },
    { path: '/studio', label: 'Studio', icon: 'palette' },
    { path: '/storage', label: 'Storage', icon: 'folder-open' },
    { path: '/search', label: 'Search', icon: 'search' },
    { path: '/settings', label: 'Settings', icon: 'cog' }
  ]

  const menuItems = [
    { 
      icon: 'crown', 
      label: 'Manage Subscription', 
      action: () => {
        navigate('/subscription')
        setIsDropdownOpen(false)
      }
    },
    { 
      icon: 'sign-out-alt', 
      label: 'Logout', 
      action: () => {
        console.log('Logout user')
        setIsDropdownOpen(false)
      }
    }
  ]

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTheme(theme)
  }

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/')
  }

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
                data-testid="hamburger-button"
              >
                <i className="fas fa-bars" />
              </button>
            )}

            {/* Brand */}
            <a 
              href="/" 
              className="header-brand"
              onClick={handleBrandClick}
              data-testid="header-brand"
            >
              <i className="fas fa-layer-group header-brand-icon" />
              <span className="header-brand-text">Content Stack</span>
            </a>

            {/* Desktop Navigation */}
            {!isTablet && (
              <nav className="header-nav">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      clsx('nav-link', isActive && 'nav-link--active')
                    }
                    data-testid={`nav-${item.icon}`}
                  >
                    <i className={`fas fa-${item.icon} nav-link-icon`} />
                    <span className="nav-link-text">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            )}

            {/* Actions */}
            <div className="header-actions">
              {!isTablet && (
                <Button
                  variant="secondary"
                  size="small"
                  icon="heartbeat"
                  title="System Health"
                  onClick={() => navigate('/health')}
                >
                  Health
                </Button>
              )}
              
              {!isTablet && (
                <div className="menu-dropdown">
                  <button 
                    className="menu-trigger"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-controls="menu-dropdown"
                  >
                    <span>Menu</span>
                    <i className={clsx(
                      'fas fa-chevron-down menu-trigger-arrow',
                      isDropdownOpen && 'menu-trigger-arrow--open'
                    )} />
                  </button>
                
                {isDropdownOpen && (
                  <div 
                    className="dropdown-menu"
                    id="menu-dropdown"
                    data-state={isDropdownOpen ? 'open' : 'closed'}
                  >
                    {user && (
                      <UserInfoSection 
                        email={user.email}
                        tier={user.tier}
                      />
                    )}
                    
                    <ThemeToggleSection 
                      currentTheme={resolvedTheme}
                      onThemeChange={handleThemeChange}
                    />
                    
                    <div className="menu-divider" />
                    
                    <div className="menu-section">
                      {menuItems.map((item, index) => (
                        <button 
                          key={index}
                          className="menu-item" 
                          onClick={item.action}
                        >
                          <i className={`fas fa-${item.icon}`} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              )}
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
      onSettingsClick={() => {
        // Settings page removed - functionality moved to playground
        navigate('/playground')
      }}
      onSubscriptionClick={() => {
        console.log('Navigate to subscription')
      }}
      onLogoutClick={() => {
        console.log('Logout user')
      }}
    />
  </>
  )
}
