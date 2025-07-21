/**
 * @file components/Box.tsx
 * @purpose Layout box component - maps to HTML div element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [Card, ContentInboxFeature, ContentInboxInputPanel, ContentInboxQueuePanel, EditableField, InboxPage, InboxPlayground, InboxWorkflowDemo]
 * @css none(utilitiesonly)
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
  
  // Display (maps to your .d-* utilities)
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-flex' | 'none';
  
  // Flexbox (maps to your existing flex utilities)
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between';
  align?: 'start' | 'center' | 'end';
  
  // Spacing (maps to your .gap-*, .p-*, .m-* utilities)  
  gap?: 'sm' | 'md' | 'lg';
  padding?: '0' | '1' | '2' | '3' | '4' | '5';
  paddingX?: '0' | '1' | '2' | '3' | '4' | '5';
  paddingY?: '0' | '1' | '2' | '3' | '4' | '5';
  margin?: '0' | '1' | '2' | '3' | '4' | '5';
  marginX?: '0' | '1' | '2' | '3' | '4' | '5';
  marginY?: '0' | '1' | '2' | '3' | '4' | '5';
  
  // Background (maps to your .bg-* utilities)
  background?: 'primary' | 'secondary' | 'elevated' | 'glass' | 'transparent';
  
  // Border radius (maps to your .rounded-* utilities)
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  
  // Shadow (maps to your .shadow-* utilities)
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'glow';
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ 
    as: Component = 'div',
    display,
    direction,
    justify,
    align,
    gap,
    padding,
    paddingX,
    paddingY,
    margin,
    marginX,
    marginY,
    background,
    rounded,
    shadow,
    className,
    children,
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        data-cid="Box"
        className={clsx(
          // Display utilities (from your existing system)
          display && `d-${display}`,
          
          // Flexbox utilities (from your existing system)
          direction && `flex-${direction}`,
          justify && `justify-${justify}`,
          align && `align-${align}`,
          
          // Gap utilities (from your existing system)
          gap && `gap-${gap}`,
          
          // Padding utilities (from your existing system)
          padding && `p-${padding}`,
          paddingX && `px-${paddingX}`,
          paddingY && `py-${paddingY}`,
          
          // Margin utilities (from your existing system)
          margin && `m-${margin}`,
          marginX && `mx-${marginX}`,
          marginY && `my-${marginY}`,
          
          // Background utilities (from your existing system)
          background && `bg-${background}`,
          
          // Border radius utilities (from your existing system)
          rounded && `rounded-${rounded}`,
          
          // Shadow utilities (from your existing system)
          shadow && `shadow-${shadow}`,
          
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';
