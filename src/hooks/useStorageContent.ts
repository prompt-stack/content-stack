/**
 * @file hooks/useStorageContent.ts
 * @purpose Hook for accessing storage content with metadata
 * @layer hooks
 * @deps [StorageService]
 * @used-by [Studio editors]
 * @llm-read true
 * @llm-write full-edit
 */

import { useState, useEffect, useCallback } from 'react';
import { StorageService, StorageItem, ContentMetadata } from '@/services/StorageService';

interface UseStorageContentOptions {
  type?: string;
  platform?: 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 'substack' | 'newsletter';
}

export function useStorageContent(options: UseStorageContentOptions = {}) {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load items with metadata
      const storageItems = await StorageService.getItemsWithMetadata(options.type);
      
      // Filter items suitable for the platform if specified
      let filteredItems = storageItems;
      if (options.platform) {
        filteredItems = storageItems.filter(item => {
          // Filter logic based on platform requirements
          switch (options.platform) {
            case 'twitter':
              // Text, images, short videos
              return ['text', 'image', 'document'].includes(item.type) ||
                     (item.metadata?.wordCount && item.metadata.wordCount < 1000);
            case 'instagram':
              // Images and videos
              return ['image', 'video'].includes(item.type);
            case 'tiktok':
              // Videos and images for slideshow
              return ['video', 'image'].includes(item.type);
            case 'linkedin':
            case 'substack':
            case 'newsletter':
              // Text content
              return ['text', 'document'].includes(item.type);
            default:
              return true;
          }
        });
      }
      
      setItems(filteredItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load storage content');
    } finally {
      setLoading(false);
    }
  }, [options.type, options.platform]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const getSuggestion = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item?.metadata || !options.platform) return null;
    
    return StorageService.suggestContentForPlatform(item.metadata, options.platform);
  }, [items, options.platform]);

  const refresh = useCallback(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    getSuggestion,
    refresh
  };
}