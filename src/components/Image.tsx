/**
 * @layer primitive
 * @description Image component - maps to HTML img element
 * @dependencies None (primitive component)
 * @cssFile Uses global image styles
 * @className Inherits from global styles
 * 
 * This is a PRIMITIVE component that wraps the HTML <img> element with
 * consistent behavior and optional lazy loading support.
 */

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | '21/9';
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ fallback, aspectRatio, className, alt = '', ...props }, ref) => {
    return (
      <img
        ref={ref}
        alt={alt}
        className={clsx(
          aspectRatio && `aspect-${aspectRatio.replace('/', '-')}`,
          className
        )}
        onError={(e) => {
          if (fallback && e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          }
        }}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';