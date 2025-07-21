import { ContentItem as GlobalContentItem } from '@/types';

export interface ContentItem extends GlobalContentItem {
  timestamp?: Date;
  sourceUrl?: string;
}

export interface ContentMetadata {
  title?: string;
  tags: string[];
  category?: string;
  wordCount: number;
  format: string;
  extractedAt: Date;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  customFields: Record<string, string>;
  isEditingTags?: boolean;
}

export interface ContentQueueState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
}

export interface ContentSubmission {
  type: ContentItem['type'];
  content: string | File;
  options?: {
    extractMetadata?: boolean;
    autoTag?: boolean;
  };
}