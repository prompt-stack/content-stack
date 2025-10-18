/**
 * @file config/metadata-schema.config.ts
 * @purpose Metadata schema configuration
 * @description Defines the structure and validation for content metadata
 * @llm-read true
 * @llm-write full-edit
 */

export interface ContentMetadata {
  // ===== IMMUTABLE FIELDS (Never change after creation) =====
  id: string;
  created_at: string;
  source: {
    method: 'paste' | 'upload' | 'url' | 'drop' | 'manual' | 'api';
    timestamp?: string;
  };
  content: {
    type: string; // From file-types.config.ts - determined at creation
    full_text: string; // Original content
    hash: string; // Content hash
    file_type?: string;
    size?: number;
    duration?: string; // For audio/video
    dimensions?: { width: number; height: number }; // For images/video
  };
  
  // ===== SYSTEM FIELDS (Updated by system) =====
  updated_at: string;
  status: 'raw' | 'enriched'; // Simplified status
  title: string; // Display title (initially from filename, can be updated)
  filename: string; // Current filename
  location: {
    inbox_path: string | null;
    final_path: string | null;
    archive_path?: string | null;
  };
  storage: {
    path: string;
    size: number;
    last_accessed?: string;
  };
  
  // ===== USER-EDITABLE FIELDS =====
  user_tags: string[]; // Tags added by user
  source_url?: string; // URL where content was found (can be updated/corrected)
  reference_urls?: string[]; // Additional related URLs
  metadata?: {
    author?: string;
    source_platform?: string;
    original_date?: string;
    language?: string;
    [key: string]: any;
  };
  
  // ===== LLM-ONLY FIELDS (Only AI should edit) =====
  llm_analysis?: {
    // Core analysis
    category: string; // Main category classification
    title: string; // LLM's suggested title
    tags: string[]; // LLM's suggested tags
    
    // Extended analysis
    summary?: string; // Content summary
    reasoning?: string; // Why this categorization
    confidence?: number; // 0-1 confidence score
    suggested_filename?: string; // Better filename suggestion
    extracted_entities?: string[]; // People, places, concepts
    
    // Metadata
    word_count: number; // Calculated word count
    analyzed_at?: string; // When AI analyzed it
    model_version?: string; // Which AI model analyzed it
  } | null;
}

// Schema for validation
export const metadataSchema = {
  required: [
    'id',
    'created_at',
    'updated_at',
    'status',
    'title',
    'filename',
    'source',
    'content',
    'location',
    'user_tags',
    'storage'
  ],
  
  statusValues: ['raw', 'enriched'] as const,
  
  sourceMethodValues: ['paste', 'upload', 'url', 'drop', 'manual', 'api'] as const,
  
  contentTypes: [
    'text', 'document', 'spreadsheet', 'presentation',
    'code', 'image', 'video', 'audio', 'archive',
    'design', 'email', 'web', 'data'
  ] as const
};

// Helper functions
export function createMetadataId(): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  return `content-${timestamp}-${randomId}`;
}

export function createDefaultMetadata(
  filePath: string,
  contentType: string,
  method: ContentMetadata['source']['method'] = 'manual',
  sourceUrl?: string
): Partial<ContentMetadata> {
  const now = new Date().toISOString();
  const filename = filePath.split('/').pop() || filePath;
  
  return {
    id: createMetadataId(),
    created_at: now,
    updated_at: now,
    status: 'raw', // Changed to 'raw' for unenriched content
    title: filename, // Initial title from filename
    filename: filename,
    source: {
      method
    },
    source_url: sourceUrl || undefined,
    content: {
      type: contentType,
      full_text: '',
      hash: ''
    },
    location: {
      inbox_path: filePath,
      final_path: null
    },
    llm_analysis: null,
    user_tags: [],
    storage: {
      path: filePath,
      size: 0
    }
  };
}

export function validateMetadata(metadata: any): metadata is ContentMetadata {
  // Check required fields
  for (const field of metadataSchema.required) {
    if (!(field in metadata)) {
      return false;
    }
  }
  
  // Validate status
  if (!metadataSchema.statusValues.includes(metadata.status)) {
    return false;
  }
  
  // Validate source method
  if (!metadataSchema.sourceMethodValues.includes(metadata.source?.method)) {
    return false;
  }
  
  // Basic type checks
  if (typeof metadata.id !== 'string' ||
      typeof metadata.created_at !== 'string' ||
      typeof metadata.updated_at !== 'string' ||
      !Array.isArray(metadata.tags)) {
    return false;
  }
  
  return true;
}

export function generateContentHash(content: string): string {
  // Simple hash function for demo - in production use crypto
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256-${Math.abs(hash).toString(16).padStart(64, '0')}`;
}

// Export types
export type MetadataStatus = typeof metadataSchema.statusValues[number]; // 'raw' | 'enriched'
export type SourceMethod = typeof metadataSchema.sourceMethodValues[number];
export type ContentType = typeof metadataSchema.contentTypes[number];

// Instructions for LLM enrichment
export const LLM_ENRICHMENT_INSTRUCTIONS = `
When enriching content metadata, you should ONLY modify fields in the 'llm_analysis' section:
- category: Classify the content (e.g., 'education', 'technical', 'reference')
- title: Suggest a descriptive title based on the content
- tags: Suggest relevant tags for searchability
- summary: Create a brief summary of the content
- reasoning: Explain your categorization choice
- confidence: Rate your confidence (0-1)
- suggested_filename: Propose a better filename if needed
- extracted_entities: List key people, places, concepts mentioned
- word_count: Calculate the actual word count
- analyzed_at: Timestamp of analysis
- model_version: Your model identifier

DO NOT modify immutable fields (id, created_at, source, content)
DO NOT modify system fields (updated_at, status, title, filename, location, storage)
DO NOT modify user-editable fields (user_tags, metadata) unless specifically requested

The system will:
- Display title: Shows system 'title' field (not llm_analysis.title)
- Display tags: Combines user_tags + llm_analysis.tags
- Let users accept LLM suggestions to update the main title/filename
`;

// Helper to get combined tags for display
export function getCombinedTags(metadata: ContentMetadata): string[] {
  const userTags = metadata.user_tags || [];
  const llmTags = metadata.llm_analysis?.tags || [];
  // Combine and deduplicate
  return [...new Set([...userTags, ...llmTags])];
}