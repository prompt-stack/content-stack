/**
 * @file config/pipeline.config.ts
 * @purpose Configuration for content processing pipeline
 * @layer config
 * @deps ./content-types.config, ./paths.config
 * @used-by [Processing Tools, Backend Services]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 * 
 * Pipeline Flow:
 * 1. Content arrives via API (paste/upload/url)
 * 2. Split into storage + metadata
 * 3. LLM enrichment (async)
 * 4. Library organization (user/auto)
 */

import type { ContentType } from '../backend/types/ContentTypes';
import { AI_MODEL_REQUIREMENTS } from './content-types.config';
import { LIBRARY_CATEGORIES } from './paths.config';

/**
 * Pipeline stages
 */
export const PIPELINE_STAGES = {
  INGESTION: 'ingestion',      // Content arrives
  STORAGE: 'storage',          // Split to storage + metadata
  ENRICHMENT: 'enrichment',    // LLM processing
  ORGANIZATION: 'organization', // Library placement
} as const;

/**
 * Processing status for each stage
 */
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Pipeline configuration
 */
export const PIPELINE_CONFIG = {
  /**
   * Auto-processing rules
   */
  autoProcess: {
    enabled: true,
    stages: {
      [PIPELINE_STAGES.INGESTION]: true,     // Always automatic
      [PIPELINE_STAGES.STORAGE]: true,       // Always automatic
      [PIPELINE_STAGES.ENRICHMENT]: true,    // Can be disabled
      [PIPELINE_STAGES.ORGANIZATION]: false, // Manual by default
    },
  },
  
  /**
   * Processing priorities by content type
   */
  priorities: {
    text: 1,      // Highest priority (fast to process)
    code: 2,
    data: 3,
    document: 4,
    image: 5,
    audio: 6,
    video: 7,     // Lowest priority (resource intensive)
    web: 3,
    email: 3,
    design: 4,
    archive: 8,   // Process after extraction
  } as Record<ContentType, number>,
  
  /**
   * Enrichment settings
   */
  enrichment: {
    /**
     * Which content types to enrich automatically
     */
    autoEnrich: {
      text: true,
      code: true,
      data: true,
      document: true,
      image: true,
      audio: false,  // Expensive
      video: false,  // Very expensive
      web: true,
      email: true,
      design: false,
      archive: false,
    } as Record<ContentType, boolean>,
    
    /**
     * Maximum content size for auto-enrichment (bytes)
     */
    maxSize: {
      text: 1024 * 1024,        // 1MB
      code: 512 * 1024,         // 512KB
      data: 256 * 1024,         // 256KB
      document: 5 * 1024 * 1024, // 5MB
      image: 10 * 1024 * 1024,   // 10MB
      audio: 50 * 1024 * 1024,   // 50MB
      video: 100 * 1024 * 1024,  // 100MB
      web: 512 * 1024,          // 512KB
      email: 256 * 1024,        // 256KB
      design: 10 * 1024 * 1024, // 10MB
      archive: 0,               // Don't process
    } as Record<ContentType, number>,
  },
  
  /**
   * Library organization rules
   */
  organization: {
    /**
     * Auto-categorization mappings
     */
    categoryMappings: {
      // Content characteristics → Library category
      'tutorial': LIBRARY_CATEGORIES.tutorials,
      'how-to': LIBRARY_CATEGORIES.tutorials,
      'guide': LIBRARY_CATEGORIES.tutorials,
      'article': LIBRARY_CATEGORIES.articles,
      'blog': LIBRARY_CATEGORIES.articles,
      'reference': LIBRARY_CATEGORIES.references,
      'documentation': LIBRARY_CATEGORIES.references,
      'project': LIBRARY_CATEGORIES.projects,
      'snippet': LIBRARY_CATEGORIES.snippets,
      'code': LIBRARY_CATEGORIES.snippets,
      'resource': LIBRARY_CATEGORIES.resources,
      'tool': LIBRARY_CATEGORIES.resources,
    },
    
    /**
     * Default category by content type
     */
    defaultCategories: {
      text: LIBRARY_CATEGORIES.articles,
      code: LIBRARY_CATEGORIES.snippets,
      data: LIBRARY_CATEGORIES.resources,
      document: LIBRARY_CATEGORIES.references,
      image: LIBRARY_CATEGORIES.resources,
      audio: LIBRARY_CATEGORIES.resources,
      video: LIBRARY_CATEGORIES.resources,
      web: LIBRARY_CATEGORIES.articles,
      email: LIBRARY_CATEGORIES.resources,
      design: LIBRARY_CATEGORIES.resources,
      archive: LIBRARY_CATEGORIES.resources,
    } as Record<ContentType, string>,
  },
};

/**
 * Pipeline metadata structure
 */
export interface PipelineMetadata {
  stages: {
    [PIPELINE_STAGES.INGESTION]: {
      status: ProcessingStatus;
      timestamp: string;
      method: 'paste' | 'upload' | 'url' | 'drop';
    };
    [PIPELINE_STAGES.STORAGE]: {
      status: ProcessingStatus;
      timestamp: string;
      location: string;
    };
    [PIPELINE_STAGES.ENRICHMENT]?: {
      status: ProcessingStatus;
      timestamp: string;
      model?: string;
      results?: {
        summary?: string;
        category?: string;
        tags?: string[];
        confidence?: number;
      };
    };
    [PIPELINE_STAGES.ORGANIZATION]?: {
      status: ProcessingStatus;
      timestamp: string;
      category: string;
      location: string;
      method: 'auto' | 'manual';
    };
  };
}

/**
 * Get AI model for content type
 */
export function getAIModelForType(contentType: ContentType): readonly string[] {
  return AI_MODEL_REQUIREMENTS[contentType]?.models || ['LLM'];
}

/**
 * Should auto-enrich content?
 */
export function shouldAutoEnrich(contentType: ContentType, size: number): boolean {
  const config = PIPELINE_CONFIG.enrichment;
  return config.autoEnrich[contentType] && size <= config.maxSize[contentType];
}

/**
 * Get processing priority
 */
export function getProcessingPriority(contentType: ContentType): number {
  return PIPELINE_CONFIG.priorities[contentType] || 99;
}

/**
 * Suggest library category based on content
 */
export function suggestLibraryCategory(
  contentType: ContentType,
  enrichmentResults?: { category?: string; tags?: string[] }
): string {
  if (enrichmentResults?.category) {
    // Check if LLM suggestion matches a mapping
    const mappedCategory = PIPELINE_CONFIG.organization.categoryMappings[
      enrichmentResults.category.toLowerCase()
    ];
    if (mappedCategory) return mappedCategory;
  }
  
  // Fall back to default for content type
  return PIPELINE_CONFIG.organization.defaultCategories[contentType];
}