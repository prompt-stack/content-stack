/**
 * @file backend/routes/health.ts
 * @purpose Health check endpoint for storage/metadata consistency audit
 */

import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';
import { MetadataService } from '../services/MetadataService';

const router = Router();

// Storage directory paths
const STORAGE_ROOT = path.join(process.cwd(), 'storage');
const METADATA_ROOT = path.join(process.cwd(), 'metadata');

interface StorageItem {
  path: string;
  type: string;
  filename: string;
  size: number;
}

interface ConsistencyReport {
  status: 'healthy' | 'inconsistent';
  totalStorageItems: number;
  totalMetadataItems: number;
  orphanedStorageItems: string[];
  missingStorageItems: string[];
  mismatches: Array<{
    metadataId: string;
    issue: string;
  }>;
  timestamp: Date;
}

/**
 * GET /api/health
 * Basic health check
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    endpoints: [
      '/api/health',
      '/api/health/storage-audit'
    ]
  });
});

/**
 * GET /api/health/storage-audit
 * Audit storage/metadata consistency
 */
router.get('/storage-audit', async (req: Request, res: Response) => {
  try {
    console.log('Starting storage/metadata consistency audit...');
    
    // Get all storage items
    const storageItems = await getAllStorageItems();
    console.log(`Found ${storageItems.length} storage items`);
    
    // Get all metadata items
    const metadataService = new MetadataService();
    const metadataItems = await metadataService.getAllMetadata();
    console.log(`Found ${metadataItems.length} metadata items`);
    
    // Create maps for efficient lookup
    const storageMap = new Map<string, StorageItem>();
    const metadataMap = new Map<string, any>();
    
    // Build storage map - key by filename without extension
    storageItems.forEach(item => {
      const key = path.basename(item.filename, path.extname(item.filename));
      storageMap.set(key, item);
    });
    
    // Build metadata map - key by content ID
    metadataItems.forEach(item => {
      if (item.id) {
        metadataMap.set(item.id, item);
      }
    });
    
    // Find orphaned storage items (no corresponding metadata)
    const orphanedStorageItems: string[] = [];
    storageMap.forEach((storageItem, key) => {
      if (!metadataMap.has(key)) {
        orphanedStorageItems.push(storageItem.path);
      }
    });
    
    // Find missing storage items (metadata exists but no file)
    const missingStorageItems: string[] = [];
    const mismatches: Array<{ metadataId: string; issue: string }> = [];
    
    metadataMap.forEach((metadata, id) => {
      // Check if storage file exists
      if (!storageMap.has(id)) {
        missingStorageItems.push(id);
      } else {
        // Validate consistency between storage and metadata
        const storageItem = storageMap.get(id)!;
        
        // Check file size consistency
        if (metadata.content?.size && Math.abs(metadata.content.size - storageItem.size) > 100) {
          mismatches.push({
            metadataId: id,
            issue: `Size mismatch: metadata=${metadata.content.size}, storage=${storageItem.size}`
          });
        }
        
        // Check content type consistency
        if (metadata.content?.type && metadata.content.type !== storageItem.type) {
          mismatches.push({
            metadataId: id,
            issue: `Type mismatch: metadata=${metadata.content.type}, storage=${storageItem.type}`
          });
        }
      }
    });
    
    // Build report
    const report: ConsistencyReport = {
      status: orphanedStorageItems.length === 0 && missingStorageItems.length === 0 && mismatches.length === 0 
        ? 'healthy' 
        : 'inconsistent',
      totalStorageItems: storageItems.length,
      totalMetadataItems: metadataItems.length,
      orphanedStorageItems,
      missingStorageItems,
      mismatches,
      timestamp: new Date()
    };
    
    console.log('Audit complete:', {
      status: report.status,
      orphaned: orphanedStorageItems.length,
      missing: missingStorageItems.length,
      mismatches: mismatches.length
    });
    
    res.json(report);
  } catch (error) {
    console.error('Storage audit error:', error);
    res.status(500).json({
      error: 'Failed to perform storage audit',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Helper function to get all storage items recursively
 */
async function getAllStorageItems(): Promise<StorageItem[]> {
  const items: StorageItem[] = [];
  
  async function scanDirectory(dir: string, type: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await scanDirectory(fullPath, entry.name);
        } else if (entry.isFile()) {
          // Get file stats
          const stats = await fs.stat(fullPath);
          items.push({
            path: fullPath,
            type: type,
            filename: entry.name,
            size: stats.size
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
  }
  
  // Check if storage directory exists
  try {
    await fs.access(STORAGE_ROOT);
    await scanDirectory(STORAGE_ROOT, 'root');
  } catch (error) {
    console.log('Storage directory not found:', STORAGE_ROOT);
  }
  
  return items;
}

export default router;