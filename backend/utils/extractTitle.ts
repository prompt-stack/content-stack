/**
 * @layer backend-utils
 * @description Extract title from content
 * @dependencies none
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming convention: extract[Property]
 */

/**
 * Extract title from content
 * Looks for markdown headers, first line, or creates from content
 */
export function extractTitle(content: string): string {
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return 'Untitled Content';
  }
  
  const firstLine = lines[0].trim();
  
  // Check for markdown H1
  if (firstLine.startsWith('# ')) {
    return firstLine.replace('# ', '').trim();
  }
  
  // Check for markdown H2
  if (firstLine.startsWith('## ')) {
    return firstLine.replace('## ', '').trim();
  }
  
  // Use first line, truncated
  if (firstLine.length > 50) {
    return firstLine.slice(0, 50) + '...';
  }
  
  return firstLine;
}