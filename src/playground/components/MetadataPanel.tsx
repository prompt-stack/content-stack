/**
 * @file playground/components/MetadataPanel.tsx
 * @purpose Metadata inspector panel for inbox items
 * @layer composed
 * @deps none
 * @used-by none
 * @css /styles/features/inbox.css
 * @status stable
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { formatFileSize } from '../utils/formatters'

interface MetadataPanelProps {
  item: {
    id: string
    filename: string
    type: string
    size: number
    status: string
    createdAt: string
    metadata?: Record<string, any>
    suggestedTransforms?: string[]
  }
  onClose: () => void
  onProcess: () => void
}

export function MetadataPanel({ item, onClose, onProcess }: MetadataPanelProps) {
  return (
    <aside className="metadata-panel">
      <div className="metadata-panel__header">
        <h2 className="metadata-panel__title">Metadata Inspector</h2>
        <button 
          className="metadata-panel__close"
          onClick={onClose}
          aria-label="Close metadata panel"
        >
          ×
        </button>
      </div>

      <div className="metadata-panel__content">
        <div className="metadata-panel__section">
          <div className="metadata-panel__label">Selected File</div>
          <div className="metadata-panel__value">
            {item.filename}
          </div>
        </div>

        <div className="metadata-panel__section">
          <div className="metadata-panel__label">Source Info</div>
          <div className="metadata-panel__json">
{JSON.stringify({
  originalPath: `storage/inbox/queue/${item.filename}`,
  type: item.type,
  size: item.size,
  createdAt: item.createdAt,
  importedAt: new Date().toISOString(),
  importMethod: 'drag-drop'
}, null, 2)}
          </div>
        </div>

        {item.metadata && (
          <div className="metadata-panel__section">
            <div className="metadata-panel__label">Content Analysis</div>
            <div className="metadata-panel__json">
{JSON.stringify({
  ...item.metadata,
  suggestedTransforms: item.suggestedTransforms
}, null, 2)}
            </div>
          </div>
        )}

        <div className="metadata-panel__section">
          <div className="metadata-panel__label">Processing Status</div>
          <div className="metadata-panel__value">
            {item.status === 'pending' && 'Pending • Ready for processing'}
            {item.status === 'processing' && 'Processing • In progress...'}
            {item.status === 'complete' && 'Complete • Processed successfully'}
            {item.status === 'failed' && 'Failed • Check error details'}
          </div>
        </div>

        <div className="metadata-panel__section">
          <button 
            className="btn btn--primary"
            onClick={onProcess}
            disabled={item.status !== 'pending'}
            style={{ width: '100%' }}
          >
            Process with AI Agent
          </button>
        </div>
      </div>
    </aside>
  )
}
