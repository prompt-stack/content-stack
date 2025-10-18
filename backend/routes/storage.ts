/**
 * @file backend/routes/storage.ts
 * @purpose API routes for storage operations
 * @layer backend-routes
 * @deps express, fs, path, ../../config/schemas/paths.config
 * @used-by [server.ts]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role async-service
 */

import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import { getStoragePaths, getMetadataPath } from '../../config/schemas/paths.config';
import { STORAGE_DIRECTORIES } from '../../config/schemas/content-types.config';

const router = Router();

/**
 * GET /api/storage/stats
 * Get storage statistics by type
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const storagePaths = getStoragePaths();
    const stats: Record<string, { count: number; size: number }> = {};
    
    // Get stats for each storage type
    for (const [contentType, dirName] of Object.entries(STORAGE_DIRECTORIES)) {
      const dirPath = join(storagePaths.root, dirName);
      
      try {
        const files = await fs.readdir(dirPath);
        let totalSize = 0;
        
        for (const file of files) {
          const filePath = join(dirPath, file);
          const stat = await fs.stat(filePath);
          if (stat.isFile()) {
            totalSize += stat.size;
          }
        }
        
        stats[contentType] = {
          count: files.filter(f => !f.startsWith('.')).length,
          size: totalSize
        };
      } catch (error) {
        // Directory might not exist yet
        stats[contentType] = { count: 0, size: 0 };
      }
    }
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get storage stats'
    });
  }
});

/**
 * GET /api/storage/files
 * Get all files from all storage directories
 */
router.get('/files', async (req: Request, res: Response) => {
  try {
    const storagePaths = getStoragePaths();
    const allFiles: Record<string, Array<{
      name: string;
      size: number;
      created: Date;
      modified: Date;
      type: string;
      path: string;
    }>> = {};
    
    // Get files from each storage type directory
    for (const [contentType, dirName] of Object.entries(STORAGE_DIRECTORIES)) {
      const dirPath = join(storagePaths.root, dirName);
      
      try {
        // Check if directory exists
        await fs.access(dirPath);
        const files = await fs.readdir(dirPath);
        const fileList = [];
        
        for (const file of files) {
          // Skip hidden files
          if (file.startsWith('.')) continue;
          
          const filePath = join(dirPath, file);
          const stat = await fs.stat(filePath);
          
          // Only include files, not directories
          if (stat.isFile()) {
            // Try to read metadata if it exists
            let metadata: any = {};
            try {
              // Extract content ID from filename (remove extension)
              const contentId = file.replace(/\.[^/.]+$/, '');
              const metadataDir = getMetadataPath();
              const metadataFilePath = join(metadataDir, `${contentId}.json`);
              const metadataContent = await fs.readFile(metadataFilePath, 'utf-8');
              metadata = JSON.parse(metadataContent);
            } catch (error) {
              // No metadata file or invalid JSON - that's okay
            }
            
            fileList.push({
              name: file,
              size: stat.size,
              created: stat.birthtime,
              modified: stat.mtime,
              type: contentType,
              path: join(dirName, file), // Relative path from storage root
              metadata
            });
          }
        }
        
        if (fileList.length > 0) {
          allFiles[contentType] = fileList;
        }
      } catch (error) {
        // Directory doesn't exist or can't be accessed - skip it
        console.log(`Storage directory ${dirPath} not accessible:`, error);
      }
    }
    
    // Calculate total stats
    let totalFiles = 0;
    let totalSize = 0;
    
    for (const files of Object.values(allFiles)) {
      totalFiles += files.length;
      totalSize += files.reduce((sum, file) => sum + file.size, 0);
    }
    
    res.json({
      success: true,
      total: {
        files: totalFiles,
        size: totalSize
      },
      filesByType: allFiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get all storage files'
    });
  }
});

/**
 * GET /api/storage/:type
 * List files in a specific storage type
 */
router.get('/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const storagePaths = getStoragePaths();
    const dirPath = storagePaths[type as keyof typeof storagePaths];
    
    if (!dirPath || dirPath === storagePaths.root) {
      return res.status(400).json({
        success: false,
        error: 'Invalid storage type'
      });
    }
    
    const files = await fs.readdir(dirPath);
    const fileList = [];
    
    for (const file of files) {
      if (file.startsWith('.')) continue;
      
      const filePath = join(dirPath, file);
      const stat = await fs.stat(filePath);
      
      fileList.push({
        name: file,
        size: stat.size,
        created: stat.birthtime,
        modified: stat.mtime
      });
    }
    
    res.json({
      success: true,
      type,
      files: fileList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list storage files'
    });
  }
});

/**
 * POST /api/storage/enrich
 * Enrich metadata for selected files using LLM
 */
router.post('/enrich', async (req: Request, res: Response) => {
  try {
    const { fileIds } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files selected for enrichment'
      });
    }
    
    const enrichedFiles = [];
    const errors = [];
    
    // Process each file
    for (const fileId of fileIds) {
      try {
        // Get the metadata file path
        const metadataDir = getMetadataPath();
        const metadataPath = join(metadataDir, `${fileId}.json`);
        
        // Read existing metadata
        let metadata: any = {};
        try {
          const metadataContent = await fs.readFile(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataContent);
        } catch (error) {
          // If no metadata exists, create basic metadata
          metadata = {
            id: fileId,
            filename: fileId,
            created_at: new Date().toISOString(),
            status: 'pending_enrichment'
          };
        }
        
        // Skip if already enriched
        if (metadata.enriched_at) {
          continue;
        }
        
        // TODO: In production, this would call an LLM API to analyze the content
        // For now, we'll simulate the enrichment process
        
        // Simulated enrichment - in production, this would be replaced with actual LLM analysis
        const enrichedMetadata = {
          ...metadata,
          enriched_at: new Date().toISOString(),
          enrichment_version: '1.0',
          title: metadata.title || generateTitle(fileId),
          category: metadata.category || detectCategory(fileId, metadata),
          tags: metadata.tags || generateTags(fileId, metadata),
          summary: metadata.summary || 'AI-generated summary would go here',
          key_points: metadata.key_points || ['Key point 1', 'Key point 2'],
          confidence: 'medium',
          score: 7,
          topics: ['topic1', 'topic2'],
          channel_fitness: {
            tweet_single: 0.8,
            tweet_thread: 0.7,
            linkedin_post: 0.6,
            newsletter_section: 0.5,
            blog_article: 0.4
          }
        };
        
        // Save enriched metadata
        await fs.writeFile(metadataPath, JSON.stringify(enrichedMetadata, null, 2));
        
        enrichedFiles.push({
          id: fileId,
          title: enrichedMetadata.title,
          category: enrichedMetadata.category
        });
        
      } catch (error) {
        errors.push({
          id: fileId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    res.json({
      success: true,
      enriched: enrichedFiles.length,
      skipped: fileIds.length - enrichedFiles.length - errors.length,
      errors: errors.length,
      details: {
        enrichedFiles,
        errors
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enrich files'
    });
  }
});

// Helper functions for simulated enrichment
function generateTitle(fileId: string): string {
  // Extract meaningful title from filename
  return fileId
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Title case
}

function detectCategory(fileId: string, metadata: any): string {
  // Simple category detection based on filename or content
  const filename = fileId.toLowerCase();
  
  if (filename.includes('code') || filename.includes('programming') || filename.includes('api')) {
    return 'tech';
  } else if (filename.includes('business') || filename.includes('marketing')) {
    return 'business';
  } else if (filename.includes('health') || filename.includes('fitness')) {
    return 'health';
  } else if (filename.includes('recipe') || filename.includes('cooking')) {
    return 'cooking';
  }
  
  return 'general';
}

function generateTags(fileId: string, metadata: any): string[] {
  // Generate relevant tags based on filename and metadata
  const tags: string[] = [];
  const filename = fileId.toLowerCase();
  
  // Add tags based on keywords
  const keywords = ['ai', 'programming', 'tutorial', 'guide', 'tips', 'review'];
  keywords.forEach(keyword => {
    if (filename.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  // Add category as tag
  if (metadata.category) {
    tags.push(metadata.category);
  }
  
  return tags; // Return empty array if no tags found
}

export default router;