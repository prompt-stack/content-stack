/**
 * @file components/Select.tsx
 * @purpose Select dropdown component - maps to HTML select element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [Select]
 * @css /styles/components/forms.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Select.test.tsx
 * @test-status missing
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = 'default', fullWidth, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          'select',
          variant !== 'default' && `select--${variant}`,
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
