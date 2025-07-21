/**
 * @file playground/components/ProcessingStatus.tsx
 * @purpose Visual indicator for processing states
 * @layer composed
 * @deps none
 * @used-by none
 * @css /styles/features/inbox.css
 * @status stable
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
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
