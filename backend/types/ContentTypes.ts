/**
 * @layer backend-types
 * @description MVP metadata types for content management system
 * @dependencies none
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming conventions:
 * - No 'I' or 'T' prefixes
 * - Descriptive names
 * - Props pattern: [ServiceName]Input/[ServiceName]Config
 */

// Content status in processing pipeline
export type ContentStatus = 'inbox' | 'stored';

// Content input methods (4 ways to add content)
export type ContentMethod = 'paste' | 'upload' | 'url' | 'drop';

// Content types detected from content analysis - based on INGEST_FILES.MD
// These are primitive file formats that can be factually auto-detected
export type ContentType = 
  | 'text'           // Plain text, markdown, html
  | 'code'           // Programming files
  | 'document'       // PDFs, Word docs, slides
  | 'image'          // Photos, screenshots, diagrams
  | 'video'          // Video files
  | 'audio'          // Audio files, voice recordings
  | 'data'           // Spreadsheets, CSV, JSON
  | 'web'            // URLs, webpages
  | 'email'          // Email threads
  | 'design'         // Figma, design files
  | 'archive';       // Compressed files

// Storage categories - expanded for all content types
export type StorageCategory = 
  | 'articles'       // Long-form text content
  | 'notes'          // Short thoughts, reminders
  | 'code'           // Programming files
  | 'images'         // Visual content
  | 'videos'         // Video files
  | 'audio'          // Audio recordings
  | 'data'           // Structured data
  | 'documents'      // PDFs, presentations
  | 'web'            // Web content, bookmarks
  | 'design'         // Design files
  | 'archives';      // Compressed files

// Source information for content
export interface ContentSource {
  method: ContentMethod;
  url: string | null;
}

// Core content information
export interface ContentData {
  type: ContentType;
  title: string;
  full_text: string;  // DEPRECATED - original submission, use text instead
  text?: string | null;  // Extracted text for LLM processing
  word_count: number;
  hash: string;
  file_type?: string;  // MIME type for file uploads
  size?: number;       // File size in bytes
}

// File location tracking
export interface ContentLocation {
  inbox_path: string;
  final_path: string | null;
}

// LLM analysis results
export interface LLMAnalysis {
  category: StorageCategory;
  reasoning: string;
  confidence: number;
  suggested_filename: string;
}

// Storage information
export interface ContentStorage {
  path: string;      // Relative path to storage location
  type: string;      // Storage subdirectory (text, images, etc.)
  size: number;      // File size in bytes
}

// Content categories - aligned with categories.config.ts
export type ContentCategory = 
  | 'tech' 
  | 'business' 
  | 'finance' 
  | 'health' 
  | 'cooking' 
  | 'education' 
  | 'lifestyle' 
  | 'entertainment' 
  | 'general';

// Complete metadata structure (MVP schema)
export interface ContentMetadata {
  id: string;
  created_at: string;
  updated_at: string;
  status: ContentStatus;
  source: ContentSource;
  content: ContentData;
  location: ContentLocation;
  storage?: ContentStorage;  // Storage information after splitting
  category: ContentCategory;  // Required constrained field
  llm_analysis: LLMAnalysis | null;
  tags: string[]; // User-assigned tags for organization
}

// Service input types (following [ServiceName]Input pattern)
export interface ContentInboxServiceInput {
  method: ContentMethod;
  content: string;
  url?: string;
  filename?: string;  // For file uploads
  metadata?: {
    reference_url?: string;
    [key: string]: any;
  };
}

export interface MetadataServiceInput {
  method: ContentMethod;
  content: string;
  url?: string;
  filename?: string;  // For file uploads
}

export interface LLMAnalysisServiceInput {
  content: string;
  type: ContentType;
  title: string;
  word_count: number;
  method: ContentMethod;
}

// Service output types
export interface LLMAnalysisServiceOutput {
  category: StorageCategory;
  reasoning: string;
  confidence: number;
  suggested_filename: string;
}

export interface FileOperationResult {
  success: boolean;
  path?: string;
  error?: string;
}

export interface ContentCreationResult {
  success: boolean;
  metadata?: ContentMetadata;
  error?: string;
}