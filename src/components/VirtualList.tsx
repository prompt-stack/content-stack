/**
 * @file components/VirtualList.tsx
 * @purpose Component for VirtualList
 * @layer composed
 * @deps Box, react-window
 * @used-by [ContentInboxQueuePanel]
 * @css /styles/components/virtual-list.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file VirtualList.test.tsx
 * @test-status missing
 */

import { forwardRef, useCallback } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { Box } from './Box';

export interface VirtualListProps<T = any> {
  items: T[];
  height: number;
  width?: number | string;
  itemSize: number | ((index: number) => number);
  overscan?: number;
  onScroll?: (scrollOffset: number, scrollDirection: 'forward' | 'backward') => void;
  renderItem: (item: T, index: number, style: CSSProperties) => ReactNode;
  className?: string;
  estimatedItemSize?: number;
  threshold?: number; // Number of items before enabling virtualization
}

interface ItemData<T> {
  items: T[];
  renderItem: (item: T, index: number, style: CSSProperties) => ReactNode;
}

// Row component for react-window
const Row = <T,>({ index, style, data }: ListChildComponentProps<ItemData<T>>) => {
  const { items, renderItem } = data;
  return <>{renderItem(items[index], index, style)}</>;
};

export const VirtualList = forwardRef<List, VirtualListProps>(
  <T,>({
    items,
    height,
    width = '100%',
    itemSize,
    overscan = 3,
    onScroll,
    renderItem,
    className = '',
    estimatedItemSize = 100,
    threshold = 50
  }: VirtualListProps<T>, ref: React.Ref<List>) => {
    
    const handleScroll = useCallback(({ scrollOffset, scrollDirection }: {
      scrollOffset: number;
      scrollDirection: 'forward' | 'backward';
    }) => {
      onScroll?.(scrollOffset, scrollDirection);
    }, [onScroll]);

    const itemData: ItemData<T> = {
      items,
      renderItem
    };

    // If items are below threshold, render normally without virtualization
    if (items.length < threshold) {
      return (
        <Box 
          className={`virtual-list virtual-list--simple ${className}`}
          style={{ height, width, overflowY: 'auto' }}
        >
          {items.map((item, index) => 
            renderItem(item, index, {})
          )}
        </Box>
      );
    }

    // Use virtual scrolling for large lists
    return (
      <Box className={`virtual-list ${className}`}>
        <List
          ref={ref}
          height={height}
          width={width}
          itemCount={items.length}
          itemSize={itemSize}
          overscanCount={overscan}
          onScroll={handleScroll}
          itemData={itemData}
          estimatedItemSize={estimatedItemSize}
          className="virtual-list__container"
        >
          {Row}
        </List>
      </Box>
    );
  }
);

VirtualList.displayName = 'VirtualList';
