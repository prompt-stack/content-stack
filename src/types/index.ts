/**
 * @file types/index.ts
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps none
 * @used-by [main]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

// Content types
export type ContentSource = 'youtube' | 'tiktok' | 'reddit' | 'article' | 'file-upload' | 'paste';
export type ContentType = 'file' | 'url' | 'text' | 'paste';
export type ContentStatus = 'raw' | 'processing' | 'processed' | 'error';
export type TierLevel = 'free' | 'pro' | 'enterprise';

export interface ContentItem {
  id: string;
  type: ContentType;
  source: ContentSource;
  status: ContentStatus;
  title: string;
  content?: string;
  timestamp?: Date; // Add timestamp for sorting
  sourceUrl?: string; // Add sourceUrl field
  metadata: {
    created_at: string;
    updated_at: string;
    size?: number;
    url?: string;
    file_type?: string;
    content_hash: string;
    tags: string[];
    category?: string; // Content category
    title?: string; // Title for UI consistency
    wordCount?: number; // Word count for UI display
    isOptimistic?: boolean; // For UI styling during upload
    storage?: {
      path: string;
      type: string;
      size: number;
    };
  };
  enrichment?: {
    summary: string;
    key_points: string[];
    topics: string[];
    category: string;
  };
}

export interface TierCapabilities {
  urlExtraction: boolean;
  maxInboxItems: number;
  pluginAccess: boolean;
  advancedSearch: boolean;
}
