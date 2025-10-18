/**
 * @file components/Sidebar/SidebarSection.tsx
 * @purpose Sidebar section with collapsible support
 * @layer composed
 * @deps [Box, SidebarItem]
 * @used-by [Sidebar]
 * @cssFile /styles/components/sidebar.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file SidebarSection.test.tsx
 * @test-status missing
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { Box } from '../Box';
import { SidebarItem } from './SidebarItem';
import type { SidebarSection as SidebarSectionType } from './types';

export interface SidebarSectionProps {
  section: SidebarSectionType;
}

export function SidebarSection({ section }: SidebarSectionProps) {
  const { isCollapsed, isMobile } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const showTitle = section.title && !isCollapsed && !isMobile;
  
  return (
    <Box className="sidebar__section">
      {showTitle && (
        <button
          className="sidebar__section-header"
          onClick={() => section.collapsible && setIsExpanded(!isExpanded)}
          disabled={!section.collapsible}
          aria-expanded={isExpanded}
          type="button"
        >
          <span className="sidebar__section-title">{section.title}</span>
          {section.collapsible && (
            <ChevronDown 
              className={`sidebar__chevron ${!isExpanded ? 'sidebar__chevron--rotated' : ''}`}
              size={16}
            />
          )}
        </button>
      )}
      
      {(!section.collapsible || isExpanded) && (
        <ul className="sidebar__list">
          {section.items.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </Box>
  );
}
