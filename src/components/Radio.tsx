/**
 * @file components/Radio.tsx
 * @purpose Radio button component - maps to HTML input[type="radio"] element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by none
 * @cssFile /styles/components/forms.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Radio.test.tsx
 * @test-status missing
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
