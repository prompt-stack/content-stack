/**
 * @layer primitive
 * @description Typography component - maps to HTML text elements (p, span, h1-h6)
 * @dependencies None (primitive component)
 * @cssFile Uses global typography styles
 * @className Varies by element
 * 
 * This is a PRIMITIVE component for consistent typography. It wraps various HTML text
 * elements and ensures consistent styling through our design tokens.
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

type TextElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextVariant = 'primary' | 'secondary' | 'tertiary' | 'inverse';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;
  variant?: TextVariant;
  size?: TextSize;
  weight?: 'normal' | 'medium' | 'bold';
  children: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ as: Component = 'p', variant = 'primary', size, weight, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={clsx(
          variant && `text-${variant}`,
          size && `text-${size}`,
          weight === 'bold' && 'font-bold',
          weight === 'medium' && 'font-medium',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';