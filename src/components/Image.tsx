/**
 * @file components/Image.tsx
 * @purpose Image component - maps to HTML img element
 * @layer primitive
 * @deps None (primitive component)
 * @used-by none
 * @css Usesglobalimagestyles
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
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
