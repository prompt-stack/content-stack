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
