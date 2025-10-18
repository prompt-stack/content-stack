/**
 * @file components/Sidebar/SidebarTooltip.tsx
 * @purpose Tooltip component for collapsed sidebar items
 * @layer composed
 * @deps [React.createPortal]
 * @used-by [SidebarItem]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { createPortal } from 'react-dom';

export interface SidebarTooltipProps {
  content: string;
  top: number;
}

export function SidebarTooltip({ content, top }: SidebarTooltipProps) {
  return createPortal(
    <div 
      className="sidebar__tooltip" 
      role="tooltip"
      style={{ top: `${top}px` }}
    >
      {content}
    </div>,
    document.body
  );
}