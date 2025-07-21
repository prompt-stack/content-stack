/**
 * @file features/content-inbox/hooks/useContentQueue.ts
 * @purpose Hook for ContentQueue management
 * @layer feature
 * @deps none
 * @used-by [ContentInboxFeature]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useState, useCallback, useEffect } from 'react';
import { ContentItem, ContentSubmission, ContentMetadata } from '../types';
import { contentInboxApi } from '@/services/ContentInboxApi';
import { contentInboxConfig, getFileSizeLimit, isVideoFile, shouldReadFileContent } from '../config';

// Simple ID generator for demo
const generateId = () => `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Simple content sanitization for MVP (prevents XSS)
const sanitizeContent = (content: string): string => {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Configuration now imported from ./config.ts
// All limits, extensions, and settings are centralized

// Basic metadata extraction
const extractBasicMetadata = (content: string, type: string = 'text/plain'): ContentMetadata => {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const lines = content.split('\n');
  const firstLine = lines[0] || '';
  
  // Try to extract a better title
  let title = firstLine.slice(0, 50) + (firstLine.length > 50 ? '...' : '');
  
  // For markdown, look for H1
  if (type === 'text/markdown' && lines.length > 0) {
    const h1Match = lines.find(line => line.startsWith('# '));
    if (h1Match) {
      title = h1Match.replace(/^# /, '').trim();
    }
  }
  
  return {
    title,
    tags: [],
    category: undefined, // Will default to 'Uncategorized' in UI
    wordCount: words.length,
    format: type,
    extractedAt: new Date(),
    customFields: {}
  };
};

export function useContentQueue() {
  const [queue, setQueue] = useState<ContentItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateDialog, setDuplicateDialog] = useState<{
    submission: ContentSubmission;
    existingItemId?: string;
    onApprove: () => void;
    onCancel: () => void;
  } | null>(null);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{
    itemIds: string[];
    itemCount: number;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  // Load queue from API on mount
  const loadQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // console.log('Loading queue from backend...');
      const items = await contentInboxApi.getInboxItems();
      // console.log('Loaded items from backend:', items.length, items);
      // console.log('First item structure:', items[0]);
      setQueue(items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
      setError(errorMessage);
      console.error('Failed to load queue:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load queue on mount only - don't auto-reload to prevent blinks
  useEffect(() => {
    loadQueue();
  }, []); // Remove loadQueue dependency to prevent reloads

  const addContent = useCallback(async (submission: ContentSubmission) => {
    setIsProcessing(true);
    setError(null);
    
    // Create optimistic item for immediate UI feedback
    const optimisticId = generateId();
    // Create a stable key that won't change during optimistic->real transition
    const stableKey = `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const optimisticItem: ContentItem = {
      id: optimisticId,
      type: submission.type === 'url' ? 'url' : submission.content instanceof File ? 'file' : 'text',
      source: submission.type === 'upload' ? 'file-upload' : 
              submission.type === 'url' ? 'article' :
              submission.type === 'drop' ? 'file-upload' : 'paste',
      status: 'raw',
      title: submission.content instanceof File ? submission.content.name : 
             typeof submission.content === 'string' && submission.content.length > 50 ? 
             submission.content.slice(0, 50) + '...' : 
             typeof submission.content === 'string' ? submission.content : 'Uploading...',
      content: typeof submission.content === 'string' ? submission.content : undefined,
      timestamp: new Date(),
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        size: typeof submission.content === 'string' ? submission.content.length : submission.content?.size || 0,
        content_hash: 'pending...',
        tags: [],
        isOptimistic: true, // Flag for UI styling
        isNew: true, // Flag for animation styling
        stableKey: stableKey // Stable key for React component identity
      }
    };

    // Add optimistic item to UI immediately (batched update)
    setQueue(prev => {
      console.log('➕ Adding optimistic item to queue');
      return [optimisticItem, ...prev];
    });
    
    try {
      let contentString = '';
      let filename: string | undefined;

      // Handle different content types with validation
      if (submission.content instanceof File) {
        const file = submission.content;
        
        // Smart file size validation using configuration
        const maxFileSize = getFileSizeLimit(file.name);
        if (file.size > maxFileSize) {
          const maxSizeGB = maxFileSize >= 1024 * 1024 * 1024 ? (maxFileSize / (1024 * 1024 * 1024)).toFixed(1) + 'GB' : Math.round(maxFileSize / 1024 / 1024) + 'MB';
          const fileSizeGB = file.size >= 1024 * 1024 * 1024 ? (file.size / (1024 * 1024 * 1024)).toFixed(1) + 'GB' : Math.round(file.size / 1024 / 1024) + 'MB';
          const videoNote = isVideoFile(file.name) ? ' for video files' : '';
          throw new Error(contentInboxConfig.validation.messages.fileSizeExceeded
            .replace('{actualSize}', fileSizeGB)
            .replace('{maxSize}', maxSizeGB)
            .replace('{fileTypeNote}', videoNote));
        }
        
        // Smart content handling using configuration
        if (isVideoFile(file.name)) {
          // Video files: metadata only, don't read content to avoid memory issues
          const sizeDisplay = file.size >= 1024 * 1024 * 1024 ? 
            (file.size / (1024 * 1024 * 1024)).toFixed(1) + 'GB' : 
            Math.round(file.size / 1024 / 1024) + 'MB';
          contentString = `🎥 Video file: ${file.name}\nSize: ${sizeDisplay}\nType: ${file.type || 'video'}\n\n[Video content not processed - file stored for reference]`;
        } else if (shouldReadFileContent(file)) {
          contentString = await file.text();
        } else {
          // For other binary files, show metadata
          const sizeDisplay = file.size >= 1024 * 1024 ? 
            Math.round(file.size / 1024 / 1024) + 'MB' : 
            Math.round(file.size / 1024) + 'KB';
          contentString = `📄 Binary file: ${file.name}\nSize: ${sizeDisplay}\nType: ${file.type || 'unknown'}`;
        }
        filename = file.name;
      } else if (submission.type === 'url') {
        // URL validation
        try {
          const url = new URL(submission.content as string);
          // Basic URL validation
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Only HTTP and HTTPS URLs are supported');
          }
          
          // For now, just store the URL - later we can add extraction
          contentString = submission.content as string;
        } catch (e) {
          throw new Error('Invalid URL format');
        }
      } else {
        // Paste content - validate
        const rawContent = submission.content as string;
        if (!rawContent || rawContent.trim().length === 0) {
          throw new Error('Content cannot be empty');
        }
        
        // Content length validation - higher for localhost
        const maxPasteSize = isLocalhost ? 10 * 1024 * 1024 : 1024 * 1024; // 10MB for localhost, 1MB for production
        if (rawContent.length > maxPasteSize) {
          const maxSizeMB = Math.round(maxPasteSize / 1024 / 1024);
          throw new Error(`Pasted content is too large (max ${maxSizeMB}MB)`);
        }
        
        contentString = rawContent;
      }

      // Call our new backend API
      const newItem = await contentInboxApi.addInboxItem({
        method: submission.type === 'upload' ? 'upload' : 
                submission.type === 'url' ? 'url' :
                submission.type === 'drop' ? 'drop' : 'paste',
        content: contentString,
        url: submission.type === 'url' ? submission.content as string : undefined,
        filename
      });

      // Smooth transition: merge backend data into optimistic item structure
      // This prevents React from seeing it as a completely different component
      const mergedItem: ContentItem = {
        ...optimisticItem, // Keep optimistic structure as base
        ...newItem,        // Override with backend data
        id: optimisticId,  // KEEP optimistic ID to prevent component replacement
        metadata: {
          ...optimisticItem.metadata,
          ...newItem.metadata,
          isOptimistic: false, // Mark as confirmed
          isNew: false, // Remove new flag after confirmation
          stableKey: optimisticItem.metadata.stableKey // Preserve stable key
        }
      };
      
      console.log('🔄 Transition optimistic→real:', {
        optimisticId,
        backendId: newItem.id,
        wasOptimistic: optimisticItem.metadata.isOptimistic,
        wasNew: optimisticItem.metadata.isNew,
        nowOptimistic: mergedItem.metadata.isOptimistic,
        nowNew: mergedItem.metadata.isNew
      });
      
      setQueue(prev => {
        console.log('🔄 Updating optimistic→real in queue');
        return prev.map(item => 
          item.id === optimisticId ? mergedItem : item
        );
      });

      return newItem;
    } catch (error) {
      // Remove optimistic item on error - don't try to update items that don't exist in backend
      console.log('❌ Error occurred, removing optimistic item:', optimisticId);
      setQueue(prev => prev.filter(item => item.id !== optimisticId));
      
      // Check if it's a duplicate error (409 status)
      if (error instanceof Error && error.message.includes('already exists')) {
        // Show duplicate dialog for user approval
        setDuplicateDialog({
          submission,
          onApprove: () => {
            setDuplicateDialog(null);
            // Force add content with override flag
            forceAddContent(submission);
          },
          onCancel: () => {
            setDuplicateDialog(null);
          }
        });
        return; // Don't throw error, let user decide
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to process content';
      setError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Force add content (bypass duplicate check) - for user approved duplicates
  const forceAddContent = useCallback(async (submission: ContentSubmission) => {
    // TODO: Implement force add with backend API override flag
    // For now, just show a message that forcing isn't implemented yet
    setError('Force adding duplicates is not yet implemented. The content was not added.');
  }, []);

  const updateContent = useCallback(async (id: string, updates: Partial<ContentItem>) => {
    try {
      // Check if this is an optimistic item (doesn't exist in backend yet)
      const item = queue.find(i => i.id === id);
      if (item?.metadata.isOptimistic) {
        console.log('⚠️ Skipping backend update for optimistic item:', id);
        // Only update UI for optimistic items
        setQueue(prev => 
          prev.map(item => 
            item.id === id 
              ? { ...item, ...updates }
              : item
          )
        );
        return;
      }

      // Optimistic update - update UI immediately
      setQueue(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...updates }
            : item
        )
      );

      // Update backend for real items only
      await contentInboxApi.updateContentItem(id, updates as any);
      console.log('Content updated successfully:', id, updates);
      
    } catch (error) {
      console.error('Update content error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update content';
      setError(errorMessage);
      throw error;
    }
  }, [queue]);

  const removeContent = useCallback(async (id: string) => {
    console.log('removeContent called with id:', id);
    
    // Store item for potential rollback
    const itemToRemove = queue.find(item => item.id === id);
    if (!itemToRemove) {
      console.log('Item not found in queue:', id);
      return;
    }

    // Optimistically remove from UI immediately
    console.log('Removing item from UI:', itemToRemove.title);
    setQueue(prev => prev.filter(item => item.id !== id));
    
    try {
      await contentInboxApi.deleteContentItem(id);
      // Success - item already removed from UI
    } catch (error) {
      // Check if item doesn't exist in backend (old item)
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('404'))) {
        // Item doesn't exist in backend - remove from frontend and don't show error
        console.log(`Item ${id} doesn't exist in backend, removing from frontend`);
        return; // Don't rollback, just remove from UI
      }
      
      // Real error - rollback: add item back to UI
      setQueue(prev => {
        // Add back at original position (approximate)
        return [itemToRemove, ...prev];
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete content';
      setError(errorMessage);
      throw error;
    }
  }, [queue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const refreshQueue = useCallback(async () => {
    await loadQueue();
  }, [loadQueue]);


  const bulkRemove = useCallback(async (ids: string[]) => {
    console.log('bulkRemove called with ids:', ids);
    
    // Show confirmation dialog instead of immediate deletion
    setBulkDeleteDialog({
      itemIds: ids,
      itemCount: ids.length,
      onConfirm: async () => {
        setBulkDeleteDialog(null);
        // Actually perform the bulk delete
        await performBulkDelete(ids);
      },
      onCancel: () => {
        setBulkDeleteDialog(null);
      }
    });
  }, []);

  // Internal function to actually perform bulk delete after confirmation
  const performBulkDelete = useCallback(async (ids: string[]) => {
    console.log('Performing confirmed bulk delete:', ids);
    
    // Remove from UI immediately (optimistic)
    setQueue(prev => prev.filter(item => !ids.includes(item.id)));
    
    // Delete each item from backend
    try {
      for (const id of ids) {
        console.log('Bulk deleting item:', id);
        await contentInboxApi.deleteContentItem(id);
      }
      console.log('Bulk delete completed successfully');
    } catch (error) {
      console.error('Bulk delete failed:', error);
      // Reload queue to restore items that failed to delete
      await loadQueue();
      const errorMessage = error instanceof Error ? error.message : 'Failed to bulk delete content';
      setError(errorMessage);
    }
  }, [loadQueue]);

  const bulkUpdate = useCallback((ids: string[], updates: Partial<ContentItem>) => {
    setQueue(prev => 
      prev.map(item => {
        if (ids.includes(item.id)) {
          const updatedItem = { ...item };
          
          // Handle metadata updates specially to preserve existing metadata
          if (updates.metadata) {
            updatedItem.metadata = {
              ...item.metadata,
              ...updates.metadata
            };
          }
          
          // Apply other updates
          Object.keys(updates).forEach(key => {
            if (key !== 'metadata') {
              (updatedItem as any)[key] = (updates as any)[key];
            }
          });
          
          return updatedItem;
        }
        return item;
      })
    );
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sync check function for detecting frontend/backend mismatches
  const checkSync = useCallback(async (): Promise<{ totalItems: number; serverItems: ContentItem[] }> => {
    try {
      const serverItems = await contentInboxApi.getInboxItems();
      return {
        totalItems: serverItems.length,
        serverItems
      };
    } catch (err) {
      console.error('Sync check failed:', err);
      throw err;
    }
  }, []);

  return {
    queue,
    isProcessing,
    isLoading,
    error,
    duplicateDialog,
    bulkDeleteDialog,
    addContent,
    updateContent,
    removeContent,
    clearQueue,
    refreshQueue,
    bulkRemove,
    bulkUpdate,
    clearError,
    loadQueue,
    checkSync
  };
}
