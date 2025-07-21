/**
 * @file components/Input.tsx
 * @purpose Form input component - maps to HTML input element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [Checkbox, ContentInboxFeature, ContentInboxInputPanel, EditableField, InboxWorkflowDemo, Input, Radio]
 * @css /styles/components/forms.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', fullWidth, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'input',
          variant !== 'default' && `input--${variant}`,
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
