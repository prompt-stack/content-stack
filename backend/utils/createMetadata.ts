/**
 * @layer backend-utils
 * @description Create metadata for content items
 * @dependencies ../types/ContentTypes, ./generateContentId, ./detectContentType, ./extractTitle, ./calculateWordCount, ./generateHash
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: create[Subject]
 */

import type { ContentMetadata, MetadataServiceInput } from '../types/ContentTypes';
import { generateContentId } from './generateContentId';
import { detectContentType } from './detectContentType';
import { extractTitle } from './extractTitle';
import { calculateWordCount } from './calculateWordCount';
import { generateHash } from './generateHash';

/**
 * Create metadata for new content
 * Following MVP metadata schema
 */
export function createMetadata(input: MetadataServiceInput): ContentMetadata {
  const id = generateContentId();
  const timestamp = new Date().toISOString();
  const type = detectContentType(input.content, input.filename);
  const title = input.filename ? input.filename : extractTitle(input.content);
  const wordCount = calculateWordCount(input.content);
  const hash = generateHash(input.content);
  
  // Generate inbox file path
  const fileExtension = getFileExtension(type, input.filename);
  const inboxPath = `content/inbox/${input.method}-${Date.now()}-${id.split('-')[2]}.${fileExtension}`;
  
  return {
    id,
    created_at: timestamp,
    updated_at: timestamp,
    status: 'inbox',
    source: {
      method: input.method,
      url: input.url || null,
    },
    content: {
      type,
      title,
      full_text: input.content,
      word_count: wordCount,
      hash,
    },
    location: {
      inbox_path: inboxPath,
      final_path: null,
    },
    llm_analysis: null,
    tags: [], // Initialize with empty tags array
  };
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