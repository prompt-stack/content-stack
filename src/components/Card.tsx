/**
 * @layer composed
 * @description Container component with styled card appearance
 * @dependencies Box primitive
 * @cssFile /styles/components/card.css
 * @utilities spacing (via Box), shadow (via Box)
 * @variants ["default", "elevated", "outlined", "glass"]
 * @className .card
 * 
 * This is a COMPOSED component that provides a styled container with variants.
 * It uses Box primitive for utility props (spacing, shadow) while maintaining
 * its own CSS file for card-specific styling (variants, hover effects).
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