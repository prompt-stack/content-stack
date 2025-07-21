/**
 * @component InboxQueue
 * @layer composed
 * @description Queue list view for inbox items
 * @cssFile /styles/features/inbox.css
 * @status stable
 * @since 2025-07-20
 */

import { InboxItem } from './InboxItem'

interface InboxQueueProps {
  items: Array<{
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
  }>
  onItemSelect: (item: any) => void
}

export function InboxQueue({ items, onItemSelect }: InboxQueueProps) {
  if (items.length === 0) {
    return (
      <div className="inbox-queue inbox-queue--empty">
        <div className="inbox-queue__empty-icon">📭</div>
        <div className="inbox-queue__empty-text">No items in queue</div>
        <div className="inbox-queue__empty-hint">
          Drag and drop files here or click "Add Content" to get started
        </div>
      </div>
    )
  }

  return (
    <div className="inbox-queue">
      <div className="inbox-queue__header">
        <h3 className="inbox-queue__title">Queue ({items.length} items)</h3>
        <div className="inbox-queue__actions">
          <button className="btn btn--secondary btn--xs">Sort by date</button>
          <button className="btn btn--secondary btn--xs">Filter</button>
        </div>
      </div>
      
      <div className="inbox-queue__list">
        {items.map(item => (
          <InboxItem
            key={item.id}
            item={item}
            isSelected={false}
            onSelect={() => onItemSelect(item)}
          />
        ))}
      </div>
    </div>
  )
}