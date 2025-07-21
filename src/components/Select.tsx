/**
 * @layer primitive
 * @description Select dropdown component - maps to HTML select element
 * @dependencies None (primitive component)
 * @cssFile /styles/components/forms.css
 * @className .select
 * 
 * This is a PRIMITIVE component that wraps the native HTML <select> element
 * with consistent styling. For custom dropdowns, use the Dropdown composed component.
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