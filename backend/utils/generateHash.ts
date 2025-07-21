/**
 * @layer backend-utils
 * @description Generate content hash for deduplication
 * @dependencies crypto (Node.js built-in)
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: generate[Value]
 */

import { createHash } from 'crypto';

/**
 * Generate SHA-256 hash for content deduplication
 * Returns: sha256-{hash}
 */
export function generateHash(content: string): string {
  const hash = createHash('sha256')
    .update(content)
    .digest('hex');
    
  return `sha256-${hash}`;
}