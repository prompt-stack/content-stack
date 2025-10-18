/**
 * @file hooks/useSidebarShortcuts.ts
 * @purpose Keyboard shortcuts for sidebar navigation
 * @layer feature
 * @deps [useEffect, useSidebar]
 * @used-by [Layout, InboxPage]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 90
 * @test-file useSidebarShortcuts.test.ts
 * @test-status missing
 */

import { useEffect } from 'react';
import { useSidebar } from '../contexts/SidebarContext';

export function useSidebarShortcuts() {
  const { toggle } = useSidebar();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggle();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);
}
