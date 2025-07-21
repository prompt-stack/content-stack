/**
 * @file server/routes/metadata.js
 * @purpose Server-side metadata logic
 * @layer backend
 * @deps [import express from 'express';, import path from 'path';, import { PATHS,  pathHelpers } from '../../config/paths.js';, import { isValidId,  isPathWithinDirectory } from '../utils/validation.js';, import { promises as fs } from 'fs';, import { readJsonFile } from '../utils/file-lock.js';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { readJsonFile } from '../utils/file-lock.js';
import { isValidId, isPathWithinDirectory } from '../utils/validation.js';
import { PATHS, pathHelpers } from '../../config/paths.js';

const router = express.Router();

export default function(ROOT_DIR) {
    const metadataDir = PATHS.metadata.root;
    
    // Get metadata by ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            
            // Validate ID
            if (!isValidId(id)) {
                return res.status(400).json({ error: 'Invalid metadata ID' });
            }
            
            // Search in both raw and processed subfolders using path helpers
            const possiblePaths = [
                ...pathHelpers.getAllMetadataPaths(`${id}.json`),
                ...pathHelpers.getAllMetadataPaths(`${id}.meta.json`)
            ];
            
            for (const metadataPath of possiblePaths) {
                // Ensure path is within metadata directory
                if (!isPathWithinDirectory(metadataPath, metadataDir)) {
                    continue;
                }
                
                try {
                    const metadata = await readJsonFile(metadataPath);
                    res.json(metadata);
                    return;
                } catch (err) {
                    // Continue to next path
                }
            }
            
            return res.status(404).json({ error: 'Metadata not found' });
        } catch (error) {
            console.error('Error reading metadata:', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    // List all metadata files
    router.get('/', async (req, res) => {
        try {
            await fs.mkdir(PATHS.metadata.root, { recursive: true });
            await fs.mkdir(PATHS.metadata.raw, { recursive: true });
            await fs.mkdir(PATHS.metadata.processed, { recursive: true });
            
            const metadata = [];
            
            // Scan both raw and processed subfolders using path helpers
            const subfolders = pathHelpers.getMetadataSearchFolders().filter(f => f); // Remove empty string
            
            for (const subfolder of subfolders) {
                const subfolderPath = pathHelpers.getMetadataPath(subfolder);
                
                try {
                    const files = await fs.readdir(subfolderPath);
                    const metadataFiles = files.filter(f => f.endsWith('.json'));
                    
                    for (const file of metadataFiles) {
                        try {
                            const filePath = path.join(subfolderPath, file);
                            const data = await readJsonFile(filePath);
                            metadata.push({
                                filename: file,
                                subfolder: subfolder,
                                ...data
                            });
                        } catch (err) {
                            console.error(`Error reading ${subfolder}/${file}:`, err);
                        }
                    }
                } catch (err) {
                    console.error(`Error reading ${subfolder} directory:`, err);
                }
            }
            
            // Also scan root metadata directory for any legacy files
            try {
                const files = await fs.readdir(PATHS.metadata.root);
                const metadataFiles = files.filter(f => f.endsWith('.json'));
                
                for (const file of metadataFiles) {
                    try {
                        const filePath = path.join(PATHS.metadata.root, file);
                        const data = await readJsonFile(filePath);
                        metadata.push({
                            filename: file,
                            subfolder: 'root',
                            ...data
                        });
                    } catch (err) {
                        console.error(`Error reading root/${file}:`, err);
                    }
                }
            } catch (err) {
                console.error('Error reading root metadata directory:', err);
            }
            
            // Sort by saved_at descending
            metadata.sort((a, b) => {
                const dateA = new Date(a.saved_at || a.created_at || 0);
                const dateB = new Date(b.saved_at || b.created_at || 0);
                return dateB - dateA;
            });
            
            res.json({ items: metadata });
        } catch (error) {
            console.error('Error listing metadata:', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    return router;
}
