/**
 * @file components/Sidebar/Sidebar.tsx
 * @purpose Collapsible sidebar navigation component
 * @layer composed
 * @deps [SidebarContext, Box, ScrollContainer]
 * @used-by [Layout, InboxPage]
 * @cssFile /styles/components/sidebar.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Sidebar.test.tsx
 * @test-status missing
 */

import { useEffect, useRef } from 'react';
import { ChevronsLeft } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Box } from '../Box';
import { ScrollContainer } from '../ScrollContainer';
import { SidebarSection } from './SidebarSection';
import { SidebarToggle } from './SidebarToggle';
import type { SidebarSection as SidebarSectionType } from './types';
import '../../styles/components/sidebar.css';

export interface SidebarProps {
  sections: SidebarSectionType[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Sidebar({ sections, header, footer, className = '' }: SidebarProps) {
  const { isCollapsed, isMobile, isOpen, setOpen, toggle } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Lock body scroll on mobile when open
  useBodyScrollLock(isMobile && isOpen);
  
  // Handle click outside on mobile
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, setOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && isOpen) {
        setOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, isOpen, setOpen]);

  const sidebarClasses = [
    'sidebar',
    isCollapsed && !isMobile && 'sidebar--collapsed',
    isMobile && isOpen && 'sidebar--open',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div 
          className={`sidebar__backdrop ${isOpen ? 'sidebar__backdrop--visible' : ''}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <Box
        ref={sidebarRef}
        as="aside"
        className={sidebarClasses}
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={isMobile ? isOpen : !isCollapsed}
      >
        {/* Toggle Button - Always visible on desktop */}
        {!isMobile && (
          <button
            className="sidebar__toggle-button"
            onClick={() => toggle()}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeft 
              className={`sidebar__toggle-icon ${isCollapsed ? 'sidebar__toggle-icon--rotated' : ''}`}
              size={16}
            />
          </button>
        )}
        
        {/* Header */}
        {header && (
          <Box className="sidebar__header">
            {header}
          </Box>
        )}
        
        {/* Navigation */}
        <Box className="sidebar__nav">
          {sections.map((section) => (
            <SidebarSection key={section.id} section={section} />
          ))}
        </Box>
        
        {/* Footer */}
        {footer && (
          <Box className="sidebar__footer">
            {footer}
          </Box>
        )}
      </Box>
    </>
  );
}

