/**
 * @file components/Sidebar/types.ts
 * @purpose Type definitions for Sidebar components
 * @layer composed
 * @deps react
 * @used-by [Sidebar, SidebarItem, SidebarSection]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file types.test.ts
 * @test-status missing
 */

import type { ReactNode } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  badge?: string | number;
  active?: boolean;
  isInput?: boolean;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  isDisabled?: boolean;
  tooltip?: string;
  className?: string;
}

export interface SidebarSection {
  id: string;
  title?: string;
  items: SidebarItem[];
  collapsible?: boolean;
}
