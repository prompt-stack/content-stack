import { ReactNode } from 'react';

/**
 * @layer primitive
 * @cssFile /styles/components/badge.css
 * @dependencies None
 * @className .badge
 */

export interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'plasma';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: BadgeProps) {
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
}