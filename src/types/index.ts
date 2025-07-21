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
  metadata: {
    created_at: string;
    updated_at: string;
    size?: number;
    url?: string;
    file_type?: string;
    content_hash: string;
    tags: string[];
    isOptimistic?: boolean; // For UI styling during upload
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
