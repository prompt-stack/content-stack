/**
 * @layer backend-utils
 * @description Detect content type from text analysis or filename
 * @dependencies ./detectFileType
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: detect[Property]
 */

import type { ContentType } from '../types/ContentTypes';
import { detectFileType } from './detectFileType';

/**
 * Detect content type from content analysis
 * Can also accept filename for file uploads
 */
export function detectContentType(content: string, filename?: string): ContentType {
  // If we have a filename, use file type detection first
  if (filename) {
    return detectFileType(filename, content);
  }
  
  // For text content (paste, url), analyze the content
  
  // URL detection
  if (isUrl(content)) {
    return 'web';
  }
  
  // Code detection
  if (hasCodePatterns(content)) {
    return 'code';
  }
  
  // HTML detection
  if (hasHtmlPatterns(content)) {
    return 'text'; // HTML content goes to text/articles
  }
  
  // Default to text for all other content
  return 'text';
}

/**
 * Check if content contains code patterns
 * Following design-system naming: has[Property]
 */
function hasCodePatterns(content: string): boolean {
  const codePatterns = [
    /```/,                    // Code blocks
    /function\s+\w+/,         // Function declarations
    /const\s+\w+\s*=/,        // Const declarations
    /import\s+.*from/,        // Import statements
    /export\s+/,              // Export statements
    /{.*}/,                   // Object/function brackets
    /console\.log/,           // Console statements
    /\.then\(/,               // Promise chains
    /async\s+function/,       // Async functions
  ];
  
  return codePatterns.some(pattern => pattern.test(content));
}

/**
 * Check if content contains HTML patterns
 * Following design-system naming: has[Property]
 */
function hasHtmlPatterns(content: string): boolean {
  const htmlPatterns = [
    /<html/i,
    /<!DOCTYPE/i,
    /<div/i,
    /<span/i,
    /<p>/i,
  ];
  
  return htmlPatterns.some(pattern => pattern.test(content));
}

/**
 * Check if content is a URL
 * Following design-system naming: is[Condition]
 */
function isUrl(content: string): boolean {
  try {
    new URL(content.trim());
    return true;
  } catch {
    return false;
  }
}