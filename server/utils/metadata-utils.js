import { promises as fs } from 'fs';
import path from 'path';
import { PATHS, pathHelpers } from '../../config/paths.js';

/**
 * Move metadata file to appropriate subfolder based on status
 * @param {string} metadataId - The metadata ID (without .json extension)
 * @param {string} newStatus - The new status (raw, processed, archived)
 */
export async function moveMetadataToSubfolder(metadataId, newStatus) {
    const filename = `${metadataId}.json`;
    
    // Define folder mapping
    const folderMap = {
        'raw': 'raw',
        'processed': 'processed', 
        'archived': 'processed'  // archived items stay in processed folder
    };
    
    const targetFolder = folderMap[newStatus];
    if (!targetFolder) {
        console.warn(`Unknown status: ${newStatus}, not moving metadata file`);
        return;
    }
    
    const targetPath = pathHelpers.getMetadataPath(targetFolder, filename);
    
    // Find current location of metadata file using path helpers
    const possiblePaths = pathHelpers.getAllMetadataPaths(filename);
    
    let currentPath = null;
    for (const possiblePath of possiblePaths) {
        try {
            await fs.access(possiblePath);
            currentPath = possiblePath;
            break;
        } catch (err) {
            // Continue to next path
        }
    }
    
    if (!currentPath) {
        console.warn(`Metadata file not found: ${filename}`);
        return;
    }
    
    // Don't move if already in the right place
    if (currentPath === targetPath) {
        return;
    }
    
    // Ensure target directory exists
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    
    // Move the file
    await fs.rename(currentPath, targetPath);
    console.log(`📁 Moved metadata: ${filename} → ${targetFolder}/`);
} 