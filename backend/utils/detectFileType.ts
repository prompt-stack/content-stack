/**
 * @layer backend-utils
 * @description Detect file type from filename and content - based on INGEST_FILES.MD
 * @dependencies none
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: detect[Property]
 * Based on AI-Native Content Ingestion Map from INGEST_FILES.MD
 */

import type { ContentType } from '../types/ContentTypes';
import { getContentTypeFromExtension } from '../../config/schemas/content-types.config';

/**
 * Detect content type from filename and content
 * Based on the comprehensive list from INGEST_FILES.MD
 */
export function detectFileType(filename: string, content?: string): ContentType {
  // Web content (for URLs)
  if (isWebContent(filename)) {
    return 'web';
  }
  
  // Use config-based detection
  const detectedType = getContentTypeFromExtension(filename);
  
  // Special case: If detected as text but content has code patterns, classify as code
  if (detectedType === 'text' && content && hasCodePatterns(content)) {
    return 'code';
  }
  
  return detectedType;
}


/**
 * Check if this is web content (URL)
 */
function isWebContent(filename: string): boolean {
  return filename.startsWith('http://') || filename.startsWith('https://');
}

/**
 * Check if content contains code patterns
 */
function hasCodePatterns(content: string): boolean {
  const codePatterns = [
    /```/,                    // Code blocks
    /function\s+\w+/,         // Function declarations
    /const\s+\w+\s*=/,        // Const declarations
    /import\s+.*from/,        // Import statements
    /export\s+/,              // Export statements
    /{[\s\S]*}/,              // Object/function brackets
    /console\.log/,           // Console statements
    /\.then\(/,               // Promise chains
    /async\s+function/,       // Async functions
    /class\s+\w+/,            // Class declarations
    /def\s+\w+\(/,            // Python functions
    /public\s+class/,         // Java classes
  ];
  
  return codePatterns.some(pattern => pattern.test(content));
}