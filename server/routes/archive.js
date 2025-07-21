/**
 * @file server/routes/archive.js
 * @purpose Server-side archive logic
 * @layer backend
 * @deps [import express from 'express';, import path from 'path';, import { PATHS } from '../../config/paths.js';, import { isValidId,  isPathWithinDirectory } from '../utils/validation.js';, import { promises as fs } from 'fs';]
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role async-service
 */

import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { isValidId, isPathWithinDirectory } from '../utils/validation.js';
import { PATHS } from '../../config/paths.js';

const router = express.Router();

export default function(ROOT_DIR) {
    // Get archived content by timestamp
    router.get('/:timestamp', async (req, res) => {
        try {
            const { timestamp } = req.params;
            
            // Validate timestamp
            if (!isValidId(timestamp)) {
                return res.status(400).json({ error: 'Invalid timestamp format' });
            }
            
            const archiveDir = PATHS.archive;
            
            try {
                // List all files in archive
                const files = await fs.readdir(archiveDir);
                
                // Find file containing the timestamp
                const matchingFile = files.find(file => file.includes(timestamp));
                
                if (!matchingFile) {
                    return res.status(404).json({ error: 'Archived content not found' });
                }
                
                const filePath = path.join(archiveDir, matchingFile);
                
                // Security check
                if (!isPathWithinDirectory(filePath, archiveDir)) {
                    return res.status(403).json({ error: 'Invalid file path' });
                }
                
                // Read and return content
                const content = await fs.readFile(filePath, 'utf8');
                
                res.json({
                    content,
                    filename: matchingFile,
                    timestamp
                });
                
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return res.status(404).json({ error: 'Archive directory not found' });
                }
                throw err;
            }
            
        } catch (error) {
            console.error('Error fetching archived content:', error);
            res.status(500).json({ error: error.message });
        }
    });
    
    return router;
}
