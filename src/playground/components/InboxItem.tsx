/**
 * @file playground/components/InboxItem.tsx
 * @purpose Individual inbox item card
 * @layer composed
 * @deps none
 * @used-by [InboxQueue]
 * @css /styles/features/inbox.css
 * @status stable
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import clsx from 'clsx'
import { formatFileSize, getTimeAgo } from '../utils/formatters'

interface InboxItemProps {
  item: {
    id: string
    filename: string
    type: string
    size: number
    status: 'pending' | 'processing' | 'complete' | 'failed'
    createdAt: string
    preview?: string
    suggestedTransforms?: string[]
    error?: string
    metadata?: Record<string, any>
  }
  isSelected: boolean
  onSelect: () => void
}

export function InboxItem({ item, isSelected, onSelect }: InboxItemProps) {
  const fileType = getFileType(item.type)
  
  return (
    <div
      className={clsx(
        'inbox-item',
        `inbox-item--${item.status}`,
        isSelected && 'inbox-item--selected'
      )}
      onClick={onSelect}
    >
      {/* Preview Area */}
      <div className="inbox-item__preview">
        {item.preview ? (
          <div className="inbox-item__preview-text">{item.preview}</div>
        ) : (
          <div className="inbox-item__preview-icon">{fileType.icon}</div>
        )}
        
        {item.status === 'processing' && (
          <div className="inbox-item__processing-overlay">
            <div className="inbox-item__processing-spinner" />
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="inbox-item__info">
        <div className="inbox-item__header">
          <span className="inbox-item__filename">{item.filename}</span>
          <span className={`badge badge--${fileType.color} badge--sm`}>
            {fileType.label}
          </span>
        </div>

        <div className="inbox-item__meta">
          <span>{formatFileSize(item.size)}</span>
          <span>•</span>
          <span>{getTimeAgo(item.createdAt)}</span>
          {item.metadata?.wordCount && (
            <>
              <span>•</span>
              <span>{item.metadata.wordCount} words</span>
            </>
          )}
          {item.metadata?.duration && (
            <>
              <span>•</span>
              <span>{item.metadata.duration}</span>
            </>
          )}
        </div>

        {item.error && (
          <div className="inbox-item__error">
            <span className="inbox-item__error-icon">⚠️</span>
            <span className="inbox-item__error-text">{item.error}</span>
          </div>
        )}

        {item.suggestedTransforms && item.suggestedTransforms.length > 0 && (
          <div className="inbox-item__actions">
            {item.suggestedTransforms.slice(0, 3).map((transform, index) => (
              <span
                key={index}
                className={clsx(
                  'inbox-item__action-chip',
                  index === 0 && 'inbox-item__action-chip--suggested'
                )}
              >
                {transform}
              </span>
            ))}
            {item.suggestedTransforms.length > 3 && (
              <span className="inbox-item__action-more">
                +{item.suggestedTransforms.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function getFileType(mimeType: string): { icon: string; label: string; color: string } {
  const typeMap: Record<string, { icon: string; label: string; color: string }> = {
    'text/markdown': { icon: '📝', label: 'MARKDOWN', color: 'blue' },
    'text/plain': { icon: '📄', label: 'TEXT', color: 'blue' },
    'text/csv': { icon: '📊', label: 'DATA', color: 'green' },
    'image/jpeg': { icon: '🖼️', label: 'IMAGE', color: 'yellow' },
    'image/png': { icon: '🖼️', label: 'IMAGE', color: 'yellow' },
    'audio/mp3': { icon: '🎵', label: 'AUDIO', color: 'red' },
    'audio/mpeg': { icon: '🎵', label: 'AUDIO', color: 'red' },
    'video/mp4': { icon: '🎥', label: 'VIDEO', color: 'red' },
    'application/pdf': { icon: '📑', label: 'PDF', color: 'glass' }
  }
  
  return typeMap[mimeType] || { icon: '📎', label: 'FILE', color: 'glass' }
}
