/**
 * @file components/Textarea.tsx
 * @purpose Textarea component - maps to HTML textarea element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [ContentInboxInputPanel, Textarea]
 * @css /styles/components/forms.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Textarea.test.tsx
 * @test-status missing
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
