/**
 * @file components/Sidebar/SidebarItem.tsx
 * @purpose Individual sidebar navigation item
 * @layer composed
 * @deps [Box, Badge, Link]
 * @used-by [SidebarSection]
 * @cssFile /styles/components/sidebar.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file SidebarItem.test.tsx
 * @test-status missing
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { Badge } from '../Badge';
import { Link } from '../Link';
import { SidebarTooltip } from './SidebarTooltip';
import type { SidebarItem as SidebarItemType } from './types';

export interface SidebarItemProps {
  item: SidebarItemType;
  depth?: number;
}

export function SidebarItem({ item, depth = 0 }: SidebarItemProps) {
  const { isCollapsed, isMobile } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number } | null>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const hasChildren = item.children && item.children.length > 0;
  
  const handleClick = (e: React.MouseEvent) => {
    if (item.isDisabled) {
      e.preventDefault();
      return;
    }
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    } else if (hasChildren && !item.href) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };
  
  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && item.onSubmit) {
      item.onSubmit(inputValue.trim());
      setInputValue('');
    }
  };
  
  const ItemWrapper = item.href ? Link : 'button';
  const showContent = !isCollapsed || isMobile;
  
  // Calculate tooltip position on hover
  useEffect(() => {
    if (!isCollapsed || isMobile || !itemRef.current) return;
    
    const handleMouseEnter = () => {
      const rect = itemRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({ top: rect.top + rect.height / 2 });
      }
    };
    
    const handleMouseLeave = () => {
      setTooltipPosition(null);
    };
    
    const element = itemRef.current;
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isCollapsed, isMobile]);
  
  // If this is an input item, render differently
  if (item.isInput) {
    return (
      <>
        <li className="sidebar__item-wrapper" ref={itemRef}>
          <div className={`sidebar__item sidebar__item--input sidebar__item--depth-${depth}`}>
            <span className="sidebar__icon">{item.icon}</span>
            {showContent && (
              <input
                type="text"
                className="sidebar__input"
                placeholder={item.placeholder || 'Enter value...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputSubmit}
              />
            )}
          </div>
        </li>
        {/* Tooltip rendered as portal for proper positioning */}
        {isCollapsed && !isMobile && tooltipPosition && (
          <SidebarTooltip content={item.label} top={tooltipPosition.top} />
        )}
      </>
    );
  }
  
  return (
    <>
      <li className="sidebar__item-wrapper" ref={itemRef}>
        <ItemWrapper
          className={`sidebar__item sidebar__item--depth-${depth} ${item.active ? 'sidebar__item--active' : ''} ${item.isDisabled ? 'sidebar__item--disabled' : ''} ${item.className || ''}`}
          href={item.isDisabled ? undefined : item.href}
          onClick={handleClick}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-disabled={item.isDisabled}
          type={!item.href ? 'button' : undefined}
        >
          <span className="sidebar__icon">{item.icon}</span>
          
          {showContent && (
            <>
              <span className="sidebar__label">{item.label}</span>
              {item.badge && (
                <Badge size="sm" className="sidebar__badge">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronRight 
                  className={`sidebar__chevron ${isExpanded ? 'sidebar__chevron--expanded' : ''}`}
                  size={16}
                />
              )}
            </>
          )}
        </ItemWrapper>
        
        {/* Nested items */}
        {hasChildren && isExpanded && showContent && item.children && (
          <ul className="sidebar__sublist">
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
      
      {/* Tooltip rendered as portal for proper positioning */}
      {isCollapsed && !isMobile && tooltipPosition && (
        <SidebarTooltip content={item.tooltip || item.label} top={tooltipPosition.top} />
      )}
    </>
  );
}
