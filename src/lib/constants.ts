/**
 * @file lib/constants.ts
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps none
 * @used-by [Dropzone]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

import type { TierLevel, TierCapabilities } from '@/types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3468/api';

export const TIER_LIMITS: Record<TierLevel, TierCapabilities> = {
  free: {
    urlExtraction: false,
    maxInboxItems: 100,
    pluginAccess: false,
    advancedSearch: false,
  },
  pro: {
    urlExtraction: true,
    maxInboxItems: 10000,
    pluginAccess: true,
    advancedSearch: true,
  },
  enterprise: {
    urlExtraction: true,
    maxInboxItems: Infinity,
    pluginAccess: true,
    advancedSearch: true,
  },
};

export const ACCEPTED_FILE_TYPES = [
  '.txt', '.md', '.pdf', '.doc', '.docx',
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
  '.csv', '.json', '.xml', '.html'
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
