/**
 * @file components/Text.tsx
 * @purpose Typography component - maps to HTML text elements (p, span, h1-h6)
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [ContentInboxFeature, ContentInboxInputPanel, ContentInboxQueuePanel, EditableField, InboxPlayground, InboxWorkflowDemo, Textarea]
 * @css Usesglobaltypographystyles
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Text.test.tsx
 * @test-status missing
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
  color?: 'primary' | 'secondary' | 'muted' | 'inverse';
  marginY?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  transform?: 'capitalize' | 'uppercase' | 'lowercase';
  children: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ 
    as: Component = 'p', 
    variant = 'primary', 
    size, 
    weight, 
    color,
    marginY,
    marginTop,
    marginBottom,
    transform,
    className, 
    children, 
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={clsx(
          variant && `text-${variant}`,
          size && `text-${size}`,
          weight === 'bold' && 'font-bold',
          weight === 'medium' && 'font-medium',
          color && `text-${color}`,
          transform && `text-${transform}`,
          className
        )}
        style={{
          marginTop: marginY || marginTop,
          marginBottom: marginY || marginBottom,
          ...props.style
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';
