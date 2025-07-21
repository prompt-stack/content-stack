/**
 * @layer primitive
 * @description Checkbox component - maps to HTML input[type="checkbox"] element
 * @dependencies None (primitive component)
 * @cssFile /styles/components/forms.css
 * @className .checkbox
 * 
 * This is a PRIMITIVE component that wraps the HTML checkbox input with
 * consistent styling and optional label integration.
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