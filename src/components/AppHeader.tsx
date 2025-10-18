/**
 * @file components/AppHeader.tsx
 * @purpose Unified header for core app pages (inbox, storage, search, studio)
 * @layer composed
 * @deps [useLocation, Link, UserAvatar]
 * @used-by [BaseLayout]
 * @llm-read true
 * @llm-write full-edit
 */

import { useLocation, Link } from 'react-router-dom';
import { Box } from './Box';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export function AppHeader() {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      path: '/inbox',
      label: 'Inbox',
      icon: <i className="fas fa-inbox" />
    },
    {
      path: '/storage',
      label: 'Storage',
      icon: <i className="fas fa-database" />
    },
    {
      path: '/search',
      label: 'Search',
      icon: <i className="fas fa-search" />
    },
    {
      path: '/studio',
      label: 'Studio',
      icon: <i className="fas fa-edit" />
    }
  ];
  
  return (
    <Box className="app-header">
      <div className="app-header__container">
        {/* Navigation */}
        <nav className="app-header__nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`app-header__nav-item ${isActive ? 'app-header__nav-item--active' : ''}`}
              >
                <span className="app-header__nav-icon">{item.icon}</span>
                <span className="app-header__nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Right side actions */}
        <div className="app-header__actions">
          <Link to="/settings" className="app-header__action-btn" title="Settings">
            <i className="fas fa-cog" />
          </Link>
          <Link to="/" className="app-header__action-btn" title="Home">
            <i className="fas fa-home" />
          </Link>
        </div>
      </div>
    </Box>
  );
}