/**
 * @file components/Label.tsx
 * @purpose Form label component - maps to HTML label element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by [Label]
 * @css /styles/components/forms.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx('label', className)}
        {...props}
      >
        {children}
        {required && <span className="text-error ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
