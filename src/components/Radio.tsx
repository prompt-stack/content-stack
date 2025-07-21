/**
 * @layer primitive
 * @description Radio button component - maps to HTML input[type="radio"] element
 * @dependencies None (primitive component)
 * @cssFile /styles/components/forms.css
 * @className .radio
 * 
 * This is a PRIMITIVE component that wraps the HTML radio input with
 * consistent styling. Use RadioGroup composed component for grouped radios.
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={clsx('radio-wrapper', className)}>
        <input
          ref={ref}
          type="radio"
          className="radio"
          {...props}
        />
        {label && <span className="radio__label">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';