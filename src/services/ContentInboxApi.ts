/**
 * @layer service
 * @description API service for content inbox operations - connects to new backend
 * @dependencies @/lib/api, @/types
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming conventions:
 * - Service pattern: [FeatureName]Api
 * - Methods: get[Value], add[Subject], update[Subject], delete[Subject]
 */

import { api as apiClient } from '@/lib/api';
import type { ContentItem } from '@/types';

// Backend metadata structure (matches our backend types)
interface BackendContentMetadata {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'inbox' | 'stored';
  source: {
    method: 'paste' | 'upload' | 'url' | 'drop';
    url: string | null;
  };
  content: {
    type: string;
    title: string;
    full_text: string;
    word_count: number;
    hash: string;
  };
  location: {
    inbox_path: string;
    final_path: string | null;
  };
  llm_analysis: any | null;
  tags: string[]; // User-assigned tags
}

// Backend API response types
interface BackendResponse<T> {
  success: boolean;
  error?: string;
  item?: T;
  items?: T[];
  results?: T[];
  stats?: any;
}

export class ContentInboxApi {
  /**
   * Transform backend metadata to frontend ContentItem
   * Following design-system pattern: transform[Subject]
   */
  private transformToContentItem(metadata: BackendContentMetadata): ContentItem {
    return {
      id: metadata.id,
      type: this.mapBackendTypeToFrontend(metadata.content.type),
      source: this.mapBackendSourceToFrontend(metadata.source.method),
      status: this.mapBackendStatusToFrontend(metadata.status),
      title: metadata.content.title,
      content: metadata.content.full_text,
      timestamp: new Date(metadata.created_at), // Add timestamp for sorting
      sourceUrl: metadata.source.url || undefined, // Add sourceUrl field
      metadata: {
        created_at: metadata.created_at,
        updated_at: metadata.updated_at,
        size: metadata.content.full_text.length,
        url: metadata.source.url || undefined,
        file_type: metadata.content.type,
        content_hash: metadata.content.hash,
        tags: metadata.tags || [], // Use backend tags
        title: metadata.content.title, // Add title to metadata for UI consistency
        wordCount: metadata.content.word_count, // Add word count for UI display
        category: metadata.llm_analysis?.category || undefined, // Add category to metadata
      },
      enrichment: metadata.llm_analysis ? {
        summary: metadata.llm_analysis.reasoning || '',
        key_points: [],
        topics: [],
        category: metadata.llm_analysis.category || '',
      } : undefined
    };
  }

  /**
   * Map backend content type to frontend type
   * Following design-system pattern: map[Property]
   */
  private mapBackendTypeToFrontend(backendType: string): ContentItem['type'] {
    switch (backendType) {
      case 'text':
      case 'note':
      case 'web':
        return 'text';
      case 'code':
        return 'text'; // Could be separate if frontend supports
      case 'document':
      case 'image':
      case 'video':
      case 'audio':
      case 'data':
      case 'design':
      case 'archive':
      case 'email':
        return 'file';
      default:
        return 'text';
    }
  }

  /**
   * Map backend source method to frontend source
   */
  private mapBackendSourceToFrontend(method: string): ContentItem['source'] {
    switch (method) {
      case 'paste':
        return 'paste';
      case 'upload':
      case 'drop':
        return 'file-upload';
      case 'url':
        return 'article'; // Or could be youtube, tiktok based on URL
      default:
        return 'paste';
    }
  }

  /**
   * Map backend status to frontend status
   */
  private mapBackendStatusToFrontend(status: string): ContentItem['status'] {
    switch (status) {
      case 'inbox':
        return 'raw';
      case 'stored':
        return 'processed';
      default:
        return 'raw';
    }
  }

  /**
   * Get all inbox items
   * Following design-system pattern: get[Value]
   */
  async getInboxItems(): Promise<ContentItem[]> {
    const response = await apiClient.get<BackendResponse<BackendContentMetadata>>('/api/content-inbox/items');
    
    if (response.success && response.items) {
      return response.items.map(item => this.transformToContentItem(item));
    }
    
    return [];
  }

  /**
   * Add content to inbox
   * Following design-system pattern: add[Subject]
   */
  async addInboxItem(data: {
    method: 'paste' | 'upload' | 'url' | 'drop';
    content: string;
    url?: string;
    filename?: string;
  }): Promise<ContentItem> {
    const response = await apiClient.post<BackendResponse<BackendContentMetadata>>('/api/content-inbox/add', data);
    
    if (response.success && response.item) {
      return this.transformToContentItem(response.item);
    }
    
    throw new Error(response.error || 'Failed to add content');
  }

  /**
   * Get specific content item
   * Following design-system pattern: get[Subject]
   */
  async getContentItem(id: string): Promise<ContentItem> {
    const response = await apiClient.get<BackendResponse<BackendContentMetadata>>(`/api/content-inbox/item/${id}`);
    
    if (response.success && response.item) {
      return this.transformToContentItem(response.item);
    }
    
    throw new Error(response.error || 'Content not found');
  }

  /**
   * Update content item
   * Following design-system pattern: update[Subject]
   */
  async updateContentItem(id: string, updates: Partial<BackendContentMetadata>): Promise<ContentItem> {
    const response = await apiClient.put<BackendResponse<BackendContentMetadata>>(`/api/content-inbox/item/${id}`, updates);
    
    if (response.success && response.item) {
      return this.transformToContentItem(response.item);
    }
    
    throw new Error(response.error || 'Failed to update content');
  }

  /**
   * Delete content item
   * Following design-system pattern: delete[Subject]
   */
  async deleteContentItem(id: string): Promise<void> {
    console.log('DELETE: Calling API for item:', id);
    const response = await apiClient.delete<BackendResponse<never>>(`/api/content-inbox/item/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete content');
    }
  }

  /**
   * Search content
   * Following design-system pattern: search[Items]
   */
  async searchContent(query: string): Promise<ContentItem[]> {
    const response = await apiClient.get<BackendResponse<BackendContentMetadata>>(`/api/content-inbox/search?q=${encodeURIComponent(query)}`);
    
    if (response.success && response.results) {
      return response.results.map(item => this.transformToContentItem(item));
    }
    
    return [];
  }

  /**
   * Get inbox statistics
   * Following design-system pattern: get[Value]
   */
  async getInboxStats(): Promise<any> {
    const response = await apiClient.get<BackendResponse<never>>('/api/content-inbox/stats');
    
    if (response.success) {
      return response.stats;
    }
    
    throw new Error(response.error || 'Failed to get stats');
  }
}

export const contentInboxApi = new ContentInboxApi();