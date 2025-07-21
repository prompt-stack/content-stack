/**
 * @component InboxHeader
 * @layer composed
 * @description Header with breadcrumb navigation and actions
 * @cssFile /styles/features/inbox.css
 * @status stable
 * @since 2025-07-20
 */

interface InboxHeaderProps {
  currentPath: string
  onAddContent: () => void
  onProcessAll: () => void
}

export function InboxHeader({ currentPath, onAddContent, onProcessAll }: InboxHeaderProps) {
  const pathParts = currentPath.split('/')
  
  return (
    <header className="inbox-header">
      <div className="inbox-header__breadcrumb">
        <span className="inbox-header__breadcrumb-item">storage</span>
        {pathParts.map((part, index) => (
          <span key={index} className="inbox-header__breadcrumb-group">
            <span className="inbox-header__breadcrumb-separator">/</span>
            <span className={`inbox-header__breadcrumb-item ${
              index === pathParts.length - 1 ? 'inbox-header__breadcrumb-item--current' : ''
            }`}>
              {part}
            </span>
          </span>
        ))}
      </div>
      
      <div className="inbox-header__actions">
        <button className="btn btn--secondary btn--sm">
          <span>🔍</span>
          Search
        </button>
        <button className="btn btn--secondary btn--sm" onClick={onProcessAll}>
          <span>⚡</span>
          Process All
        </button>
        <button className="btn btn--primary btn--sm" onClick={onAddContent}>
          <span>➕</span>
          Add Content
        </button>
      </div>
    </header>
  )
}