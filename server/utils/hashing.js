import crypto from 'crypto';

/**
 * Generate a hash from content
 * @param {string|Buffer} content - Content to hash
 * @returns {string} First 16 characters of SHA-256 hash
 */
export function hashContent(content) {
    return crypto
        .createHash('sha256')
        .update(content)
        .digest('hex')
        .substring(0, 16); // First 16 chars is enough for deduplication
}

/**
 * Check if content already exists by hash
 * @param {string} hash - Content hash to check
 * @param {string} metadataDir - Path to metadata directory
 * @returns {Promise<Object|null>} Existing metadata if found, null otherwise
 */
export async function checkDuplicateByHash(hash, metadataDir) {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    try {
        // Check all metadata subdirectories
        const dirsToCheck = [
            metadataDir,
            path.join(metadataDir, 'raw'),
            path.join(metadataDir, 'processed'),
            path.join(metadataDir, 'archived')
        ];
        
        for (const dir of dirsToCheck) {
            try {
                const files = await fs.readdir(dir);
                
                for (const file of files) {
                    if (!file.endsWith('.json')) continue;
                    
                    try {
                        const metadataPath = path.join(dir, file);
                        const content = await fs.readFile(metadataPath, 'utf8');
                        const metadata = JSON.parse(content);
                        
                        if (metadata.content_hash === hash) {
                            return metadata;
                        }
                    } catch (err) {
                        // Skip invalid JSON files
                        continue;
                    }
                }
            } catch (err) {
                // Directory might not exist, continue
                continue;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error checking for duplicates:', error);
        return null;
    }
}