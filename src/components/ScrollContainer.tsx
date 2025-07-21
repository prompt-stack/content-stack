import { forwardRef, ReactNode, CSSProperties } from 'react';
import { Box, BoxProps } from './Box';

/**
 * @layer primitive
 * @cssFile /styles/components/scroll-container.css
 * @dependencies Box
 * @className .scroll-container
 */

export interface ScrollContainerProps extends Omit<BoxProps, 'ref'> {
  children: ReactNode;
  direction?: 'vertical' | 'horizontal' | 'both';
  height?: string | number;
  maxHeight?: string | number;
  width?: string | number;
  maxWidth?: string | number;
  smooth?: boolean;
  hideScrollbar?: boolean;
  fadeEdges?: boolean;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  scrollPadding?: string | number;
  preserveScrollPosition?: boolean;
}

export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(({
  children,
  direction = 'vertical',
  height,
  maxHeight,
  width,
  maxWidth,
  smooth = true,
  hideScrollbar = false,
  fadeEdges = false,
  onScroll,
  scrollPadding,
  preserveScrollPosition = false,
  className = '',
  style,
  ...boxProps
}, ref) => {
  const scrollContainerClasses = [
    'scroll-container',
    `scroll-container--${direction}`,
    smooth && 'scroll-container--smooth',
    hideScrollbar && 'scroll-container--hide-scrollbar',
    fadeEdges && 'scroll-container--fade-edges',
    className
  ].filter(Boolean).join(' ');

  const scrollContainerStyle: CSSProperties = {
    height,
    maxHeight,
    width,
    maxWidth,
    ...style
  };

  if (scrollPadding) {
    scrollContainerStyle.scrollPadding = scrollPadding;
  }

  return (
    <Box
      ref={ref}
      className={scrollContainerClasses}
      style={scrollContainerStyle}
      onScroll={onScroll}
      data-preserve-scroll={preserveScrollPosition}
      {...boxProps}
    >
      {children}
    </Box>
  );
});

ScrollContainer.displayName = 'ScrollContainer';