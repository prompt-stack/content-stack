/**
 * @layer primitive
 * @description Core button component - maps directly to HTML button element
 * @dependencies None (primitive component)
 * @cssFile /styles/components/button.css
 * @className .btn
 * @variants ["primary", "secondary", "danger"]
 * @sizes ["xs", "sm", "md", "lg", "xl"]
 * @states ["loading", "disabled"]
 * @status stable
 * @since 2025-07-19
 * @a11y aria-label required for icon-only buttons, aria-busy when loading
 * @performance Debounce onClick for heavy operations
 * 
 * This is a PRIMITIVE component - it has zero dependencies on other custom components
 * and maps 1:1 to the HTML <button> element with styling and variants.
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'xs' | 'small' | 'medium' | 'large';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading, iconLeft, iconRight, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'btn',
          `btn--${variant}`,
          size !== 'medium' && `btn--${size}`,
          loading && 'is-loading',
          className
        )}
        disabled={loading || props.disabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <span className="sr-only">Loading</span>}
        {!loading && iconLeft && <span className="btn__icon-left">{iconLeft}</span>}
        {children}
        {!loading && iconRight && <span className="btn__icon-right">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
