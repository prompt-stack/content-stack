/**
 * @file components/Link.tsx
 * @purpose Component for Link
 * @layer primitive
 * @deps none
 * @used-by [App, Header, MobileMenu, PlaygroundPage]
 * @cssFile none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Link.test.tsx
 * @test-status missing
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
