# Inbox Page Implementation Guide

## Overview
The Inbox page is the primary content ingestion interface for Content Stack. It handles file uploads, URL extraction, and text pasting with a modern, responsive design that adapts to different screen sizes and input methods.

## Page Architecture

### Component Hierarchy
```
InboxPage
├── InboxHeader
│   ├── Title & Description
│   └── ViewControls (grid/list toggle, filters)
├── InboxInput
│   ├── URLExtractor
│   ├── FileDropzone
│   └── QuickActions (browse, paste)
├── InboxContent
│   ├── InboxStats
│   ├── InboxFilters
│   └── InboxGrid/InboxList
│       └── InboxItem (repeated)
└── Modals
    ├── PasteModal
    └── ItemDetailModal
```

## Core Components

### 1. InboxPage Component
```tsx
// pages/Inbox.tsx
import { useState, useCallback, useEffect } from 'react';
import { useInbox } from '@/hooks/useInbox';
import { InboxHeader } from '@/components/inbox/InboxHeader';
import { InboxInput } from '@/components/inbox/InboxInput';
import { InboxContent } from '@/components/inbox/InboxContent';
import { PasteModal } from '@/components/inbox/PasteModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDropzone } from '@/hooks/useDropzone';
import type { ViewMode, FilterOptions } from '@/types';

export function InboxPage() {
  const { items, isLoading, addItem, deleteItem, selectedItems, toggleSelect } = useInbox();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    source: 'all',
    dateRange: 'all'
  });
  const [showPasteModal, setShowPasteModal] = useState(false);

  // Global dropzone for drag-and-drop anywhere
  const { isDragging } = useDropzone({
    onDrop: (files) => {
      files.forEach(file => addItem({ type: 'file', file }));
    }
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+v': () => setShowPasteModal(true),
    'cmd+a': () => toggleSelect('all'),
    'delete': () => deleteSelected(),
  });

  // Paste event handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Let input fields handle their own paste
      }
      
      e.preventDefault();
      const text = e.clipboardData?.getData('text');
      const files = Array.from(e.clipboardData?.files || []);
      
      if (files.length > 0) {
        files.forEach(file => addItem({ type: 'file', file }));
      } else if (text) {
        setShowPasteModal(true);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [addItem]);

  const filteredItems = useFilteredItems(items, filters);

  return (
    <div className={`inbox-page ${isDragging ? 'inbox-page--dragging' : ''}`}>
      <InboxHeader 
        itemCount={filteredItems.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <InboxInput 
        onAddItem={addItem}
        onOpenPaste={() => setShowPasteModal(true)}
      />

      <InboxContent
        items={filteredItems}
        viewMode={viewMode}
        selectedItems={selectedItems}
        onToggleSelect={toggleSelect}
        onDeleteItem={deleteItem}
        isLoading={isLoading}
      />

      <PasteModal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onSave={(content) => {
          addItem({ type: 'paste', content });
          setShowPasteModal(false);
        }}
      />

      {isDragging && (
        <div className="inbox-drop-overlay">
          <div className="inbox-drop-message">
            <i className="fas fa-cloud-upload-alt" />
            <p>Drop files to add to inbox</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. InboxInput Component
```tsx
// components/inbox/InboxInput.tsx
import { useState } from 'react';
import { URLExtractor } from './URLExtractor';
import { FileDropzone } from './FileDropzone';
import { Button } from '@/components/Button';
import type { AddItemPayload } from '@/types';

interface InboxInputProps {
  onAddItem: (payload: AddItemPayload) => void;
  onOpenPaste: () => void;
}

export function InboxInput({ onAddItem, onOpenPaste }: InboxInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = ACCEPTED_FILE_TYPES.join(',');
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      files.forEach(file => onAddItem({ type: 'file', file }));
    };
    input.click();
  };

  return (
    <section className="inbox-input">
      <div className="inbox-input-header">
        <h2>Add Content</h2>
        <p className="text-secondary">
          Drag files anywhere, paste with Ctrl+V, or enter a URL
        </p>
      </div>

      <URLExtractor 
        onExtract={(url) => onAddItem({ type: 'url', url })}
        disabled={false} // Check tier for URL extraction
      />

      <FileDropzone 
        onDrop={(files) => {
          files.forEach(file => onAddItem({ type: 'file', file }));
        }}
        isCompact={!isExpanded}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
      />

      <div className="inbox-input-actions">
        <Button 
          icon="folder-open" 
          variant="secondary"
          onClick={handleFileSelect}
        >
          Browse Files
        </Button>
        <Button 
          icon="clipboard" 
          variant="secondary"
          onClick={onOpenPaste}
        >
          Paste Content
        </Button>
        <Button 
          icon="bolt" 
          variant="secondary"
          disabled
          title="Quick capture coming soon"
        >
          Quick Capture
        </Button>
      </div>

      <div className="inbox-input-tips">
        <p className="text-xs text-tertiary">
          <strong>Pro tip:</strong> You can paste images directly from your clipboard
        </p>
      </div>
    </section>
  );
}
```

### 3. InboxItem Component
```tsx
// components/inbox/InboxItem.tsx
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { Dropdown } from '@/components/Dropdown';
import { formatFileSize, formatRelativeTime } from '@/utils/format';
import type { ContentItem } from '@/types';

interface InboxItemProps {
  item: ContentItem;
  isSelected: boolean;
  viewMode: 'grid' | 'list';
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (item: ContentItem) => void;
}

export function InboxItem({ 
  item, 
  isSelected, 
  viewMode,
  onToggleSelect, 
  onDelete,
  onView 
}: InboxItemProps) {
  const [showPreview, setShowPreview] = useState(false);

  const statusColors = {
    raw: 'text-blue-500',
    processing: 'text-yellow-500',
    processed: 'text-green-500',
    error: 'text-red-500'
  };

  const sourceIcons = {
    youtube: 'fab fa-youtube',
    tiktok: 'fab fa-tiktok',
    reddit: 'fab fa-reddit',
    article: 'fas fa-newspaper',
    'file-upload': 'fas fa-file',
    paste: 'fas fa-clipboard'
  };

  if (viewMode === 'list') {
    return (
      <div className="inbox-item-list">
        <Checkbox 
          checked={isSelected}
          onChange={() => onToggleSelect(item.id)}
        />
        
        <div className="inbox-item-icon">
          <i className={sourceIcons[item.source]} />
        </div>

        <div className="inbox-item-content">
          <h4 className="inbox-item-title">{item.title}</h4>
          <div className="inbox-item-meta">
            <span className={`inbox-item-status ${statusColors[item.status]}`}>
              {item.status}
            </span>
            <span className="text-secondary">•</span>
            <span className="text-secondary">
              {formatRelativeTime(item.metadata.created_at)}
            </span>
            {item.metadata.size && (
              <>
                <span className="text-secondary">•</span>
                <span className="text-secondary">
                  {formatFileSize(item.metadata.size)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="inbox-item-actions">
          <Button 
            size="small" 
            variant="secondary"
            onClick={() => onView(item)}
          >
            View
          </Button>
          <Dropdown>
            <Dropdown.Item onClick={() => processItem(item.id)}>
              Process Now
            </Dropdown.Item>
            <Dropdown.Item onClick={() => downloadItem(item.id)}>
              Download
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item onClick={() => onDelete(item.id)} variant="danger">
              Delete
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <Card 
      className="inbox-item"
      selected={isSelected}
      onClick={() => setShowPreview(true)}
    >
      <div className="inbox-item-header">
        <Checkbox 
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(item.id);
          }}
        />
        <Dropdown>
          <Dropdown.Item onClick={() => onView(item)}>View</Dropdown.Item>
          <Dropdown.Item onClick={() => onDelete(item.id)}>Delete</Dropdown.Item>
        </Dropdown>
      </div>

      <div className="inbox-item-icon-large">
        <i className={sourceIcons[item.source]} />
      </div>

      <h4 className="inbox-item-title">{item.title}</h4>
      
      {item.enrichment?.summary && (
        <p className="inbox-item-summary">{item.enrichment.summary}</p>
      )}

      <div className="inbox-item-footer">
        <span className={`badge ${statusColors[item.status]}`}>
          {item.status}
        </span>
        <span className="text-xs text-secondary">
          {formatRelativeTime(item.metadata.created_at)}
        </span>
      </div>
    </Card>
  );
}
```

## State Management

### useInbox Hook
```tsx
// hooks/useInbox.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import type { ContentItem, AddItemPayload } from '@/types';

export function useInbox() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Fetch inbox items
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['inbox'],
    queryFn: api.getInboxItems,
    refetchInterval: 30000, // Refresh every 30s
  });

  // Add item mutation
  const addMutation = useMutation({
    mutationFn: async (payload: AddItemPayload) => {
      switch (payload.type) {
        case 'file':
          const formData = new FormData();
          formData.append('file', payload.file);
          return api.uploadFile(formData);
        
        case 'url':
          return api.extractURL(payload.url);
        
        case 'paste':
          return api.addTextContent(payload.content);
        
        default:
          throw new Error('Invalid payload type');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      showToast('Content added to inbox', 'success');
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: api.deleteInboxItem,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['inbox'], (old: ContentItem[]) => 
        old.filter(item => item.id !== deletedId)
      );
      setSelectedItems(prev => {
        const next = new Set(prev);
        next.delete(deletedId);
        return next;
      });
      showToast('Item deleted', 'success');
    },
  });

  // Bulk operations
  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => api.deleteInboxItem(id)));
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      setSelectedItems(new Set());
      showToast(`${ids.length} items deleted`, 'success');
    } catch (error) {
      showToast('Failed to delete some items', 'error');
    }
  }, []);

  // Selection management
  const toggleSelect = useCallback((id: string | 'all' | 'none') => {
    if (id === 'all') {
      setSelectedItems(new Set(items.map(item => item.id)));
    } else if (id === 'none') {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }
  }, [items]);

  return {
    items,
    isLoading,
    error,
    selectedItems,
    addItem: addMutation.mutate,
    deleteItem: deleteMutation.mutate,
    bulkDelete,
    toggleSelect,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
```

## CSS Architecture

### Inbox-Specific Styles
```css
/* styles/pages/inbox.css */
@layer pages {
  .inbox-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-6);
    
    &.inbox-page--dragging {
      position: relative;
      
      &::after {
        content: '';
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
      }
    }
  }

  /* Input Section */
  .inbox-input {
    background: var(--surface-elevated);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    border: 1px solid var(--border-default);
  }

  .inbox-input-header {
    margin-bottom: var(--space-4);
    
    h2 {
      margin: 0 0 var(--space-2) 0;
    }
  }

  .inbox-input-actions {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-4);
    
    @container (max-width: 600px) {
      flex-wrap: wrap;
      
      button {
        flex: 1;
        min-width: 150px;
      }
    }
  }

  /* Content Grid */
  .inbox-content {
    container-type: inline-size;
  }

  .inbox-grid {
    display: grid;
    gap: var(--space-4);
    
    &.inbox-grid--grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      
      @container (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    
    &.inbox-grid--list {
      grid-template-columns: 1fr;
    }
  }

  /* Item Styles */
  .inbox-item {
    position: relative;
    padding: var(--space-4);
    transition: all var(--duration-fast) var(--ease-out);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }

  .inbox-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .inbox-item-icon-large {
    font-size: 2rem;
    color: var(--text-secondary);
    margin-bottom: var(--space-3);
    
    .fa-youtube { color: #ff0000; }
    .fa-tiktok { color: #000000; }
    .fa-reddit { color: #ff4500; }
  }

  .inbox-item-title {
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    margin: 0 0 var(--space-2) 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .inbox-item-summary {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin: 0 0 var(--space-3) 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .inbox-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* List View */
  .inbox-item-list {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    gap: var(--space-3);
    align-items: center;
    padding: var(--space-3);
    background: var(--surface-base);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    transition: all var(--duration-fast) var(--ease-out);
    
    &:hover {
      background: var(--surface-elevated);
      border-color: var(--border-hover);
    }
  }

  /* Drop Overlay */
  .inbox-drop-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 101;
    pointer-events: none;
  }

  .inbox-drop-message {
    background: var(--surface-elevated);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    text-align: center;
    box-shadow: var(--shadow-xl);
    
    i {
      font-size: 3rem;
      color: var(--primary);
      margin-bottom: var(--space-4);
    }
    
    p {
      font-size: var(--text-lg);
      font-weight: var(--font-medium);
      margin: 0;
    }
  }
}
```

## Features Implementation

### 1. Drag & Drop
- Global dropzone that works anywhere on the page
- Visual feedback with overlay
- Support for multiple files
- File type validation

### 2. URL Extraction
- Real-time URL validation
- Platform detection (YouTube, TikTok, etc.)
- Loading states during extraction
- Error handling with retry

### 3. Paste Handling
- Global paste listener
- Smart detection (URL vs text vs file)
- Paste modal for text content
- Image paste from clipboard

### 4. Keyboard Shortcuts
- Cmd/Ctrl + V: Open paste modal
- Cmd/Ctrl + A: Select all items
- Delete: Delete selected items
- Escape: Clear selection

### 5. Filtering & Search
- Filter by status (raw, processed, error)
- Filter by source (youtube, tiktok, etc.)
- Date range filters
- Full-text search across titles and content

### 6. Bulk Operations
- Select multiple items
- Bulk delete
- Bulk process
- Export selected

## Performance Optimizations

### 1. Virtual Scrolling
For large lists, implement virtual scrolling:
```tsx
import { VirtualList } from '@tanstack/react-virtual';

// Use for > 100 items
```

### 2. Optimistic Updates
```tsx
// Immediate UI update before server response
onMutate: async (newItem) => {
  await queryClient.cancelQueries(['inbox']);
  const previousItems = queryClient.getQueryData(['inbox']);
  
  queryClient.setQueryData(['inbox'], old => [...old, optimisticItem]);
  
  return { previousItems };
},
```

### 3. Image Lazy Loading
```tsx
// Use Intersection Observer for item thumbnails
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1
});
```

## Accessibility

### 1. Keyboard Navigation
- Tab through all interactive elements
- Arrow keys for grid navigation
- Enter to open item details
- Space to toggle selection

### 2. Screen Reader Support
- Proper ARIA labels
- Live regions for status updates
- Descriptive button text
- Form field associations

### 3. Focus Management
- Focus trap in modals
- Focus restoration after modal close
- Visual focus indicators
- Skip links for navigation

## Error Handling

### 1. Upload Errors
```tsx
const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File exceeds 10MB limit',
  INVALID_TYPE: 'File type not supported',
  NETWORK_ERROR: 'Upload failed. Please try again.',
  QUOTA_EXCEEDED: 'Storage limit reached'
};
```

### 2. Retry Logic
```tsx
// Automatic retry for network errors
retry: 3,
retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
```

### 3. Graceful Degradation
- Offline mode with queue
- Partial feature availability
- Clear error messages
- Recovery suggestions

## Testing Considerations

### 1. Component Tests
- File upload scenarios
- URL extraction validation
- Keyboard shortcut handling
- Filter/search functionality

### 2. Integration Tests
- Full upload flow
- Bulk operations
- Error scenarios
- Performance with large datasets

### 3. E2E Tests
- User journey from upload to processing
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

## Future Enhancements

1. **Advanced Features**
   - Duplicate detection
   - Auto-tagging
   - Smart suggestions
   - Batch processing queue

2. **UI Improvements**
   - Customizable views
   - Saved filter presets
   - Keyboard-first navigation
   - Dark mode optimization

3. **Performance**
   - WebWorker for processing
   - Progressive enhancement
   - Offline-first architecture
   - Real-time sync

This implementation provides a robust, accessible, and performant inbox interface that scales from mobile to desktop while maintaining excellent user experience.