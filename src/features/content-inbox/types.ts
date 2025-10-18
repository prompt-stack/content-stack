/**
 * @file features/content-inbox/types.ts
 * @purpose [TODO: Add purpose]
 * @layer feature
 * @deps none
 * @used-by [ContentInboxApi, ContentInboxInputPanel, ContentInboxQueuePanel, api, config, constants, types, useContentQueue, useModalFormReducer, useUserTier]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

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
  metadata?: {
    reference_url?: string;
    [key: string]: string | number | boolean | undefined;
  };
}
