/**
 * @file components/Sidebar/SidebarToggle.tsx
 * @purpose Toggle button for sidebar collapse/expand
 * @layer composed
 * @deps [Button, useSidebar]
 * @used-by [Sidebar, Header]
 * @cssFile /styles/components/sidebar.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file SidebarToggle.test.tsx
 * @test-status missing
 */

import { Menu, ChevronsLeft } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { Button } from '../Button';

export interface SidebarToggleProps {
  className?: string;
}

export function SidebarToggle({ className = '' }: SidebarToggleProps) {
  const { toggle, isCollapsed, isMobile } = useSidebar();
  
  return (
    <Button
      className={`sidebar__toggle ${className}`}
      onClick={toggle}
      variant="secondary"
      size="small"
      aria-label={
        isMobile 
          ? 'Open navigation menu' 
          : isCollapsed 
            ? 'Expand sidebar' 
            : 'Collapse sidebar'
      }
    >
      {isMobile ? (
        <Menu size={20} />
      ) : (
        <ChevronsLeft 
          className={`sidebar__toggle-icon ${isCollapsed ? 'sidebar__toggle-icon--rotated' : ''}`}
          size={20}
        />
      )}
    </Button>
  );
}
