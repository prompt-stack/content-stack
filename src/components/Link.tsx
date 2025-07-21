/**
 * @layer primitive
 * @description Anchor/link component - maps to HTML anchor element
 * @dependencies None (primitive component)
 * @cssFile Uses global link styles
 * @className Inherits from global styles
 * 
 * This is a PRIMITIVE component that wraps the HTML <a> element with consistent
 * styling and behavior. Direct mapping to native HTML anchor element.
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { AnchorHTMLAttributes } from 'react';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'primary' | 'secondary';
  external?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = 'default', external, className, children, ...props }, ref) => {
    const externalProps = external ? {
      target: '_blank',
      rel: 'noopener noreferrer'
    } : {};

    return (
      <a
        ref={ref}
        className={clsx(
          variant !== 'default' && `link--${variant}`,
          className
        )}
        {...externalProps}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';