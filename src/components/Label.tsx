/**
 * @layer primitive
 * @description Form label component - maps to HTML label element
 * @dependencies None (primitive component)
 * @cssFile /styles/components/forms.css
 * @className .label
 * 
 * This is a PRIMITIVE component that wraps the HTML <label> element for
 * consistent form labeling with proper accessibility.
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