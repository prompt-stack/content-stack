/**
 * @file contexts/SidebarContext.tsx
 * @purpose Sidebar state management context
 * @layer feature
 * @deps react
 * @used-by [Sidebar, SidebarToggle, Layout]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarConfig {
  defaultCollapsed?: boolean;
  collapsedWidth?: number;
  expandedWidth?: number;
  breakpoint?: number;
  persistState?: boolean;
  animationDuration?: number;
}

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobile: boolean;
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  collapse: () => void;
  expand: () => void;
  config: Required<SidebarConfig>;
}

const defaultConfig: Required<SidebarConfig> = {
  defaultCollapsed: false,
  collapsedWidth: 64,
  expandedWidth: 280,
  breakpoint: 1024,
  persistState: true,
  animationDuration: 300,
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export interface SidebarProviderProps {
  children: ReactNode;
  config?: SidebarConfig;
}

export function SidebarProvider({ children, config = {} }: SidebarProviderProps) {
  const mergedConfig = { ...defaultConfig, ...config };
  const { breakpoint, persistState, defaultCollapsed } = mergedConfig;

  // Check if mobile
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  
  // Desktop collapsed state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (!persistState || typeof window === 'undefined') return defaultCollapsed;
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? saved === 'true' : defaultCollapsed;
  });
  
  // Mobile open state
  const [isOpen, setIsOpen] = useState(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);
      // Close mobile sidebar on resize to desktop
      if (!mobile && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint, isOpen]);

  // Persist state
  useEffect(() => {
    if (persistState && !isMobile && typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(isCollapsed));
    }
  }, [isCollapsed, isMobile, persistState]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggle = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const value: SidebarContextValue = {
    isCollapsed,
    isMobile,
    isOpen,
    toggle,
    setOpen: setIsOpen,
    collapse: () => setIsCollapsed(true),
    expand: () => setIsCollapsed(false),
    config: mergedConfig,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}