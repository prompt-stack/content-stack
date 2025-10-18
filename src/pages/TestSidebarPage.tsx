/**
 * @file pages/TestSidebarPage.tsx
 * @purpose Test page for sidebar functionality
 * @layer page
 * @deps [BaseLayout, Box, Text, Button]
 * @used-by [Router]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role test
 */

import { BaseLayout } from '@/layout/BaseLayout';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { useSidebar } from '@/contexts/SidebarContext';

export function TestSidebarPage() {
  const { isCollapsed, isMobile, isOpen, toggle, collapse, expand } = useSidebar();

  return (
    <BaseLayout>
      <Box padding="xl">
        <Text as="h1" size="2xl" weight="bold" marginBottom="lg">
          Sidebar Test Page
        </Text>
        
        <Box marginBottom="xl">
          <Text size="lg" weight="semibold" marginBottom="md">
            Sidebar State:
          </Text>
          <Box display="flex" direction="column" gap="sm">
            <Text>Is Mobile: {isMobile ? 'Yes' : 'No'}</Text>
            <Text>Is Collapsed (Desktop): {isCollapsed ? 'Yes' : 'No'}</Text>
            <Text>Is Open (Mobile): {isOpen ? 'Yes' : 'No'}</Text>
          </Box>
        </Box>

        <Box display="flex" gap="md" flexWrap="wrap">
          <Button onClick={toggle}>
            Toggle Sidebar
          </Button>
          
          {!isMobile && (
            <>
              <Button onClick={collapse} variant="secondary">
                Collapse
              </Button>
              <Button onClick={expand} variant="secondary">
                Expand
              </Button>
            </>
          )}
        </Box>

        <Box marginTop="xl">
          <Text size="sm" color="muted">
            Try resizing your browser window to test mobile behavior.
            The sidebar should collapse/expand smoothly with the toggle button.
          </Text>
        </Box>
      </Box>
    </BaseLayout>
  );
}