/**
 * @file features/content-inbox/components/ContentInboxQueuePanel.tsx
 * @purpose [TODO: Add purpose]
 * @layer feature
 * @deps [ContentInboxTagEditor]
 * @used-by [ContentInboxFeature]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, useMemo, useEffect, useRef, memo, useCallback } from 'react';
import { getPreviewLength, getMaxVisibleTags, contentInboxConfig } from '../config';
import { Box } from '@/components/Box';
import { Card } from '@/components/Card';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Modal } from '@/components/Modal';
import { EditableText } from '@/components/EditableText';
import { ScrollContainer } from '@/components/ScrollContainer';
import { VirtualList } from '@/components/VirtualList';
import { ContentInboxTagEditor } from './ContentInboxTagEditor';
import { ContentItem } from '../types';
import { useModalFormReducer } from '../hooks/useModalFormReducer';
import { useScrollPosition } from '@/hooks/useScrollPosition';

interface ContentInboxQueuePanelProps {
  items: ContentItem[];
  onUpdate: (id: string, updates: Partial<ContentItem>) => void;
  onRemove: (id: string) => void;
  onBulkRemove?: (ids: string[]) => void;
  onBulkUpdate?: (ids: string[], updates: Partial<ContentItem>) => void;
  onExport?: (items: ContentItem[], format: 'json' | 'csv' | 'markdown') => void;
  onRefresh?: () => Promise<void>;
  onSyncCheck?: () => Promise<{ totalItems: number; serverItems: ContentItem[] }>;
}

type SortOption = 'newest' | 'oldest' | 'title';

function ContentInboxQueuePanelComponent({ items, onUpdate, onRemove, onBulkRemove, onExport, onRefresh, onSyncCheck }: ContentInboxQueuePanelProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const modalCategoryDropdownRef = useRef<HTMLDivElement>(null);
  const virtualListRef = useRef<any>(null);
  
  // Categories from configuration
  const availableCategories = Object.keys(contentInboxConfig.categories);
  
  // Scroll position persistence
  const { setScrollElement, scrollToTop } = useScrollPosition({
    storageKey: 'content-inbox-scroll-position',
    restoreOnMount: true
  });
  
  // Modal form state with reducer
  const { state: modalState, actions: modalActions } = useModalFormReducer();
  
  const [syncStatus, setSyncStatus] = useState<'synced' | 'checking' | 'out-of-sync'>('synced');
  const [lastSyncCheck, setLastSyncCheck] = useState<Date | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close card category dropdown
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setEditingCategoryId(null);
      }
      // Close modal category dropdown
      if (modalCategoryDropdownRef.current && !modalCategoryDropdownRef.current.contains(event.target as Node)) {
        setModalState(prev => ({ ...prev, showCategoryDropdown: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Moved after filteredAndSortedItems is defined

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
  };

  const getContentPreview = (item: ContentItem): string => {
    const maxLength = getPreviewLength(viewMode);
    
    if (item.type === 'image' || item.type === 'file') {
      const fileName = item.metadata.title || 'Untitled';
      const size = formatFileSize(item.metadata.size || 0);
      return `Binary file: ${fileName} (${size})`;
    }
    
    const preview = item.content.substring(0, maxLength);
    return preview.length < item.content.length ? `${preview}...` : preview;
  };

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (optional field)
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  // Get content type icon from schema content.type field
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'code': return <i className="fas fa-code" />;
      case 'text': return <i className="fas fa-file-text" />;
      case 'document': return <i className="fas fa-file-pdf" />;
      case 'image': return <i className="fas fa-image" />;
      case 'video': return <i className="fas fa-video" />;
      case 'audio': return <i className="fas fa-volume-up" />;
      case 'data': return <i className="fas fa-table" />;
      case 'web': return <i className="fas fa-globe" />;
      case 'email': return <i className="fas fa-envelope" />;
      case 'design': return <i className="fas fa-paint-brush" />;
      case 'archive': return <i className="fas fa-file-archive" />;
      default: return <i className="fas fa-file" />;
    }
  };

  // Get source method icon class name
  const getSourceIcon = (source: string): string => {
    switch (source) {
      case 'paste': return 'fas fa-clipboard';
      case 'file-upload': return 'fas fa-upload';
      case 'article': return 'fas fa-link';
      case 'youtube': return 'fab fa-youtube';
      case 'tiktok': return 'fab fa-tiktok';
      default: return 'fas fa-question';
    }
  };

  const getSourceTooltip = (source: string): string => {
    switch (source) {
      case 'paste': return 'Pasted content';
      case 'file-upload': return 'File upload';
      case 'article': return 'URL extraction';
      case 'youtube': return 'YouTube content';
      case 'tiktok': return 'TikTok content';
      default: return 'Unknown source';
    }
  };

  const getTypeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case 'text': return <i className="fas fa-file-alt" />;
      case 'image': return <i className="fas fa-image" />;
      case 'file': return <i className="fas fa-file" />;
      case 'pdf': return <i className="fas fa-file-pdf" />;
      case 'code': return <i className="fas fa-code" />;
      default: return <i className="fas fa-file" />;
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category || category === 'Uncategorized') return 'badge--gray';
    
    const colors = {
      // LLM Categories (from INBOX_PROCESSING.md)
      'tech': 'badge--blue',           // Programming, AI, software, digital tools, automation
      'business': 'badge--green',      // Entrepreneurship, marketing, strategy, growth
      'finance': 'badge--yellow',      // Investing, crypto, money, economics
      'health': 'badge--red',          // Fitness, wellness, nutrition, mental health
      'cooking': 'badge--orange',      // Recipes, food prep, culinary techniques
      'education': 'badge--purple',    // Learning, tutorials, how-to guides
      'lifestyle': 'badge--pink',      // Personal development, habits, productivity
      'entertainment': 'badge--gray',  // Pop culture, media, gaming, arts
      'general': 'badge--blue',        // Cross-category or uncategorized
      
      // Content Source Types (from metadata schema)
      'paste': 'badge--blue',
      'file-upload': 'badge--green',
      'url-youtube': 'badge--red',
      'url-tiktok': 'badge--pink',
      'url-reddit': 'badge--orange',
      'url-article': 'badge--blue',
      'url-extraction': 'badge--purple',
      'image': 'badge--green',
      'pdf': 'badge--red',
      'video': 'badge--red',
      'audio': 'badge--purple',
      'text': 'badge--blue',
      'document': 'badge--green',
      'spreadsheet': 'badge--yellow',
      
      // Status-based categories
      'raw': 'badge--yellow',
      'processed': 'badge--green',
      'archived': 'badge--gray',
      
      // Legacy categories
      'documentation': 'badge--blue',
      'docs': 'badge--blue', 
      'feature': 'badge--green',
      'bug': 'badge--red',
      'enhancement': 'badge--purple',
      'research': 'badge--yellow',
      'meeting': 'badge--orange',
      'idea': 'badge--pink',
      'todo': 'badge--gray',
      'task': 'badge--gray',
      'reference': 'badge--purple'
    };
    
    const key = category.toLowerCase().trim().replace(/[\s-_]+/g, '');
    const color = colors[key as keyof typeof colors];
    
    // If no exact match, try partial matches
    if (!color) {
      for (const [keyword, colorClass] of Object.entries(colors)) {
        if (key.includes(keyword) || keyword.includes(key)) {
          return colorClass;
        }
      }
    }
    
    return color || 'badge--blue'; // Default to blue for unknown categories
  };


  // Moved after filteredAndSortedItems is defined

  const handleBulkDelete = () => {
    console.log('handleBulkDelete called');
    console.log('selectedItems:', selectedItems);
    console.log('onBulkRemove exists:', !!onBulkRemove);
    
    if (onBulkRemove && selectedItems.size > 0) {
      console.log('Calling onBulkRemove with:', Array.from(selectedItems));
      onBulkRemove(Array.from(selectedItems));
      setSelectedItems(new Set());
    } else {
      console.log('Bulk delete conditions not met - selectedItems.size:', selectedItems.size, 'onBulkRemove:', !!onBulkRemove);
    }
  };


  const filteredItems = useMemo(() => {
    // First filter
    const filtered = items.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (item.metadata.title || '').toLowerCase().includes(query);
        const matchesContent = item.content.toLowerCase().includes(query);
        const matchesTags = item.metadata.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesCategory = (item.metadata.category || '').toLowerCase().includes(query);
        const matchesType = item.type.toLowerCase().includes(query);
        const matchesStatus = item.status.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesTags && !matchesCategory && !matchesType && !matchesStatus) return false;
      }
      
      return true;
    });
    return filtered;
  }, [items, searchQuery]);

  const filteredAndSortedItems = useMemo(() => {
    // Sort the filtered items
    const sorted = [...filteredItems]; // Create copy to avoid mutating
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      case 'oldest':
        return sorted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      case 'title':
        return sorted.sort((a, b) => 
          (a.metadata.title || '').localeCompare(b.metadata.title || ''));
      default:
        return sorted;
    }
  }, [filteredItems, sortBy]);

  const allSelected = filteredAndSortedItems.length > 0 && selectedItems.size === filteredAndSortedItems.length;
  const someSelected = selectedItems.size > 0 && selectedItems.size < filteredAndSortedItems.length;

  // Functions that depend on filteredAndSortedItems
  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  }, [filteredAndSortedItems]);

  // Calculate item height for virtual scrolling
  const getItemHeight = useCallback((index: number) => {
    // Base height + dynamic content
    const item = filteredAndSortedItems[index];
    if (!item) return 150; // Default height
    
    // Estimate based on content
    const hasLongTitle = (item.metadata.title?.length || 0) > 50;
    const tagCount = item.metadata.tags.length;
    const contentPreviewLength = getContentPreview(item).length;
    
    let height = 150; // Base height
    if (hasLongTitle) height += 20;
    if (tagCount > 3) height += 24;
    if (contentPreviewLength > 150) height += 30;
    
    return height;
  }, [filteredAndSortedItems]);

  // Sync checking function
  const checkSync = async () => {
    if (!onSyncCheck) return;
    
    setSyncStatus('checking');
    try {
      const serverData = await onSyncCheck();
      const frontendItemIds = new Set(items.map(item => item.id));
      const serverItemIds = new Set(serverData.serverItems.map(item => item.id));
      
      // Check if frontend and backend have different items
      const hasExtraItems = items.some(item => !serverItemIds.has(item.id));
      const hasMissingItems = serverData.serverItems.some(item => !frontendItemIds.has(item.id));
      const totalMismatch = items.length !== serverData.totalItems;
      
      if (hasExtraItems || hasMissingItems || totalMismatch) {
        setSyncStatus('out-of-sync');
      } else {
        setSyncStatus('synced');
      }
      setLastSyncCheck(new Date());
    } catch (error) {
      console.error('Sync check failed:', error);
      setSyncStatus('out-of-sync');
    }
  };

  // Only check sync on mount, not on every item change to prevent re-render storms
  useEffect(() => {
    checkSync();
  }, []); // Only on mount
  
  // Optional: check sync when user manually triggers refresh
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     checkSync();
  //   }, 2000); // Much longer debounce
  //   
  //   return () => clearTimeout(timeoutId);
  // }, [items.length]);

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
      await checkSync();
    }
  };

  // Render individual queue item for VirtualList
  const renderQueueItem = useCallback((item: ContentItem, index: number, style: React.CSSProperties) => {
    return (
      <div style={style} key={item.metadata.stableKey || item.id}>
        <Card 
          variant="default"
          className={`content-inbox__queue-item ${
            selectedItems.has(item.id) ? 'content-inbox__queue-item--selected' : ''
          } ${
            item.status === 'processing' ? 'content-inbox__queue-item--processing' : ''
          } ${
            item.metadata.isOptimistic ? 'content-inbox__queue-item--optimistic' : ''
          } ${
            item.metadata.isNew ? 'content-inbox__queue-item--new' : ''
          }`}
          onAnimationEnd={(e) => {
            if (e.animationName === 'fadeInSlide' && item.metadata.isNew) {
              onUpdate(item.id, {
                metadata: { ...item.metadata, isNew: false }
              });
            }
          }}
        >
          <div className="content-inbox__card-header">
            <div className={`content-inbox__status-dot content-inbox__status-dot--${item.status}`}></div>
            <div className="content-inbox__header-top">
              <div className="content-inbox__header-left">
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.target.checked) {
                      setSelectedItems(prev => new Set([...prev, item.id]));
                    } else {
                      setSelectedItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(item.id);
                        return newSet;
                      });
                    }
                    setLastClickedIndex(index);
                  }}
                  className="content-inbox__item-checkbox"
                />
                <div className="content-inbox__category-dropdown" ref={editingCategoryId === item.id ? categoryDropdownRef : null}>
                  <span 
                    className={`badge badge--md ${getCategoryColor(item.metadata.category || 'uncategorized')} content-inbox__category-badge`}
                    onClick={() => setEditingCategoryId(editingCategoryId === item.id ? null : item.id)}
                    title="Click to change category"
                  >
                    {item.metadata.category || 'uncategorized'}
                  </span>
                  {editingCategoryId === item.id && (
                    <div className="content-inbox__category-menu content-inbox__category-menu--scrollable">
                      {availableCategories.map(category => (
                        <button
                          key={category}
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdate(item.id, {
                              metadata: { ...item.metadata, category }
                            });
                            setEditingCategoryId(null);
                          }}
                          className={`content-inbox__category-option ${
                            category === item.metadata.category ? 'content-inbox__category-option--active' : ''
                          }`}
                        >
                          <span className={`badge badge--sm ${getCategoryColor(category)}`}>
                            {category}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="content-inbox__header-main">
              <h3 className="content-inbox__card-title">
                <span className="content-inbox__content-type-icon">
                  {getTypeIcon(item.type)}
                </span>
                <EditableText
                  value={item.metadata.title || 'Untitled'}
                  onChange={(newTitle) => onUpdate(item.id, {
                    metadata: { ...item.metadata, title: newTitle }
                  })}
                  className="content-inbox__item-title"
                  placeholder="Untitled"
                />
              </h3>
              <div className="content-inbox__tags-row">
                {item.metadata.tags.length === 0 && (
                  <span className="badge badge--tag badge--sm content-inbox__add-tag">
                    + Add tag
                  </span>
                )}
                <ContentInboxTagEditor
                  tags={item.metadata.tags}
                  onUpdate={(newTags) => onUpdate(item.id, {
                    metadata: { ...item.metadata, tags: newTags }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="content-inbox__card-body">
            <p className="content-inbox__item-preview">
              {getContentPreview(item)}
            </p>
          </div>
          
          <div className="content-inbox__card-footer">
            <div className="content-inbox__footer-content">
              <div className="content-inbox__metadata-row">
                <div className="content-inbox__meta-item">
                  <i className="fas fa-hdd"></i>
                  <span>{formatFileSize(item.metadata.size || 0)}</span>
                </div>
                <div className="content-inbox__meta-item">
                  <i className="fas fa-calendar"></i>
                  <span>{formatDate(item.timestamp)}</span>
                </div>
                <div className="content-inbox__meta-item">
                  <i className={getSourceIcon(item.source)} title={getSourceTooltip(item.source)}></i>
                  <span>{item.source}</span>
                </div>
              </div>
              <div className="content-inbox__card-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    modalActions.openModal(item);
                  }}
                  className="content-inbox__action-icon"
                  title="View content"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="content-inbox__action-icon content-inbox__action-icon--danger"
                  title="Remove item"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }, [selectedItems, editingCategoryId, availableCategories, lastClickedIndex, onUpdate, onRemove, modalActions]);

  return (
    <ScrollContainer 
      className="content-inbox__queue-panel"
      direction="vertical"
      smooth
      fadeEdges
      onScroll={(e) => {
        const target = e.target as HTMLElement;
        setShowBackToTop(target.scrollTop > 200);
      }}
    >
      <Box className="content-inbox__queue-header">
        <Box display="flex" justify="between" align="center" marginY="3">
          <Box display="flex" align="center" gap="md">
            <Text as="h2" className="content-inbox__panel-title">
              Content Queue
            </Text>
            {selectedItems.size > 0 && (
              <Text size="sm" className="content-inbox__selection-count">
                {selectedItems.size} selected
              </Text>
            )}
          </Box>
          <Box display="flex" align="center" gap="sm">
            {selectedItems.size > 0 && (
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                title="Select all items"
                className="content-inbox__select-all"
              />
            )}
            {/* Subtle integrated sync status */}
            <div 
              className="content-inbox__sync-info" 
              onClick={onRefresh ? handleRefresh : undefined}
              role={onRefresh ? "button" : undefined}
              tabIndex={onRefresh ? 0 : undefined}
              onKeyDown={onRefresh ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRefresh();
                }
              } : undefined}
              aria-label={
                syncStatus === 'checking' ? 'Syncing with server...' :
                syncStatus === 'out-of-sync' ? `${filteredAndSortedItems.length} items - Click to refresh (out of sync)` :
                onRefresh ? `${filteredAndSortedItems.length} items - Click to refresh` :
                `${filteredAndSortedItems.length} items`
              }
            >
              <Text variant="secondary" size="sm">
                {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'item' : 'items'}
              </Text>
              
              {/* Minimal sync indicator - only show when needed */}
              {syncStatus === 'checking' && (
                <i className="fas fa-circle-notch fa-spin content-inbox__sync-dot content-inbox__sync-dot--checking" aria-hidden="true"></i>
              )}
              {syncStatus === 'out-of-sync' && (
                <i className="fas fa-circle content-inbox__sync-dot content-inbox__sync-dot--warning" aria-hidden="true"></i>
              )}
              {/* When synced: clean, no visual clutter */}
            </div>
          </Box>
        </Box>
        

        {/* Simplified Toolbar - Only essential controls */}
        <Box className="content-inbox__toolbar" marginY="2">
          <Box display="flex" align="center" gap="md">
            {/* Search */}
            <input
              type="text"
              placeholder="Search titles, content, tags, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="content-inbox__search"
            />
            
            {/* Only show sort when there are multiple items */}
            {items.length > 1 && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="content-inbox__sort-select"
              >
                <option value="newest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">By title</option>
              </select>
            )}
            
            {/* View Toggle */}
            <div className="content-inbox__view-toggle">
              <Button
                size="small"
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('list')}
                className="content-inbox__view-btn"
                iconLeft={<i className="fas fa-list" />}
              />
              <Button
                size="small"
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('grid')}
                className="content-inbox__view-btn"
                iconLeft={<i className="fas fa-th" />}
              />
            </div>
          </Box>
        </Box>
        
        {/* Subtle Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="content-inbox__bulk-bar">
            <div className="content-inbox__bulk-left">
              <label className="content-inbox__select-all-minimal">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="content-inbox__bulk-checkbox"
                />
              </label>
              <span className="content-inbox__bulk-count">
                {selectedItems.size} selected
              </span>
            </div>
            
            <div className="content-inbox__bulk-controls">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    selectedItems.forEach(itemId => {
                      const item = items.find(i => i.id === itemId);
                      if (item) {
                        onUpdate(itemId, {
                          metadata: { 
                            ...item.metadata, 
                            category: e.target.value 
                          }
                        });
                      }
                    });
                  }
                }}
                className="content-inbox__bulk-input"
              >
                <option value="">category</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="tag"
                className="content-inbox__bulk-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const newTag = e.currentTarget.value.trim();
                    selectedItems.forEach(itemId => {
                      const item = items.find(i => i.id === itemId);
                      if (item && !item.metadata.tags.includes(newTag)) {
                        onUpdate(itemId, {
                          metadata: { 
                            ...item.metadata, 
                            tags: [...item.metadata.tags, newTag] 
                          }
                        });
                      }
                    });
                    e.currentTarget.value = '';
                  }
                }}
              />
              
              <button
                onClick={handleBulkDelete}
                className="content-inbox__bulk-action content-inbox__bulk-action--danger"
                title="Delete selected"
              >
                <i className="fas fa-trash"></i>
              </button>
              
              <button
                onClick={() => setSelectedItems(new Set())}
                className="content-inbox__bulk-action"
                title="Clear selection"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </Box>

      {items.length === 0 ? (
        <Card variant="outlined" className="content-inbox__empty-state">
          <Text variant="secondary" className="text-center">
            No content in queue. Add some content to get started!
          </Text>
        </Card>
      ) : viewMode === 'grid' ? (
        // Grid view - no virtualization for grid layout
        <div className="content-inbox__queue-grid">
          {filteredAndSortedItems.map((item, index) => (
            <Card 
              key={item.metadata.stableKey || item.id}
              variant="default"
              className={`content-inbox__queue-item ${
                selectedItems.has(item.id) ? 'content-inbox__queue-item--selected' : ''
              } ${
                item.status === 'processing' ? 'content-inbox__queue-item--processing' : ''
              } ${
                item.metadata.isOptimistic ? 'content-inbox__queue-item--optimistic' : ''
              } ${
                item.metadata.isNew ? 'content-inbox__queue-item--new' : ''
              }`}
              onAnimationEnd={(e) => {
                // Remove isNew flag after fade-in animation completes
                if (e.animationName === 'fadeInSlide' && item.metadata.isNew) {
                  onUpdate(item.id, {
                    metadata: { ...item.metadata, isNew: false }
                  });
                }
              }}
            >
              {/* Card Header */}
              <div className="content-inbox__card-header">
                <div className={`content-inbox__status-dot content-inbox__status-dot--${item.status}`}></div>
                <div className="content-inbox__header-top">
                  <div className="content-inbox__header-left">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedItems(prev => new Set([...prev, item.id]));
                        } else {
                          setSelectedItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(item.id);
                            return newSet;
                          });
                        }
                      }}
                      className="content-inbox__item-checkbox"
                    />
                    <div className="content-inbox__category-dropdown" ref={categoryDropdownRef}>
                      <span 
                        className={`badge badge--md ${getCategoryColor(item.metadata.category || 'uncategorized')} content-inbox__category-badge`}
                        title="Click to change category"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          setEditingCategoryId(editingCategoryId === item.id ? null : item.id);
                        }}
                      >
                        {(item.metadata.category || 'uncategorized').length > 12 
                          ? (item.metadata.category || 'uncategorized').slice(0, 12) + '...' 
                          : item.metadata.category || 'uncategorized'}
                      </span>
                      {editingCategoryId === item.id && (
                        <div className="content-inbox__category-menu content-inbox__category-menu--scrollable">
                          {availableCategories.map(category => (
                            <button
                              key={category}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                onUpdate(item.id, {
                                  metadata: { ...item.metadata, category: category }
                                });
                                setEditingCategoryId(null);
                              }}
                              className="content-inbox__category-option"
                            >
                              <span className={`badge badge--md ${getCategoryColor(category)}`}>
                                {category}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="content-inbox__header-main">
                  <h3 className="content-inbox__card-title">
                    {/* Content type icon - shows what kind of content */}
                    <span className="content-inbox__content-type-icon">
                      {getContentTypeIcon(item.metadata.file_type || 'text')}
                    </span>
                    <EditableText
                      value={item.metadata.title || 'Untitled'}
                      onSave={(newTitle) => onUpdate(item.id, { 
                        metadata: { ...item.metadata, title: newTitle }
                      })}
                      className="content-inbox__item-title"
                    />
                  </h3>
                  
                  
                  <div className="content-inbox__tags-row">
                    {item.metadata.tags.slice(0, getMaxVisibleTags(viewMode)).map(tag => (
                      <div key={tag} className="content-inbox__tag-pill" title={tag}>
                        <span className="content-inbox__tag-text">
                          {tag.length > 10 ? tag.slice(0, 10) + '...' : tag}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTags = item.metadata.tags.filter(t => t !== tag);
                            onUpdate(item.id, {
                              metadata: { ...item.metadata, tags: newTags }
                            });
                          }}
                          className="content-inbox__tag-remove"
                          title="Remove tag"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    {item.metadata.tags.length > getMaxVisibleTags(viewMode) && (
                      <span className="content-inbox__tag-overflow">
                        +{item.metadata.tags.length - getMaxVisibleTags(viewMode)}
                      </span>
                    )}
                    <ContentInboxTagEditor
                      tags={item.metadata.tags}
                      onUpdate={(newTags) => onUpdate(item.id, {
                        metadata: { ...item.metadata, tags: newTags }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="content-inbox__card-body">
                <p className="content-inbox__item-preview">
                  {item.content?.slice(0, getPreviewLength(viewMode)) || 'No content preview available'}...
                </p>
              </div>
              
              {/* Card Footer */}
              <div className="content-inbox__card-footer">
                <div className="content-inbox__footer-content">
                  <div className="content-inbox__metadata-row">
                    <div className="content-inbox__meta-item">
                      <i className="fas fa-hdd"></i>
                      <span>{formatFileSize(item.metadata.size || 0)}</span>
                    </div>
                    
                    <div className="content-inbox__meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                    
                    {/* Source method - shows how content was added */}
                    <div className="content-inbox__meta-item">
                      <i className={getSourceIcon(item.source)} title={getSourceTooltip(item.source)}></i>
                      <span>{item.source}</span>
                    </div>
                    
                    {item.metadata.url && (
                      <div className="content-inbox__meta-item">
                        <i className="fas fa-external-link-alt"></i>
                        <a 
                          href={item.metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="content-inbox__source-link"
                          title="Open source link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          source
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="content-inbox__card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item);
                      }}
                      className="content-inbox__action-icon"
                      title="View content"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="content-inbox__action-icon content-inbox__action-icon--danger"
                      title="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

            </Card>
          ))}
        </div>
      ) : (
        // List view - use virtual scrolling for performance
        <VirtualList
          ref={virtualListRef}
          items={filteredAndSortedItems}
          height={600} // Adjust based on your layout
          itemSize={getItemHeight}
          renderItem={renderQueueItem}
          overscan={5}
          threshold={30} // Use virtual scrolling when more than 30 items
          className="content-inbox__queue-list"
          onScroll={(scrollOffset) => {
            // Save scroll position for persistence
            if (virtualListRef.current) {
              const element = virtualListRef.current._outerRef;
              if (element) {
                setScrollElement(element);
              }
            }
          }}
        />
      )}
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          className="content-inbox__back-to-top"
          variant="primary"
          size="small"
          onClick={() => scrollToTop()}
          iconLeft={<i className="fas fa-arrow-up" />}
          aria-label="Back to top"
        />
      )}
      
      {/* Content View Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={modalActions.closeModal}
        title={modalState.item?.metadata.title || 'Content View'}
        size="large"
        className="content-inbox__view-modal"
      >
        {modalState.item && (
          <Box className="content-inbox__modal-content">
            {/* Compact Metadata */}
            <Box className="content-inbox__modal-meta-compact" marginY="2" padding="3">
              {/* Title Row */}
              <Box className="content-inbox__modal-row">
                <Text size="xs" weight="medium" className="content-inbox__modal-label">Title:</Text>
                <input
                  type="text"
                  value={modalState.editedValues.title}
                  onChange={(e) => modalActions.updateField('title', e.target.value)}
                  className="content-inbox__input-field-compact"
                  placeholder="Enter title..."
                />
              </Box>
              
              {/* Source URL Row */}
              <Box className="content-inbox__modal-row">
                <Text size="xs" weight="medium" className="content-inbox__modal-label">Source Link:</Text>
                <div>
                  <input
                    type="url"
                    value={modalState.editedValues.sourceUrl}
                    onChange={(e) => {
                      modalActions.updateField('sourceUrl', e.target.value);
                      if (e.target.value && !validateUrl(e.target.value)) {
                        setUrlError('Please enter a valid URL (http:// or https://)');
                      } else {
                        setUrlError('');
                      }
                    }}
                    className={`content-inbox__input-field-compact ${modalState.errors.url ? 'error' : ''}`}
                    placeholder="https://claude.ai/chat/... (optional)"
                  />
                  {modalState.errors.url && (
                    <Text size="xs" className="content-inbox__error-text" style={{color: 'red', fontSize: '11px', marginTop: '2px'}}>
                      {modalState.errors.url}
                    </Text>
                  )}
                </div>
              </Box>
              
              {/* Category & Tags Row */}
              <Box className="content-inbox__modal-row content-inbox__modal-row--split">
                <Box className="content-inbox__modal-field">
                  <Text size="xs" weight="medium" className="content-inbox__modal-label">Category:</Text>
                  <div className="content-inbox__category-dropdown" ref={modalCategoryDropdownRef}>
                    <span 
                      className={`badge badge--md ${getCategoryColor(modalState.editedValues.category || 'uncategorized')} content-inbox__modal-category-badge`}
                      onClick={toggleModalCategoryDropdown}
                    >
                      {modalState.editedValues.category || 'uncategorized'}
                    </span>
                    {modalState.showCategoryDropdown && (
                      <div className="content-inbox__category-menu content-inbox__category-menu--scrollable">
                        {availableCategories.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              modalActions.updateField('category', category);
                              setModalState(prev => ({ ...prev, showCategoryDropdown: false }));
                            }}
                            className="content-inbox__category-option"
                          >
                            <span className={`badge badge--md ${getCategoryColor(category)}`}>
                              {category}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Box>
                <Box className="content-inbox__modal-field content-inbox__modal-field--tags">
                  <Text size="xs" weight="medium" className="content-inbox__modal-label">Tags:</Text>
                  <Box className="content-inbox__modal-tags-container">
                    {editingTags.map(tag => (
                      <div key={tag} className="content-inbox__tag-pill">
                        <span className="content-inbox__tag-text">{tag}</span>
                        <button
                          onClick={() => setEditingTags(prev => prev.filter(t => t !== tag))}
                          className="content-inbox__tag-remove"
                          title="Remove tag"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    <ContentInboxTagEditor
                      tags={modalState.editedValues.tags}
                      onUpdate={(newTags) => modalActions.updateField('tags', newTags)}
                    />
                  </Box>
                </Box>
              </Box>
              
              {/* Compact Info Row */}
              <Box className="content-inbox__modal-info-compact">
                <Text size="xs" className="content-inbox__meta-compact">
                  <span className="content-inbox__type-icon"><i className={getSourceIcon(modalState.item.source)} title={getSourceTooltip(modalState.item.source)}></i></span>
                  {modalState.item.source}
                </Text>
                <Text size="xs" className="content-inbox__meta-compact">
                  {modalState.item.metadata.size ? `${Math.round(modalState.item.metadata.size / 1024)}KB` : '0KB'}
                </Text>
                <Text size="xs" className="content-inbox__meta-compact">
                  {modalState.item.timestamp ? formatDate(modalState.item.timestamp) : ''}
                </Text>
              </Box>
            </Box>
            
            {/* Content Body - Takes up most space */}
            <ScrollContainer 
              className="content-inbox__modal-body" 
              style={{ flex: 1 }}
              direction="vertical"
              smooth
              maxHeight="400px"
            >
              <Text size="sm" weight="medium" className="content-inbox__content-label">Content:</Text>
              <textarea
                value={modalState.editedValues.content}
                onChange={(e) => modalActions.updateField('content', e.target.value)}
                className="content-inbox__content-textarea"
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '12px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  resize: 'vertical'
                }}
                placeholder="Edit content..."
              />
            </ScrollContainer>
            
            {/* Modal Actions */}
            <Box display="flex" justify="between" align="center" marginY="3">
              <Button
                variant={copySuccess ? "primary" : "secondary"}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(modalState.item?.content || '');
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                    console.log('Content copied to clipboard');
                  } catch (err) {
                    console.error('Failed to copy content:', err);
                    // Fallback for older browsers or non-HTTPS
                    const textArea = document.createElement('textarea');
                    textArea.value = modalState.item?.content || '';
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                      document.execCommand('copy');
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                      console.log('Content copied using fallback method');
                    } catch (fallbackErr) {
                      console.error('Fallback copy failed:', fallbackErr);
                    }
                    document.body.removeChild(textArea);
                  }
                }}
                iconLeft={copySuccess ? <i className="fas fa-check" /> : <i className="fas fa-copy" />}
              >
                {copySuccess ? 'Copied!' : 'Copy Content'}
              </Button>
              
              <Box display="flex" gap="sm">
                <Button
                  variant={saveSuccess ? "secondary" : "primary"}
                  onClick={async () => {
                    try {
                      // Validate URL before saving
                      if (modalState.editedValues.sourceUrl && !validateUrl(modalState.editedValues.sourceUrl)) {
                        modalActions.setError('url', 'Please enter a valid URL (http:// or https://)');
                        return;
                      }
                      
                      // Save changes
                      console.log('Save Changes clicked');
                      console.log('Editing source URL:', modalState.editedValues.sourceUrl);
                      const updates = {
                        content: modalState.editedValues.content,
                        metadata: {
                          ...modalState.item!.metadata,
                          title: modalState.editedValues.title.trim() || 'Untitled',
                          category: modalState.editedValues.category.trim() || undefined,
                          tags: modalState.editedValues.tags,
                          url: modalState.editedValues.sourceUrl.trim() === '' ? '' : modalState.editedValues.sourceUrl.trim()
                        }
                      };
                      console.log('Sending updates:', updates);
                      
                      await onUpdate(modalState.item!.id, updates);
                      
                      // Show success notification
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 2000);
                      
                      // Update the modal state with new data
                      modalActions.saveSuccess(updates);
                    } catch (error) {
                      console.error('Save failed:', error);
                    }
                  }}
                  iconLeft={saveSuccess ? <i className="fas fa-check" /> : <i className="fas fa-save" />}
                >
                  {saveSuccess ? 'Saved!' : 'Save Changes'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={modalActions.closeModal}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Modal>
    </ScrollContainer>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ContentInboxQueuePanel = memo(ContentInboxQueuePanelComponent, (prevProps, nextProps) => {
  // Simple comparison - only re-render if props actually changed
  const propsChanged = (
    prevProps.items !== nextProps.items ||
    prevProps.onUpdate !== nextProps.onUpdate ||
    prevProps.onRemove !== nextProps.onRemove ||
    prevProps.onBulkRemove !== nextProps.onBulkRemove ||
    prevProps.onRefresh !== nextProps.onRefresh ||
    prevProps.onSyncCheck !== nextProps.onSyncCheck
  );
  
  if (propsChanged) {
    console.log('🔄 QueuePanel memo: props changed, will re-render');
  } else {
    console.log('✅ QueuePanel memo: props same, skipping render');
  }
  
  return !propsChanged; // Return true to skip re-render
});
