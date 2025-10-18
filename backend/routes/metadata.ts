/**
 * @file backend/routes/metadata.ts
 * @purpose API routes for metadata operations
 * @layer backend-routes
 * @deps express, fs, path, ../../config/schemas/paths.config
 * @used-by [server.ts]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role metadata-service
 */

import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import { getMetadataPath } from '../../config/schemas/paths.config';

const router = Router();

/**
 * GET /api/metadata/:id
 * Get metadata for a specific content ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required'
      });
    }
    
    const metadataDir = getMetadataPath();
    const metadataPath = join(metadataDir, `${id}.json`);
    
    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(metadataContent);
      
      res.json({
        success: true,
        metadata
      });
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          error: 'Metadata not found'
        });
      }
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get metadata'
    });
  }
});

/**
 * GET /api/metadata
 * List all metadata files
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const metadataDir = getMetadataPath();
    
    try {
      // Check if metadata directory exists
      await fs.access(metadataDir);
      
      const files = await fs.readdir(metadataDir);
      const metadataList = [];
      
      for (const file of files) {
        if (file.endsWith('.json') && !file.startsWith('.')) {
          try {
            const filePath = join(metadataDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const metadata = JSON.parse(content);
            
            metadataList.push({
              id: file.replace('.json', ''),
              ...metadata
            });
          } catch (error) {
            console.error(`Error reading metadata file ${file}:`, error);
          }
        }
      }
      
      res.json({
        success: true,
        total: metadataList.length,
        metadata: metadataList
      });
    } catch (error) {
      // Directory doesn't exist
      res.json({
        success: true,
        total: 0,
        metadata: []
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list metadata'
    });
  }
});

/**
 * PUT /api/metadata/:id
 * Update metadata for a specific content ID
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required'
      });
    }
    
    const metadataDir = getMetadataPath();
    const metadataPath = join(metadataDir, `${id}.json`);
    
    // Read existing metadata
    let existingMetadata = {};
    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      existingMetadata = JSON.parse(metadataContent);
    } catch (error) {
      // If file doesn't exist, we'll create a new one
    }
    
    // Merge updates with existing metadata
    const updatedMetadata = {
      ...existingMetadata,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Ensure directory exists
    await fs.mkdir(metadataDir, { recursive: true });
    
    // Write updated metadata
    await fs.writeFile(metadataPath, JSON.stringify(updatedMetadata, null, 2));
    
    res.json({
      success: true,
      metadata: updatedMetadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update metadata'
    });
  }
});

/**
 * DELETE /api/metadata/:id
 * Delete metadata for a specific content ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required'
      });
    }
    
    const metadataDir = getMetadataPath();
    const metadataPath = join(metadataDir, `${id}.json`);
    
    try {
      await fs.unlink(metadataPath);
      res.json({
        success: true,
        message: 'Metadata deleted successfully'
      });
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          error: 'Metadata not found'
        });
      }
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete metadata'
    });
  }
});

export default router;