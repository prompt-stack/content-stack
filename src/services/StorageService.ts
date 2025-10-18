/**
 * @file services/StorageService.ts
 * @purpose Handle storage and metadata operations
 * @layer service
 * @deps [@/lib/api]
 * @used-by [Studio components]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role data-service
 */

import { Api } from '@/lib/api';

export interface StorageItem {
  id: string;
  name: string;
  type: string;
  size: number;
  created: Date;
  modified: Date;
  path: string;
  metadata?: ContentMetadata;
}

export interface ContentMetadata {
  id: string;
  title: string;
  type: string;
  tags: string[];
  summary?: string;
  keyPoints?: string[];
  wordCount?: number;
  sentiment?: string;
  topics?: string[];
  source?: {
    method: string;
    url?: string;
  };
}

export class StorageService {
  static async getStorageItems(type?: string): Promise<StorageItem[]> {
    try {
      const endpoint = type ? `/api/storage/files/${type}` : '/api/storage/files';
      const response = await Api.get(endpoint);
      
      if (response.success && response.files) {
        // Flatten the files object into an array
        const items: StorageItem[] = [];
        
        if (type) {
          // Single type response
          return response.files.map((file: any) => ({
            ...file,
            id: file.name.replace(/\.[^/.]+$/, '') // Use filename without extension as ID
          }));
        } else {
          // All types response
          Object.entries(response.files).forEach(([contentType, files]: [string, any]) => {
            files.forEach((file: any) => {
              items.push({
                ...file,
                id: file.name.replace(/\.[^/.]+$/, ''),
                contentType
              });
            });
          });
        }
        
        return items;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to load storage items:', error);
      return [];
    }
  }

  static async getMetadata(fileId: string): Promise<ContentMetadata | null> {
    try {
      const response = await Api.get(`/api/storage/metadata/${fileId}`);
      
      if (response.success && response.metadata) {
        return response.metadata;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to load metadata:', error);
      return null;
    }
  }

  static async getItemsWithMetadata(type?: string): Promise<StorageItem[]> {
    const items = await this.getStorageItems(type);
    
    // Load metadata for each item in parallel
    const itemsWithMetadata = await Promise.all(
      items.map(async (item) => {
        const metadata = await this.getMetadata(item.id);
        return { ...item, metadata };
      })
    );
    
    return itemsWithMetadata;
  }

  static async suggestContentForPlatform(
    metadata: ContentMetadata, 
    platform: 'twitter' | 'instagram' | 'linkedin' | 'tiktok' | 'substack' | 'newsletter'
  ): Promise<any> {
    // Content transformation logic based on metadata
    switch (platform) {
      case 'twitter':
        if (metadata.keyPoints && metadata.keyPoints.length > 1) {
          // Suggest a thread
          return {
            type: 'thread',
            content: metadata.keyPoints.map((point, i) => `${i + 1}/ ${point}`)
          };
        } else if (metadata.summary) {
          // Single tweet
          return {
            type: 'single',
            content: metadata.summary.substring(0, 280)
          };
        }
        break;
        
      case 'linkedin':
        return {
          type: 'post',
          content: `${metadata.title}\n\n${metadata.summary || ''}\n\n${metadata.keyPoints?.join('\n• ') || ''}`
        };
        
      case 'substack':
      case 'newsletter':
        return {
          type: 'article',
          title: metadata.title,
          subtitle: metadata.summary,
          content: metadata.keyPoints?.join('\n\n') || ''
        };
        
      // Add more platform-specific transformations
    }
    
    return null;
  }
}