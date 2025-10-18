/**
 * @layer backend-utils
 * @description Create metadata for content items
 * @dependencies ../types/ContentTypes, ./generateContentId, ./detectContentType, ./extractTitle, ./calculateWordCount, ./generateHash
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: create[Subject]
 */

import type { ContentMetadata, ContentInboxServiceInput } from '../types/ContentTypes';
import { generateContentId } from './generateContentId';
import { detectContentType } from './detectContentType';
import { extractTitle } from './extractTitle';
import { calculateWordCount } from './calculateWordCount';
import { generateHash } from './generateHash';
import { generateStoragePath } from '../../config/schemas/paths.config';

/**
 * Create metadata for new content
 * Following MVP metadata schema
 */
export function createMetadata(input: ContentInboxServiceInput): ContentMetadata {
  const id = generateContentId();
  const timestamp = new Date().toISOString();
  const type = detectContentType(input.content, input.filename);
  const title = input.filename ? input.filename : extractTitle(input.content);
  const wordCount = calculateWordCount(input.content);
  const hash = generateHash(input.content);
  
  // Generate storage path (no more inbox)
  const fileExtension = getFileExtension(type, input.filename);
  const storagePath = generateStoragePath(type, id, fileExtension);
  
  return {
    id,
    created_at: timestamp,
    updated_at: timestamp,
    status: 'inbox',
    source: {
      method: input.method,
      url: input.metadata?.reference_url || input.url || null,
    },
    content: {
      type,
      title,
      full_text: '', // DEPRECATED - keeping empty for backward compatibility
      text: shouldExtractText(type) ? input.content : null,  // Extract text for text-based formats
      word_count: wordCount,
      hash,
    },
    location: {
      inbox_path: storagePath, // DEPRECATED field - kept for compatibility
      final_path: null,
    },
    category: 'general', // Default category - can be enriched later
    llm_analysis: null,
    tags: [], // Initialize with empty tags array
  };
}

/**
 * Check if content type should have text extracted
 * Text-based formats that don't require external services
 */
function shouldExtractText(type: string): boolean {
  const textBasedTypes = ['text', 'code', 'data', 'web', 'email'];
  return textBasedTypes.includes(type);
}

/**
 * Get appropriate file extension for content type
 * Following design-system naming: get[Value]
 */
function getFileExtension(type: string, filename?: string): string {
  // If we have a filename, preserve its extension
  if (filename) {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot !== -1) {
      return filename.substring(lastDot + 1);
    }
  }
  
  // Default extensions based on content type
  switch (type) {
    case 'text':
      return 'txt';
    case 'code':
      return 'js';
    case 'data':
      return 'json';
    case 'document':
      return 'pdf';
    case 'image':
      return 'png';
    case 'video':
      return 'mp4';
    case 'audio':
      return 'mp3';
    case 'web':
      return 'html';
    case 'email':
      return 'eml';
    case 'design':
      return 'svg';
    case 'archive':
      return 'zip';
    default:
      return 'txt';
  }
}