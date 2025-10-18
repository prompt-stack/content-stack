/**
 * @file components/Card.tsx
 * @purpose Component for Card
 * @layer composed
 * @deps none
 * @used-by [App, CardPlayground, CompositionPlayground, ContentInboxInputPanel, ContentInboxQueuePanel, HealthPage, InboxPlayground, InboxWorkflowDemo, LayoutPlayground, PlaygroundHome, PlaygroundPage, SubscriptionPage, UtilityPlayground]
 * @cssFile /styles/components/card.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Card.test.tsx
 * @test-status missing
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Box } from './Box';
import type { BoxProps } from './Box';

interface CardProps extends Omit<BoxProps, 'className'> {
  children: ReactNode;
  selected?: boolean;
  interactive?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    selected, 
    interactive, 
    variant = 'default', 
    className,
    // Default utility props
    padding = '4',
    rounded = 'md',
    shadow = variant === 'elevated' ? 'md' : undefined,
    ...boxProps 
  }, ref) => {
    return (
      <Box 
        ref={ref}
        className={clsx(
          'card',
          `card--${variant}`,
          selected && 'card--selected',
          interactive && 'card--interactive',
          className
        )}
        data-selected={selected}
        padding={padding}
        rounded={rounded}
        shadow={shadow}
        {...boxProps}
      >
        {children}
      </Box>
    );
  }
);

Card.displayName = 'Card';
