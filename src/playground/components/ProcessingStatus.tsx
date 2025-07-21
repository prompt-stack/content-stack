/**
 * @component ProcessingStatus
 * @layer composed
 * @description Visual indicator for processing states
 * @cssFile /styles/features/inbox.css
 * @status stable
 * @since 2025-07-20
 */

import clsx from 'clsx'

interface ProcessingStatusProps {
  status: 'pending' | 'processing' | 'complete' | 'failed'
  size?: 'sm' | 'md' | 'lg'
}

export function ProcessingStatus({ status, size = 'md' }: ProcessingStatusProps) {
  const statusConfig = {
    pending: {
      icon: '⏳',
      label: 'Pending',
      color: 'blue'
    },
    processing: {
      icon: '⚡',
      label: 'Processing',
      color: 'yellow'
    },
    complete: {
      icon: '✅',
      label: 'Complete',
      color: 'green'
    },
    failed: {
      icon: '❌',
      label: 'Failed',
      color: 'red'
    }
  }

  const config = statusConfig[status]

  return (
    <div className={clsx(
      'processing-status',
      `processing-status--${status}`,
      `processing-status--${size}`
    )}>
      <span className="processing-status__icon">{config.icon}</span>
      <span className="processing-status__label">{config.label}</span>
      {status === 'processing' && (
        <span className="processing-status__spinner" />
      )}
    </div>
  )
}