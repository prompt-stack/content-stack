/**
 * @layer primitive
 * @description Textarea component - maps to HTML textarea element
 * @dependencies None (primitive component)
 * @cssFile /styles/components/forms.css
 * @className .textarea
 * 
 * This is a PRIMITIVE component that wraps the HTML <textarea> element
 * with consistent styling.
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = 'default', fullWidth, autoResize, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'textarea',
          variant !== 'default' && `textarea--${variant}`,
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';