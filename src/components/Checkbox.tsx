/**
 * @file components/Checkbox.tsx
 * @purpose Checkbox component - maps to HTML input[type="checkbox"] element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [ContentInboxQueuePanel]
 * @css /styles/components/forms.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Checkbox.test.tsx
 * @test-status missing
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className, ...props }, ref) => {
    return (
      <label className={clsx('checkbox', className)}>
        <input
          ref={(el) => {
            if (typeof ref === 'function') ref(el);
            else if (ref) ref.current = el;
            if (el) el.indeterminate = indeterminate ?? false;
          }}
          type="checkbox"
          className="checkbox__input"
          {...props}
        />
        {label && <span className="checkbox__label">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
