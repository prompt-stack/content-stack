/**
 * @file playground/components/InboxSidebar.tsx
 * @purpose Sidebar navigation for inbox folders
 * @layer composed
 * @deps none
 * @used-by none
 * @css /styles/features/inbox.css
 * @status stable
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState } from 'react'
import clsx from 'clsx'

interface Folder {
  name: string
  icon: string
  count: number
  status?: 'processing' | 'error'
  children?: Folder[]
}

interface InboxSidebarProps {
  folders: Folder[]
  selectedFolder: string
  onFolderSelect: (path: string) => void
}

export function InboxSidebar({ folders, selectedFolder, onFolderSelect }: InboxSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['inbox'])

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    )
  }

  const renderFolder = (folder: Folder, path: string = '', level: number = 0) => {
    const currentPath = path ? `${path}/${folder.name}` : folder.name
    const isExpanded = expandedFolders.includes(folder.name)
    const isSelected = selectedFolder === currentPath
    const hasChildren = folder.children && folder.children.length > 0

    return (
      <div key={currentPath} className="inbox-sidebar__folder-group">
        <div
          className={clsx(
            'inbox-sidebar__folder',
            isSelected && 'inbox-sidebar__folder--active'
          )}
          style={{ paddingLeft: `${20 + level * 20}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleFolder(folder.name)
            }
            onFolderSelect(currentPath)
          }}
        >
          <span className="inbox-sidebar__folder-icon">{folder.icon}</span>
          <span className="inbox-sidebar__folder-name">{folder.name}</span>
          <span className="inbox-sidebar__folder-count">{folder.count}</span>
          {folder.status && (
            <span className={clsx(
              'inbox-sidebar__folder-status',
              `inbox-sidebar__folder-status--${folder.status}`
            )} />
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="inbox-sidebar__children">
            {folder.children!.map(child => renderFolder(child, currentPath, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="inbox-sidebar">
      <div className="inbox-sidebar__header">
        <div className="inbox-sidebar__title">WORKSPACE</div>
        <div className="inbox-sidebar__path">~/prompt-stack</div>
      </div>
      
      <div className="inbox-sidebar__folders">
        {folders.map(folder => renderFolder(folder))}
        
        <div className="inbox-sidebar__section">
          <div className="inbox-sidebar__folder">
            <span className="inbox-sidebar__folder-icon">🤖</span>
            <span className="inbox-sidebar__folder-name">.allowed-agents</span>
            <span className="inbox-sidebar__folder-status inbox-sidebar__folder-status--active">
              Active
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
