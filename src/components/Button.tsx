/**
 * @file components/Button.tsx
 * @purpose Core button component - maps directly to HTML button element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [App, Button, ButtonPlayground, CardPlayground, CompositionPlayground, ContentInboxFeature, ContentInboxInputPanel, ContentInboxQueuePanel, EditableField, FormPlayground, Header, InboxPlayground, InboxWorkflowDemo, ModalPlayground, PlaygroundPage, SubscriptionPage, UtilityPlayground]
 * @cssFile /styles/components/button.css
 * @status stable
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 100
 * @test-file Button.test.tsx
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
