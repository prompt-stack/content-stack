/**
 * @file components/Badge.tsx
 * @purpose Component for Badge
 * @layer primitive
 * @deps None
 * @used-by [InboxWorkflowDemo]
 * @css /styles/components/badge.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 * @test-coverage 80
 * @test-file Badge.test.tsx
 * @test-status exists
 */

import { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'plasma';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'gray',
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
