/**
 * @layer backend-utils
 * @description Calculate word count from content
 * @dependencies none
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: calculate[Value]
 */

/**
 * Calculate word count from content
 * Filters out empty strings and handles various whitespace
 */
export function calculateWordCount(content: string): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }
  
  // Split by whitespace and filter out empty strings
  const words = content
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
    
  return words.length;
}