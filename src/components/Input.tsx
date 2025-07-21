/**
 * @layer primitive
 * @description Form input component - maps to HTML input element
 * @dependencies None (primitive component)
 * @cssFile /styles/components/forms.css
 * @className .input
 * 
 * This is a PRIMITIVE component that wraps the HTML <input> element with consistent
 * styling and variants. It serves as the base for more complex form components.
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