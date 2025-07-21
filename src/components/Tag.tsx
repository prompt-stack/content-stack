/**
 * @layer primitive
 * @cssFile /styles/components/tag.css
 * @dependencies None (primitive component)
 * @utilities None
 * @variants ["default", "primary", "success", "warning", "danger"]
 * @className .tag
 */
import { clsx } from 'clsx';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function Tag({ 
  children, 
  variant = 'default', 
  size = 'sm',
  onRemove,
  onClick,
  className 
}: TagProps) {
  return (
    <span 
      className={clsx(
        'tag',
        `tag--${variant}`,
        `tag--${size}`,
        onClick && 'tag--clickable',
        className
      )}
      onClick={onClick}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="tag__remove"
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </span>
  );
}